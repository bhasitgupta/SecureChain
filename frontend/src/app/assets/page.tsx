'use client';

import { useState, useEffect, useRef } from 'react';
import { apiFetch, API_BASE } from '@/lib/api';
import { Box, Plus, Image as ImageIcon, Check, AlertCircle, RefreshCw, Send, ArrowRight } from 'lucide-react';

export default function AssetsPage() {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Mint Form State
  const [toAddress, setToAddress] = useState('');
  const [assetClass, setAssetClass] = useState('Secure Communications Hardware');
  const [metadataURI, setMetadataURI] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [minting, setMinting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Modal State for Allocate / Transfer / Retire
  const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null);
  const [modalType, setModalType] = useState<'allocate' | 'transfer' | 'retire' | null>(null);
  const [modalTarget, setModalTarget] = useState('');
  const [modalSender, setModalSender] = useState('');
  const [modalReason, setModalReason] = useState('');
  const [modalLoading, setModalLoading] = useState(false);

  const loadAssets = async () => {
    try {
      const data = await apiFetch('/assets');
      setAssets(data.assets || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssets();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setMinting(true);

    try {
      const formData = new FormData();
      formData.append('to', toAddress);
      formData.append('assetClass', assetClass);
      formData.append('metadataURI', metadataURI);
      if (thumbnailFile) {
        formData.append('thumbnail', thumbnailFile);
      }

      const res = await fetch(`${API_BASE}/assets/mint`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Minting failed');

      setSuccess(`Asset NFT Minted! Token ID: #${data.tokenId} (Tx: ${data.txHash || 'local'})`);
      setToAddress('');
      setThumbnailFile(null);
      setThumbnailPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      loadAssets();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setMinting(false);
    }
  };

  const handleModalAction = async () => {
    if (!selectedTokenId || !modalType) return;
    setModalLoading(true);
    setError(null);
    try {
      if (modalType === 'allocate') {
        await apiFetch('/assets/allocate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tokenId: selectedTokenId, to: modalTarget }),
        });
        setSuccess(`Token #${selectedTokenId} allocated to ${modalTarget}`);
      } else if (modalType === 'transfer') {
        await apiFetch('/assets/transfer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tokenId: selectedTokenId, from: modalSender, to: modalTarget }),
        });
        setSuccess(`Token #${selectedTokenId} transferred to ${modalTarget}`);
      } else if (modalType === 'retire') {
        await apiFetch('/assets/retire', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tokenId: selectedTokenId, reason: modalReason }),
        });
        setSuccess(`Token #${selectedTokenId} retired. Reason: ${modalReason}`);
      }

      setModalType(null);
      setSelectedTokenId(null);
      setModalTarget('');
      setModalSender('');
      setModalReason('');
      loadAssets();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Box className="w-6 h-6 text-purple-400" /> Enterprise Digital Asset (NFT) Registry
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          ERC-721 enterprise control assets linked directly to DID identities with full thumbnail previews stored securely in MinIO.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-950/60 border border-rose-800/50 text-rose-300 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-950/60 border border-emerald-800/50 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
          <Check className="w-4 h-4" /> {success}
        </div>
      )}

      {/* Mint NFT Form */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <Plus className="w-4 h-4 text-purple-400" /> Mint Enterprise Asset NFT (Admin Only)
        </h2>

        <form onSubmit={handleMint} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                Recipient Account (Responsible Principal)
              </label>
              <input
                type="text"
                required
                placeholder="0x..."
                value={toAddress}
                onChange={(e) => setToAddress(e.target.value)}
                className="w-full bg-gray-900 border border-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Asset Class</label>
              <input
                type="text"
                required
                placeholder="e.g. Defence Encryption Unit, Radar Module"
                value={assetClass}
                onChange={(e) => setAssetClass(e.target.value)}
                className="w-full bg-gray-900 border border-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Metadata URI (Optional)</label>
              <input
                type="text"
                placeholder="ipfs:// or https://..."
                value={metadataURI}
                onChange={(e) => setMetadataURI(e.target.value)}
                className="w-full bg-gray-900 border border-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                Asset Thumbnail Image (Required for Visual Verification)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="w-full text-xs text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-gray-800 file:text-purple-400 hover:file:bg-gray-700 cursor-pointer"
                />
                {thumbnailPreview && (
                  <div className="w-10 h-10 rounded-lg overflow-hidden border border-purple-500/50 flex-shrink-0">
                    <img src={thumbnailPreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={minting}
              className="bg-purple-600 hover:bg-purple-500 text-white font-medium text-sm px-6 py-2.5 rounded-xl transition disabled:opacity-50 flex items-center gap-2"
            >
              {minting ? 'Minting NFT...' : 'Mint Enterprise NFT'}
            </button>
          </div>
        </form>
      </div>

      {/* Asset Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-white">Minted Assets Portfolio</h2>
          <button
            onClick={loadAssets}
            className="text-xs text-gray-400 hover:text-white flex items-center gap-1 bg-gray-900 px-3 py-1.5 rounded-lg border border-border"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-500">Loading assets...</div>
        ) : assets.length === 0 ? (
          <div className="p-12 text-center text-gray-500 bg-card border border-border rounded-xl">
            No enterprise asset NFTs minted yet. Use the form above to mint the first one!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {assets.map((asset) => (
              <div
                key={asset.tokenId}
                className="bg-card border border-border hover:border-purple-500/50 rounded-2xl overflow-hidden transition shadow-lg flex flex-col"
              >
                {/* Thumbnail Display */}
                <div className="w-full h-48 bg-gray-900 relative flex items-center justify-center overflow-hidden border-b border-border">
                  {asset.thumbnailUrl ? (
                    <img
                      src={`${API_BASE.replace('/api', '')}${asset.thumbnailUrl}`}
                      alt={`Token #${asset.tokenId}`}
                      className="w-full h-full object-cover"
                      onError={(e: any) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="flex flex-col items-center text-gray-600">
                      <ImageIcon className="w-12 h-12 stroke-1" />
                      <span className="text-xs mt-1">No thumbnail</span>
                    </div>
                  )}
                  <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-purple-400 font-mono font-bold text-xs px-2.5 py-1 rounded-md border border-purple-500/30">
                    Token #{asset.tokenId}
                  </div>
                  <div className="absolute top-3 right-3">
                    <span
                      className={`text-xs px-2 py-0.5 rounded font-medium ${
                        asset.status === 'Active'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : asset.status === 'Retired'
                          ? 'bg-rose-950 text-rose-400 border border-rose-800'
                          : 'bg-blue-950 text-blue-400 border border-blue-800'
                      }`}
                    >
                      ● {asset.status || 'Active'}
                    </span>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs text-gray-400">Classification</div>
                      <div className="text-sm font-semibold text-white mt-0.5">
                        {asset.assetClass || 'General Enterprise Asset'}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-gray-400">Responsible Controller</div>
                      <div className="text-xs font-mono text-gray-300 mt-0.5 truncate">
                        {asset.owner || 'Admin Controlled'}
                      </div>
                    </div>

                    {asset.didHash && (
                      <div>
                        <div className="text-xs text-gray-400">DID Hash</div>
                        <div className="text-xs font-mono text-purple-400/80 truncate">
                          {asset.didHash}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-4 mt-4 border-t border-border grid grid-cols-3 gap-2">
                    <button
                      onClick={() => {
                        setSelectedTokenId(asset.tokenId);
                        setModalType('allocate');
                      }}
                      className="text-xs bg-gray-800 hover:bg-gray-700 text-purple-300 font-medium py-1.5 rounded-lg border border-border transition"
                    >
                      Allocate
                    </button>
                    <button
                      onClick={() => {
                        setSelectedTokenId(asset.tokenId);
                        setModalSender(asset.owner || '');
                        setModalType('transfer');
                      }}
                      className="text-xs bg-gray-800 hover:bg-gray-700 text-blue-300 font-medium py-1.5 rounded-lg border border-border transition"
                    >
                      Transfer
                    </button>
                    <button
                      onClick={() => {
                        setSelectedTokenId(asset.tokenId);
                        setModalType('retire');
                      }}
                      className="text-xs bg-gray-800 hover:bg-gray-700 text-rose-300 font-medium py-1.5 rounded-lg border border-border transition"
                    >
                      Retire
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Modal */}
      {modalType && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white capitalize">
              {modalType === 'allocate' && `Allocate Token #${selectedTokenId}`}
              {modalType === 'transfer' && `Transfer Token #${selectedTokenId}`}
              {modalType === 'retire' && `Retire Token #${selectedTokenId}`}
            </h3>

            {modalType === 'transfer' && (
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">From Address</label>
                <input
                  type="text"
                  value={modalSender}
                  onChange={(e) => setModalSender(e.target.value)}
                  className="w-full bg-gray-900 border border-border rounded-lg px-3 py-2 text-sm text-white font-mono"
                />
              </div>
            )}

            {modalType !== 'retire' ? (
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Target Recipient Address</label>
                <input
                  type="text"
                  placeholder="0x..."
                  value={modalTarget}
                  onChange={(e) => setModalTarget(e.target.value)}
                  className="w-full bg-gray-900 border border-border rounded-lg px-3 py-2 text-sm text-white font-mono"
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Retirement Reason</label>
                <input
                  type="text"
                  placeholder="e.g. Decommissioned after lifecycle audit"
                  value={modalReason}
                  onChange={(e) => setModalReason(e.target.value)}
                  className="w-full bg-gray-900 border border-border rounded-lg px-3 py-2 text-sm text-white"
                />
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setModalType(null)}
                className="px-4 py-2 text-xs font-medium text-gray-400 hover:text-white rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleModalAction}
                disabled={modalLoading}
                className="bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs px-5 py-2 rounded-lg transition disabled:opacity-50"
              >
                {modalLoading ? 'Executing...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
