import { useAuth } from '../../context/AuthContext';
import { truncateAddress, truncateHash, formatTimeAgo } from '../../utils/formatters';
import { 
  Wallet, Bell, ChevronDown, LogOut, User, ShieldCheck, CheckCheck, 
  Clock, ShieldAlert, FileCheck2, Database, Menu, Gem, ExternalLink,
  Loader2
} from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { fetchAuditEvents } from '../../lib/api';
import './TopBar.css';
import { useState, useRef, useEffect, useCallback } from 'react';

const PAGE_NAMES = {
  '/dashboard': 'Dashboard',
  '/identity': 'Identity',
  '/rbac': 'Access Control',
  '/assets': 'Digital Assets',
  '/verification': 'Document Verification',
  '/documents': 'Document Proofs',
  '/audit': 'Audit Trail',
  '/recovery': 'Recovery Settings',
  '/settings': 'System Settings',
};

const STORAGE_KEY_READ_NOTIFS = 'sc_read_notifications';

function getReadNotificationIds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_READ_NOTIFS);
    if (raw) return new Set(JSON.parse(raw));
  } catch {}
  return new Set();
}

function saveReadNotificationIds(set) {
  try {
    localStorage.setItem(STORAGE_KEY_READ_NOTIFS, JSON.stringify(Array.from(set)));
  } catch {}
}

function transformEventToNotification(evt, readIds) {
  const id = String(evt.id || evt.tx_hash || `evt_${evt.created_at || Date.now()}`);
  const isUnread = !readIds.has(id);
  const name = evt.event_name || 'SystemEvent';
  const d = evt.decoded || {};
  
  let title = 'System Activity';
  let desc = 'Cryptographic state updated.';
  let icon = FileCheck2;

  if (name === 'MerkleRootAnchored' || name === 'DocumentAnchored') {
    title = 'Document Merkle Root Anchored';
    const targetName = d.target || d.title || 'Document Proof';
    desc = `${targetName} committed to Polygon Amoy${evt.block_number ? ` • Block #${evt.block_number}` : ''}`;
    icon = Database;
  } else if (name === 'RoleGranted') {
    const roleName = d.role || 'ROLE';
    const acct = d.account ? truncateAddress(d.account) : 'Wallet';
    title = `Role Granted: ${roleName}`;
    desc = `Access assigned to ${acct}${d.authority ? ` by ${truncateAddress(d.authority)}` : ''}`;
    icon = ShieldCheck;
  } else if (name === 'RoleRevoked') {
    const roleName = d.role || 'ROLE';
    const acct = d.account ? truncateAddress(d.account) : 'Wallet';
    title = `Role Revoked: ${roleName}`;
    desc = `Access removed from ${acct}`;
    icon = ShieldAlert;
  } else if (name === 'AssetMinted') {
    const assetName = d.name || d.target || `Token #${d.tokenId || ''}`;
    title = `Digital Asset Minted`;
    desc = `${assetName} minted on Polygon Amoy`;
    icon = Gem;
  } else if (name === 'AssetTransferred' || name === 'AssetAllocated') {
    title = `Digital Asset Transferred`;
    const toAddr = d.to || d.account ? truncateAddress(d.to || d.account) : 'Recipient';
    desc = `${d.target || `Token #${d.tokenId || ''}`} transferred to ${toAddr}`;
    icon = Gem;
  } else if (name === 'IdentityRegistered') {
    title = `DID Identity Registered`;
    desc = `Identity for ${truncateAddress(d.account || evt.target)} confirmed on-chain`;
    icon = User;
  } else if (name === 'IdentitySuspended') {
    title = `Identity Suspended`;
    desc = `DID ${truncateAddress(d.account || evt.target)} suspended`;
    icon = ShieldAlert;
  } else if (name === 'DocumentVerified') {
    title = `Document Proof Verified`;
    desc = `${d.title || d.target || 'Cryptographic proof'} verified against on-chain root`;
    icon = FileCheck2;
  } else {
    title = name.replace(/([A-Z])/g, ' $1').trim();
    desc = d.target || evt.target || (evt.tx_hash ? `Transaction: ${truncateHash(evt.tx_hash)}` : 'On-chain verification confirmed');
  }

  const timestamp = evt.created_at || evt.timestamp || Date.now();

  return {
    id,
    title,
    desc,
    time: formatTimeAgo(timestamp),
    rawTime: new Date(timestamp).getTime(),
    unread: isUnread,
    icon,
    txHash: evt.tx_hash && evt.tx_hash.startsWith('0x') && evt.tx_hash.length === 66 ? evt.tx_hash : null,
    blockNumber: evt.block_number,
  };
}

