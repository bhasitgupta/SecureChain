import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { truncateAddress } from '../utils/formatters';
import { CONTRACT_ADDRESSES, NETWORK } from '../utils/constants';
import { Wallet, Globe, FileCode, ExternalLink, Copy, Check, ShieldCheck } from 'lucide-react';

const CONTRACT_METADATA = {
  IdentityAndAccessManager: {
    label: 'Identity & Access Manager (IAM)',
    role: 'DID Registry, On-Chain RBAC & Sovereign Permissions',
  },
  EnterpriseAssetNFT: {
    label: 'Enterprise Asset NFT (EASSET)',
    role: 'ERC-721 Token Standard, Sovereign Asset Lifecycle & Transfers',
  },
  DocumentAnchorRegistry: {
    label: 'Document Anchor Registry',
    role: 'Immutable Merkle Root Anchoring & Cryptographic Proof Verification',
  },
  RecoveryManager: {
    label: 'Social & Multi-Sig Recovery Manager',
    role: 'Account Recovery, Authorized Security Providers & Timelocked Veto',
  },
};

export default function Settings() {
  const { wallet, role } = useAuth();
  const [copiedKey, setCopiedKey] = useState(null);

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const getExplorerUrl = (address) => {
    const base = NETWORK.blockExplorer || 'https://amoy.polygonscan.com';
    return `${base.replace(/\/$/, '')}/address/${address}`;
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>System Settings</h1>
        <p>Live blockchain network parameters and deployed smart contract registry</p>
      </div>

      <div className="grid-2">
        <div className="card">
          <h3 style={{ marginBottom: 'var(--space-lg)' }}>
            <Wallet size={18} style={{ display: 'inline', marginRight: 8, verticalAlign: 'text-bottom' }} />
            Connected Identity
          </h3>
          <div className="flex flex-col gap-md">
            <div>
              <span className="text-sm text-secondary">Wallet Address</span>
              <div className="flex items-center gap-sm" style={{ marginTop: 4 }}>
                <span className="font-mono text-sm" style={{ wordBreak: 'break-all' }}>
                  {wallet || 'Not connected'}
                </span>
                {wallet && (
                  <button 
                    className="btn btn-ghost btn-sm" 
                    onClick={() => handleCopy(wallet, 'wallet')}
                    title="Copy wallet address"
                    style={{ padding: '4px 8px' }}
                  >
                    {copiedKey === 'wallet' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                  </button>
                )}
              </div>
            </div>
            <div>
              <span className="text-sm text-secondary">Active Governance Role</span>
              <div style={{ marginTop: 6 }}>
                <span className={`badge role-${role?.toLowerCase() || 'user'}`}>
                  {role || 'USER'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: 'var(--space-lg)' }}>
            <Globe size={18} style={{ display: 'inline', marginRight: 8, verticalAlign: 'text-bottom' }} />
            Blockchain Network
          </h3>
          <div className="flex flex-col gap-md">
            <div className="flex items-center justify-between">
              <span className="text-sm text-secondary">Network Name</span>
              <span className="text-sm font-weight-500" style={{ fontWeight: 600 }}>{NETWORK.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-secondary">Chain ID</span>
              <span className="font-mono text-sm">{NETWORK.chainId} (0x{parseInt(NETWORK.chainId).toString(16)})</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-secondary">Currency</span>
              <span className="text-sm font-mono">{NETWORK.nativeCurrency?.symbol || 'POL'} (18 decimals)</span>
            </div>
            <div>
              <span className="text-sm text-secondary">RPC Endpoint</span>
              <div className="font-mono text-xs text-secondary" style={{ marginTop: 4, wordBreak: 'break-all' }}>
                {NETWORK.rpcUrl}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-secondary">Block Explorer</span>
              <a 
                href={NETWORK.blockExplorer} 
                target="_blank" 
                rel="noreferrer"
                className="font-mono text-xs flex items-center gap-xs"
                style={{ color: 'var(--color-action)' }}
              >
                amoy.polygonscan.com <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {role !== 'USER' && (
        <div className="card" style={{ marginTop: 'var(--space-lg)' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-lg)', flexWrap: 'wrap', gap: 8 }}>
            <h3>
              <FileCode size={18} style={{ display: 'inline', marginRight: 8, verticalAlign: 'text-bottom' }} />
              Authoritative Smart Contracts
            </h3>
            <span className="badge badge-success flex items-center gap-xs">
              <ShieldCheck size={14} /> Polygon Amoy Enforced
            </span>
          </div>

          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Contract Component</th>
                  <th>EVM Contract Address</th>
                  <th>Purpose / Module</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(CONTRACT_ADDRESSES).map(([name, addr]) => {
                  const meta = CONTRACT_METADATA[name] || { label: name, role: 'Smart Contract Engine' };
                  return (
                    <tr key={name}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{meta.label}</div>
                        <div className="text-xs text-tertiary font-mono">{name}</div>
                      </td>
                      <td>
                        <div className="flex items-center gap-xs">
                          <span className="font-mono text-sm" style={{ fontWeight: 500 }}>
                            {addr}
                          </span>
                          <button 
                            className="btn btn-ghost btn-sm" 
                            onClick={() => handleCopy(addr, name)}
                            title="Copy contract address"
                            style={{ padding: '4px 6px' }}
                          >
                            {copiedKey === name ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
                          </button>
                        </div>
                      </td>
                      <td>
                        <span className="text-sm text-secondary">{meta.role}</span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <a 
                          href={getExplorerUrl(addr)} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="btn btn-ghost btn-sm"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                        >
                          <ExternalLink size={13} /> Explorer
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
