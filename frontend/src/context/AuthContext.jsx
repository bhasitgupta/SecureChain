import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { connectWallet, switchNetwork, onAccountsChanged, onChainChanged } from '../utils/walletUtils';
import { getRoleForWallet } from '../utils/roleRegistry';

const AuthContext = createContext(null);

const SESSION_KEY = 'sc_auth';

function saveSession(data) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(data));
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
  } catch (e) { /* silent */ }
}

function loadSession() {
  try {
    if (typeof window !== 'undefined' && sessionStorage.getItem('sc_manual_disconnect') === '1') {
      return null;
    }
    const raw = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
    if (raw) return JSON.parse(raw);
    return null;
  } catch (e) { return null; }
}

function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
  } catch (e) { /* silent */ }
}

export function AuthProvider({ children }) {
  const initialSession = loadSession();
  const [wallet, setWallet] = useState(initialSession?.wallet || null);
  const [role, setRole] = useState(initialSession?.role || 'USER');
  const [isConnected, setIsConnected] = useState(!!initialSession?.isConnected);
  const [authMethod, setAuthMethod] = useState(initialSession?.authMethod || (initialSession ? 'wallet' : null));
  const [uid, setUid] = useState(initialSession?.uid || null);
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState(null);

  // Restore or verify provider on mount
  useEffect(() => {
    const session = loadSession();
    if (session) {
      setWallet(session.wallet);
      setRole(session.role || getRoleForWallet(session.wallet));
      setAuthMethod(session.authMethod || 'wallet');
      setUid(session.uid || null);
      setIsConnected(true);

      if (session.authMethod === 'wallet' && window.ethereum) {
        window.ethereum.request({ method: 'eth_accounts' }).then(accounts => {
          if (accounts.length > 0 && accounts[0].toLowerCase() === session.wallet?.toLowerCase()) {
            setProvider(window.ethereum);
          }
        }).catch(() => {});
      }
    }
    setLoading(false);
  }, []);

  // Listen for admin role updates dispatched in real time
  useEffect(() => {
    const handleRoleUpdated = (e) => {
      const { address: updatedAddr, role: newRole } = e.detail || {};
      if (wallet && updatedAddr && wallet.toLowerCase() === updatedAddr.toLowerCase()) {
        switchRole(newRole);
      }
    };
    window.addEventListener('sc_role_updated', handleRoleUpdated);
    return () => window.removeEventListener('sc_role_updated', handleRoleUpdated);
  }, [wallet]);

  // Listen for wallet account/chain changes
  useEffect(() => {
    if (!provider || authMethod !== 'wallet') return;

    const unsubAccounts = onAccountsChanged(provider, (accounts) => {
      if (accounts.length === 0) {
        disconnect();
      } else {
        const newAddr = accounts[0];
        const assignedRole = getRoleForWallet(newAddr);
        setWallet(newAddr);
        setRole(assignedRole);
        const session = loadSession();
        if (session) {
          saveSession({ ...session, wallet: newAddr, role: assignedRole });
        }
      }
    });

    const unsubChain = onChainChanged(provider, () => {
      // Reload on chain change for safety
      window.location.reload();
    });

    return () => { unsubAccounts(); unsubChain(); };
  }, [provider, authMethod]);

  /**
   * Connect via browser wallet (MetaMask, Coinbase, Trust)
   */
  const connectWithWallet = useCallback(async (walletId) => {
    try { sessionStorage.removeItem('sc_manual_disconnect'); } catch (e) {}
    const result = await connectWallet(walletId);

    // Switch to correct network
    await switchNetwork(result.provider);

    const address = result.address;
    // New wallets default to 'USER'; only designated/admin-granted addresses get higher roles
    const assignedRole = getRoleForWallet(address);

    setWallet(address);
    setRole(assignedRole);
    setAuthMethod('wallet');
    setProvider(result.provider);
    setIsConnected(true);

    saveSession({ wallet: address, role: assignedRole, authMethod: 'wallet', uid: null, isConnected: true });

    return { address, role: assignedRole };
  }, []);

  /**
   * Login via UID + Password
   */
  const loginWithUID = useCallback(async (uidValue, password) => {
    try { sessionStorage.removeItem('sc_manual_disconnect'); } catch (e) {}
    const apiBase = import.meta.env.VITE_API_BASE_URL;
    if (!apiBase) {
      throw new Error('Backend service not configured. Contact your system administrator.');
    }

    const response = await fetch(`${apiBase}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid: uidValue, password }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Authentication failed. Check your credentials.');
    }

    const data = await response.json();
    // Expected: { wallet, role, token, uid }

    setWallet(data.wallet || null);
    setRole(data.role || 'USER');
    setAuthMethod('uid');
    setUid(data.uid || uidValue);
    setIsConnected(true);

    saveSession({
      wallet: data.wallet,
      role: data.role,
      authMethod: 'uid',
      uid: data.uid || uidValue,
      token: data.token,
      isConnected: true,
    });

    return data;
  }, []);

  const disconnect = useCallback(() => {
    try { sessionStorage.setItem('sc_manual_disconnect', '1'); } catch (e) {}
    setWallet(null);
    setRole(null);
    setIsConnected(false);
    setAuthMethod(null);
    setUid(null);
    setProvider(null);
    clearSession();
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  }, []);

  const switchRole = (newRole) => {
    setRole(newRole);
    const session = loadSession();
    if (session) {
      saveSession({ ...session, role: newRole });
    }
  };

  return (
    <AuthContext.Provider value={{
      wallet, role, isConnected, authMethod, uid, loading, provider,
      connectWithWallet, loginWithUID, disconnect, switchRole,
      // Legacy alias for backward compat
      connect: () => connectWithWallet('metamask'),
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
