export const truncateAddress = (addr) => addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : '';
export const truncateHash = (hash) => hash ? `${hash.slice(0, 10)}...${hash.slice(-6)}` : '';
export const formatDate = (iso) => new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
export const getStatusColor = (status) => {
  const map = { VERIFIABLE: 'success', ANCHORED: 'success', ANCHOR_PENDING: 'warning', MERKLE_BATCHED: 'info', PROOF_READY: 'info', OCR_PROCESSING: 'pending', HASHED: 'info', DURABLY_STORED: 'warning', UPLOADING: 'neutral', ACTIVE: 'success', SUSPENDED: 'warning', REVOKED: 'error' };
  return map[status] || 'neutral';
};

export const formatTimeAgo = (dateInput) => {
  if (!dateInput) return 'Just now';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return 'Just now';
  const now = new Date();
  const diffSec = Math.floor((now - date) / 1000);
  if (diffSec < 45) return 'Just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDays = Math.floor(diffHr / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};
