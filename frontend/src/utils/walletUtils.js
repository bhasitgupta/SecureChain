// Wallet utility functions — raw window.ethereum interaction
// No external dependencies (no ethers, no wagmi)

const WALLETS = [
  {
    id: 'metamask',
    name: 'MetaMask',
    icon: 'metamask',
    checkInstalled: () => typeof window !== 'undefined' && Boolean(window.ethereum?.isMetaMask && !window.ethereum?.isPhantom),
    installUrl: 'https://metamask.io/download/',
    getProvider: () => {
      if (typeof window === 'undefined') return null;
      if (window.ethereum?.providers) {
        return window.ethereum.providers.find(p => p.isMetaMask && !p.isPhantom);
      }
      return (window.ethereum?.isMetaMask && !window.ethereum?.isPhantom) ? window.ethereum : null;
    },
  },
  {
    id: 'phantom',
    name: 'Phantom',
    icon: 'phantom',
    checkInstalled: () => typeof window !== 'undefined' && Boolean(window.phantom?.ethereum || window.ethereum?.isPhantom),
    installUrl: 'https://phantom.app/download',
    getProvider: () => {
      if (typeof window === 'undefined') return null;
      if (window.phantom?.ethereum) return window.phantom.ethereum;
      if (window.ethereum?.providers) {
        return window.ethereum.providers.find(p => p.isPhantom);
      }
      return window.ethereum?.isPhantom ? window.ethereum : null;
    },
  },
  {
    id: 'coinbase',
    name: 'Coinbase Wallet',
    icon: 'coinbase',
    checkInstalled: () => typeof window !== 'undefined' && Boolean(window.ethereum?.isCoinbaseWallet || window.coinbaseWalletExtension),
    installUrl: 'https://www.coinbase.com/wallet/downloads',
    getProvider: () => {
      if (typeof window === 'undefined') return null;
      if (window.ethereum?.providers) {
        return window.ethereum.providers.find(p => p.isCoinbaseWallet);
      }
      return window.coinbaseWalletExtension || (window.ethereum?.isCoinbaseWallet ? window.ethereum : null);
    },
  },
];

/**
 * Detect which wallets are available in the browser
 */
export function detectWallets() {
  return WALLETS.map(w => ({
    ...w,
    installed: w.checkInstalled(),
  }));
}

/**
 * Connect to a specific wallet provider
 * @param {string} walletId - one of 'metamask', 'coinbase', 'trust'
 * @returns {{ address: string, chainId: string }}
 */
export async function connectWallet(walletId) {
  const wallet = WALLETS.find(w => w.id === walletId);
  if (!wallet) throw new Error(`Unknown wallet: ${walletId}`);

  const provider = wallet.getProvider();
  if (!provider) {
    throw new Error(`${wallet.name} is not installed. Please install it from ${wallet.installUrl}`);
  }

  const accounts = await provider.request({ method: 'eth_requestAccounts' });
  if (!accounts || accounts.length === 0) {
    throw new Error('No accounts returned. Please unlock your wallet.');
  }

  const chainId = await provider.request({ method: 'eth_chainId' });

  return {
    address: accounts[0],
    chainId,
    provider,
  };
}

/**
 * Switch to the configured network (Polygon Amoy by default)
 */
export async function switchNetwork(provider) {
  const targetChainId = import.meta.env.VITE_CHAIN_ID || '80002';
  const hexChainId = '0x' + parseInt(targetChainId).toString(16);

  try {
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: hexChainId }],
    });
  } catch (switchError) {
    // Chain not added — add it
    if (switchError.code === 4902) {
      const networkName = import.meta.env.VITE_NETWORK_NAME || 'Polygon Amoy Testnet';
      const rpcUrl = import.meta.env.VITE_RPC_URL || 'https://polygon-amoy.drpc.org';

      await provider.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: hexChainId,
          chainName: networkName,
          rpcUrls: [rpcUrl, 'https://polygon-amoy-bor-rpc.publicnode.com'],
          nativeCurrency: { name: 'POL', symbol: 'POL', decimals: 18 },
          blockExplorerUrls: ['https://amoy.polygonscan.com/'],
        }],
      });
    } else {
      throw switchError;
    }
  }
}

/**
 * Sign a message for authentication verification (standard EIP-4361 SIWE format for clean, safe wallet display)
 */
export async function signAuthMessage(provider, address) {
  const domain = typeof window !== 'undefined' ? window.location.host : 'localhost';
  const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost';
  const timestamp = new Date().toISOString();
  const nonce = Math.random().toString(36).substring(2, 14);

  const message = `${domain} wants you to sign in with your Ethereum account:\n${address}\n\nSign in to SecureChain Platform.\n\nURI: ${origin}\nVersion: 1\nChain ID: 80002\nNonce: ${nonce}\nIssued At: ${timestamp}`;

  const signature = await provider.request({
    method: 'personal_sign',
    params: [message, address],
  });

  return { message, signature, timestamp };
}

/**
 * Listen for account/chain changes
 */
export function onAccountsChanged(provider, callback) {
  if (provider?.on) {
    provider.on('accountsChanged', callback);
    return () => provider.removeListener('accountsChanged', callback);
  }
  return () => {};
}

export function onChainChanged(provider, callback) {
  if (provider?.on) {
    provider.on('chainChanged', callback);
    return () => provider.removeListener('chainChanged', callback);
  }
  return () => {};
}

/**
 * Truncate address for display
 */
export function truncateAddress(address) {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export { WALLETS };
