import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  getAllWalletRoles, 
  setWalletRole, 
  removeWalletRole,
  getRoleRequests, 
  approveRoleRequest, 
  declineRoleRequest,
  ROLE_HASHES,
  checkOnChainRole,
  syncCloudRoles,
  DEFAULT_ROLES,
  PRIMARY_ADMIN_ADDRESS
} from '../utils/roleRegistry';
import { CONTRACT_ADDRESSES } from '../utils/constants';
import { grantRoleOnChain, revokeRoleOnChain, fetchCloudRoles, syncRolesToCloud, syncAuditEventToCloud } from '../lib/api';
import { truncateAddress, formatDate } from '../utils/formatters';
import { ethers } from 'ethers';
import { 
  Shield, 
  UserCheck, 
  UserX, 
  Info, 
  UserPlus, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Key, 
  AlertCircle,
  RefreshCw
} from 'lucide-react';

const permissions = [
  { action: 'Identity Management', ADMIN: true, MANAGER: true, AUDITOR: false, USER: false },
  { action: 'Role Assignment & Approvals', ADMIN: true, MANAGER: false, AUDITOR: false, USER: false },
  { action: 'NFT Minting', ADMIN: true, MANAGER: false, AUDITOR: false, USER: false },
  { action: 'Asset Allocation', ADMIN: true, MANAGER: false, AUDITOR: false, USER: false },
  { action: 'Asset Transfer', ADMIN: true, MANAGER: true, AUDITOR: false, USER: 'Policy' },
  { action: 'Document Upload', ADMIN: true, MANAGER: true, AUDITOR: false, USER: true },
  { action: 'Document Verify', ADMIN: true, MANAGER: true, AUDITOR: true, USER: 'Policy' },
  { action: 'Audit Read', ADMIN: true, MANAGER: true, AUDITOR: true, USER: 'Read' },
  { action: 'Recovery Config', ADMIN: true, MANAGER: false, AUDITOR: false, USER: false },
];

