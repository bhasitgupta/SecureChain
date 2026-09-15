import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppLayout from './components/Layout/AppLayout';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Identity from './pages/Identity';
import RBAC from './pages/RBAC';
import Assets from './pages/Assets';
import Documents from './pages/Documents';
import Verification from './pages/Verification';
import Audit from './pages/Audit';
import Recovery from './pages/Recovery';
import Settings from './pages/Settings';

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
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/identity" element={<RoleRoute roles={['ADMIN']}><Identity /></RoleRoute>} />
        <Route path="/rbac" element={<RoleRoute roles={['ADMIN']}><RBAC /></RoleRoute>} />
        <Route path="/assets" element={<RoleRoute roles={['ADMIN', 'MANAGER', 'USER']}><Assets /></RoleRoute>} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/verification" element={<Verification />} />
        <Route path="/audit" element={<RoleRoute roles={['ADMIN', 'AUDITOR']}><Audit /></RoleRoute>} />
        <Route path="/recovery" element={<RoleRoute roles={['ADMIN']}><Recovery /></RoleRoute>} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
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
