import { useState, useEffect } from 'react';
import { mockIdentities } from '../utils/mockData';
import { formatDate, truncateAddress, getStatusColor } from '../utils/formatters';
import { fetchIdentities, registerIdentity } from '../lib/api';
import { UserPlus, Search, Fingerprint, AlertCircle, CheckCircle2, Loader2, X } from 'lucide-react';
import EmptyState from '../components/EmptyState';
import './Identity.css';

export default function Identity() {
  const [identities, setIdentities] = useState(mockIdentities);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [account, setAccount] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const loadIdentities = async () => {
    try {
      const data = await fetchIdentities();
      if (data && data.length > 0) {
        setIdentities(data.map(i => ({
          name: i.subject_id || i.name || 'Enterprise Principal',
          did: i.did || `did:pkh:eip155:80002:${i.account}`,
          address: i.account || i.address,
          role: i.role || 'USER',
          status: i.status || 'Active',
          createdAt: i.created_at || i.createdAt || Date.now(),
        })));
      }
    } catch {
      console.warn('Backend identities offline, using local state');
    }
  };

  useEffect(() => {
    loadIdentities();
  }, []);

  const handleRegister = async () => {
    if (!account || !subjectId) {
      setErrorMsg('Wallet address and Subject ID / Name are required');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await registerIdentity(account, subjectId);
      setSuccessMsg({
        did: res.did || 'did:pkh:eip155:80002:' + account.slice(0, 10),
        txHash: res.txHash,
      });
      await loadIdentities();
      setTimeout(() => {
        setShowModal(false);
        setSuccessMsg(null);
        setAccount('');
        setSubjectId('');
      }, 3500);
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const filtered = identities.filter(i =>
    (i.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (i.did || '').toLowerCase().includes(search.toLowerCase()) ||
    (i.address || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page">
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1>Identity Management</h1>
            <p>DID-based identity registration and lifecycle on Polygon Amoy</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <UserPlus size={16} /> Register Identity
          </button>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
        <div className="flex items-center gap-md">
          <div className="input-group" style={{ flex: 1 }}>
            <div className="search-input-wrap">
              <Search size={16} className="search-icon" />
              <input 
                className="input search-input" 
                placeholder="Search by name, DID, or wallet..." 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
              />
            </div>
          </div>
        </div>
      </div>

      <div className="table-container card" style={{ padding: 0 }}>
        <table className="table">
          <thead>
            <tr>
              <th>Name / Subject</th>
              <th>DID (W3C PKH)</th>
              <th>Wallet</th>
              <th>Status</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((id, idx) => (
              <tr key={id.did || idx}>
                <td className="font-weight-500">{id.name}</td>
                <td className="font-mono text-sm">{id.did}</td>
                <td className="font-mono text-sm">{truncateAddress(id.address)}</td>
                <td><span className={`badge badge-${getStatusColor(id.status)}`}>{id.status}</span></td>
                <td className="text-sm text-secondary">{formatDate(id.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <EmptyState 
            icon={Fingerprint} 
            message="No identities found" 
            description="Register a new DID principal to get started." 
          />
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content card animate-fade-scale" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-lg)' }}>
              <h3>Register Enterprise Identity</h3>
              <button className="btn-icon btn-ghost" onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>

            {errorMsg && (
              <div className="flex items-center gap-sm p-3 rounded text-sm mb-3" style={{ background: '#FEE2E2', color: '#991B1B' }}>
                <AlertCircle size={16} /> {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="flex items-center gap-sm p-3 rounded text-sm mb-3" style={{ background: '#D1FAE5', color: '#065F46' }}>
                <CheckCircle2 size={16} />
                <span>
                  Registered on-chain! DID: {successMsg.did}
                  {successMsg.txHash && (
                    <> — <a href={`https://amoy.polygonscan.com/tx/${successMsg.txHash}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', color: '#065F46', fontWeight: 600 }}>View Tx on Polygonscan</a></>
                  )}
                </span>
              </div>
            )}

            <div className="flex flex-col gap-md">
              <div className="input-group">
                <label>Subject Full Name / Department Identifier</label>
                <input 
                  className="input" 
                  placeholder="e.g. Major General R. Sharma (HQ Logistics)"
                  value={subjectId}
                  onChange={e => setSubjectId(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label>Principal Ethereum Address</label>
                <input 
                  className="input font-mono" 
                  placeholder="0x..."
                  value={account}
                  onChange={e => setAccount(e.target.value)}
                />
              </div>

              <div className="flex gap-md" style={{ marginTop: 'var(--space-md)' }}>
                <button 
                  className="btn btn-primary" 
                  style={{ flex: 1 }} 
                  onClick={handleRegister}
                  disabled={loading}
                >
                  {loading ? <><Loader2 size={16} className="spin" /> Registering...</> : 'Register on Chain'}
                </button>
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