export default function TopBar({ onToggleSidebar }) {
  const { wallet, role, isConnected, disconnect, authMethod, uid } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifs, setLoadingNotifs] = useState(true);
  const location = useLocation();

  const notifRef = useRef(null);
  const walletRef = useRef(null);

  const unreadCount = notifications.filter(n => n.unread).length;
  const pageTitle = PAGE_NAMES[location.pathname] || 'Dashboard';

  const loadNotifications = useCallback(async () => {
    try {
      const events = await fetchAuditEvents({ limit: 20 });
      const readSet = getReadNotificationIds();
      const mapped = (events || []).map(e => transformEventToNotification(e, readSet));
      mapped.sort((a, b) => b.rawTime - a.rawTime);
      setNotifications(mapped);
    } catch (err) {
      console.warn('[TopBar] Failed loading notifications:', err);
    } finally {
      setLoadingNotifs(false);
    }
  }, []);

  // Initial load and real-time event subscriptions
  useEffect(() => {
    loadNotifications();

    const handleLiveUpdate = () => {
      loadNotifications();
    };

    window.addEventListener('sc_audit_updated', handleLiveUpdate);
    window.addEventListener('sc_documents_updated', handleLiveUpdate);
    window.addEventListener('sc_assets_updated', handleLiveUpdate);
    window.addEventListener('sc_roles_updated', handleLiveUpdate);
    window.addEventListener('sc_identities_updated', handleLiveUpdate);

    // Refresh relative times every 30 seconds
    const interval = setInterval(() => {
      setNotifications(prev => prev.map(n => ({
        ...n,
        time: formatTimeAgo(n.rawTime)
      })));
    }, 30000);

    return () => {
      clearInterval(interval);
      window.removeEventListener('sc_audit_updated', handleLiveUpdate);
      window.removeEventListener('sc_documents_updated', handleLiveUpdate);
      window.removeEventListener('sc_assets_updated', handleLiveUpdate);
      window.removeEventListener('sc_roles_updated', handleLiveUpdate);
      window.removeEventListener('sc_identities_updated', handleLiveUpdate);
    };
  }, [loadNotifications]);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (walletRef.current && !walletRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllRead = () => {
    const set = getReadNotificationIds();
    notifications.forEach(n => set.add(n.id));
    saveReadNotificationIds(set);
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const handleNotificationClick = (item) => {
    const set = getReadNotificationIds();
    set.add(item.id);
    saveReadNotificationIds(set);
    setNotifications(prev => prev.map(n => n.id === item.id ? { ...n, unread: false } : n));
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        {onToggleSidebar && (
          <button 
            className="topbar-hamburger-btn" 
            onClick={onToggleSidebar}
            aria-label="Toggle navigation drawer"
            title="Toggle navigation"
          >
            <Menu size={18} />
          </button>
        )}
        <div className="topbar-context">
          <span className="context-prefix">SecureChain</span>
          <span className="context-sep">/</span>
          <span className="context-page">{pageTitle}</span>
        </div>
      </div>

      <div className="topbar-right">
        {/* Verified Role Badge (Locked to Connected Wallet) */}
        <div className="topbar-role-badge-static" title={`Verified role for ${wallet || 'wallet'}: ${role || 'USER'}`}>
          <ShieldCheck size={14} className="role-icon" />
          <span className={`role-badge role-${role?.toLowerCase()}`}>{role || 'USER'}</span>
        </div>

        {/* Notifications */}
        <div className="topbar-notif-wrapper" ref={notifRef}>
          <button 
            className={`topbar-icon-btn ${showNotifications ? 'active' : ''}`}
            onClick={() => setShowNotifications(!showNotifications)}
            title="System Notifications"
            aria-label="System Notifications"
          >
            <Bell size={17} />
            {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
          </button>

          {showNotifications && (
            <div className="notif-dropdown">
              <div className="notif-header">
                <div className="notif-header-left">
                  <span className="notif-title">Notifications</span>
                  {unreadCount > 0 && <span className="notif-count-pill">{unreadCount} new</span>}
                </div>
                {unreadCount > 0 && (
                  <button className="notif-mark-read" onClick={markAllRead}>
                    <CheckCheck size={13} /> Mark read
                  </button>
                )}
              </div>

              <div className="notif-list">
                {loadingNotifs && notifications.length === 0 ? (
                  <div className="notif-empty">
                    <Loader2 size={24} className="spin text-secondary notif-empty-icon" />
                    <p className="notif-empty-desc">Loading live notifications...</p>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="notif-empty">
                    <Bell size={28} className="notif-empty-icon" />
                    <p className="notif-empty-title">No Notifications Yet</p>
                    <p className="notif-empty-desc">
                      Live on-chain anchors, role grants, and asset transfers will appear here in real time.
                    </p>
                  </div>
                ) : (
                  notifications.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div 
                        key={item.id} 
                        className={`notif-item ${item.unread ? 'notif-unread' : ''}`}
                        onClick={() => handleNotificationClick(item)}
                      >
                        <div className="notif-icon-box">
                          <Icon size={15} />
                        </div>
                        <div className="notif-content">
                          <div className="notif-item-top">
                            <span className="notif-item-title">{item.title}</span>
                            <span className="notif-item-time"><Clock size={10} /> {item.time}</span>
                          </div>
                          <p className="notif-item-desc">{item.desc}</p>
                          {item.txHash && (
                            <a 
                              href={`https://amoy.polygonscan.com/tx/${item.txHash}`}
                              target="_blank"
                              rel="noreferrer"
                              className="notif-tx-pill"
                              onClick={(e) => e.stopPropagation()}
                              title="Verify on Polygon Amoy Explorer"
                            >
                              <ExternalLink size={9} />
                              {truncateHash(item.txHash)}
                            </a>
                          )}
                        </div>
                        {item.unread && <span className="notif-dot" />}
                      </div>
                    );
                  })
                )}
              </div>

              <div className="notif-footer">
                <span className="notif-footer-text">Decentralized Trust Network • Polygon Amoy Synced</span>
              </div>
            </div>
          )}
        </div>

        {/* Wallet / Identity Pill */}
        {isConnected && (
          <div className="topbar-wallet-wrapper" ref={walletRef}>
            <button className="topbar-wallet" onClick={() => setShowMenu(!showMenu)}>
              <span className="wallet-live-dot" />
              {authMethod === 'uid' ? <User size={15} /> : <Wallet size={15} />}
              <span className="font-mono text-sm wallet-address">
                {authMethod === 'uid' ? (uid || 'UID User') : truncateAddress(wallet)}
              </span>
              <ChevronDown size={13} />
            </button>
            {showMenu && (
              <div className="topbar-dropdown">
                <div className="dropdown-wallet-info">
                  <span className="dropdown-label">Connected Account</span>
                  <span className="dropdown-value font-mono">{wallet ? truncateAddress(wallet) : uid}</span>
                </div>
                <button className="dropdown-item dropdown-logout" onClick={disconnect}>
                  <LogOut size={14} /> Disconnect Wallet
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
