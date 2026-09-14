'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { Shield, CheckCircle2, XCircle, Search, FileCheck, Layers, Link as LinkIcon, AlertTriangle } from 'lucide-react';

function VerifyContent() {
  const searchParams = useSearchParams();
  const initialVersionId = searchParams.get('versionId') || '';

  const [versionId, setVersionId] = useState(initialVersionId);
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialVersionId) {
      handleVerify(initialVersionId);
    }
  }, [initialVersionId]);

  const handleVerify = async (vid: string) => {
    if (!vid) return;
    setVerifying(true);
    setError(null);
    setResult(null);

    try {
      const data = await apiFetch(`/verify/${vid}`, {
        method: 'POST',
      });
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Shield className="w-6 h-6 text-emerald-400" /> Independent Cryptographic Verifier
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Zero-trust evidence audit: Derives truth strictly from exact object bytes, computed SHA-256, Merkle inclusion proof, and the Polygon Amoy anchor contract.
        </p>
      </div>

      {/* Input Form */}
      <div className="bg-card border border-border rounded-xl p-6">
        <label className="block text-xs font-medium text-gray-300 mb-2">
          Enter Version ID to Audit
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000"
            value={versionId}
            onChange={(e) => setVersionId(e.target.value)}
            className="flex-1 bg-gray-900 border border-border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
          />
          <button
            onClick={() => handleVerify(versionId)}
            disabled={verifying || !versionId}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm px-6 py-2.5 rounded-lg transition disabled:opacity-50 flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            {verifying ? 'Auditing Evidence...' : 'Run Verification'}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-950/60 border border-rose-800/50 text-rose-300 text-sm rounded-xl flex items-center gap-2">
          <XCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Verification Evidence Breakdown */}
      {result && (
        <div className="space-y-6">
          {/* Main Verdict Card */}
          <div
            className={`p-6 rounded-2xl border flex items-center justify-between shadow-xl ${
              result.valid
                ? 'bg-emerald-950/40 border-emerald-600 text-emerald-300'
                : 'bg-rose-950/40 border-rose-600 text-rose-300'
            }`}
          >
            <div className="flex items-center gap-4">
              {result.valid ? (
                <CheckCircle2 className="w-12 h-12 text-emerald-400" />
              ) : (
                <XCircle className="w-12 h-12 text-rose-400" />
              )}
              <div>
                <div className="text-xl font-black tracking-wide">
                  DOCUMENT INTEGRITY: {result.valid ? 'VALID' : 'INVALID'}
                </div>
                <div className="text-xs opacity-80 mt-1 font-mono">
                  Audited Version: {result.versionId} (Document: {result.documentId})
                </div>
              </div>
            </div>

            <div className="text-right hidden sm:block">
              <span
                className={`text-xs font-bold px-3 py-1.5 rounded-full border ${
                  result.valid
                    ? 'bg-emerald-900 border-emerald-500 text-emerald-200'
                    : 'bg-rose-900 border-rose-500 text-rose-200'
                }`}
              >
                {result.valid ? 'ALL 4 STAGES PASSED' : 'VERIFICATION FAILED'}
              </span>
            </div>
          </div>

          {/* 4 Steps Chain */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Step 1: Object Retrieved */}
            <div className="bg-card border border-border rounded-xl p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-400">STAGE 1</span>
                {result.steps.objectRetrieved ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-400" />
                )}
              </div>
              <div className="font-bold text-white text-sm">Object Retrieved</div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Exact binary object streamed from MinIO storage bucket.
              </p>
              <div className="text-xs font-mono text-emerald-400 pt-2">
                {result.steps.objectRetrieved ? '✓ 200 OK' : '✗ Fetch Failed'}
              </div>
            </div>

            {/* Step 2: SHA-256 Match */}
            <div className="bg-card border border-border rounded-xl p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-400">STAGE 2</span>
                {result.steps.sha256Match ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-400" />
                )}
              </div>
              <div className="font-bold text-white text-sm">SHA-256 Match</div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Computed SHA-256 hash matches immutable database record.
              </p>
              <div className="text-xs font-mono text-emerald-400 pt-2 truncate" title={result.details.computedSha256}>
                {result.steps.sha256Match ? '✓ Exact Match' : '✗ Hash Mismatch'}
              </div>
            </div>

            {/* Step 3: Merkle Inclusion */}
            <div className="bg-card border border-border rounded-xl p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-400">STAGE 3</span>
                {result.steps.merkleInclusionMatch ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-400" />
                )}
              </div>
              <div className="font-bold text-white text-sm">Merkle Inclusion</div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Leaf hash inclusion verified through binary path against root.
              </p>
              <div className="text-xs font-mono text-emerald-400 pt-2">
                {result.steps.merkleInclusionMatch ? '✓ Proof Verified' : '✗ Proof Invalid'}
              </div>
            </div>

            {/* Step 4: Polygon Root Match */}
            <div className="bg-card border border-border rounded-xl p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-400">STAGE 4</span>
                {result.steps.polygonAnchorMatch ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-400" />
                )}
              </div>
              <div className="font-bold text-white text-sm">Polygon Anchor</div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Merkle root matches on-chain record in DocumentAnchorRegistry.
              </p>
              <div className="text-xs font-mono text-emerald-400 pt-2">
                {result.steps.polygonAnchorMatch ? '✓ Anchored' : '✗ Unanchored'}
              </div>
            </div>
          </div>

          {/* Cryptographic Preimages & Proof Details */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-semibold text-white">Cryptographic Audit Evidence</h3>
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-gray-900 rounded-lg border border-border">
                <div className="text-gray-500 mb-0.5">Computed SHA-256 Digest:</div>
                <div className="text-emerald-400 break-all">{result.details.computedSha256}</div>
              </div>

              <div className="p-3 bg-gray-900 rounded-lg border border-border">
                <div className="text-gray-500 mb-0.5">Computed Merkle Leaf:</div>
                <div className="text-purple-400 break-all">{result.details.computedLeaf}</div>
              </div>

              <div className="p-3 bg-gray-900 rounded-lg border border-border">
                <div className="text-gray-500 mb-0.5">Merkle Root:</div>
                <div className="text-blue-400 break-all">{result.details.merkleRoot || 'Pending'}</div>
              </div>

              {result.details.anchorTx && (
                <div className="p-3 bg-gray-900 rounded-lg border border-border">
                  <div className="text-gray-500 mb-0.5">Polygon Anchor Transaction:</div>
                  <div className="text-amber-400 break-all">{result.details.anchorTx}</div>
                </div>
              )}

              {result.details.failureReason && (
                <div className="p-3 bg-rose-950/50 rounded-lg border border-rose-800 text-rose-300">
                  <div className="font-bold mb-0.5">Audit Failure Reason:</div>
                  <div>{result.details.failureReason}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="text-gray-500">Loading verifier...</div>}>
      <VerifyContent />
    </Suspense>
  );
}
