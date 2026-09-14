'use client';

import { useState } from 'react';
import { apiFetch } from '@/lib/api';
import { Key, Shield, Check, AlertCircle, Clock, XCircle, CheckCircle2 } from 'lucide-react';

export default function RecoveryPage() {
  const [account, setAccount] = useState('');
  const [recoveryState, setRecoveryState] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  // Form states
  const [timelockSeconds, setTimelockSeconds] = useState(300);
  const [proposedOwner, setProposedOwner] = useState('');

  const fetchRecoveryState = async (addr: string) => {
    if (!addr) return;
    setLoading(true);
    setStatusMsg(null);
    try {
      const data = await apiFetch(`/recovery/${addr}`);
      setRecoveryState(data);
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setStatusMsg(null);
    try {
      const res = await apiFetch('/recovery/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ timelockSeconds }),
      });
      setStatusMsg({ type: 'success', text: `Account registered with ${timelockSeconds}s timelock! (Tx: ${res.txHash || 'local'})` });
      if (account) fetchRecoveryState(account);
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message });
    }
  };

  const handleCancel = async () => {
    if (!account) return;
    setStatusMsg(null);
    try {
      const res = await apiFetch('/recovery/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account }),
      });
      setStatusMsg({ type: 'success', text: `Recovery cancelled by owner veto! (Tx: ${res.txHash || 'local'})` });
      fetchRecoveryState(account);
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message });
    }
  };

  const handleFinalize = async () => {
    if (!account) return;
    setStatusMsg(null);
    try {
      const res = await apiFetch('/recovery/finalize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account }),
      });
      setStatusMsg({ type: 'success', text: `Recovery finalized! Control transferred to proposed owner. (Tx: ${res.txHash || 'local'})` });
      fetchRecoveryState(account);
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Key className="w-6 h-6 text-amber-400" /> Smart Account Recovery (ERC-7947 Model)
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Cryptographic account restoration with approved provider signatures, strict timelock countdown, and owner veto protection. Historical documents and Merkle anchors remain immutable.
        </p>
      </div>

      {statusMsg && (
        <div
          className={`p-4 rounded-xl border text-xs flex items-center gap-2 ${
            statusMsg.type === 'error'
              ? 'bg-rose-950/60 border-rose-800/50 text-rose-300'
              : 'bg-emerald-950/60 border-emerald-800/50 text-emerald-300'
          }`}
        >
          {statusMsg.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <Check className="w-4 h-4" />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Query Status */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-base font-semibold text-white mb-3">Inspect Account Recovery Status</h2>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Enter Smart Account Address (0x...)"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            className="flex-1 bg-gray-900 border border-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 font-mono"
          />
          <button
            onClick={() => fetchRecoveryState(account)}
            disabled={loading || !account}
            className="bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium px-5 py-2 rounded-lg border border-border transition disabled:opacity-50"
          >
            {loading ? 'Checking...' : 'Check Status'}
          </button>
        </div>

        {recoveryState && (
          <div className="mt-4 pt-4 border-t border-border grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div className="bg-gray-900 p-3 rounded-lg border border-border">
              <span className="text-gray-500 block">Current Controller:</span>
              <span className="text-white break-all">{recoveryState.owner}</span>
            </div>
            <div className="bg-gray-900 p-3 rounded-lg border border-border">
              <span className="text-gray-500 block">Pending Proposed Owner:</span>
              <span className="text-amber-400 break-all">{recoveryState.pendingOwner || 'None'}</span>
            </div>
            <div className="bg-gray-900 p-3 rounded-lg border border-border">
              <span className="text-gray-500 block">Timelock State:</span>
              <span className="text-emerald-400 font-bold">{recoveryState.status}</span>
            </div>
          </div>
        )}
      </div>

      {/* Enrollment & Action Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Register Account */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h3 className="font-semibold text-white text-sm flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-400" /> Register Account Timelock
          </h3>
          <p className="text-xs text-gray-400">
            Enrolls the account into the RecoveryManager with a mandatory dispute timelock delay (default 300s / 5 mins for demo).
          </p>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Timelock Window (Seconds)</label>
            <input
              type="number"
              value={timelockSeconds}
              onChange={(e) => setTimelockSeconds(parseInt(e.target.value, 10))}
              className="w-full bg-gray-900 border border-border rounded-lg px-3 py-2 text-sm text-white"
            />
          </div>
          <button
            onClick={handleRegister}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs py-2.5 rounded-lg transition"
          >
            Register Account
          </button>
        </div>

        {/* Veto & Finalize Actions */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h3 className="font-semibold text-white text-sm flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" /> Dispute Resolution Controls
          </h3>
          <p className="text-xs text-gray-400">
            Active owner can cancel erroneous/malicious requests during the timelock window. Finalize transfers access after time expiry.
          </p>
          <div className="grid grid-cols-2 gap-3 pt-4">
            <button
              onClick={handleCancel}
              className="bg-rose-900/60 hover:bg-rose-800/60 border border-rose-700/60 text-rose-300 font-medium text-xs py-2.5 rounded-lg transition flex items-center justify-center gap-1.5"
            >
              <XCircle className="w-4 h-4" /> Owner Veto (Cancel)
            </button>
            <button
              onClick={handleFinalize}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs py-2.5 rounded-lg transition flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" /> Finalize Recovery
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
