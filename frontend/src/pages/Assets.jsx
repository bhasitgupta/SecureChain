import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { formatDate, getStatusColor } from '../utils/formatters';
import { fetchAssets, getCachedAssets, mintAsset, transferAssetOnChain, compressImage, saveAssetThumbnail, parseMetadataURI } from '../lib/api';
import { CONTRACT_ADDRESSES } from '../utils/constants';
import { Gem, Plus, Search, ExternalLink, AlertCircle, CheckCircle2, Loader2, Send, Wallet, Copy, Check, RefreshCw, ImageOff } from 'lucide-react';
import EmptyState from '../components/EmptyState';
import './Assets.css';

export default function Assets() {
  const { wallet, role } = useAuth();
  const canMint = role === 'ADMIN';

  // Initialize with confirmed cache so NFTs never vanish on refresh
  const [assets, setAssets] = useState(() => getCachedAssets());
  const [loadingAssets, setLoadingAssets] = useState(() => getCachedAssets().length === 0);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'my'
  const [showMint, setShowMint] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  // Mint Form State
  const [description, setDescription] = useState('');
  const [assetClass, setAssetClass] = useState('Defence Equipment');
  const [toAddress, setToAddress] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileBase64, setFileBase64] = useState(null);
  const [mintLoading, setMintLoading] = useState(false);
  const [mintStep, setMintStep] = useState('');
  const [mintError, setMintError] = useState('');
  const [mintSuccess, setMintSuccess] = useState(null);

  // Transfer Modal State
  const [transferModal, setTransferModal] = useState({
    open: false,
    asset: null,
    toAddress: '',
    loading: false,
    error: '',
    success: null,
  });

  const loadAssetsData = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const data = await fetchAssets();
      if (data && Array.isArray(data) && data.length > 0) {
        setAssets(data);
      }
    } catch (err) {
      console.warn('Failed to refresh assets from blockchain:', err);
    } finally {
      setLoadingAssets(false);
      if (isManual) setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAssetsData();
    const handleUpdate = () => loadAssetsData();
    window.addEventListener('sc_assets_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('sc_assets_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFileSelection = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      try {
        const compressed = await compressImage(file, 720, 0.90);
        if (compressed) {
          setFileBase64(compressed.dataUrl);
          setSelectedFile(compressed.file);
          return;
        }
      } catch {}
      const reader = new FileReader();
      reader.onloadend = () => {
        setFileBase64(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setFileBase64(null);
    }
  };

  const handleMint = async () => {
    if (!canMint) {
      setMintError('Unauthorized: Only administrators have minting privileges.');
      return;
    }
    if (!description || !description.trim()) {
      setMintError('Asset title / description is required');
      return;
    }
    setMintLoading(true);
    setMintStep('Preparing asset...');
    setMintError('');
    setMintSuccess(null);

    const finalImage = fileBase64 || '';

    try {
      const res = await mintAsset({
        to: toAddress?.trim() || wallet || undefined,
        assetClass,
        metadataURI: description.trim(),
        file: selectedFile,
        imageUrl: finalImage,
        onProgress: (stepText) => setMintStep(stepText),
      });

      if (res && res.tokenId) {
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
          setFileBase64(null);
          setMintStep('');
        }, 3200);
      } else {
        throw new Error('Minting failed: no token ID returned');
      }
    } catch (err) {
      console.error('Mint execution error:', err);
      setMintError(err.message || 'On-chain minting failed');
    } finally {
      setMintLoading(false);
      setMintStep('');
    }
  };

  const openTransferModal = (asset) => {
    setTransferModal({
      open: true,
      asset,
      toAddress: '',
      loading: false,
      error: '',
      success: null,
    });
  };

  const closeTransferModal = () => {
    setTransferModal({
      open: false,
      asset: null,
      toAddress: '',
      loading: false,
      error: '',
      success: null,
    });
  };

  const handleTransfer = async () => {
    if (!transferModal.asset) return;
    const dest = transferModal.toAddress?.trim();
    if (!dest || !dest.startsWith('0x') || dest.length !== 42) {
      setTransferModal(prev => ({ ...prev, error: 'Valid 0x recipient address required' }));
      return;
    }

    setTransferModal(prev => ({ ...prev, loading: true, error: '', success: null }));

    try {
      const res = await transferAssetOnChain({
        tokenId: transferModal.asset.tokenId,
        toAddress: dest,
      });

      setTransferModal(prev => ({
        ...prev,
        loading: false,
        success: {
          txHash: res.txHash,
          to: dest,
        },
      }));

      await loadAssetsData();
      setTimeout(() => {
        closeTransferModal();
      }, 3500);
    } catch (err) {
      console.error('Transfer execution error:', err);
      setTransferModal(prev => ({
        ...prev,
        loading: false,
        error: err.message || 'On-chain transfer failed',
      }));
    }
  };

  const myAssets = assets.filter(a =>
    wallet && typeof a.ownerName === 'string' && a.ownerName.toLowerCase() === wallet.toLowerCase()
  );

  const displayedList = activeTab === 'my' ? myAssets : assets;

  const filtered = displayedList.filter(a =>
    (a.description || '').toLowerCase().includes(search.toLowerCase()) ||
    String(a.tokenId).includes(search) || 
    (a.assetClass || '').toLowerCase().includes(search.toLowerCase()) ||
    (a.ownerName || '').toLowerCase().includes(search.toLowerCase())
  );

  const nftContractAddr = CONTRACT_ADDRESSES.EnterpriseAssetNFT || '0xE97E0ea3a452a5099fd126721Db0DAfa96455e7D';

  return (
    <div className="page">
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1>Digital Assets</h1>
            <p>ERC-721 enterprise asset registry on Polygon Amoy ({nftContractAddr.slice(0, 6)}...{nftContractAddr.slice(-4)})</p>
          </div>
          <div className="flex gap-sm">
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => loadAssetsData(true)}
              disabled={refreshing}
              title="Sync with Polygon Amoy"
            >
              <RefreshCw size={14} className={refreshing ? 'spin' : ''} /> Sync Chain
            </button>
            {canMint && (
              <button className="btn btn-primary" onClick={() => setShowMint(true)}>
                <Plus size={16} /> Mint Asset On-Chain
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs & Search Filter */}
      <div className="card" style={{ marginBottom: 'var(--space-lg)', padding: 'var(--space-md)' }}>
        <div className="flex items-center justify-between gap-md" style={{ flexWrap: 'wrap' }}>
          <div className="flex gap-sm">
            <button 
              className={`btn btn-sm ${activeTab === 'all' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setActiveTab('all')}
            >
              All Assets ({assets.length})
            </button>
            <button 
              className={`btn btn-sm ${activeTab === 'my' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setActiveTab('my')}
            >
              <Wallet size={14} /> My Wallet Assets ({myAssets.length})
            </button>
          </div>

          <div className="search-input-wrap" style={{ flex: 1, minWidth: 260 }}>
            <Search size={16} className="search-icon" />
            <input 
              className="input search-input" 
              placeholder="Search assets by ID, class, owner, description..." 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
            />
          </div>
        </div>
      </div>

      {loadingAssets && assets.length === 0 ? (
        <div className="card flex items-center justify-center p-5">
          <div className="flex items-center gap-md text-secondary">
            <Loader2 size={24} className="spin" />
            <span>Connecting to Polygon Amoy for confirmed digital assets...</span>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card">
          <EmptyState 
            icon={Gem} 
            message={activeTab === 'my' ? "No assets in your wallet" : "No digital assets"} 
            description={activeTab === 'my' 
              ? (wallet ? `No NFTs are currently owned by ${wallet.slice(0,6)}...${wallet.slice(-4)}. Mint one or have someone transfer one to this address.` : "Connect your wallet to view your owned NFTs.") 
              : (canMint ? "Mint your first on-chain NFT asset to begin tracking." : "No digital assets allocated to your account.")
            } 
          />
        </div>
      ) : (
        <div className="grid-3">
          {filtered.map(asset => {
            const isMyAsset = wallet && typeof asset.ownerName === 'string' && asset.ownerName.toLowerCase() === wallet.toLowerCase();
            return (
              <div key={asset.tokenId} className="card card-interactive asset-card">
                <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-md)' }}>
                  <div className="asset-token-id">
                    <Gem size={16} style={{ color: 'var(--status-pending)' }} />
                    <span className="font-mono">#{asset.tokenId}</span>
                  </div>
                  <div className="flex items-center gap-xs">
                    {isMyAsset && (
                      <span className="badge badge-primary font-mono" style={{ background: '#2563EB', color: '#fff', fontSize: '0.72rem', padding: '2px 6px' }}>
                        YOU (Owner)
                      </span>
                    )}
                    <span className={`badge badge-${getStatusColor(asset.assetStatus)}`}>{asset.assetStatus}</span>
                  </div>
                </div>
                
                {/* Authentic On-Chain Thumbnail Display */}
                {asset.thumbnailUrl ? (
                  <div 
                    style={{ 
                      height: 150, 
                      marginBottom: 'var(--space-md)', 
                      overflow: 'hidden', 
                      borderRadius: 8, 
                      background: '#0F172A', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      border: '1px solid #1E293B',
                    }}
                  >
                    <img 
                      src={asset.thumbnailUrl} 
                      alt={asset.description} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      onError={(e) => { 
                        e.target.style.display = 'none'; 
                        if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                      }} 
                    />
                    <div style={{ display: 'none', flexDirection: 'column', alignItems: 'center', gap: 6, color: '#64748B' }}>
                      <ImageOff size={28} />
                      <span className="text-xs">Image unavailable</span>
                    </div>
                  </div>
                ) : (
                  <div 
                    style={{ 
                      height: 140, 
                      marginBottom: 'var(--space-md)', 
                      borderRadius: 8, 
                      background: 'linear-gradient(135deg, #0B132B 0%, #1C2541 100%)', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      color: '#64748B', 
                      border: '1px solid #1E293B', 
                      gap: 8,
                    }}
                  >
                    <Gem size={30} style={{ color: '#0EA5E9', opacity: 0.55 }} />
                    <span className="text-xs font-mono" style={{ color: '#94A3B8' }}>ERC-721 Token #{asset.tokenId}</span>
                  </div>
                )}

                <h4 style={{ marginBottom: 'var(--space-xs)' }}>
                  {asset.description?.startsWith('data:') 
                    ? (parseMetadataURI(asset.description)?.name || `Asset #${asset.tokenId}`) 
                    : (asset.description || `Asset #${asset.tokenId}`)}
                </h4>
                <div className="text-sm text-secondary" style={{ marginBottom: 'var(--space-md)' }}>{asset.assetClass}</div>
                <div className="divider" />
                
                <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-sm)' }}>
                  <div>
                    <div className="text-xs text-tertiary">On-Chain Owner</div>
                    <div className="flex items-center gap-xs">
                      <span className="text-sm font-mono">
                        {typeof asset.ownerName === 'string' && asset.ownerName.startsWith('0x') 
                          ? `${asset.ownerName.slice(0, 6)}...${asset.ownerName.slice(-4)}` 
                          : asset.ownerName}
                      </span>
                      {typeof asset.ownerName === 'string' && asset.ownerName.startsWith('0x') && (
                        <button 
                          className="btn btn-ghost btn-sm" 
                          style={{ padding: '2px 4px', height: 'auto' }}
                          title="Copy address"
                          onClick={() => handleCopy(asset.ownerName, asset.tokenId)}
                        >
                          {copiedId === asset.tokenId ? <Check size={12} style={{ color: '#10B981' }} /> : <Copy size={12} />}
                        </button>
                      )}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="text-xs text-tertiary">Minted</div>
                    <div className="text-sm">{formatDate(asset.createdAt)}</div>
                  </div>
                </div>

                <div className="flex gap-sm" style={{ marginTop: 'var(--space-md)' }}>
                  <button 
                    className="btn btn-ghost btn-sm" 
                    style={{ flex: 1 }} 
                    onClick={() => window.open(`https://amoy.polygonscan.com/token/${nftContractAddr}?a=${asset.tokenId}`, '_blank')}
                  >
                    Polygonscan <ExternalLink size={12} />
                  </button>

                  {(isMyAsset || canMint) && (
                    <button 
                      className="btn btn-secondary btn-sm" 
                      style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                      onClick={() => openTransferModal(asset)}
                    >
                      <Send size={12} /> Transfer
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Mint Modal */}
      {showMint && canMint && (
        <div className="modal-overlay" onClick={() => setShowMint(false)}>
          <div className="modal-content card animate-fade-scale" onClick={e => e.stopPropagation()}>
            <h3 style={{ marginBottom: 'var(--space-xs)' }}>Mint New Asset On-Chain</h3>
            <p className="text-xs text-secondary" style={{ marginBottom: 'var(--space-md)' }}>
              Broadcasts an ERC-721 mint transaction to Polygon Amoy. Encodes your genuine image into on-chain metadata for Polygonscan.
            </p>
            
            {mintError && (
              <div className="flex items-center justify-between gap-sm p-3 rounded text-sm mb-3" style={{ background: '#FEE2E2', color: '#991B1B' }}>
                <div className="flex items-center gap-sm">
                  <AlertCircle size={16} /> <span>{mintError}</span>
                </div>
              </div>
            )}

            {mintSuccess && (
              <div className="flex items-center gap-sm p-3 rounded text-sm mb-3" style={{ background: '#D1FAE5', color: '#065F46' }}>
                <CheckCircle2 size={16} />
                <span>
                  Successfully Minted Token #{mintSuccess.tokenId}!
                  {mintSuccess.txHash && (
                    <> — <a href={`https://amoy.polygonscan.com/tx/${mintSuccess.txHash}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', color: '#065F46', fontWeight: 600 }}>View on Polygonscan</a></>
                  )}
                </span>
              </div>
            )}

            <div className="flex flex-col gap-md">
              <div className="input-group">
                <label>Asset Title / Description</label>
                <input 
                  className="input" 
                  placeholder="e.g. Tactical Defense Drone Matrix" 
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
                  placeholder={wallet ? `Default: Your connected wallet (${wallet.slice(0,6)}...${wallet.slice(-4)})` : "0x..."}
                  value={toAddress}
                  onChange={e => setToAddress(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label>Upload Real Asset Image (File)</label>
                <input 
                  type="file" 
                  className="input" 
                  accept="image/*"
                  onChange={handleFileSelection}
                />
              </div>

              {/* Real Image Preview */}
              {fileBase64 && (
                <div style={{ height: 120, borderRadius: 6, overflow: 'hidden', background: '#0F172A', border: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img 
                    src={fileBase64} 
                    alt="Preview" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                </div>
              )}

              <div className="flex gap-md" style={{ marginTop: 'var(--space-md)' }}>
                <button 
                  className="btn btn-primary" 
                  style={{ flex: 1 }} 
                  onClick={handleMint}
                  disabled={mintLoading}
                >
                  {mintLoading ? <><Loader2 size={16} className="spin" /> {mintStep || 'Confirming in Wallet...'}</> : 'Mint On-Chain'}
                </button>
                <button className="btn btn-secondary" onClick={() => setShowMint(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transfer Modal */}
      {transferModal.open && transferModal.asset && (
        <div className="modal-overlay" onClick={closeTransferModal}>
          <div className="modal-content card animate-fade-scale" onClick={e => e.stopPropagation()}>
            <h3 style={{ marginBottom: 'var(--space-xs)' }}>
              Transfer Token #{transferModal.asset.tokenId} On-Chain
            </h3>
            <p className="text-xs text-secondary" style={{ marginBottom: 'var(--space-md)' }}>
              Direct ERC-721 transfer executed via MetaMask on Polygon Amoy.
            </p>

            <div className="card p-3 mb-3" style={{ background: '#0F172A', border: '1px solid #1E293B' }}>
              <div className="text-xs text-tertiary">Asset Details</div>
              <div className="font-semibold text-sm">{transferModal.asset.description}</div>
              <div className="text-xs text-secondary font-mono">Current Owner: {transferModal.asset.ownerName}</div>
            </div>

            {transferModal.error && (
              <div className="flex items-center gap-sm p-3 rounded text-sm mb-3" style={{ background: '#FEE2E2', color: '#991B1B' }}>
                <AlertCircle size={16} /> <span>{transferModal.error}</span>
              </div>
            )}

            {transferModal.success && (
              <div className="flex items-center gap-sm p-3 rounded text-sm mb-3" style={{ background: '#D1FAE5', color: '#065F46' }}>
                <CheckCircle2 size={16} />
                <span>
                  Transferred successfully!
                  {transferModal.success.txHash && (
                    <> — <a href={`https://amoy.polygonscan.com/tx/${transferModal.success.txHash}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', color: '#065F46', fontWeight: 600 }}>View on Polygonscan</a></>
                  )}
                </span>
              </div>
            )}

            <div className="flex flex-col gap-md">
              <div className="input-group">
                <label>Recipient Wallet Address</label>
                <input 
                  className="input font-mono" 
                  placeholder="0x8292040fb8adbe10333a74b2bf79ebfbf3b0e41c"
                  value={transferModal.toAddress}
                  onChange={e => setTransferModal(prev => ({ ...prev, toAddress: e.target.value }))}
                />
              </div>

              <div className="flex gap-md" style={{ marginTop: 'var(--space-md)' }}>
                <button 
                  className="btn btn-primary" 
                  style={{ flex: 1 }} 
                  onClick={handleTransfer}
                  disabled={transferModal.loading}
                >
                  {transferModal.loading ? <><Loader2 size={16} className="spin" /> Confirming in Wallet...</> : 'Execute On-Chain Transfer'}
                </button>
                <button className="btn btn-secondary" onClick={closeTransferModal}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
