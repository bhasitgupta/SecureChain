'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { BrowserProvider, JsonRpcSigner } from 'ethers';

interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  signer: JsonRpcSigner | null;
  provider: BrowserProvider | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType>({
  address: null,
  isConnected: false,
  signer: null,
  provider: null,
  connect: async () => {},
  disconnect: () => {},
});

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      const browserProvider = new BrowserProvider((window as any).ethereum);
      setProvider(browserProvider);

      // Check if already connected
      browserProvider.listAccounts().then((accounts) => {
        if (accounts.length > 0) {
          setAddress(accounts[0].address);
          browserProvider.getSigner().then(setSigner).catch(() => {});
        }
      }).catch(() => {});

      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          browserProvider.getSigner().then(setSigner).catch(() => {});
        } else {
          setAddress(null);
          setSigner(null);
        }
      };

      (window as any).ethereum.on('accountsChanged', handleAccountsChanged);
      return () => {
        (window as any).ethereum.removeListener?.('accountsChanged', handleAccountsChanged);
      };
    }
  }, []);

  const connect = async () => {
    if (typeof window === 'undefined' || !(window as any).ethereum) {
      alert('MetaMask or EVM browser wallet required');
      return;
    }

    try {
      const browserProvider = new BrowserProvider((window as any).ethereum);
      const accounts = await browserProvider.send('eth_requestAccounts', []);
      if (accounts.length > 0) {
        setAddress(accounts[0]);
        const s = await browserProvider.getSigner();
        setSigner(s);
        setProvider(browserProvider);
      }
    } catch (err: any) {
      console.error('Wallet connect error:', err);
    }
  };

  const disconnect = () => {
    setAddress(null);
    setSigner(null);
  };

  return (
    <WalletContext.Provider
      value={{
        address,
        isConnected: !!address,
        signer,
        provider,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  return useContext(WalletContext);
}
