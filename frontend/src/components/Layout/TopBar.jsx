import { useAuth } from '../../context/AuthContext';
import { truncateAddress } from '../../utils/formatters';
import { Wallet, Bell, ChevronDown, LogOut, User, ShieldCheck, CheckCheck, Clock, ShieldAlert, FileCheck2, Database, Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import './TopBar.css';
import { useState, useRef, useEffect } from 'react';

const PAGE_NAMES = {
  '/dashboard': 'Dashboard',
  '/identity': 'Identity',
  '/rbac': 'Access Control',
  '/assets': 'Digital Access',
  '/verification': 'Document Verification',
  '/documents': 'Document Proofs',
  '/audit': 'Audit Trail',
  '/recovery': 'Recovery Settings',
  '/settings': 'System Settings',
};

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    title: 'Merkle Root Batch Anchored',
    desc: 'Block #582390 successfully committed with cryptographic root hash.',
    time: '2m ago',
    unread: true,
    icon: Database,
  },
  {
    id: 2,
    title: 'Smart Contract IAM Policy Synced',
    desc: 'Zero-Knowledge RBAC policy verified on decentralized network.',
    time: '14m ago',
    unread: true,
    icon: ShieldAlert,
  },
  {
    id: 3,
    title: 'Document Proof Attested',
    desc: 'Verifiable credential #8841-A cryptographic proof verified.',
    time: '42m ago',
    unread: true,
    icon: FileCheck2,
  },
];

export default function TopBar({ onToggleSidebar }) {
  const { wallet, role, isConnected, disconnect, authMethod, uid } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const location = useLocation();

  const notifRef = useRef(null);
  const walletRef = useRef(null);

  const unreadCount = notifications.filter(n => n.unread).length;
  const pageTitle = PAGE_NAMES[location.pathname] || 'Dashboard';

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
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
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
                {notifications.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div 
                      key={item.id} 
                      className={`notif-item ${item.unread ? 'notif-unread' : ''}`}
                      onClick={() => {
                        setNotifications(prev => prev.map(n => n.id === item.id ? { ...n, unread: false } : n));
                      }}
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
                      </div>
                      {item.unread && <span className="notif-dot" />}
                    </div>
                  );
                })}
              </div>

              <div className="notif-footer">
                <span className="notif-footer-text">Decentralized Trust Network • 100% Synced</span>
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
