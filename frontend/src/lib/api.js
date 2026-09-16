export const API_BASE = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export function getAuthHeaders() {
  try {
    const token = localStorage.getItem('sc_auth_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch {
    return {};
  }
}

export async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const headers = {
    ...getAuthHeaders(),
    ...(options.headers || {}),
  };
  const res = await fetch(url, {
    ...options,
    credentials: 'include',
    headers,
  });

  if (!res.ok) {
    let errorMsg = `API Error ${res.status}`;
    try {
      const data = await res.json();
      if (data.error) errorMsg = data.error;
    } catch {}
    throw new Error(errorMsg);
  }

  return res.json();
}

// ── Auth ──
export async function walletLogin(message, signature, address) {
  return apiFetch('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, signature, address }),
  });
}

export async function fetchChainHealth() {
  const res = await fetch(`${API_BASE.replace('/api', '')}/health`, { credentials: 'include' });
  return res.json();
}

// ── Dashboard / Stats ──
export async function fetchDashboardStats() {
  try {
    return await apiFetch('/audit/stats');
  } catch (err) {
    console.warn('Backend stats unavailable, using fallback', err);
    return null;
  }
}

// ── Documents ──
export async function fetchDocuments() {
  const data = await apiFetch('/documents');
  return data.documents || [];
}

export async function uploadDocument(title, file) {
  const formData = new FormData();
  formData.append('title', title || file.name);
  formData.append('file', file);

  const res = await fetch(`${API_BASE}/documents`, {
    method: 'POST',
    body: formData,
    headers: {
      ...getAuthHeaders(),
    },
    credentials: 'include',
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Upload failed');
  return data;
}

export async function fetchDocumentDetail(docId) {
  return await apiFetch(`/documents/${docId}`);
}

export async function uploadDocumentRevision(docId, file) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE}/documents/${docId}/versions`, {
    method: 'POST',
    body: formData,
    headers: {
      ...getAuthHeaders(),
    },
    credentials: 'include',
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Revision upload failed');
  return data;
}

export async function getDocumentDownloadUrl(docId, versionId) {
  const data = await apiFetch(`/documents/${docId}/versions/${versionId}/download`);
  return data.downloadUrl;
}

// ── Assets ──
export async function fetchAssets() {
  const data = await apiFetch('/assets');
  return data.assets || [];
}

export async function mintAsset({ to, assetClass, metadataURI, file }) {
  const formData = new FormData();
  if (to) formData.append('to', to);
  if (assetClass) formData.append('assetClass', assetClass);
  if (metadataURI) formData.append('metadataURI', metadataURI);
  if (file) formData.append('thumbnail', file);

  const res = await fetch(`${API_BASE}/assets/mint`, {
    method: 'POST',
    body: formData,
    headers: {
      ...getAuthHeaders(),
    },
    credentials: 'include',
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Minting failed');
  return data;
}

// ── Identity ──
export async function fetchIdentities() {
  const data = await apiFetch('/identity');
  return data.identities || [];
}

export async function registerIdentity(account, subjectId) {
  return await apiFetch('/identity', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ account, subjectId }),
  });
}

// ── Roles (RBAC) ──
export async function fetchAssignedRoles() {
  try {
    const data = await apiFetch('/roles');
    return data.roles || {};
  } catch {
    return null;
  }
}

export async function fetchRolesForAddress(address) {
  return await apiFetch(`/roles/${address}`);
}

export async function assignRoleAPI(address, role) {
  return await apiFetch('/roles/assign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address, role }),
  });
}

export async function grantRoleOnChain(role, account) {
  return await apiFetch('/roles/grant', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role: `${role}_ROLE`, account }),
  });
}

export async function revokeRoleOnChain(role, account) {
  return await apiFetch('/roles/revoke', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role: `${role}_ROLE`, account }),
  });
}

export async function deleteRoleAPI(address) {
  try {
    return await apiFetch(`/roles/${address}`, {
      method: 'DELETE',
    });
  } catch {
    return null;
  }
}

// ── Cryptographic Verification ──
export async function verifyDocumentVersion(versionId) {
  return await apiFetch(`/verify/${versionId}`, {
    method: 'POST',
  });
}

// ── Audit Trail ──
export async function fetchAuditEvents(query = {}) {
  const params = new URLSearchParams(query).toString();
  const data = await apiFetch(`/audit/events${params ? `?${params}` : ''}`);
  return data.events || [];
}

// ── Recovery ──
export async function fetchRecoveryProviders() {
  try {
    const data = await apiFetch('/recovery/providers');
    return data.providers || [];
  } catch {
    return [];
  }
}

export async function registerRecoveryProviderAPI(providerAddress) {
  return await apiFetch('/recovery/providers/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ providerAddress }),
  });
}

