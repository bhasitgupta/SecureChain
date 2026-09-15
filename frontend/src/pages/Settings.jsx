import { useAuth } from '../context/AuthContext';
import { truncateAddress } from '../utils/formatters';
import { CONTRACT_ADDRESSES, NETWORK } from '../utils/constants';
import { Wallet, Globe, FileCode, ExternalLink } from 'lucide-react';

export default function Settings() {
  const { wallet, role } = useAuth();

  return (
    <div className="page">
      <div className="page-header">
        <h1>Settings</h1>
        <p>Network configuration and contract addresses</p>
      </div>

      <div className="grid-2">
        <div className="card">
          <h3 style={{ marginBottom: 'var(--space-lg)' }}><Wallet size={18} style={{ display: 'inline', marginRight: 8 }} />Wallet</h3>
          <div className="flex flex-col gap-md">
            <div><span className="text-sm text-secondary">Address</span><div className="font-mono text-sm" style={{ marginTop: 4 }}>{wallet || 'Not connected'}</div></div>
            <div><span className="text-sm text-secondary">Current Role</span><div style={{ marginTop: 4 }}><span className={`badge role-${role?.toLowerCase()}`}>{role}</span></div></div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: 'var(--space-lg)' }}><Globe size={18} style={{ display: 'inline', marginRight: 8 }} />Network</h3>
          <div className="flex flex-col gap-md">
            <div><span className="text-sm text-secondary">Network</span><div className="text-sm" style={{ marginTop: 4 }}>{NETWORK.name}</div></div>
            <div><span className="text-sm text-secondary">Chain ID</span><div className="font-mono text-sm" style={{ marginTop: 4 }}>{NETWORK.chainId}</div></div>
            <div><span className="text-sm text-secondary">RPC</span><div className="font-mono text-xs" style={{ marginTop: 4 }}>{NETWORK.rpcUrl}</div></div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 'var(--space-lg)' }}>
        <h3 style={{ marginBottom: 'var(--space-lg)' }}><FileCode size={18} style={{ display: 'inline', marginRight: 8 }} />Smart Contracts</h3>
        <div className="table-container">
          <table className="table">
            <thead><tr><th>Contract</th><th>Address</th><th></th></tr></thead>
            <tbody>
              {Object.entries(CONTRACT_ADDRESSES).map(([name, addr]) => (
                <tr key={name}>
                  <td style={{ fontWeight: 500 }}>{name}</td>
                  <td className="font-mono text-sm">{addr}</td>
                  <td><button className="btn btn-ghost btn-sm"><ExternalLink size={12} /> Explorer</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
