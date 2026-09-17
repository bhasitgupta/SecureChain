import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { NAV_ITEMS } from '../../utils/constants';
import LineSidebar from '../Navigation/LineSidebar';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useState } from 'react';
import './Sidebar.css';

export default function Sidebar({ mobileOpen = false, onClose }) {
  const { role } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const currentRole = role || 'USER';
  const allowedItems = NAV_ITEMS.filter(item => item.roles.includes(currentRole));
  const activeIndex = Math.max(0, allowedItems.findIndex(item => item.path === location.pathname));
  const items = allowedItems.map(item => item.label);

  const handleItemClick = (index) => {
    const target = allowedItems[index];
    if (target) {
      navigate(target.path);
      if (onClose) {
        onClose();
      }
    }
  };

  return (
    <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''} ${mobileOpen ? 'sidebar-mobile-open' : ''}`}>
      {/* Brand Header */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <img src="/logo-icon.png" alt="SecureChain" className="logo-icon" />
          {(!collapsed || mobileOpen) && (
            <div className="sidebar-brand-text">
              <span className="logo-text">SecureChain<span className="brand-dot">.</span></span>
            </div>
          )}
        </div>

        <div className="sidebar-actions">
          {/* Desktop Collapse Toggle */}
          <button 
            className="sidebar-toggle desktop-only" 
            onClick={() => setCollapsed(!collapsed)} 
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>

          {/* Mobile Drawer Close Button */}
          {onClose && (
            <button 
              className="sidebar-mobile-close mobile-only" 
              onClick={onClose}
              title="Close navigation"
              aria-label="Close navigation"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* LineSidebar Navigation */}
      <div className="sidebar-nav-container">
        {(!collapsed || mobileOpen) && (
          <div className="sidebar-section-title">CORE REGISTRIES</div>
        )}
        <LineSidebar
          items={items}
          accentColor="#FF0000"
          textColor="#5C7175"
          markerColor="#BBD5DA"
          showIndex={true}
          showMarker={!collapsed || mobileOpen}
          proximityRadius={60}
          maxShift={0}
          falloff="smooth"
          markerLength={14}
          markerGap={6}
          tickScale={0.5}
          scaleTick={true}
          itemGap={13}
          fontSize={0.76}
          smoothing={60}
          activeIndex={activeIndex}
          onItemClick={handleItemClick}
          className="securechain-linesidebar"
        />

        {(!collapsed || mobileOpen) && currentRole === 'ADMIN' && (
          <div className="sidebar-telemetry-card">
            <div className="telemetry-header">
              <span className="telemetry-title">NETWORK TELEMETRY</span>
              <span className="telemetry-badge">LIVE</span>
            </div>
            <div className="telemetry-rows">
              <div className="telemetry-row">
                <span className="telemetry-key">Consensus</span>
                <span className="telemetry-val font-mono">Amoy 80002</span>
              </div>
              <div className="telemetry-row">
                <span className="telemetry-key">State Anchor</span>
                <span className="telemetry-val">Keccak-256</span>
              </div>
              <div className="telemetry-row">
                <span className="telemetry-key">Auth Guard</span>
                <span className="telemetry-val">SIWE + EIP-712</span>
              </div>
              <div className="telemetry-row">
                <span className="telemetry-key">Cryptographic Proof</span>
                <span className="telemetry-val font-mono">SHA-256</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Status Badge */}
      <div className="sidebar-footer">
        {(!collapsed || mobileOpen) ? (
          <div className="sidebar-node-badge">
            <div className="node-status-row">
              <span className="node-pulse-dot" />
              <span className="node-status-title">Decentralized Trust Network</span>
            </div>
            <span className="node-status-sub">Smart Contract Enforced</span>
          </div>
        ) : (
          <div className="sidebar-collapsed-dot" title="Network Connected">
            <span className="node-pulse-dot" />
          </div>
        )}
      </div>
    </aside>
  );
}
