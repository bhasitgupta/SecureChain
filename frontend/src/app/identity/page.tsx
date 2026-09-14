'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { Users, Plus, ShieldCheck, Check, AlertCircle } from 'lucide-react';

export default function IdentityPage() {
  const [identities, setIdentities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [account, setAccount] = useState('');
  const [subjectId, setSubjectId] = useState('');

  const loadIdentities = async () => {
    try {
      const data = await apiFetch('/identity');
      setIdentities(data.identities || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIdentities();
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    try {
      const res = await apiFetch('/identity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account, subjectId }),
      });

      setSuccess(`Identity registered! DID: ${res.did}`);
      setAccount('');
      setSubjectId('');
      loadIdentities();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Users className="w-6 h-6 text-blue-400" /> Decentralized Identity (DID) Registry
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Cryptographic controller association, stable W3C did:pkh identifiers, and zero on-chain sensitive PII.
        </p>
      </div>

      {/* Registration Form */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-blue-400" /> Register Organizational Identity
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-rose-950/60 border border-rose-800/50 text-rose-300 text-xs rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-emerald-950/60 border border-emerald-800/50 text-emerald-300 text-xs rounded-lg flex items-center gap-2">
            <Check className="w-4 h-4" /> {success}
          </div>
        )}

        <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">EVM Controller Account</label>
            <input
              type="text"
              required
              placeholder="0x..."
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              className="w-full bg-gray-900 border border-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Subject ID (Internal Reference)</label>
            <input
              type="text"
              required
              placeholder="e.g. BEL-EMP-4921"
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="w-full bg-gray-900 border border-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm py-2 rounded-lg transition disabled:opacity-50"
            >
              {submitting ? 'Registering on-chain...' : 'Register Identity'}
            </button>
          </div>
        </form>
      </div>

      {/* Identities Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex justify-between items-center">
          <h2 className="text-base font-semibold text-white">Registered Identities</h2>
          <span className="text-xs text-gray-400">{identities.length} total</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-900/60 text-gray-400 text-xs border-b border-border">
              <tr>
                <th className="px-6 py-3 font-medium">DID</th>
                <th className="px-6 py-3 font-medium">Account</th>
                <th className="px-6 py-3 font-medium">Subject ID</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Registered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Loading identities...
                  </td>
                </tr>
              ) : identities.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No identities registered yet.
                  </td>
                </tr>
              ) : (
                identities.map((item) => (
                  <tr key={item.did_hash} className="hover:bg-gray-800/30">
                    <td className="px-6 py-3 font-mono text-xs text-blue-400">
                      {item.did}
                    </td>
                    <td className="px-6 py-3 font-mono text-xs text-gray-300">
                      {item.account}
                    </td>
                    <td className="px-6 py-3 font-medium text-white">
                      {item.subject_id}
                    </td>
                    <td className="px-6 py-3">
                      <span className="inline-flex items-center gap-1 text-xs bg-emerald-950 text-emerald-400 border border-emerald-800/50 px-2 py-0.5 rounded font-medium">
                        <ShieldCheck className="w-3.5 h-3.5" /> {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-xs text-gray-400">
                      {new Date(item.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
