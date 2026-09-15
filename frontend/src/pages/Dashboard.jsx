import { useState, useEffect } from 'react';
import { dashboardStats, mockDocuments, mockAuditEvents } from '../utils/mockData';
import { DOC_STATES } from '../utils/constants';
import { formatDate, getStatusColor } from '../utils/formatters';
import { fetchDashboardStats, fetchAuditEvents, fetchDocuments } from '../lib/api';
import { Users, Gem, FileText, ShieldCheck, TrendingUp, Anchor, ArrowRight, Activity, ScrollText } from 'lucide-react';
import EmptyState from '../components/EmptyState';
import { AnimatedBorder } from '../components/ui/button-border';
import BorderGlow from '../components/ui/BorderGlow';
import './Dashboard.css';

export default function Dashboard() {
  const [statsData, setStatsData] = useState({
    activeIdentities: dashboardStats.activeIdentities,
    totalIdentities: dashboardStats.totalIdentities,
    totalAssets: dashboardStats.totalAssets,
    totalDocuments: dashboardStats.totalDocuments,
    verifiedDocs: dashboardStats.verifiedDocs,
    merkleRoots: dashboardStats.merkleRoots,
    polygonAnchors: dashboardStats.polygonAnchors,
    pendingProofs: dashboardStats.pendingProofs,
  });
  const [recentEvents, setRecentEvents] = useState(mockAuditEvents);
  const [docList, setDocList] = useState(mockDocuments);

  useEffect(() => {
    async function loadData() {
      try {
        const stats = await fetchDashboardStats();
        if (stats) {
          setStatsData({
            activeIdentities: stats.identitiesCount || 0,
            totalIdentities: stats.identitiesCount || 0,
            totalAssets: stats.assetsCount || 0,
            totalDocuments: stats.documentsCount || 0,
            verifiedDocs: stats.verifiableVersionsCount || 0,
            merkleRoots: stats.batchesCount || 0,
            polygonAnchors: stats.anchoredBatchesCount || 0,
            pendingProofs: Math.max(0, (stats.versionsCount || 0) - (stats.verifiableVersionsCount || 0)),
          });
        }
      } catch {}

      try {
        const events = await fetchAuditEvents({ limit: 5 });
        if (events && events.length > 0) setRecentEvents(events);
      } catch {}

      try {
        const docs = await fetchDocuments();
        if (docs && docs.length > 0) setDocList(docs);
      } catch {}
    }
    loadData();
  }, []);

  const stats = [
    { label: 'Active Identities', value: statsData.activeIdentities, total: statsData.totalIdentities, icon: Users, color: 'var(--status-info)' },
    { label: 'Digital Assets', value: statsData.totalAssets, icon: Gem, color: 'var(--status-pending)' },
    { label: 'Documents', value: statsData.totalDocuments, icon: FileText, color: 'var(--status-success)' },
    { label: 'Verified Proofs', value: statsData.verifiedDocs, total: statsData.totalDocuments, icon: ShieldCheck, color: 'var(--color-action)' },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Enterprise trust platform overview</p>
      </div>

      <div className="grid-4" style={{ marginBottom: 'var(--space-xl)' }}>
        {stats.map((s, i) => (
          <BorderGlow
            key={i}
            borderRadius={16}
            glowRadius={24}
            edgeSensitivity={35}
            glowColor={i === 3 ? '0 100 50' : '188 33 80'}
            backgroundColor="linear-gradient(180deg, rgba(248, 250, 252, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%)"
            colors={i === 3 ? ['#FF0000', '#BBD5DA', '#94A3B8'] : ['#BBD5DA', '#94A3B8', '#0F172A']}
          >
            <div className="card card-interactive stat-card" style={{ animationDelay: `${i * 0.08}s`, position: 'relative', height: '100%' }}>
              <AnimatedBorder radius={16} size={60} duration={4 + i * 0.8} />
              <div className="stat-card-header">
                <div className="stat-icon" style={{ background: `${s.color}15`, color: s.color }}>
                  <s.icon size={20} />
                </div>
                {s.total > 0 && <span className="text-xs text-tertiary">of {s.total}</span>}
              </div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </BorderGlow>
        ))}
      </div>

      <div className="grid-2" style={{ marginBottom: 'var(--space-xl)' }}>
        {/* Document Pipeline */}
        <div className="card dashboard-static-card" style={{ position: 'relative' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-md)' }}>
            <h3>Document Pipeline</h3>
            <Activity size={18} className="text-tertiary" />
          </div>
          <div className="pipeline-card-inner">
            <div className="pipeline">
              {DOC_STATES.map((state, i) => {
                const count = docList.filter(d => (d.status || d.state) === state).length;
                const isActive = count > 0;
                return (
                  <div key={state} className="pipeline-step">
                    <div className={`pipeline-dot ${isActive ? 'pipeline-dot-active' : ''}`}>
                      {count > 0 && <span>{count}</span>}
                    </div>
                    <span className="pipeline-label">{state.replace(/_/g, ' ')}</span>
                    {i < DOC_STATES.length - 1 && <div className="pipeline-line" />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Blockchain Stats */}
        <div className="card dashboard-static-card" style={{ position: 'relative' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-md)' }}>
            <h3>Blockchain Anchors</h3>
            <Anchor size={18} className="text-tertiary" />
          </div>
          <div className="anchor-stats">
            <div className="anchor-stat">
              <div className="anchor-stat-value">{statsData.merkleRoots}</div>
              <div className="anchor-stat-label">Merkle Roots</div>
            </div>
            <div className="anchor-stat">
              <div className="anchor-stat-value">{statsData.polygonAnchors}</div>
              <div className="anchor-stat-label">On-Chain TXs</div>
            </div>
            <div className="anchor-stat">
              <div className="anchor-stat-value">{statsData.pendingProofs}</div>
              <div className="anchor-stat-label">Pending Proofs</div>
            </div>
          </div>
          <div className="chain-visual-container">
            <div className="chain-visual">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="chain-block" style={{ animationDelay: `${i * 0.15}s` }}>
                  <span>B-{58234000 + i * 1000}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card" style={{ position: 'relative' }}>
        <AnimatedBorder radius={16} size={110} duration={10} />
        <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-lg)' }}>
          <h3>Recent Activity</h3>
          <button className="btn btn-ghost btn-sm">View All <ArrowRight size={14} /></button>
        </div>
        {recentEvents.length === 0 ? (
          <EmptyState
            icon={ScrollText}
            message="No activity recorded"
            description="System activity and blockchain transactions will appear here."
          />
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Actor</th>
                  <th>Target</th>
                  <th>Block</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {recentEvents.slice(0, 5).map((e, idx) => (
                  <tr key={e.id || idx}>
                    <td><span className={`badge badge-${getEventColor(e.event || e.event_name || '')}`}>{e.event || e.event_name}</span></td>
                    <td className="font-mono text-sm">{e.actor || (e.decoded && e.decoded.account) || 'System'}</td>
                    <td className="text-sm">{e.target || e.contract_addr || '—'}</td>
                    <td className="font-mono text-sm">{e.block || e.block_number || 'Live'}</td>
                    <td className="text-sm text-secondary">{formatDate(e.timestamp || e.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function getEventColor(event) {
  if (event.includes('Mint') || event.includes('Register')) return 'success';
  if (event.includes('Suspend') || event.includes('Revok')) return 'error';
  if (event.includes('Anchor') || event.includes('Document')) return 'action';
  if (event.includes('Transfer') || event.includes('Allocat')) return 'info';
  return 'pending';
}
