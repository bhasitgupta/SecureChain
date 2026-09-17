import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppLayout from './components/Layout/AppLayout';
import useLenis from './hooks/useLenis';

// Lazy-loaded pages — loaded on first navigation, never on initial load
const Landing    = lazy(() => import('./pages/Landing'));
const Dashboard  = lazy(() => import('./pages/Dashboard'));
const Identity   = lazy(() => import('./pages/Identity'));
const RBAC       = lazy(() => import('./pages/RBAC'));
const Assets     = lazy(() => import('./pages/Assets'));
const Documents  = lazy(() => import('./pages/Documents'));
const Verification = lazy(() => import('./pages/Verification'));
const Audit      = lazy(() => import('./pages/Audit'));
const Recovery   = lazy(() => import('./pages/Recovery'));
const Settings   = lazy(() => import('./pages/Settings'));

function PageLoader() {
  return (
    <div style={{
      display: 'flex',
      height: '100%',
      minHeight: 220,
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--text-tertiary)',
      fontSize: '0.85rem',
      gap: 10,
    }}>
      <span style={{
        width: 18, height: 18,
        border: '2px solid var(--color-accent-medium)',
        borderTopColor: 'var(--color-action)',
        borderRadius: '50%',
        display: 'inline-block',
        animation: 'spin 0.7s linear infinite',
      }} />
      Loading…
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { isConnected, loading } = useAuth();
  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--color-base, #F5F5F5)', color: 'var(--color-text-secondary, #666)' }}>
        Loading SecureChain...
      </div>
    );
  }
  return isConnected ? children : <Navigate to="/" replace />;
}

function RoleRoute({ roles, children }) {
  const { role } = useAuth();
  const currentRole = role || 'USER';
  if (roles && !roles.includes(currentRole)) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

function AppRoutes() {
  // Initialize butter-smooth momentum scrolling
  useLenis();

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/identity" element={<RoleRoute roles={['ADMIN', 'MANAGER']}><Identity /></RoleRoute>} />
          <Route path="/rbac" element={<RoleRoute roles={['ADMIN']}><RBAC /></RoleRoute>} />
          <Route path="/assets" element={<RoleRoute roles={['ADMIN', 'MANAGER', 'USER']}><Assets /></RoleRoute>} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/verification" element={<Verification />} />
          <Route path="/audit" element={<RoleRoute roles={['ADMIN', 'MANAGER', 'AUDITOR']}><Audit /></RoleRoute>} />
          <Route path="/recovery" element={<RoleRoute roles={['ADMIN']}><Recovery /></RoleRoute>} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
