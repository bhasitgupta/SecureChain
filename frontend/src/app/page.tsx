'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { Shield, FileCheck, Users, Box, Key, CheckCircle, ArrowRight, Server, Database } from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState<any>({
    identitiesCount: 0,
    documentsCount: 0,
    versionsCount: 0,
    batchesCount: 0,
    assetsCount: 0,
    anchoredBatchesCount: 0,
    verifiableVersionsCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/audit/stats')
      .then((data) => setStats(data))
      .catch((err) => console.error('Failed to load stats:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/20 border border-blue-800/40 rounded-2xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-blue-400">
              SIH-26125 Enterprise Trust Architecture
            </span>
            <h1 className="text-2xl md:text-3xl font-bold text-white mt-1">
              Defence-Grade Identity & Document Integrity Platform
            </h1>
            <p className="text-gray-400 text-sm mt-2 max-w-2xl">
              Real decentralized identity (DID), RBAC permissions, ERC-721 enterprise asset NFTs with thumbnail management, 
              confidential MinIO storage, streaming SHA-256 digests, Merkle tree batching, and Polygon Amoy anchoring.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/documents"
              className="bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm px-4 py-2.5 rounded-xl shadow transition flex items-center gap-1.5"
            >
              Upload Document <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/verify"
              className="bg-card hover:bg-gray-800 text-gray-200 border border-border font-medium text-sm px-4 py-2.5 rounded-xl transition flex items-center gap-1.5"
            >
              Verify Evidence
            </Link>
          </div>
        </div>
      </div>

      {/* System Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400">Identities (DID)</span>
            <Users className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">
            {loading ? '...' : stats.identitiesCount}
          </div>
          <div className="text-xs text-gray-500 mt-1">On-chain DID bindings</div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400">Enterprise Assets</span>
            <Box className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">
            {loading ? '...' : stats.assetsCount}
          </div>
          <div className="text-xs text-gray-500 mt-1">NFTs with Thumbnails</div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400">Confidential Docs</span>
            <FileCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">
            {loading ? '...' : stats.documentsCount}
          </div>
          <div className="text-xs text-gray-500 mt-1">{stats.versionsCount} immutable versions</div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400">Anchored Batches</span>
            <Shield className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">
            {loading ? '...' : stats.anchoredBatchesCount}
          </div>
          <div className="text-xs text-gray-500 mt-1">{stats.verifiableVersionsCount} verifiable docs</div>
        </div>
      </div>

      {/* Architecture Planes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center space-x-2 text-blue-400">
            <Server className="w-5 h-5" />
            <h3 className="font-semibold text-white">Trust / Blockchain Plane</h3>
          </div>
          <p className="text-xs text-gray-400 mt-2 leading-relaxed">
            Polygon Amoy smart contracts enforce root identities, role matrices, NFT asset issuance, and Merkle root anchors. Zero confidential bytes on-chain.
          </p>
          <div className="mt-4 pt-4 border-t border-border flex flex-col space-y-2 text-xs text-gray-300">
            <div className="flex justify-between">
              <span>Chain:</span>
              <span className="font-mono text-blue-400">Polygon Amoy (80002)</span>
            </div>
            <div className="flex justify-between">
              <span>Merkle Batches:</span>
              <span>{stats.batchesCount} generated</span>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center space-x-2 text-purple-400">
            <Database className="w-5 h-5" />
            <h3 className="font-semibold text-white">Confidential Data Plane</h3>
          </div>
          <p className="text-xs text-gray-400 mt-2 leading-relaxed">
            MinIO object store hosts raw encrypted documents and asset thumbnails. PostgreSQL maintains insert-only immutable versions and transactional outbox.
          </p>
          <div className="mt-4 pt-4 border-t border-border flex flex-col space-y-2 text-xs text-gray-300">
            <div className="flex justify-between">
              <span>Storage:</span>
              <span className="font-mono text-emerald-400">MinIO (Versioned)</span>
            </div>
            <div className="flex justify-between">
              <span>Database:</span>
              <span className="font-mono text-emerald-400">PostgreSQL 16</span>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center space-x-2 text-emerald-400">
            <CheckCircle className="w-5 h-5" />
            <h3 className="font-semibold text-white">Independent Verifier</h3>
          </div>
          <p className="text-xs text-gray-400 mt-2 leading-relaxed">
            4-step cryptographic pipeline: Object Retrieved → SHA-256 Match → Merkle Inclusion → Polygon Anchor Match.
          </p>
          <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
            <span className="text-xs text-gray-400">Audit Status:</span>
            <span className="text-xs bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded font-medium">
              Active Verifier
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
