export const truncateAddress = (addr) => addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : '';
export const truncateHash = (hash) => hash ? `${hash.slice(0, 10)}...${hash.slice(-6)}` : '';
export const formatDate = (iso) => new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
export const getStatusColor = (status) => {
  const map = { VERIFIABLE: 'success', ANCHORED: 'success', ANCHOR_PENDING: 'warning', MERKLE_BATCHED: 'info', PROOF_READY: 'info', OCR_PROCESSING: 'pending', HASHED: 'info', DURABLY_STORED: 'warning', UPLOADING: 'neutral', ACTIVE: 'success', SUSPENDED: 'warning', REVOKED: 'error' };
  return map[status] || 'neutral';
};
