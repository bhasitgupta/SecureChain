import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { formatDate, truncateAddress, getStatusColor } from '../utils/formatters';
import { fetchIdentities, registerIdentity } from '../lib/api';
import { 
  UserPlus, Search, Fingerprint, AlertCircle, CheckCircle2, 
  Loader2, X, RefreshCw, ExternalLink, Copy, Check, ShieldCheck, Wallet 
} from 'lucide-react';
import EmptyState from '../components/EmptyState';
import './Identity.css';

export default function Identity() {
  const { wallet, isConnected } = useAuth();
  const [identities, setIdentities] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [copiedDid, setCopiedDid] = useState(null);

  // Form State
  const [account, setAccount] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState(null);

  const loadIdentities = async (showSpinner = false) => {
    if (showSpinner) setSyncing(true);
    try {
      const data = await fetchIdentities();
      if (Array.isArray(data)) {
        setIdentities(data.map(i => ({
          name: i.name || i.subject_id || i.subjectId || 'Enterprise Principal',
          did: i.did || `did:pkh:eip155:80002:${i.address || i.account}`,
          address: (i.address || i.account || '').toLowerCase(),
          role: i.role || 'USER',
          status: i.status || 'Active',
          createdAt: i.createdAt || i.created_at || Date.now(),
          txHash: i.txHash || i.tx_hash || null,
          onChain: i.onChain !== false,
        })));
      }
    } catch (err) {
      console.warn('Failed to load identities:', err);
    } finally {
      if (showSpinner) setTimeout(() => setSyncing(false), 600);
    }
  };

  useEffect(() => {
    loadIdentities();

    const handleLiveSync = () => {
      loadIdentities();
    };

    window.addEventListener('sc_identities_updated', handleLiveSync);
    window.addEventListener('storage', handleLiveSync);
    return () => {
      window.removeEventListener('sc_identities_updated', handleLiveSync);
      window.removeEventListener('storage', handleLiveSync);
    };
  }, []);

  const handleOpenModal = () => {
    setShowModal(true);
    setErrorMsg('');
    setSuccessMsg(null);
    if (!account && wallet) {
      setAccount(wallet);
    }
  };

  const handleUseConnectedWallet = () => {
    if (wallet) {
      setAccount(wallet);
    }
  };

  const handleCopyDid = (did) => {
    if (!did) return;
    navigator.clipboard?.writeText(did);
    setCopiedDid(did);
    setTimeout(() => setCopiedDid(null), 2000);
  };

  const handleRegister = async () => {
    if (!account || !subjectId) {
      setErrorMsg('Wallet address and Subject ID / Department are required');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg(null);

    try {
      const res = await registerIdentity(account, subjectId);
      setSuccessMsg({
        did: res.did || `did:pkh:eip155:80002:${account.toLowerCase()}`,
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
      setErrorMsg(err.message || 'Identity registration failed');
    } finally {
      setLoading(false);
    }
  };

  const filtered = identities.filter(i =>
    (i.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (i.did || '').toLowerCase().includes(search.toLowerCase()) ||
    (i.address || '').toLowerCase().includes(search.toLowerCase()) ||
    (i.role || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page">
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1>Identity Management</h1>
            <p>W3C DID-based enterprise identity registration and lifecycle on Polygon Amoy</p>
          </div>
          <div className="flex items-center gap-sm">
            <button 
              className="btn btn-secondary" 
              onClick={() => loadIdentities(true)} 
              disabled={syncing}
              title="Sync latest verified identities from Polygon Amoy and Cloud"
            >
              <RefreshCw size={15} className={syncing ? 'spin' : ''} />
              <span>{syncing ? 'Syncing...' : 'Sync Chain'}</span>
            </button>
            <button className="btn btn-primary" onClick={handleOpenModal}>
              <UserPlus size={16} /> Register Identity
            </button>
          </div>
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
          <div className="text-sm text-secondary font-mono" style={{ whiteSpace: 'nowrap' }}>
            {filtered.length} {filtered.length === 1 ? 'Principal' : 'Principals'} Registered
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
              <th>On-Chain Proof</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((id, idx) => {
              const isCurrentUser = wallet && id.address.toLowerCase() === wallet.toLowerCase();
              return (
                <tr key={id.did || idx}>
                  <td className="font-weight-500">
                    <div className="flex items-center gap-xs">
                      <ShieldCheck size={16} style={{ color: 'var(--primary-color)', flexShrink: 0 }} />
                      <span>{id.name}</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-xs">
                      <span className="font-mono text-sm" style={{ maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {id.did}
                      </span>
                      <button 
                        className="btn-icon btn-ghost" 
                        onClick={() => handleCopyDid(id.did)}
                        title="Copy DID string"
                        style={{ padding: '2px', height: '24px', width: '24px' }}
                      >
                        {copiedDid === id.did ? <Check size={13} style={{ color: '#10B981' }} /> : <Copy size={13} />}
                      </button>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-xs">
                      <a 
                        href={`https://amoy.polygonscan.com/address/${id.address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-sm"
                        style={{ color: 'var(--primary-color)', textDecoration: 'none' }}
                        title="View address on Polygonscan"
                      >
                        {truncateAddress(id.address)}
                      </a>
                      {isCurrentUser && (
                        <span className="badge badge-primary" style={{ fontSize: '10px', padding: '1px 6px' }}>
                          You
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className={`badge badge-${getStatusColor(id.status)}`}>
                      {id.status}
                    </span>
                  </td>
                  <td>
                    {id.txHash ? (
                      <a 
                        href={`https://amoy.polygonscan.com/tx/${id.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-xs font-mono text-xs"
                        style={{ color: 'var(--primary-color)', textDecoration: 'none' }}
                        title="Verify cryptographic proof on Polygonscan"
                      >
                        <span>{truncateAddress(id.txHash)}</span>
                        <ExternalLink size={12} />
                      </a>
                    ) : (
                      <span className="text-xs text-secondary">Verified On-Chain</span>
                    )}
                  </td>
                  <td className="text-sm text-secondary">{formatDate(id.createdAt)}</td>
                </tr>
              );
            })}
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
                  Registered on-chain! DID: {truncateAddress(successMsg.did)}
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
                  placeholder="e.g. Directorate General of Strategic Logistics"
                  value={subjectId}
                  onChange={e => setSubjectId(e.target.value)}
                />
                <div className="flex gap-xs" style={{ marginTop: '6px', flexWrap: 'wrap' }}>
                  <button 
                    type="button" 
                    className="btn btn-ghost text-xs" 
                    style={{ padding: '2px 8px', fontSize: '11px', border: '1px solid var(--border-color)' }}
                    onClick={() => setSubjectId('Directorate General of Strategic Logistics')}
                  >
                    + Logistics
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-ghost text-xs" 
                    style={{ padding: '2px 8px', fontSize: '11px', border: '1px solid var(--border-color)' }}
                    onClick={() => setSubjectId('Defense Cyber Operations Command')}
                  >
                    + Cyber Ops
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-ghost text-xs" 
                    style={{ padding: '2px 8px', fontSize: '11px', border: '1px solid var(--border-color)' }}
                    onClick={() => setSubjectId('Lead Compliance & Audit Officer')}
                  >
                    + Lead Auditor
                  </button>
                </div>
              </div>

              <div className="input-group">
                <div className="flex items-center justify-between">
                  <label>Principal Ethereum Address</label>
                  {wallet && (
                    <button 
                      type="button" 
                      className="btn-ghost text-xs flex items-center gap-xs" 
                      style={{ color: 'var(--primary-color)', cursor: 'pointer', border: 'none', background: 'none' }}
                      onClick={handleUseConnectedWallet}
                    >
                      <Wallet size={12} /> Use My Wallet ({truncateAddress(wallet)})
                    </button>
                  )}
                </div>
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
                  {loading ? <><Loader2 size={16} className="spin" /> Registering on Chain...</> : 'Register on Chain'}
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
