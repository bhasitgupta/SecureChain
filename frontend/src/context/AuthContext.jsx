import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { connectWallet, switchNetwork, signAuthMessage, onAccountsChanged, onChainChanged } from '../utils/walletUtils';
import { getRoleForWallet, checkOnChainRole, setWalletRole } from '../utils/roleRegistry';
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
      setWallet(session.wallet);
      setRole(session.role || getRoleForWallet(session.wallet));
      setAuthMethod(session.authMethod || 'wallet');
      setUid(session.uid || null);
      setIsConnected(true);
      if (session.role !== resolvedRole) {
        saveSession({ ...session, role: resolvedRole });
      }

      // Verify on-chain status asynchronously via gateway or direct contract
      fetchRolesForAddress(session.wallet)
        .then((data) => {
          const derived = deriveRoleFromRoleMap(data.roles);
          if (derived) {
            setRole(derived);
            setWalletRole(session.wallet, derived);
            saveSession({ ...session, role: derived });
          }
        })
        .catch(() => {
          checkOnChainRole(session.wallet).then(chainRole => {
            if (chainRole && chainRole !== 'USER') {
              setRole(chainRole);
              setWalletRole(session.wallet, chainRole);
              saveSession({ ...session, role: chainRole });
            }
          });
        });

      if (session.authMethod === 'wallet' && window.ethereum) {
        window.ethereum.request({ method: 'eth_accounts' }).then(accounts => {
          if (accounts.length > 0) {
            setProvider(window.ethereum);
            const activeAccount = accounts[0];
            if (activeAccount.toLowerCase() !== session.wallet.toLowerCase()) {
              setWallet(activeAccount);
              fetchRolesForAddress(activeAccount)
                .then((data) => {
                  const derived = deriveRoleFromRoleMap(data.roles);
                  setRole(derived);
                  saveSession({ ...session, wallet: activeAccount, role: derived });
                })
                .catch(() => {
                  const activeRole = getRoleForWallet(activeAccount);
                  setRole(activeRole);
                  saveSession({ ...session, wallet: activeAccount, role: activeRole });
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
        fetchRolesForAddress(wallet)
          .then((data) => {
            const derived = deriveRoleFromRoleMap(data.roles);
            setRole(derived);
            const session = loadSession();
            if (session) saveSession({ ...session, role: derived });
          })
          .catch(() => {
            const latestRole = getRoleForWallet(wallet);
            setRole(latestRole);
            const session = loadSession();
            if (session) saveSession({ ...session, role: latestRole });
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
        fetchRolesForAddress(newAddr)
          .then((data) => {
            const derived = deriveRoleFromRoleMap(data.roles);
            setRole(derived);
            const session = loadSession();
            if (session) saveSession({ ...session, wallet: newAddr, role: derived });
          })
          .catch(() => {
            const assignedRole = getRoleForWallet(newAddr);
            setRole(assignedRole);
            const session = loadSession();
            if (session) saveSession({ ...session, wallet: newAddr, role: assignedRole });
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

    // SIWE signature for gateway authentication cookie
    try {
      const { message, signature } = await signAuthMessage(result.provider, address);
      await walletLogin(message, signature, address);
    } catch (authErr) {
      console.warn('Gateway signature auth skipped/failed:', authErr);
    }

    // Authoritative on-chain role from gateway API or contract
    let authoritativeRole = 'USER';
    try {
      const roleData = await fetchRolesForAddress(address);
      authoritativeRole = deriveRoleFromRoleMap(roleData.roles);
    } catch {
      const onChain = await checkOnChainRole(address);
      authoritativeRole = (onChain && onChain !== 'USER') ? onChain : getRoleForWallet(address);
    }

    setWallet(address);
    setRole(authoritativeRole);
    setWalletRole(address, authoritativeRole);
    setAuthMethod('wallet');
    setProvider(result.provider);
    setIsConnected(true);

    saveSession({ wallet: address, role: authoritativeRole, authMethod: 'wallet', uid: null, isConnected: true });

    return { address, role: authoritativeRole };
  }, []);

  /**
   * Login via UID + Password (honest message)
   */
  const loginWithUID = useCallback(async (_uidValue, _password) => {
    throw new Error('UID/password login is not yet implemented. Please connect with a Web3 wallet.');
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
