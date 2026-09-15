import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { truncateAddress } from '../utils/formatters';
import { CONTRACT_ADDRESSES, NETWORK } from '../utils/constants';
import { Wallet, Globe, FileCode, ExternalLink, Copy, Check } from 'lucide-react';

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
            Wallet
          </h3>
          <div className="flex flex-col gap-md">
            <div>
              <span className="text-sm text-secondary">Address</span>
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
              <span className="text-sm text-secondary">Current Role</span>
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
            Network
          </h3>
          <div className="flex flex-col gap-md">
            <div>
              <span className="text-sm text-secondary">Network</span>
              <div className="text-sm font-weight-500" style={{ marginTop: 4, fontWeight: 600 }}>
                {NETWORK.name || 'Polygon Amoy Testnet'}
              </div>
            </div>
            <div>
              <span className="text-sm text-secondary">Chain ID</span>
              <div className="font-mono text-sm" style={{ marginTop: 4 }}>
                {NETWORK.chainId || '80002'}
              </div>
            </div>
            <div>
              <span className="text-sm text-secondary">RPC</span>
              <div className="font-mono text-xs text-secondary" style={{ marginTop: 4, wordBreak: 'break-all' }}>
                {NETWORK.rpcUrl || 'https://polygon-amoy.drpc.org'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {role !== 'USER' && (
        <div className="card" style={{ marginTop: 'var(--space-lg)' }}>
          <h3 style={{ marginBottom: 'var(--space-lg)' }}>
            <FileCode size={18} style={{ display: 'inline', marginRight: 8, verticalAlign: 'text-bottom' }} />
            Smart Contracts
          </h3>

          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: '35%' }}>CONTRACT</th>
                  <th>ADDRESS</th>
                  <th style={{ textAlign: 'right', width: '130px' }}></th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(CONTRACT_ADDRESSES).map(([name, addr]) => (
                  <tr key={name}>
                    <td style={{ fontWeight: 600 }}>{name}</td>
                    <td>
                      <div className="flex items-center gap-xs">
                        <span className="font-mono text-sm" style={{ wordBreak: 'break-all' }}>
                          {addr}
                        </span>
                        <button 
                          className="btn btn-ghost btn-sm" 
                          onClick={() => handleCopy(addr, name)}
                          title="Copy contract address"
                          style={{ padding: '3px 6px' }}
                        >
                          {copiedKey === name ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
                        </button>
                      </div>
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