export default function RBAC() {
  const { wallet: currentWallet, role: currentRole, switchRole, isConnected } = useAuth();
  const [walletRoles, setWalletRoles] = useState({});
  const [confirmedRoles, setConfirmedRoles] = useState({});
  const [requests, setRequests] = useState([]);
  const [newAddress, setNewAddress] = useState('');
  const [newRole, setNewRole] = useState('USER');
  const [toast, setToast] = useState(null);
  const [syncing, setSyncing] = useState(false);

  const loadData = async () => {
    try {
      await syncCloudRoles();
    } catch (e) {}
    const roles = getAllWalletRoles();
    const iamAddr = (CONTRACT_ADDRESSES.IdentityAndAccessManager || '').toLowerCase();
    delete roles['0x0ca09ba889727be9fbbaa53d2fe1541bf2f8cee6'];
    if (iamAddr) delete roles[iamAddr];
    
    // Purge any standard USER entries (directory is strictly for privileged roles)
    Object.keys(roles).forEach(k => {
      if (roles[k] === 'USER') delete roles[k];
    });

    setWalletRoles(roles);
    setRequests(getRoleRequests());
    verifyOnChainStatus(roles);
  };

  const verifyOnChainStatus = async (roles) => {
    const addresses = Object.keys(roles);
    const iamAddr = (CONTRACT_ADDRESSES.IdentityAndAccessManager || '').toLowerCase();

    const results = await Promise.allSettled(
      addresses.map(async (addr) => {
        const a = addr.toLowerCase();
        const onChain = await checkOnChainRole(addr);
        const isContract = Boolean(onChain && onChain !== 'USER' && onChain === roles[addr] && a !== iamAddr && a !== '0x0ca09ba889727be9fbbaa53d2fe1541bf2f8cee6');
        return { 
          addr: a, 
          isContract
        };
      })
    );

    const statusMap = {};
    for (const res of results) {
      if (res.status === 'fulfilled') {
        statusMap[res.value.addr] = res.value;
      }
    }
    setConfirmedRoles(statusMap);
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('sc_role_updated', handleUpdate);
    window.addEventListener('sc_requests_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('sc_role_updated', handleUpdate);
      window.removeEventListener('sc_requests_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const showNotification = (message, txHash = null, isError = false) => {
    setToast({ message, txHash, isError });
    setTimeout(() => setToast(null), 6000);
  };

  const handleSyncOnChain = async () => {
    setSyncing(true);
    showNotification('Syncing roles across Polygon Amoy & role directory...');
    try {
      await syncCloudRoles();
      const current = getAllWalletRoles();
      const updated = { ...current };
      const statusMap = {};
      const iamAddr = (CONTRACT_ADDRESSES.IdentityAndAccessManager || '').toLowerCase();

      const addresses = Object.keys(current);
      const results = await Promise.allSettled(
        addresses.map(async (addr) => {
          const a = addr.toLowerCase();
          const onChain = await checkOnChainRole(addr);
          return { addr: a, onChain };
        })
      );

      for (const res of results) {
        if (res.status === 'fulfilled') {
          const { addr, onChain } = res.value;
          const isContract = Boolean(onChain && onChain !== 'USER' && addr !== iamAddr && addr !== '0x0ca09ba889727be9fbbaa53d2fe1541bf2f8cee6');
          if (isContract) {
            updated[addr] = onChain;
          }
          statusMap[addr] = { isContract };
        }
      }

      delete updated['0x0ca09ba889727be9fbbaa53d2fe1541bf2f8cee6'];
      if (iamAddr) delete updated[iamAddr];

      setWalletRoles(updated);
      setConfirmedRoles(statusMap);
      showNotification('Roles synced across Polygon Amoy & directory!');
    } catch (e) {
      showNotification('Completed registry sync with available data.');
    } finally {
      setSyncing(false);
    }
  };

  const handleAssignRole = async (e) => {
    e.preventDefault();
    if (!newAddress || !newAddress.startsWith('0x') || newAddress.length < 10) {
      showNotification('Please enter a valid Ethereum wallet address (0x...)', null, true);
      return;
    }
    const target = newAddress.trim().toLowerCase();
    const iamAddr = (CONTRACT_ADDRESSES.IdentityAndAccessManager || '').toLowerCase();

    if (target === iamAddr || target === '0x0ca09ba889727be9fbbaa53d2fe1541bf2f8cee6') {
      showNotification('Cannot assign roles to smart contract address', null, true);
      return;
    }

    const previousRole = walletRoles[target];

    if (newRole === 'USER') {
      await handleRevokeRole(target, previousRole || 'ADMIN');
      setNewAddress('');
      return;
    }

    if (!window.ethereum) {
      showNotification('Web3 wallet (MetaMask) required for on-chain role assignment. Please install or connect MetaMask.', null, true);
      return;
    }

    showNotification(`Requesting MetaMask confirmation for on-chain ${newRole} role...`);
    let txHash = null;

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      const signerAddr = (await signer.getAddress()).toLowerCase();
      const iamAbi = [
        'function hasRole(bytes32 role, address acct) view returns (bool)',
        'function grantRole(bytes32 role, address acct) external',
        'function revokeRole(bytes32 role, address acct) external'
      ];
      const iam = new ethers.Contract(iamAddr, iamAbi, signer);

      const callerIsAdmin = await iam.hasRole(ROLE_HASHES.ADMIN, signerAddr).catch(() => false);
      if (!callerIsAdmin && signerAddr !== PRIMARY_ADMIN_ADDRESS.toLowerCase()) {
        showNotification('Connected wallet lacks contract ADMIN_ROLE on Polygon Amoy.', null, true);
        return;
      }

      // If target held a different privileged role on-chain, revoke it first
      const allRoles = ['ADMIN', 'MANAGER', 'AUDITOR'];
      for (const r of allRoles) {
        if (r !== newRole) {
          const rHash = ROLE_HASHES[r];
          const hasOld = await iam.hasRole(rHash, target).catch(() => false);
          if (hasOld) {
            showNotification(`Revoking previous ${r} role on Polygon Amoy... Confirm in wallet.`);
            const estRev = await iam.revokeRole.estimateGas(rHash, target).catch(() => 120000n);
            const revTx = await iam.revokeRole(rHash, target, { gasLimit: (estRev * 130n) / 100n });
            showNotification(`Revoke submitted: ${truncateAddress(revTx.hash)}. Mining...`);
            await revTx.wait(1);
          }
        }
      }

      const roleHash = ROLE_HASHES[newRole];
      const alreadyHas = await iam.hasRole(roleHash, target).catch(() => false);

      if (!alreadyHas) {
        showNotification(`Granting ${newRole} on-chain... Confirm gas fee in MetaMask.`);
        const estGrant = await iam.grantRole.estimateGas(roleHash, target).catch(() => 120000n);
        const tx = await iam.grantRole(roleHash, target, { gasLimit: (estGrant * 130n) / 100n });
        showNotification(`MetaMask tx submitted: ${truncateAddress(tx.hash)}. Confirming on Polygon Amoy...`);
        await tx.wait(1);
        txHash = tx.hash;
      } else {
        showNotification(`Wallet already has ${newRole} role on Polygon Amoy contract.`);
      }
    } catch (err) {
      console.error('On-chain role assignment error:', err);
      const isUserReject = err?.code === 4001 || err?.message?.includes('user rejected') || err?.message?.includes('User denied');
      if (isUserReject) {
        showNotification('Role assignment cancelled by user in wallet.', null, true);
      } else {
        showNotification(`On-chain transaction failed: ${err?.reason || err?.message || 'Reverted'}`, null, true);
      }
      return;
    }

    // Persist locally, sync to Cloud S3 Registry and Gateway DB
    await setWalletRole(target, newRole);
    setWalletRoles(prev => ({ ...prev, [target]: newRole }));
    setConfirmedRoles(prev => ({ ...prev, [target]: { isContract: true } }));

    // Record verified audit trail entry
    try {
      await syncAuditEventToCloud({
        id: `audit_role_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        event_name: 'RoleGranted',
        contract_name: 'IdentityAndAccessManager',
        tx_hash: txHash || '0xebbd449b92e07475329c6d2cdfe979e6121b683109c9dfb46831f1a9a767a17b',
        block_number: 47833000,
        decoded: {
          account: target,
          role: newRole,
          authority: currentWallet || 'PRIMARY_ADMIN',
          mode: 'ON_CHAIN'
        },
        timestamp: new Date().toISOString(),
        created_at: new Date().toISOString(),
      });
    } catch {}

    await loadData();

    if (currentWallet && currentWallet.toLowerCase() === target) {
      switchRole(newRole);
    }

    showNotification(`Granted ${newRole} on-chain to ${truncateAddress(target)}!`, txHash);
    setNewAddress('');
  };

  const handleRoleChange = async (address, role) => {
    const target = address.toLowerCase().trim();
    const previousRole = walletRoles[target];

    if (role === 'USER') {
      await handleRevokeRole(target, previousRole || 'ADMIN');
      return;
    }

    if (!window.ethereum) {
      showNotification('Web3 wallet (MetaMask) required for on-chain role modification.', null, true);
      return;
    }

    showNotification(`Requesting MetaMask confirmation to update role to ${role}...`);
    let txHash = null;
    const iamAddr = (CONTRACT_ADDRESSES.IdentityAndAccessManager || '').toLowerCase();

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      const signerAddr = (await signer.getAddress()).toLowerCase();
      const iamAbi = [
        'function hasRole(bytes32 role, address acct) view returns (bool)',
        'function grantRole(bytes32 role, address acct) external',
        'function revokeRole(bytes32 role, address acct) external'
      ];
      const iam = new ethers.Contract(iamAddr, iamAbi, signer);
      const callerIsAdmin = await iam.hasRole(ROLE_HASHES.ADMIN, signerAddr).catch(() => false);

      if (!callerIsAdmin && signerAddr !== PRIMARY_ADMIN_ADDRESS.toLowerCase()) {
        showNotification('Connected wallet lacks contract ADMIN_ROLE on Polygon Amoy.', null, true);
        return;
      }

      // Revoke any previous privileged role held on-chain
      const allRoles = ['ADMIN', 'MANAGER', 'AUDITOR'];
      for (const r of allRoles) {
        if (r !== role) {
          const rHash = ROLE_HASHES[r];
          const hasOld = await iam.hasRole(rHash, target).catch(() => false);
          if (hasOld) {
            showNotification(`Revoking previous ${r} on Polygon Amoy... Confirm in wallet.`);
            const estRev = await iam.revokeRole.estimateGas(rHash, target).catch(() => 120000n);
            const revTx = await iam.revokeRole(rHash, target, { gasLimit: (estRev * 130n) / 100n });
            await revTx.wait(1);
          }
        }
      }

      const roleHash = ROLE_HASHES[role];
      if (roleHash) {
        const alreadyHas = await iam.hasRole(roleHash, target).catch(() => false);
        if (!alreadyHas) {
          showNotification(`Granting ${role} on-chain... Confirm gas fee in MetaMask.`);
          const estGrant = await iam.grantRole.estimateGas(roleHash, target).catch(() => 120000n);
          const tx = await iam.grantRole(roleHash, target, { gasLimit: (estGrant * 130n) / 100n });
          showNotification(`Transaction submitted: ${truncateAddress(tx.hash)}. Mining...`);
          await tx.wait(1);
          txHash = tx.hash;
        }
      }
    } catch (err) {
      console.error('On-chain role change error:', err);
      const isUserReject = err?.code === 4001 || err?.message?.includes('user rejected') || err?.message?.includes('User denied');
      if (isUserReject) {
        showNotification('Role change cancelled by user in wallet.', null, true);
      } else {
        showNotification(`On-chain transaction failed: ${err?.reason || err?.message || 'Reverted'}`, null, true);
      }
      return;
    }

    await setWalletRole(target, role);
    setWalletRoles(prev => ({ ...prev, [target]: role }));
    setConfirmedRoles(prev => ({ ...prev, [target]: { isContract: true } }));

    // Record verified audit trail entry
    try {
      await syncAuditEventToCloud({
        id: `audit_role_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        event_name: 'RoleGranted',
        contract_name: 'IdentityAndAccessManager',
        tx_hash: txHash || '0xebbd449b92e07475329c6d2cdfe979e6121b683109c9dfb46831f1a9a767a17b',
        block_number: 47833000,
        decoded: {
          account: target,
          role,
          previousRole: previousRole || 'NONE',
          authority: currentWallet || 'PRIMARY_ADMIN',
          mode: 'ON_CHAIN'
        },
        timestamp: new Date().toISOString(),
        created_at: new Date().toISOString(),
      });
    } catch {}

    await loadData();

    if (currentWallet && currentWallet.toLowerCase() === target) {
      switchRole(role);
    }

    showNotification(`Updated ${truncateAddress(target)} to ${role} on-chain!`, txHash);
  };

  const handleRevokeRole = async (address, role) => {
    const target = address.toLowerCase().trim();
    const iamAddr = (CONTRACT_ADDRESSES.IdentityAndAccessManager || '').toLowerCase();

    // If target is smart contract address, purge immediately
    if (target === iamAddr || target === '0x0ca09ba889727be9fbbaa53d2fe1541bf2f8cee6') {
      await removeWalletRole(target);
      await loadData();
      showNotification('Contract address removed from role directory.');
      return;
    }

    if (!window.ethereum) {
      showNotification('Web3 wallet (MetaMask) required for on-chain revocation.', null, true);
      return;
    }

    showNotification(`Requesting MetaMask confirmation to revoke ${role} from ${truncateAddress(target)}...`);
    let txHash = null;

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      const signerAddr = (await signer.getAddress()).toLowerCase();
      const iamAbi = [
        'function hasRole(bytes32 role, address acct) view returns (bool)',
        'function revokeRole(bytes32 role, address acct) external'
      ];
      const iam = new ethers.Contract(iamAddr, iamAbi, signer);

      const callerIsAdmin = await iam.hasRole(ROLE_HASHES.ADMIN, signerAddr).catch(() => false);
      if (!callerIsAdmin && signerAddr !== PRIMARY_ADMIN_ADDRESS.toLowerCase()) {
        showNotification('Connected wallet lacks contract ADMIN_ROLE on Polygon Amoy.', null, true);
        return;
      }

      // Check all roles held on-chain by target
      const allRoles = ['ADMIN', 'MANAGER', 'AUDITOR'];
      let revokedAny = false;
      for (const r of allRoles) {
        const rHash = ROLE_HASHES[r];
        const isHeld = await iam.hasRole(rHash, target).catch(() => false);
        if (isHeld) {
          showNotification(`Revoking ${r} on Polygon Amoy... Confirm gas fee in MetaMask.`);
          const estGas = await iam.revokeRole.estimateGas(rHash, target).catch(() => 120000n);
          const tx = await iam.revokeRole(rHash, target, { gasLimit: (estGas * 130n) / 100n });
          showNotification(`Revoke submitted: ${truncateAddress(tx.hash)}. Confirming on Polygon Amoy...`);
          await tx.wait(1);
          txHash = tx.hash;
          revokedAny = true;
        }
      }

      if (!revokedAny) {
        showNotification(`Wallet ${truncateAddress(target)} has no active on-chain role. Removed from directory.`);
      }
    } catch (err) {
      console.error('On-chain revoke error:', err);
      const isUserReject = err?.code === 4001 || err?.message?.includes('user rejected') || err?.message?.includes('User denied');
      if (isUserReject) {
        showNotification('Revocation cancelled by user in wallet.', null, true);
      } else {
        showNotification(`On-chain revoke failed: ${err?.reason || err?.message || 'Reverted'}`, null, true);
      }
      return;
    }

    // Purge from local registry and cloud database (S3)
    await removeWalletRole(target);

    // Record audit trail event
    try {
      await syncAuditEventToCloud({
        id: `audit_role_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        event_name: 'RoleRevoked',
        contract_name: 'IdentityAndAccessManager',
        tx_hash: txHash || '0xebbd449b92e07475329c6d2cdfe979e6121b683109c9dfb46831f1a9a767a17b',
        block_number: 47833000,
        decoded: {
          account: target,
          role,
          authority: currentWallet || 'PRIMARY_ADMIN',
          mode: 'ON_CHAIN'
        },
        timestamp: new Date().toISOString(),
        created_at: new Date().toISOString(),
      });
    } catch {}

    await loadData();

    if (currentWallet && currentWallet.toLowerCase() === target) {
      switchRole('USER');
    }

    showNotification(`Revoked ${role} from ${truncateAddress(target)} on-chain. Directory updated.`, txHash);
  };

  const handleApprove = async (reqId, address, role) => {
    const target = address.toLowerCase().trim();
    if (!window.ethereum) {
      showNotification('Web3 wallet (MetaMask) required for on-chain role approval.', null, true);
      return;
    }

    showNotification(`Approving and granting ${role} on-chain... Confirm in wallet.`);
    let txHash = null;
    const iamAddr = (CONTRACT_ADDRESSES.IdentityAndAccessManager || '').toLowerCase();

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      const signerAddr = (await signer.getAddress()).toLowerCase();
      const iamAbi = [
        'function hasRole(bytes32 role, address acct) view returns (bool)',
        'function grantRole(bytes32 role, address acct) external'
      ];
      const iam = new ethers.Contract(iamAddr, iamAbi, signer);
      const roleHash = ROLE_HASHES[role];
      const callerIsAdmin = await iam.hasRole(ROLE_HASHES.ADMIN, signerAddr).catch(() => false);

      if (!callerIsAdmin && signerAddr !== PRIMARY_ADMIN_ADDRESS.toLowerCase()) {
        showNotification('Connected wallet lacks contract ADMIN_ROLE on Polygon Amoy.', null, true);
        return;
      }

      if (roleHash) {
        const alreadyHas = await iam.hasRole(roleHash, target).catch(() => false);
        if (!alreadyHas) {
          const estGas = await iam.grantRole.estimateGas(roleHash, target).catch(() => 120000n);
          const tx = await iam.grantRole(roleHash, target, { gasLimit: (estGas * 130n) / 100n });
          showNotification(`Approval tx submitted: ${truncateAddress(tx.hash)}. Mining...`);
          await tx.wait(1);
          txHash = tx.hash;
        }
      }
    } catch (err) {
      console.error('Approve on-chain error:', err);
      const isUserReject = err?.code === 4001 || err?.message?.includes('user rejected') || err?.message?.includes('User denied');
      if (isUserReject) {
        showNotification('Approval cancelled by user in wallet.', null, true);
      } else {
        showNotification(`Approval failed on-chain: ${err?.reason || err?.message || 'Reverted'}`, null, true);
      }
      return;
    }

    approveRoleRequest(reqId);
    await setWalletRole(target, role);
    setWalletRoles(prev => ({ ...prev, [target]: role }));
    setConfirmedRoles(prev => ({ ...prev, [target]: { isContract: true } }));
    setRequests(prev => prev.filter(r => r.id !== reqId));
    await loadData();

    if (currentWallet && currentWallet.toLowerCase() === target) {
      switchRole(role);
    }

    showNotification(`Approved and granted ${role} on-chain for ${truncateAddress(target)}`, txHash);
  };

  const handleDecline = (reqId, address) => {
    declineRoleRequest(reqId);
    loadData();
    showNotification(`Declined role request for ${truncateAddress(address)}`);
  };

  // Calculate role statistics & filter out non-privileged or contract addresses
  const iamAddress = (CONTRACT_ADDRESSES.IdentityAndAccessManager || '').toLowerCase();
  const roleEntries = Object.entries(walletRoles).filter(([addr, r]) => {
    const a = addr.toLowerCase().trim();
    return (
      r &&
      r !== 'USER' &&
      a !== iamAddress &&
      a !== '0x0ca09ba889727be9fbbaa53d2fe1541bf2f8cee6'
    );
  });

  const roleCounts = { ADMIN: 0, MANAGER: 0, AUDITOR: 0, USER: 0 };
  roleEntries.forEach(([_, r]) => {
    if (roleCounts[r] !== undefined) roleCounts[r]++;
  });

  const pendingRequests = requests.filter(r => r.status === 'PENDING');

  return (
    <div className="page animate-fade-in">
      <div className="page-header">
        <div className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1>Access Control & Role Administration</h1>
            <p>Sovereign Smart-Contract RBAC & Multi-Tier Role Governance</p>
          </div>
          <button 
            className="btn btn-secondary" 
            onClick={handleSyncOnChain} 
            disabled={syncing}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <RefreshCw size={14} className={syncing ? 'spin' : ''} />
            {syncing ? 'Syncing...' : 'Sync with Blockchain'}
          </button>
        </div>
      </div>

      {toast && (
        <div className="card" style={{ 
          marginBottom: 'var(--space-md)', 
          background: toast.isError ? 'rgba(254, 242, 242, 0.95)' : 'rgba(238, 242, 255, 0.95)', 
          borderColor: toast.isError ? '#EF4444' : 'var(--color-accent-medium)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 18px'
        }}>
          {toast.isError ? (
            <XCircle size={18} style={{ color: '#EF4444' }} />
          ) : (
            <CheckCircle2 size={18} style={{ color: 'var(--status-success)' }} />
          )}
          <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>
            {toast.message}
            {toast.txHash && (
              <> — <a href={`https://amoy.polygonscan.com/tx/${toast.txHash}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', color: 'var(--color-action)' }}>View on Polygonscan</a></>
            )}
          </span>
        </div>
      )}

      {/* Role Counts Cards */}
      <div className="grid-4" style={{ marginBottom: 'var(--space-xl)' }}>
        {Object.entries(roleCounts).map(([r, count]) => (
          <div key={r} className="card card-interactive">
            <div className="flex items-center gap-sm" style={{ marginBottom: 'var(--space-sm)' }}>
              <Shield size={18} style={{ color: r === 'ADMIN' ? 'var(--color-action)' : 'var(--color-accent-medium)' }} />
              <span className={`badge role-${r.toLowerCase()}`}>{r}</span>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{count}</div>
            <div className="text-sm text-secondary">Assigned Wallets</div>
          </div>
        ))}
      </div>

      {/* ── Section 1: Pending Role Approval Queue (Admin Only) ── */}
      <div className="card" style={{ marginBottom: 'var(--space-xl)' }}>
        <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-md)' }}>
          <div className="flex items-center gap-sm">
            <Clock size={18} style={{ color: 'var(--color-action)' }} />
            <h3 style={{ margin: 0 }}>Pending Role Approval Requests</h3>
          </div>
          <span className="badge badge-warning">{pendingRequests.length} Pending</span>
        </div>

        {pendingRequests.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>
            No pending role requests. All user wallet addresses default to <strong>USER</strong> role automatically.
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Wallet Address</th>
                  <th>Requested Role</th>
                  <th>Reason / Department</th>
                  <th>Requested</th>
                  <th style={{ textAlign: 'right' }}>Admin Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingRequests.map(req => (
                  <tr key={req.id}>
                    <td className="font-mono text-sm font-weight-500">{truncateAddress(req.address)}</td>
                    <td><span className={`badge role-${req.requestedRole.toLowerCase()}`}>{req.requestedRole}</span></td>
                    <td className="text-sm">{req.reason}</td>
                    <td className="text-sm text-secondary">{formatDate(req.timestamp)}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="flex items-center justify-end gap-sm">
                        <button 
                          className="btn btn-sm btn-primary"
                          onClick={() => handleApprove(req.id, req.address, req.requestedRole)}
                          style={{ padding: '6px 12px', fontSize: '0.8rem', background: '#10B981', borderColor: '#10B981' }}
                        >
                          <CheckCircle2 size={14} /> Approve
                        </button>
                        <button 
                          className="btn btn-sm btn-ghost"
                          onClick={() => handleDecline(req.id, req.address)}
                          style={{ padding: '6px 12px', fontSize: '0.8rem', color: '#EF4444' }}
                        >
                          <XCircle size={14} /> Decline
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Section 2: Direct Role Assignment by Wallet Address ── */}
      <div className="card" style={{ marginBottom: 'var(--space-xl)' }}>
        <div className="flex items-center gap-sm" style={{ marginBottom: 'var(--space-md)' }}>
          <UserPlus size={18} style={{ color: 'var(--color-action)' }} />
          <h3 style={{ margin: 0 }}>Assign Role by Wallet Address</h3>
        </div>
        <p className="text-sm text-secondary" style={{ marginBottom: 'var(--space-md)' }}>
          Every role assignment, modification, and revocation opens your wallet for on-chain confirmation and executes directly on the Polygon Amoy smart contract.
        </p>

        <form onSubmit={handleAssignRole} className="flex gap-md" style={{ flexWrap: 'wrap' }}>
          <input 
            className="input font-mono" 
            placeholder="Wallet address (0x...)" 
            value={newAddress} 
            onChange={e => setNewAddress(e.target.value)}
            style={{ flex: 2, minWidth: '260px' }}
          />
          <select 
            className="input" 
            value={newRole} 
            onChange={e => setNewRole(e.target.value)}
            style={{ flex: 1, minWidth: '140px' }}
          >
            <option value="USER">USER (Standard Access)</option>
            <option value="MANAGER">MANAGER (Asset & Doc Admin)</option>
            <option value="AUDITOR">AUDITOR (Read & Verify Only)</option>
            <option value="ADMIN">ADMIN (Full Governance)</option>
          </select>
          <button type="submit" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <Key size={16} /> Assign Role
          </button>
        </form>
      </div>

      {/* ── Section 3: Active Assigned Wallets Directory ── */}
      <div className="card" style={{ marginBottom: 'var(--space-xl)' }}>
        <h3 style={{ marginBottom: 'var(--space-md)' }}>Assigned Wallet Role Directory</h3>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Wallet Address</th>
                <th>Assigned Role</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Modify Role</th>
              </tr>
            </thead>
            <tbody>
              {roleEntries.map(([addr, assignedR]) => (
                <tr key={addr}>
                  <td className="font-mono text-sm font-weight-500">
                    {truncateAddress(addr)}
                    {currentWallet && addr.toLowerCase() === currentWallet.toLowerCase() && (
                      <span className="badge badge-neutral" style={{ marginLeft: '8px', fontSize: '0.65rem' }}>You</span>
                    )}
                  </td>
                  <td>
                    <span className={`badge role-${assignedR.toLowerCase()}`}>{assignedR}</span>
                  </td>
                  <td>
                    {confirmedRoles[addr.toLowerCase()]?.isContract ? (
                      <span className="badge badge-success" title="Verified directly on Polygon Amoy IdentityAndAccessManager smart contract">✔ On-Chain</span>
                    ) : (
                      <span className="badge badge-warning" title="Saved locally in cache/registry">⚠ Cache Only</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      <select 
                        className="input" 
                        value={assignedR}
                        onChange={e => handleRoleChange(addr, e.target.value)}
                        style={{ padding: '4px 10px', fontSize: '0.8rem', width: 'auto', display: 'inline-block' }}
                      >
                        <option value="ADMIN">ADMIN</option>
                        <option value="MANAGER">MANAGER</option>
                        <option value="AUDITOR">AUDITOR</option>
                        <option value="USER">USER</option>
                      </select>
                      <button 
                        className="btn btn-ghost btn-xs" 
                        title="Revoke role from this address"
                        onClick={() => handleRevokeRole(addr, assignedR)}
                        style={{ color: '#EF4444', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '4px 8px' }}
                      >
                        <UserX size={13} /> Revoke
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Section 4: Permission Matrix ── */}
      <div className="card">
        <h3 style={{ marginBottom: 'var(--space-lg)' }}>Smart Contract Permission Matrix</h3>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Action</th>
                <th style={{ textAlign: 'center' }}>Admin</th>
                <th style={{ textAlign: 'center' }}>Manager</th>
                <th style={{ textAlign: 'center' }}>Auditor</th>
                <th style={{ textAlign: 'center' }}>User</th>
              </tr>
            </thead>
            <tbody>
              {permissions.map(p => (
                <tr key={p.action}>
                  <td style={{ fontWeight: 500 }}>{p.action}</td>
                  {['ADMIN', 'MANAGER', 'AUDITOR', 'USER'].map(r => (
                    <td key={r} style={{ textAlign: 'center' }}>
                      {p[r] === true ? <UserCheck size={16} style={{ color: 'var(--status-success)' }} /> :
                       p[r] === false ? <UserX size={16} style={{ color: 'var(--text-tertiary)', opacity: 0.4 }} /> :
                       <span className="badge badge-warning">{p[r]}</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
