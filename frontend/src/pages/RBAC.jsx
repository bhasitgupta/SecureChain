import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  getAllWalletRoles, 
  setWalletRole, 
  removeWalletRole,
  getRoleRequests, 
  approveRoleRequest, 
  declineRoleRequest 
} from '../utils/roleRegistry';
import { grantRoleOnChain, revokeRoleOnChain } from '../lib/api';
import { truncateAddress, formatDate } from '../utils/formatters';
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
  AlertCircle 
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
  const { wallet: currentWallet, role: currentRole } = useAuth();
  const [walletRoles, setWalletRoles] = useState({});
  const [requests, setRequests] = useState([]);
  const [newAddress, setNewAddress] = useState('');
  const [newRole, setNewRole] = useState('USER');
  const [toastMsg, setToastMsg] = useState('');

  const loadData = () => {
    setWalletRoles(getAllWalletRoles());
    setRequests(getRoleRequests());
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('sc_role_updated', handleUpdate);
    window.addEventListener('sc_requests_updated', handleUpdate);
    return () => {
      window.removeEventListener('sc_role_updated', handleUpdate);
      window.removeEventListener('sc_requests_updated', handleUpdate);
    };
  }, []);

  const showNotification = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleAssignRole = async (e) => {
    e.preventDefault();
    if (!newAddress || !newAddress.startsWith('0x') || newAddress.length < 10) {
      showNotification('Please enter a valid Ethereum wallet address (0x...)');
      return;
    }
    const target = newAddress.trim();
    setWalletRole(target, newRole);
    showNotification(`Successfully assigned role ${newRole} to ${truncateAddress(target)}`);
    setNewAddress('');
    try {
      await grantRoleOnChain(newRole, target);
      showNotification(`On-chain transaction submitted for ${truncateAddress(target)}`);
    } catch {}
  };

  const handleRoleChange = async (address, role) => {
    if (role === 'USER') {
      await handleRevokeRole(address, walletRoles[address] || 'ADMIN');
      return;
    }
    setWalletRole(address, role);
    showNotification(`Updated ${truncateAddress(address)} to ${role}`);
    try {
      await grantRoleOnChain(role, address);
    } catch {}
  };

  const handleRevokeRole = async (address, role) => {
    removeWalletRole(address);
    showNotification(`Revoked role from ${truncateAddress(address)}`);
    try {
      await revokeRoleOnChain(role, address);
    } catch {}
  };

  const handleApprove = async (reqId, address, role) => {
    approveRoleRequest(reqId);
    showNotification(`Approved role ${role} for ${truncateAddress(address)}`);
    try {
      await grantRoleOnChain(role, address);
    } catch {}
  };

  const handleDecline = (reqId, address) => {
    declineRoleRequest(reqId);
    showNotification(`Declined role request for ${truncateAddress(address)}`);
  };

  // Calculate role statistics
  const roleEntries = Object.entries(walletRoles);
  const roleCounts = { ADMIN: 0, MANAGER: 0, AUDITOR: 0, USER: 0 };
  roleEntries.forEach(([_, r]) => {
    if (roleCounts[r] !== undefined) roleCounts[r]++;
  });

  const pendingRequests = requests.filter(r => r.status === 'PENDING');

  return (
    <div className="page animate-fade-in">
      <div className="page-header">
        <div>
          <h1>Access Control & Role Administration</h1>
          <p>Sovereign Smart-Contract RBAC & Multi-Tier Role Governance</p>
        </div>
      </div>

      {toastMsg && (
        <div className="card" style={{ 
          marginBottom: 'var(--space-md)', 
          background: 'rgba(238, 242, 255, 0.9)', 
          borderColor: 'var(--color-accent-medium)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 18px'
        }}>
          <CheckCircle2 size={18} style={{ color: 'var(--status-success)' }} />
          <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{toastMsg}</span>
        </div>
      )}

      {/* Role Counts */}
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
          Directly grant or modify a wallet's permissions. Any new wallet address connecting without explicit assignment defaults to <strong>USER</strong>.
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
                    <span className="badge badge-success">Active On-Chain</span>
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
