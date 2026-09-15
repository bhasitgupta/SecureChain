import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import ThreeBackground from '../Common/ThreeBackground';
import './AppLayout.css';

export default function AppLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      <ThreeBackground opacity={0.3} />
      
      {/* Mobile Drawer Backdrop */}
      {mobileSidebarOpen && (
        <div 
          className="sidebar-backdrop" 
          onClick={() => setMobileSidebarOpen(false)}
          aria-label="Close navigation overlay"
        />
      )}

      {/* Sidebar with Desktop Collapse + Mobile Slide Drawer */}
      <Sidebar 
        mobileOpen={mobileSidebarOpen} 
        onClose={() => setMobileSidebarOpen(false)} 
      />

      <div className="app-main">
        <TopBar onToggleSidebar={() => setMobileSidebarOpen(prev => !prev)} />
        <main className="app-content">
          <div className="app-content-inner">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
