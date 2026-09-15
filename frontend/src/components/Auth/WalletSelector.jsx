import { useState } from 'react';
import { detectWallets } from '../../utils/walletUtils';
import { useAuth } from '../../context/AuthContext';
import { ExternalLink, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import './WalletSelector.css';

// Authentic brand SVG wallet icons
const WalletIcons = {
  metamask: (
    <svg viewBox="0 0 28 28" width="32" height="32" fill="none" style={{ borderRadius: 8, overflow: 'hidden' }}>
      <path fill="#fff" d="M0 0h28v28H0z"/>
      <g clipPath="url(#mm-clip)">
        <path fill="#ff5c16" d="m24.024 23.824-4.846-1.434-3.655 2.172-2.55-.001-3.656-2.171-4.844 1.434L3 18.88l1.473-5.488L3 8.751 4.473 3l7.569 4.496h4.413L24.024 3l1.473 5.751-1.473 4.64 1.473 5.488z"/>
        <path fill="#ff5c16" d="m4.474 3 7.57 4.499-.302 3.087zm4.844 15.881 3.33 2.522-3.33.987zm3.064-4.17-.64-4.123-4.097 2.804h-.002v.001l.013 2.886 1.661-1.567zM24.024 3l-7.57 4.499.3 3.087zM19.18 18.881l-3.33 2.522 3.33.987zm1.674-5.488v-.002zl-4.097-2.804-.64 4.124h3.064l1.662 1.567z"/>
        <path fill="#e34807" d="m9.317 22.39-4.844 1.434L3 18.881h6.317zm3.064-7.68.925 5.962-1.282-3.315-4.37-1.078 1.662-1.568zm6.799 7.68 4.844 1.434 1.473-4.943H19.18zm-3.064-7.68-.925 5.962 1.282-3.315 4.37-1.078-1.663-1.568z"/>
        <path fill="#ff8d5d" d="m3 18.88 1.473-5.489h3.169l.012 2.887 4.37 1.078 1.282 3.314-.659.73-3.33-2.522H3zm22.497 0-1.473-5.489h-3.17l-.01 2.887-4.371 1.078-1.282 3.314.659.73 3.33-2.522h6.317zM16.455 7.495h-4.413l-.3 3.087 1.565 10.084h1.884l1.565-10.084z"/>
        <path fill="#661800" d="M4.473 3 3 8.751l1.473 4.64h3.169l4.1-2.805zm6.992 12.908H10.03l-.781.761 2.776.685-.56-1.447M24.024 3l1.473 5.751-1.473 4.64h-3.17l-4.098-2.805zm-6.99 12.908h1.437l.782.762-2.78.686.56-1.45zm-1.512 6.687.328-1.193-.66-.73h-1.885l-.659.73.327 1.192"/><path fill="#c0c4cd" d="M15.522 22.594v1.969h-2.548v-1.969z"/><path fill="#e7ebf6" d="m9.318 22.388 3.658 2.174v-1.969l-.328-1.192zm9.862 0-3.658 2.174v-1.969l.328-1.192z"/>
      </g>
      <defs>
        <clipPath id="mm-clip">
          <path fill="#fff" d="M3 3h22.5v21.563H3z"/>
        </clipPath>
      </defs>
    </svg>
  ),
  phantom: (
    <svg viewBox="0 0 108 108" width="32" height="32" fill="none" style={{ borderRadius: 8, overflow: 'hidden' }}>
      <rect width="108" height="108" rx="26" fill="#AB9FF2"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M46.5267 69.9229C42.0054 76.8509 34.4292 85.6182 24.348 85.6182C19.5824 85.6182 15 83.6563 15 75.1342C15 53.4305 44.6326 19.8327 72.1268 19.8327C87.768 19.8327 94 30.6846 94 43.0079C94 58.8258 83.7355 76.9122 73.5321 76.9122C70.2939 76.9122 68.7053 75.1342 68.7053 72.314C68.7053 71.5783 68.8275 70.7812 69.0719 69.9229C65.5893 75.8699 58.8685 81.3878 52.5754 81.3878C47.993 81.3878 45.6713 78.5063 45.6713 74.4598C45.6713 72.9884 45.9768 71.4556 46.5267 69.9229ZM83.6761 42.5794C83.6761 46.1704 81.5575 47.9658 79.1875 47.9658C76.7816 47.9658 74.6989 46.1704 74.6989 42.5794C74.6989 38.9885 76.7816 37.1931 79.1875 37.1931C81.5575 37.1931 83.6761 38.9885 83.6761 42.5794ZM70.2103 42.5795C70.2103 46.1704 68.0916 47.9658 65.7216 47.9658C63.3157 47.9658 61.233 46.1704 61.233 42.5795C61.233 38.9885 63.3157 37.1931 65.7216 37.1931C68.0916 37.1931 70.2103 38.9885 70.2103 42.5795Z" fill="#FFFDF8"/>
    </svg>
  ),
  coinbase: (
    <svg viewBox="0 0 28 28" width="32" height="32" fill="none" style={{ borderRadius: 8, overflow: 'hidden' }}>
      <rect width="28" height="28" rx="6" fill="#2C5FF6"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M14 23.8C19.4124 23.8 23.8 19.4124 23.8 14C23.8 8.58761 19.4124 4.2 14 4.2C8.58761 4.2 4.2 8.58761 4.2 14C4.2 19.4124 8.58761 23.8 14 23.8ZM11.55 10.8C11.1358 10.8 10.8 11.1358 10.8 11.55V16.45C10.8 16.8642 11.1358 17.2 11.55 17.2H16.45C16.8642 17.2 17.2 16.8642 17.2 16.45V11.55C17.2 11.1358 16.8642 10.8 16.45 10.8H11.55Z" fill="white"/>
    </svg>
  ),
};

export default function WalletSelector({ onSuccess }) {
  const { connectWithWallet } = useAuth();
  const [selected, setSelected] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const wallets = detectWallets();

  const handleConnect = async () => {
    if (!selected) return;
    setConnecting(true);
    setError(null);

    try {
      const result = await connectWithWallet(selected);
      setSuccess(true);
      setTimeout(() => onSuccess?.(result), 800);
    } catch (err) {
      setError(err.message);
      setConnecting(false);
    }
  };

  if (success) {
    return (
      <div className="ws-success">
        <CheckCircle size={48} />
        <p>Wallet Connected Successfully</p>
      </div>
    );
  }

  return (
    <div className="wallet-selector">
      <div className="ws-list">
        {wallets.map(w => (
          <button
            key={w.id}
            className={`ws-wallet ${selected === w.id ? 'ws-wallet-selected' : ''} ${!w.installed ? 'ws-wallet-disabled' : ''}`}
            onClick={() => w.installed ? setSelected(w.id) : window.open(w.installUrl, '_blank')}
          >
            <div className="ws-wallet-icon">
              {WalletIcons[w.icon]}
            </div>
            <div className="ws-wallet-info">
              <span className="ws-wallet-name">{w.name}</span>
              <span className="ws-wallet-status">
                {w.installed ? 'Detected' : 'Not installed'}
              </span>
            </div>
            {!w.installed && (
              <ExternalLink size={14} className="ws-wallet-install" />
            )}
            {selected === w.id && (
              <CheckCircle size={16} className="ws-wallet-check" />
            )}
          </button>
        ))}
      </div>

      {error && (
        <div className="ws-error">
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}

      <button
        className="btn btn-primary ws-connect-btn"
        disabled={!selected || connecting}
        onClick={handleConnect}
      >
        {connecting ? (
          <><Loader2 size={16} className="spin" /> Connecting...</>
        ) : (
          'Connect Wallet'
        )}
      </button>

      <p className="ws-terms">
        By connecting, you agree to the platform's Terms of Service and Privacy Policy.
      </p>
    </div>
  );
}
