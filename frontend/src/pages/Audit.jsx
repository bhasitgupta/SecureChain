import { useState, useEffect } from 'react';
import { mockAuditEvents } from '../utils/mockData';
import { formatDate } from '../utils/formatters';
import { fetchAuditEvents } from '../lib/api';
import { Search, Filter, ExternalLink, ScrollText } from 'lucide-react';
import EmptyState from '../components/EmptyState';

const EVENT_TYPES = ['All', 'IdentityRegistered', 'RoleGranted', 'AssetMinted', 'AssetAllocated', 'AssetTransferred', 'MerkleRootAnchored', 'IdentitySuspended', 'DocumentAnchored'];

function getEventBadge(event) {
  if (event.includes('Mint') || event.includes('Register')) return 'success';
  if (event.includes('Suspend') || event.includes('Revok')) return 'error';
  if (event.includes('Anchor') || event.includes('Document')) return 'action';
  if (event.includes('Transfer') || event.includes('Alloc')) return 'info';
  return 'pending';
}

export default function Audit() {
  const [events, setEvents] = useState(mockAuditEvents);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const loadEvents = async () => {
    try {
      const data = await fetchAuditEvents({
        eventName: filter === 'All' ? undefined : filter,
        limit: '100',
      });
      if (data && data.length > 0) {
        setEvents(data.map(e => ({
          id: e.id,
          event: e.event_name,
          actor: (e.decoded && (e.decoded.account || e.decoded.sender || e.decoded.admin)) || 'Contract Caller',
          target: (e.decoded && (e.decoded.did || e.decoded.tokenId || e.decoded.target)) || e.contract_addr,
          block: e.block_number,
          txHash: e.tx_hash,
          timestamp: e.created_at,
        })));
      }
    } catch {
      console.warn('Backend audit offline, using local state');
    }
  };

  useEffect(() => {
    loadEvents();
    const handleUpdate = () => loadEvents();
    window.addEventListener('sc_audit_updated', handleUpdate);
    window.addEventListener('sc_assets_updated', handleUpdate);
    window.addEventListener('sc_documents_updated', handleUpdate);
    return () => {
      window.removeEventListener('sc_audit_updated', handleUpdate);
      window.removeEventListener('sc_assets_updated', handleUpdate);
      window.removeEventListener('sc_documents_updated', handleUpdate);
    };
  }, [filter]);

  const filtered = events.filter(e =>
    (filter === 'All' || e.event === filter) &&
    ((e.event || '').toLowerCase().includes(search.toLowerCase()) || 
     (e.target || '').toLowerCase().includes(search.toLowerCase()) || 
     (e.actor || '').toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="page">
      <div className="page-header">
        <h1>Audit Trail</h1>
        <p>Immutable blockchain event history — Polygon Amoy is the cryptographic authority</p>
      </div>

      <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
        <div className="flex items-center gap-md flex-wrap">
          <div className="search-input-wrap" style={{ flex: 1, minWidth: 200 }}>
            <Search size={16} className="search-icon" />
            <input 
              className="input search-input" 
              placeholder="Search audit trail by event, actor, or target..." 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
            />
          </div>
          <div className="flex items-center gap-sm flex-wrap">
            <Filter size={14} className="text-tertiary" />
            {EVENT_TYPES.slice(0, 6).map(t => (
              <button 
                key={t} 
                className={`btn btn-sm ${filter === t ? 'btn-primary' : 'btn-ghost'}`} 
                onClick={() => setFilter(t)}
              >
                {t === 'All' ? 'All' : t.replace(/([A-Z])/g, ' $1').trim()}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="table-container card" style={{ padding: 0 }}>
        <table className="table">
          <thead>
            <tr>
              <th>Event</th>
              <th>Actor</th>
              <th>Target</th>
              <th>Block</th>
              <th>TX Hash</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(e => (
              <tr key={e.id}>
                <td><span className={`badge badge-${getEventBadge(e.event)}`}>{e.event}</span></td>
                <td className="font-mono text-sm">{e.actor}</td>
                <td className="text-sm font-mono">{typeof e.target === 'string' && e.target.length > 20 ? `${e.target.slice(0, 10)}...${e.target.slice(-6)}` : e.target}</td>
                <td className="font-mono text-sm">{e.block}</td>
                <td className="font-mono text-xs">
                  {e.txHash && e.txHash.startsWith('0x') ? (
                    <a 
                      href={`https://amoy.polygonscan.com/tx/${e.txHash}`} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="flex items-center gap-xs text-action"
                    >
                      {e.txHash.slice(0, 10)}... <ExternalLink size={10} />
                    </a>
                  ) : (e.txHash || 'Live')}
                </td>
                <td className="text-sm text-secondary">{formatDate(e.timestamp)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <EmptyState 
            icon={ScrollText} 
            message="No audit events found" 
            description="All smart contract and state transitions will be streamed here." 
          />
        )}
      </div>
    </div>
  );
}
