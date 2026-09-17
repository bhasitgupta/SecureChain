import { useState, useEffect, useRef } from 'react';
import { mockDocuments, mockVersions } from '../utils/mockData';
import { formatDate, truncateHash, getStatusColor } from '../utils/formatters';
import { 
  fetchDocuments, 
  uploadDocument, 
  fetchDocumentDetail, 
  getDocumentDownloadUrl,
  downloadDocumentArtifact,
  downloadProofCertificate,
  uploadDocumentRevision 
} from '../lib/api';
import { 
  Upload, 
  Search, 
  FileText, 
  Clock, 
  Hash, 
  ChevronRight, 
  X, 
  Download, 
  Plus, 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  ExternalLink
} from 'lucide-react';
import EmptyState from '../components/EmptyState';
import './Documents.css';

export default function Documents() {
  const [documents, setDocuments] = useState(mockDocuments);
  const [search, setSearch] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  
  // Upload State
  const [uploadTitle, setUploadTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');

  // Revision State
  const [revisionFile, setRevisionFile] = useState(null);
  const [revisionLoading, setRevisionLoading] = useState(false);

  const fileInputRef = useRef(null);

  const loadDocs = async () => {
    try {
      const data = await fetchDocuments();
      if (data && data.length > 0) {
        setDocuments(data.map(d => ({
          documentId: d.document_id || d.documentId,
          title: d.title,
          latestVersion: d.latest_seq || d.latestVersion || 1,
          hash: d.sha256 || d.hash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
          status: d.state || d.status || 'VERIFIABLE',
          owner: d.creator_did || d.owner || 'Enterprise Admin',
          updatedAt: d.updated_at || d.updatedAt || Date.now(),
          versions: d.versions || [],
          txHash: d.tx_hash || d.txHash || null,
          cloudDocUrl: d.cloudDocUrl || d.cloud_doc_url || null,
          fileDataUrl: d.fileDataUrl || null,
          fileName: d.fileName || d.file_name || null,
        })));
      }
    } catch (err) {
      console.warn('Backend documents not reachable, using local state');
    }
  };

  useEffect(() => {
    loadDocs();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      if (!uploadTitle) setUploadTitle(e.target.files[0].name.replace(/\.[^/.]+$/, ''));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
      if (!uploadTitle) setUploadTitle(e.dataTransfer.files[0].name.replace(/\.[^/.]+$/, ''));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError('Please select a file to upload.');
      return;
    }
    setUploadLoading(true);
    setUploadError('');
    setUploadSuccess('Preparing cryptographic anchor...');

    try {
      const res = await uploadDocument(uploadTitle, selectedFile, (stepText) => {
        setUploadSuccess(stepText);
      });
      setUploadSuccess(res.txHash ? `Anchored on Polygon Amoy! TX: ${res.txHash.slice(0, 10)}...` : `Uploaded: ${res.versionId || 'V1'}`);
      setSelectedFile(null);
      setUploadTitle('');
      await loadDocs();
      setTimeout(() => {
        setShowUpload(false);
        setUploadSuccess('');
      }, 2400);
    } catch (err) {
      setUploadError(err.message || 'Upload failed');
    } finally {
      setUploadLoading(false);
    }
  };

  const handleDocClick = async (doc) => {
    setSelectedDoc(doc);
    try {
      const detail = await fetchDocumentDetail(doc.documentId);
      if (detail) {
        setSelectedDoc(prev => ({
          ...prev,
          versions: detail.versions || prev.versions || [],
          cloudDocUrl: detail.cloudDocUrl || prev.cloudDocUrl,
          fileDataUrl: detail.fileDataUrl || prev.fileDataUrl,
          fileName: detail.fileName || prev.fileName,
        }));
      }
    } catch {}
  };

  const handleDownload = async (docId, versionId) => {
    try {
      const doc = documents.find(d => d.documentId === docId) || selectedDoc;
      if (doc) {
        await downloadDocumentArtifact(doc, versionId);
      }
    } catch (err) {
      console.error('Download error:', err);
      if (selectedDoc) {
        downloadProofCertificate(selectedDoc);
      }
    }
  };

  const handleAddRevision = async (docId) => {
    if (!revisionFile) return;
    setRevisionLoading(true);
    try {
      await uploadDocumentRevision(docId, revisionFile);
      setRevisionFile(null);
      await loadDocs();
      const updated = await fetchDocumentDetail(docId);
      if (updated) setSelectedDoc(updated);
    } catch (err) {
      alert('Revision upload failed: ' + err.message);
    } finally {
      setRevisionLoading(false);
    }
  };

  const filtered = documents.filter(d =>
    (d.title || '').toLowerCase().includes(search.toLowerCase()) || 
    (d.documentId || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page">
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1>Documents</h1>
            <p>Secure document management with SHA-256 proof and Merkle anchoring</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowUpload(true)}>
            <Upload size={16} /> Upload Document
          </button>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 'var(--space-lg)', padding: 'var(--space-md)' }}>
        <div className="search-input-wrap">
          <Search size={16} className="search-icon" />
          <input 
            className="input search-input" 
            placeholder="Search documents..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
          />
        </div>
      </div>

      <div className="table-container card" style={{ padding: 0 }}>
        <table className="table">
          <thead>
            <tr>
              <th>Document ID</th>
              <th>Title</th>
              <th>Version</th>
              <th>SHA-256</th>
              <th>TX Hash</th>
              <th>Status</th>
              <th>Owner</th>
              <th>Updated</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(doc => (
              <tr key={doc.documentId} style={{ cursor: 'pointer' }} onClick={() => handleDocClick(doc)}>
                <td className="font-mono text-sm" style={{ color: 'var(--color-action)', fontWeight: 600 }}>{doc.documentId}</td>
                <td style={{ fontWeight: 500 }}>{doc.title}</td>
                <td><span className="badge badge-info">V{doc.latestVersion}</span></td>
                <td className="font-mono text-xs">{truncateHash(doc.hash)}</td>
                <td className="font-mono text-xs">
                  {doc.txHash && typeof doc.txHash === 'string' && doc.txHash.length === 66 && doc.txHash.startsWith('0x') ? (
                    <a 
                      href={`https://amoy.polygonscan.com/tx/${doc.txHash}`} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="flex items-center gap-xs text-action"
                      onClick={e => e.stopPropagation()}
                      title={`View on Polygonscan: ${doc.txHash}`}
                    >
                      {doc.txHash.slice(0, 8)}... <ExternalLink size={10} />
                    </a>
                  ) : (
                    <span className="text-tertiary font-mono">—</span>
                  )}
                </td>
                <td><span className={`badge badge-${getStatusColor(doc.status)}`}>{doc.status}</span></td>
                <td className="text-sm">{doc.owner}</td>
                <td className="text-sm text-secondary">{formatDate(doc.updatedAt)}</td>
                <td onClick={e => e.stopPropagation()} style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                  <button 
                    className="btn btn-ghost btn-xs" 
                    title="Download Document"
                    onClick={() => handleDownload(doc.documentId, doc.latestVersion)}
                    style={{ padding: '4px 6px', marginRight: 4 }}
                  >
                    <Download size={14} />
                  </button>
                  <ChevronRight size={16} className="text-tertiary" style={{ display: 'inline', verticalAlign: 'middle' }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <EmptyState 
            icon={FileText} 
            message="No documents uploaded" 
            description="Upload a document to anchor it on the blockchain." 
          />
        )}
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="modal-overlay" onClick={() => setShowUpload(false)}>
          <div className="modal-content card animate-fade-scale" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-lg)' }}>
              <h3>Upload Confidential Document</h3>
              <button className="btn-icon btn-ghost" onClick={() => setShowUpload(false)}><X size={18} /></button>
            </div>

            {uploadError && (
              <div className="flex items-center gap-sm p-3 rounded text-sm mb-3" style={{ background: '#FEE2E2', color: '#991B1B' }}>
                <AlertCircle size={16} /> {uploadError}
              </div>
            )}
            {uploadSuccess && (
              <div className="flex items-center gap-sm p-3 rounded text-sm mb-3" style={{ background: '#D1FAE5', color: '#065F46' }}>
                <CheckCircle2 size={16} /> {uploadSuccess}
              </div>
            )}

            <div style={{ marginBottom: 'var(--space-md)' }}>
              <label className="text-xs text-secondary mb-1 block">Document Title</label>
              <input 
                className="input w-full" 
                placeholder="e.g. Master Operational Lease Agreement" 
                value={uploadTitle} 
                onChange={e => setUploadTitle(e.target.value)} 
              />
            </div>

            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              onChange={handleFileChange} 
            />

            <div
              className={`upload-zone ${dragOver ? 'upload-zone-active' : ''}`}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{ cursor: 'pointer' }}
            >
              <Upload size={32} style={{ color: 'var(--color-accent-medium)', marginBottom: 'var(--space-md)' }} />
              <p style={{ fontWeight: 500, marginBottom: 4 }}>
                {selectedFile ? selectedFile.name : 'Drop file here or click to browse'}
              </p>
              <p className="text-sm text-tertiary">
                {selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : 'Zero bytes on-chain • MinIO Storage • Streaming SHA-256'}
              </p>
            </div>

            <div className="upload-info">
              <div className="flex items-center gap-sm"><Hash size={14} /><span>SHA-256 computed on upload</span></div>
              <div className="flex items-center gap-sm"><Clock size={14} /><span>Async: OCR → Merkle → Polygon</span></div>
            </div>

            <button 
              className="btn btn-primary w-full" 
              style={{ marginTop: 'var(--space-md)' }} 
              onClick={handleUpload}
              disabled={uploadLoading || !selectedFile}
            >
              {uploadLoading ? <><Loader2 size={16} className="spin" /> Uploading...</> : 'Upload & Anchor'}
            </button>
          </div>
        </div>
      )}

      {/* Document Detail Panel */}
      {selectedDoc && (
        <div className="modal-overlay" onClick={() => setSelectedDoc(null)}>
          <div className="doc-detail-panel card animate-fade-scale" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-lg)' }}>
              <div>
                <span className="font-mono text-action" style={{ fontWeight: 600 }}>{selectedDoc.documentId}</span>
                <h3>{selectedDoc.title}</h3>
              </div>
              <button className="btn-icon btn-ghost" onClick={() => setSelectedDoc(null)}><X size={18} /></button>
            </div>

            <div className="grid-2" style={{ marginBottom: 'var(--space-lg)' }}>
              <div className="detail-field"><span className="text-xs text-tertiary">Latest Version</span><span className="badge badge-info">V{selectedDoc.latestVersion}</span></div>
              <div className="detail-field"><span className="text-xs text-tertiary">Status</span><span className={`badge badge-${getStatusColor(selectedDoc.status)}`}>{selectedDoc.status}</span></div>
              <div className="detail-field"><span className="text-xs text-tertiary">Owner</span><span className="text-sm">{selectedDoc.owner}</span></div>
              <div className="detail-field"><span className="text-xs text-tertiary">Created</span><span className="text-sm">{formatDate(selectedDoc.createdAt || selectedDoc.updatedAt)}</span></div>
            </div>

            <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-md)' }}>
              <h4>Version Timeline</h4>
              <div>
                <label className="btn btn-ghost btn-sm" style={{ cursor: 'pointer' }}>
                  <Plus size={14} /> Add Revision
                  <input 
                    type="file" 
                    style={{ display: 'none' }} 
                    onChange={e => {
                      if (e.target.files && e.target.files[0]) {
                        setRevisionFile(e.target.files[0]);
                        handleAddRevision(selectedDoc.documentId);
                      }
                    }} 
                  />
                </label>
              </div>
            </div>

            <div className="version-timeline">
              {(selectedDoc.versions && selectedDoc.versions.length > 0 ? selectedDoc.versions : mockVersions).map((v, i) => (
                <div key={v.version_id || v.versionId || i} className="version-item">
                  <div className="version-dot-line">
                    <div className={`version-dot ${i === 0 ? 'version-dot-latest' : ''}`} />
                    <div className="version-line" />
                  </div>
                  <div className="version-content card" style={{ padding: 'var(--space-md)' }}>
                    <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-xs)' }}>
                      <span className="badge badge-info">V{v.seq || v.versionId || (i + 1)}</span>
                      <div className="flex items-center gap-sm">
                        <span className={`badge badge-${getStatusColor(v.state || v.status || 'VERIFIABLE')}`}>{v.state || v.status || 'VERIFIABLE'}</span>
                        <button 
                          className="btn btn-ghost btn-xs" 
                          title="Download Document Version"
                          onClick={() => handleDownload(selectedDoc.documentId, v.version_id || v.versionId || v.seq)}
                        >
                          <Download size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="text-xs text-secondary" style={{ marginBottom: 4 }}>
                      <span className="font-mono">SHA-256: {v.sha256 || v.hash}</span>
                    </div>
                    <div className="text-xs text-secondary">
                      Merkle Root: <span className="font-mono">{truncateHash(v.merkleRoot || '0x6e2a9b...')}</span> • Batch: <span className="font-mono">{v.batch_id || 'Active'}</span>
                    </div>
                    {(v.txHash || selectedDoc.txHash) && typeof (v.txHash || selectedDoc.txHash) === 'string' && (v.txHash || selectedDoc.txHash).length === 66 && (
                      <div className="text-xs" style={{ marginTop: 4 }}>
                        <a 
                          href={`https://amoy.polygonscan.com/tx/${v.txHash || selectedDoc.txHash}`} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="flex items-center gap-xs text-action font-mono"
                          title="View on Polygonscan"
                        >
                          TX: {(v.txHash || selectedDoc.txHash).slice(0, 12)}...{(v.txHash || selectedDoc.txHash).slice(-6)} <ExternalLink size={11} />
                        </a>
                      </div>
                    )}
                    <div className="text-xs text-tertiary" style={{ marginTop: 4 }}>{formatDate(v.created_at || v.anchoredAt || Date.now())}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Action Footer for Document & Verification Certificate Download */}
            <div 
              className="card" 
              style={{ 
                marginTop: 'var(--space-lg)', 
                padding: 'var(--space-md)', 
                background: '#0B132B', 
                border: '1px solid #1E293B', 
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 'var(--space-md)'
              }}
            >
              <div>
                <div className="text-xs text-tertiary">CONFIDENTIAL ASSET DOCUMENT</div>
                <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#F8FAFC' }}>{selectedDoc.title}</div>
                <div className="text-xs text-secondary font-mono">
                  {selectedDoc.fileName || `${selectedDoc.title}.pdf`} • SHA-256: {truncateHash(selectedDoc.hash)}
                </div>
              </div>

              <div className="flex items-center gap-sm">
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => downloadProofCertificate(selectedDoc)}
                  title="Download verifiable cryptographic JSON anchor certificate"
                  style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <FileText size={14} /> Download Certificate
                </button>
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => handleDownload(selectedDoc.documentId, selectedDoc.latestVersion)}
                  title="Download confidential document file"
                  style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <Download size={14} /> Download Document
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
