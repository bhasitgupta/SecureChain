import { mockRecoveryProviders } from '../utils/mockData';
import { formatDate, getStatusColor } from '../utils/formatters';
import { KeyRound, Plus, ShieldAlert, CheckCircle, ArrowRight, Info } from 'lucide-react';
import EmptyState from '../components/EmptyState';
import { useState } from 'react';
import './Recovery.css';

export default function Recovery() {
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="page">
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div><h1>Account Recovery</h1><p>ERC-7947-compatible smart account recovery management</p></div>
          <button className="btn btn-primary" onClick={() => setShowAdd(true)}><Plus size={16} /> Add Provider</button>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 'var(--space-lg)', background: 'var(--color-accent-soft)' }}>
        <div className="flex items-start gap-md">
          <Info size={18} style={{ color: 'var(--status-info)', flexShrink: 0, marginTop: 2 }} />
          <div>
            <div style={{ fontWeight: 500, marginBottom: 4 }}>How Recovery Works</div>
            <div className="text-sm text-secondary">
              Recovery changes account control only. It never rewrites prior transactions, NFT history, document versions, hashes, Merkle roots, or audit events.
              Recovery requires a registered provider, valid proof, and replay protection.
            </div>
          </div>
        </div>
      </div>

      {/* Recovery Flow Visual */}
      <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
        <h3 style={{ marginBottom: 'var(--space-lg)' }}>Recovery Flow</h3>
        <div className="recovery-flow">
          {['Credential Lost', 'Recovery Request', 'Provider Validates', 'Proof + Replay Check', 'recoverAccess()', 'Access Restored', 'Audit Event'].map((step, i) => (
            <div key={step} className="recovery-flow-step">
              <div className="recovery-flow-node">{i + 1}</div>
              <span>{step}</span>
              {i < 6 && <ArrowRight size={14} className="text-tertiary" />}
            </div>
          ))}
        </div>
      </div>

      {/* Providers */}
      <div className="card">
        <h3 style={{ marginBottom: 'var(--space-lg)' }}>Recovery Providers</h3>
        {mockRecoveryProviders.length === 0 ? (
          <EmptyState
            icon={KeyRound}
            message="No recovery providers"
            description="Register trusted recovery providers for smart account credential restoration."
          />
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr><th>Provider ID</th><th>Address</th><th>Status</th><th>Registered</th><th>Recoveries</th></tr>
              </thead>
              <tbody>
                {mockRecoveryProviders.map(rp => (
                  <tr key={rp.id}>
                    <td style={{ fontWeight: 500 }}>{rp.id}</td>
                    <td className="font-mono text-sm">{rp.address}</td>
                    <td><span className={`badge badge-${getStatusColor(rp.status)}`}>{rp.status}</span></td>
                    <td className="text-sm text-secondary">{formatDate(rp.registeredAt)}</td>
                    <td>{rp.recoveryCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal-content card animate-fade-scale" onClick={e => e.stopPropagation()}>
            <h3 style={{ marginBottom: 'var(--space-lg)' }}>Register Recovery Provider</h3>
            <div className="flex flex-col gap-md">
              <div className="input-group"><label>Provider Address</label><input className="input font-mono" placeholder="0x..." /></div>
              <div className="input-group"><label>Provider Type</label>
                <select className="input"><option>Social Recovery</option><option>Hardware Key</option><option>Multi-Sig</option></select>
              </div>
              <div className="flex gap-md" style={{ marginTop: 'var(--space-md)' }}>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => setShowAdd(false)}>Register Provider</button>
                <button className="btn btn-secondary" onClick={() => setShowAdd(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
