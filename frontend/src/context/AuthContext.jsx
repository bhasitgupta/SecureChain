import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { connectWallet, switchNetwork, signAuthMessage, onAccountsChanged, onChainChanged } from '../utils/walletUtils';
import { getRoleForWallet, checkOnChainRole, setWalletRole, resolveAuthoritativeRole } from '../utils/roleRegistry';
import { walletLogin, fetchRolesForAddress } from '../lib/api';

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

function deriveRoleFromRoleMap(roleMap) {
  if (roleMap?.ADMIN_ROLE) return 'ADMIN';
  if (roleMap?.MANAGER_ROLE) return 'MANAGER';
  if (roleMap?.AUDITOR_ROLE) return 'AUDITOR';
  return 'USER';
}

export function AuthProvider({ children }) {
  const initialSession = loadSession();
  const initialRole = initialSession?.wallet ? getRoleForWallet(initialSession.wallet) : (initialSession?.role || 'USER');
  const [wallet, setWallet] = useState(initialSession?.wallet || null);
  const [role, setRole] = useState(initialRole);
  const [isConnected, setIsConnected] = useState(!!initialSession?.isConnected);
  const [authMethod, setAuthMethod] = useState(initialSession?.authMethod || (initialSession ? 'wallet' : null));
  const [uid, setUid] = useState(initialSession?.uid || null);
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState(null);

  // Restore or verify provider on mount
  useEffect(() => {
    const session = loadSession();
    if (session && session.wallet) {
      const resolvedRole = getRoleForWallet(session.wallet);
      setWallet(session.wallet);
      setRole(resolvedRole);
      setAuthMethod(session.authMethod || 'wallet');
      setUid(session.uid || null);
      setIsConnected(true);
      if (session.role !== resolvedRole) {
        saveSession({ ...session, role: resolvedRole });
      }

      // Verify on-chain and authoritative status asynchronously
      resolveAuthoritativeRole(session.wallet).then(resRole => {
        if (resRole && resRole !== 'USER') {
          setRole(resRole);
          saveSession({ ...session, role: resRole });
        }
      });
      fetchRolesForAddress(session.wallet)
        .then((data) => {
          const derived = deriveRoleFromRoleMap(data?.roles);
          if (derived && derived !== 'USER') {
            setRole(derived);
            saveSession({ ...session, role: derived });
          }
        })
        .catch(() => {});

      if (session.authMethod === 'wallet' && window.ethereum) {
        window.ethereum.request({ method: 'eth_accounts' }).then(accounts => {
          if (accounts.length > 0) {
            setProvider(window.ethereum);
            const activeAccount = accounts[0];
            if (activeAccount.toLowerCase() !== session.wallet.toLowerCase()) {
              setWallet(activeAccount);
              resolveAuthoritativeRole(activeAccount).then(effRole => {
                setRole(effRole);
                saveSession({ ...session, wallet: activeAccount, role: effRole });
              });
            }
          }
        }).catch(() => {});
      }
    }
    setLoading(false);
  }, []);

  // Listen for admin role updates dispatched in real time or across storage
  useEffect(() => {
    const syncCurrentRole = () => {
      if (wallet) {
        resolveAuthoritativeRole(wallet).then(effRole => {
          setRole(effRole);
          const session = loadSession();
          if (session) saveSession({ ...session, role: effRole });
        });
      }
    };

    const handleRoleUpdated = (e) => {
      const { address: updatedAddr, role: newRole } = e.detail || {};
      if (wallet && updatedAddr && wallet.toLowerCase() === updatedAddr.toLowerCase()) {
        setRole(newRole);
        const session = loadSession();
        if (session) {
          saveSession({ ...session, role: newRole });
        }
      } else {
        syncCurrentRole();
      }
    };

    window.addEventListener('sc_role_updated', handleRoleUpdated);
    window.addEventListener('storage', syncCurrentRole);
    return () => {
      window.removeEventListener('sc_role_updated', handleRoleUpdated);
      window.removeEventListener('storage', syncCurrentRole);
    };
  }, [wallet]);

  // Listen for wallet account/chain changes
  useEffect(() => {
    if (!provider || authMethod !== 'wallet') return;

    const unsubAccounts = onAccountsChanged(provider, (accounts) => {
      if (accounts.length === 0) {
        disconnect();
      } else {
        const newAddr = accounts[0];
        setWallet(newAddr);
        resolveAuthoritativeRole(newAddr).then(effRole => {
          setRole(effRole);
          const session = loadSession();
          if (session) saveSession({ ...session, wallet: newAddr, role: effRole });
        });
      }
    });

    const unsubChain = onChainChanged(provider, () => {
      window.location.reload();
    });

    return () => { unsubAccounts(); unsubChain(); };
  }, [provider, authMethod]);

  /**
   * Connect via browser wallet with SIWE authentication
   */
  const connectWithWallet = useCallback(async (walletId) => {
    try { sessionStorage.removeItem('sc_manual_disconnect'); } catch (e) {}
    const result = await connectWallet(walletId);

    // Switch to correct network
    await switchNetwork(result.provider);

    const address = result.address;

    // SIWE signature for gateway authentication cookie & Bearer token
    try {
      const { message, signature } = await signAuthMessage(result.provider, address);
      const authRes = await walletLogin(message, signature, address);
      if (authRes?.token) {
        localStorage.setItem('sc_auth_token', authRes.token);
      }
    } catch (authErr) {
      console.warn('Gateway signature auth skipped/failed:', authErr);
    }

    // Authoritative role resolution from on-chain, cloud store, and defaults
    let authoritativeRole = await resolveAuthoritativeRole(address);
    try {
      const roleData = await fetchRolesForAddress(address);
      const derived = deriveRoleFromRoleMap(roleData?.roles);
      if (derived && derived !== 'USER') {
        authoritativeRole = derived;
      }
    } catch {}

    setWallet(address);
    setRole(authoritativeRole);
    setWalletRole(address, authoritativeRole);
    setAuthMethod('wallet');
    setProvider(result.provider);
    setIsConnected(true);

    saveSession({ wallet: address, role: authoritativeRole, authMethod: 'wallet', uid: null, isConnected: true });

    return { address, role: authoritativeRole };
  }, []);

  const authenticateSession = useCallback(async () => {
    const activeWallet = wallet || (loadSession()?.wallet);
    if (!activeWallet) throw new Error('No wallet connected');
    const p = provider || window.ethereum;
    if (!p) throw new Error('No wallet provider found. Please reconnect wallet.');
    const { message, signature } = await signAuthMessage(p, activeWallet);
    const authRes = await walletLogin(message, signature, activeWallet);
    if (authRes?.token) {
      localStorage.setItem('sc_auth_token', authRes.token);
    }
    return authRes;
  }, [wallet, provider]);

  /**
   * Login via UID + Password (honest message)
   */
  const loginWithUID = useCallback(async (_uidValue, _password) => {
    throw new Error('UID/password login is not yet implemented. Please connect with a Web3 wallet.');
  }, []);

  const disconnect = useCallback(() => {
    try { sessionStorage.setItem('sc_manual_disconnect', '1'); } catch (e) {}
    try { localStorage.removeItem('sc_auth_token'); } catch (e) {}
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

  const connectDemoAccount = useCallback((targetRole = 'ADMIN') => {
    const demoWallet = '0x0Ca09ba889727bE9FbBAA53d2fE1541bF2f8cee6';
    try { sessionStorage.removeItem('sc_manual_disconnect'); } catch (e) {}
    setWallet(demoWallet);
    setRole(targetRole);
    setWalletRole(demoWallet, targetRole);
    setAuthMethod('demo');
    setIsConnected(true);
    saveSession({ wallet: demoWallet, role: targetRole, authMethod: 'demo', uid: null, isConnected: true });
    return { address: demoWallet, role: targetRole };
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
      connectWithWallet, connectDemoAccount, loginWithUID, disconnect, switchRole, authenticateSession,
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
