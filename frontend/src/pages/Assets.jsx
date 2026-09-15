import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { mockAssets } from '../utils/mockData';
import { formatDate, getStatusColor } from '../utils/formatters';
import { fetchAssets, mintAsset } from '../lib/api';
import { Gem, Plus, Search, ExternalLink, AlertCircle, CheckCircle2, Loader2, Image as ImageIcon } from 'lucide-react';
import EmptyState from '../components/EmptyState';
import './Assets.css';

export default function Assets() {
  const { role } = useAuth();
  const canMint = role === 'ADMIN';

  const [assets, setAssets] = useState(mockAssets);
  const [search, setSearch] = useState('');
  const [showMint, setShowMint] = useState(false);

  // Mint Form State
  const [description, setDescription] = useState('');
  const [assetClass, setAssetClass] = useState('Defence Equipment');
  const [toAddress, setToAddress] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [mintLoading, setMintLoading] = useState(false);
  const [mintError, setMintError] = useState('');
  const [mintSuccess, setMintSuccess] = useState(null);

  const loadAssetsData = async () => {
    try {
      const data = await fetchAssets();
      if (data && data.length > 0) {
        setAssets(data.map(a => ({
          tokenId: a.tokenId,
          description: (a.chain && a.chain.metadataURI) || `Asset #${a.tokenId}`,
          assetClass: (a.chain && a.chain.assetClass) || 'Enterprise Asset',
          assetStatus: (a.chain && a.chain.status) || 'Active',
          ownerName: (a.chain && a.chain.owner) || 'Enterprise Custody',
          createdAt: a.createdAt || Date.now(),
          thumbnailUrl: a.thumbnailUrl,
        })));
      }
    } catch {
      console.warn('Backend assets offline, using local state');
    }
  };

  useEffect(() => {
    loadAssetsData();
  }, []);

  const handleMint = async () => {
    if (!canMint) {
      setMintError('Unauthorized: Only administrators have minting privileges.');
      return;
    }
    if (!description) {
      setMintError('Asset description is required');
      return;
    }
    setMintLoading(true);
    setMintError('');
    setMintSuccess(null);

    try {
      const res = await mintAsset({
        to: toAddress || undefined,
        assetClass,
        metadataURI: description,
        file: selectedFile,
      });
      setMintSuccess({
        tokenId: res.tokenId,
        txHash: res.txHash,
      });
      await loadAssetsData();
      setTimeout(() => {
        setShowMint(false);
        setMintSuccess(null);
        setDescription('');
        setSelectedFile(null);
      }, 3500);
    } catch (err) {
      setMintError(err.message || 'Minting failed');
    } finally {
      setMintLoading(false);
    }
  };

  const filtered = assets.filter(a =>
    (a.description || '').toLowerCase().includes(search.toLowerCase()) ||
    String(a.tokenId).includes(search) || 
    (a.assetClass || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page">
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1>Digital Assets</h1>
            <p>ERC-721 enterprise asset registry on Polygon Amoy</p>
          </div>
          {canMint && (
            <button className="btn btn-primary" onClick={() => setShowMint(true)}>
              <Plus size={16} /> Mint Asset
            </button>
          )}
        </div>
      </div>

      <div className="card" style={{ marginBottom: 'var(--space-lg)', padding: 'var(--space-md)' }}>
        <div className="search-input-wrap">
          <Search size={16} className="search-icon" />
          <input 
            className="input search-input" 
            placeholder="Search assets by ID, class, or description..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card">
          <EmptyState 
            icon={Gem} 
            message="No digital assets" 
            description={canMint ? "Mint your first NFT asset to begin tracking." : "No digital assets allocated to your account."} 
          />
        </div>
      ) : (
        <div className="grid-3">
          {filtered.map(asset => (
            <div key={asset.tokenId} className="card card-interactive asset-card">
              <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-md)' }}>
                <div className="asset-token-id">
                  <Gem size={16} style={{ color: 'var(--status-pending)' }} />
                  <span className="font-mono">#{asset.tokenId}</span>
                </div>
                <span className={`badge badge-${getStatusColor(asset.assetStatus)}`}>{asset.assetStatus}</span>
              </div>
              
              {asset.thumbnailUrl && (
                <div style={{ height: 120, marginBottom: 'var(--space-md)', overflow: 'hidden', borderRadius: 8, background: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={asset.thumbnailUrl} alt="Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; }} />
                </div>
              )}

              <h4 style={{ marginBottom: 'var(--space-xs)' }}>{asset.description}</h4>
              <div className="text-sm text-secondary" style={{ marginBottom: 'var(--space-md)' }}>{asset.assetClass}</div>
              <div className="divider" />
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-tertiary">Owner</div>
                  <div className="text-sm font-mono">{typeof asset.ownerName === 'string' && asset.ownerName.startsWith('0x') ? `${asset.ownerName.slice(0, 6)}...${asset.ownerName.slice(-4)}` : asset.ownerName}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="text-xs text-tertiary">Created</div>
                  <div className="text-sm">{formatDate(asset.createdAt)}</div>
                </div>
              </div>
              <button className="btn btn-ghost btn-sm" style={{ marginTop: 'var(--space-md)', width: '100%' }} onClick={() => window.open(`https://amoy.polygonscan.com/token/${asset.tokenId}`, '_blank')}>
                View on Polygon <ExternalLink size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {showMint && canMint && (
        <div className="modal-overlay" onClick={() => setShowMint(false)}>
          <div className="modal-content card animate-fade-scale" onClick={e => e.stopPropagation()}>
            <h3 style={{ marginBottom: 'var(--space-lg)' }}>Mint New Asset (Admin Role Required)</h3>
            
            {mintError && (
              <div className="flex items-center gap-sm p-3 rounded text-sm mb-3" style={{ background: '#FEE2E2', color: '#991B1B' }}>
                <AlertCircle size={16} /> {mintError}
              </div>
            )}
            {mintSuccess && (
              <div className="flex items-center gap-sm p-3 rounded text-sm mb-3" style={{ background: '#D1FAE5', color: '#065F46' }}>
                <CheckCircle2 size={16} />
                <span>
                  Minted Token #{mintSuccess.tokenId || '1'}
                  {mintSuccess.txHash && (
                    <> — <a href={`https://amoy.polygonscan.com/tx/${mintSuccess.txHash}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', color: '#065F46', fontWeight: 600 }}>View Tx on Polygonscan</a></>
                  )}
                </span>
              </div>
            )}

            <div className="flex flex-col gap-md">
              <div className="input-group">
                <label>Asset Description / Title</label>
                <input 
                  className="input" 
                  placeholder="e.g. Tactical Drone Navigation Matrix" 
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label>Asset Class</label>
                <select 
                  className="input" 
                  value={assetClass}
                  onChange={e => setAssetClass(e.target.value)}
                >
                  <option>Defence Equipment</option>
                  <option>Communication Device</option>
                  <option>Electronic Warfare</option>
                  <option>Surveillance Unit</option>
                  <option>Critical Infrastructure</option>
                </select>
              </div>

              <div className="input-group">
                <label>Allocate To (Wallet Address / Account)</label>
                <input 
                  className="input font-mono" 
                  placeholder="0x... (or leave empty to retain in custody)" 
                  value={toAddress}
                  onChange={e => setToAddress(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label>Encrypted Thumbnail Asset</label>
                <input 
                  type="file" 
                  className="input" 
                  accept="image/*"
                  onChange={e => {
                    if (e.target.files && e.target.files[0]) setSelectedFile(e.target.files[0]);
                  }}
                />
              </div>

              <div className="flex gap-md" style={{ marginTop: 'var(--space-md)' }}>
                <button 
                  className="btn btn-primary" 
                  style={{ flex: 1 }} 
                  onClick={handleMint}
                  disabled={mintLoading}
                >
                  {mintLoading ? <><Loader2 size={16} className="spin" /> Minting...</> : 'Mint & Allocate'}
                </button>
                <button className="btn btn-secondary" onClick={() => setShowMint(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
