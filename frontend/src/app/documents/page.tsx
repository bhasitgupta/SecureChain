'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiFetch, API_BASE } from '@/lib/api';
import { FileCheck, Upload, Download, History, Shield, AlertCircle, Check, ArrowRight } from 'lucide-react';

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Upload V1 State
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Revision Modal State
  const [revisionDocId, setRevisionDocId] = useState<string | null>(null);
  const [revisionFile, setRevisionFile] = useState<File | null>(null);
  const [revisionLoading, setRevisionLoading] = useState(false);

  // Lineage History Modal State
  const [selectedDoc, setSelectedDoc] = useState<any | null>(null);
  const [historyLoading, setHistoryLoading] = useState(false);

  const loadDocuments = async () => {
    try {
      const data = await apiFetch('/documents');
      setDocuments(data.documents || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const handleUploadV1 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setError(null);
    setSuccess(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('title', title || file.name);
      formData.append('file', file);

      const res = await fetch(`${API_BASE}/documents`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      setSuccess(`Document V1 Ingested! Version ID: ${data.versionId} (SHA-256: ${data.sha256.slice(0, 16)}...)`);
      setTitle('');
      setFile(null);
      loadDocuments();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleUploadRevision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!revisionDocId || !revisionFile) return;
    setRevisionLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', revisionFile);

      const res = await fetch(`${API_BASE}/documents/${revisionDocId}/versions`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Revision upload failed');

      setSuccess(`Document revision uploaded! New version: V${data.seq} (SHA-256: ${data.sha256.slice(0, 16)}...)`);
      setRevisionDocId(null);
      setRevisionFile(null);
      loadDocuments();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setRevisionLoading(false);
    }
  };

  const openLineage = async (docId: string) => {
    setHistoryLoading(true);
    try {
      const data = await apiFetch(`/documents/${docId}`);
      setSelectedDoc(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleDownload = async (docId: string, versionId: string) => {
    try {
      const data = await apiFetch(`/documents/${docId}/versions/${versionId}/download`);
      if (data.downloadUrl) {
        window.open(data.downloadUrl, '_blank');
      }
    } catch (err: any) {
      setError('Download failed: ' + err.message);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <FileCheck className="w-6 h-6 text-emerald-400" /> Confidential Document Security
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Zero confidential bytes on Polygon. Original encrypted files stored in MinIO with streaming SHA-256, immutable versioning, and Merkle root anchoring.
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

      {/* Upload V1 Document */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <Upload className="w-4 h-4 text-emerald-400" /> Ingest New Confidential Document (V1)
        </h2>

        <form onSubmit={handleUploadV1} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Document Title</label>
            <input
              type="text"
              placeholder="e.g. Technical Specification D-401"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gray-900 border border-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Document File</label>
            <input
              type="file"
              required
              onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
              className="w-full text-xs text-gray-400 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-gray-800 file:text-emerald-400 hover:file:bg-gray-700 cursor-pointer"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={uploading || !file}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm py-2 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {uploading ? 'Ingesting (Streaming SHA-256)...' : 'Upload Document V1'}
            </button>
          </div>
        </form>
      </div>

      {/* Document Records Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex justify-between items-center">
          <h2 className="text-base font-semibold text-white">Ingested Document Repository</h2>
          <span className="text-xs text-gray-400">{documents.length} records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-900/60 text-gray-400 text-xs border-b border-border">
              <tr>
                <th className="px-6 py-3 font-medium">Document Title</th>
                <th className="px-6 py-3 font-medium">Latest Version</th>
                <th className="px-6 py-3 font-medium">SHA-256 Digest</th>
                <th className="px-6 py-3 font-medium">Pipeline State</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Loading documents...
                  </td>
                </tr>
              ) : documents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No documents ingested yet.
                  </td>
                </tr>
              ) : (
                documents.map((doc) => (
                  <tr key={doc.document_id} className="hover:bg-gray-800/30">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">{doc.title}</div>
                      <div className="text-xs font-mono text-gray-400">{doc.document_id}</div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="bg-gray-800 text-gray-200 border border-gray-700 px-2 py-0.5 rounded text-xs font-mono">
                        V{doc.latest_seq || 1} ({doc.version_count} versions)
                      </span>
                    </td>

                    <td className="px-6 py-4 font-mono text-xs text-emerald-400">
                      {doc.sha256 ? `${doc.sha256.slice(0, 16)}...` : 'Pending'}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-md font-medium border ${
                          doc.state === 'VERIFIABLE'
                            ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60'
                            : doc.state === 'ANCHOR_PENDING' || doc.state === 'MERKLE_BATCHED'
                            ? 'bg-amber-950/60 text-amber-400 border-amber-800/60'
                            : 'bg-blue-950/60 text-blue-400 border-blue-800/60'
                        }`}
                      >
                        ● {doc.state || 'DURABLY_STORED'}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => openLineage(doc.document_id)}
                        className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-2.5 py-1.5 rounded-lg border border-border"
                        title="View Version Lineage"
                      >
                        <History className="w-3.5 h-3.5 inline mr-1" /> History
                      </button>

                      <button
                        onClick={() => setRevisionDocId(doc.document_id)}
                        className="text-xs bg-gray-800 hover:bg-gray-700 text-purple-300 px-2.5 py-1.5 rounded-lg border border-border"
                      >
                        + Revise
                      </button>

                      {doc.latest_version_id && (
                        <>
                          <button
                            onClick={() => handleDownload(doc.document_id, doc.latest_version_id)}
                            className="text-xs bg-gray-800 hover:bg-gray-700 text-blue-300 px-2.5 py-1.5 rounded-lg border border-border"
                          >
                            <Download className="w-3.5 h-3.5 inline" />
                          </button>

                          <Link
                            href={`/verify?versionId=${doc.latest_version_id}`}
                            className="text-xs bg-emerald-900/40 hover:bg-emerald-800/40 text-emerald-400 px-2.5 py-1.5 rounded-lg border border-emerald-700/50 inline-flex items-center gap-1"
                          >
                            <Shield className="w-3.5 h-3.5" /> Verify
                          </Link>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Revision Modal */}
      {revisionDocId && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Upload Document Revision</h3>
            <p className="text-xs text-gray-400">
              Each revision creates a new immutable version with a unique SHA-256 digest. Historical versions are never overwritten.
            </p>

            <form onSubmit={handleUploadRevision} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">New Revision File</label>
                <input
                  type="file"
                  required
                  onChange={(e) => setRevisionFile(e.target.files ? e.target.files[0] : null)}
                  className="w-full text-xs text-gray-400 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-gray-800 file:text-purple-400 cursor-pointer"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRevisionDocId(null)}
                  className="px-4 py-2 text-xs font-medium text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={revisionLoading || !revisionFile}
                  className="bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs px-5 py-2 rounded-lg transition disabled:opacity-50"
                >
                  {revisionLoading ? 'Ingesting Revision...' : 'Commit Revision'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Version Lineage History Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-3xl w-full p-6 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <div>
                <h3 className="text-lg font-bold text-white">{selectedDoc.document.title}</h3>
                <div className="text-xs font-mono text-gray-400">ID: {selectedDoc.document.document_id}</div>
              </div>
              <button
                onClick={() => setSelectedDoc(null)}
                className="text-gray-400 hover:text-white text-sm"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase text-gray-400">Immutable Version Lineage</h4>
              {selectedDoc.versions.map((v: any) => (
                <div
                  key={v.version_id}
                  className="p-4 bg-gray-900 border border-border rounded-xl space-y-2 text-xs"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white text-sm">
                      Version #{v.seq}: {v.file_name}
                    </span>
                    <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded font-mono">
                      {v.state}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-gray-400 font-mono">
                    <div>
                      <span className="text-gray-500">Version ID:</span> {v.version_id}
                    </div>
                    <div>
                      <span className="text-gray-500">Size:</span> {(v.size_bytes / 1024).toFixed(1)} KB
                    </div>
                    <div className="col-span-2 truncate">
                      <span className="text-gray-500">SHA-256:</span>{' '}
                      <span className="text-emerald-400">{v.sha256}</span>
                    </div>
                    {v.merkle_root && (
                      <div className="col-span-2 truncate">
                        <span className="text-gray-500">Merkle Root:</span> {v.merkle_root}
                      </div>
                    )}
                    {v.anchor_tx && (
                      <div className="col-span-2 truncate">
                        <span className="text-gray-500">Polygon Tx:</span>{' '}
                        <span className="text-blue-400">{v.anchor_tx}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      onClick={() => handleDownload(selectedDoc.document.document_id, v.version_id)}
                      className="bg-gray-800 hover:bg-gray-700 text-blue-400 px-3 py-1 rounded text-xs border border-border"
                    >
                      <Download className="w-3 h-3 inline mr-1" /> Download Version
                    </button>
                    <Link
                      href={`/verify?versionId=${v.version_id}`}
                      className="bg-emerald-900/60 hover:bg-emerald-800/60 text-emerald-300 px-3 py-1 rounded text-xs border border-emerald-700/60"
                    >
                      Verify Cryptographic Proof
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
