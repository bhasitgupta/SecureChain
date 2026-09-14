'use client';

import { useState } from 'react';
import { apiFetch } from '@/lib/api';
import { Key, Shield, AlertCircle, Check, Search } from 'lucide-react';

export default function RolesPage() {
  const [queryAddress, setQueryAddress] = useState('');
  const [roleStatus, setRoleStatus] = useState<any>(null);
  const [checking, setChecking] = useState(false);

  // Form states
  const [targetAccount, setTargetAccount] = useState('');
  const [selectedRole, setSelectedRole] = useState<'ADMIN_ROLE' | 'MANAGER_ROLE' | 'AUDITOR_ROLE' | 'USER_ROLE'>('USER_ROLE');
  const [actionLoading, setActionLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const checkRoles = async (addr: string) => {
    if (!addr) return;
    setChecking(true);
    try {
      const data = await apiFetch(`/roles/${addr}`);
      setRoleStatus(data.roles);
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message });
    } finally {
      setChecking(false);
    }
  };

  const handleGrant = async () => {
    if (!targetAccount) return;
    setActionLoading(true);
    setStatusMsg(null);
    try {
      const res = await apiFetch('/roles/grant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: selectedRole, account: targetAccount }),
      });
      setStatusMsg({ type: 'success', text: `Granted ${selectedRole} to ${targetAccount} (Tx: ${res.txHash || 'local'})` });
      checkRoles(targetAccount);
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  const handleRevoke = async () => {
    if (!targetAccount) return;
    setActionLoading(true);
    setStatusMsg(null);
    try {
      const res = await apiFetch('/roles/revoke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: selectedRole, account: targetAccount }),
      });
      setStatusMsg({ type: 'success', text: `Revoked ${selectedRole} from ${targetAccount} (Tx: ${res.txHash || 'local'})` });
      checkRoles(targetAccount);
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Key className="w-6 h-6 text-blue-400" /> Role-Based Access Control (RBAC)
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Smart-contract enforced authorization matrix. Invariant: Only ADMIN principals can mint NFTs and perform initial allocations.
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

      {/* Query Role Status */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
          <Search className="w-4 h-4 text-blue-400" /> Inspect Account Permissions
        </h2>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Enter EVM Address (0x...)"
            value={queryAddress}
            onChange={(e) => setQueryAddress(e.target.value)}
            className="flex-1 bg-gray-900 border border-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
          />
          <button
            onClick={() => checkRoles(queryAddress)}
            disabled={checking || !queryAddress}
            className="bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium px-4 py-2 rounded-lg border border-border transition disabled:opacity-50"
          >
            {checking ? 'Checking...' : 'Check Roles'}
          </button>
        </div>

        {roleStatus && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-border">
            {Object.entries(roleStatus).map(([role, held]: any) => (
              <div
                key={role}
                className={`p-3 rounded-lg border text-center ${
                  held
                    ? 'bg-emerald-950/40 border-emerald-700/60 text-emerald-400'
                    : 'bg-gray-900/40 border-border text-gray-500'
                }`}
              >
                <div className="text-xs font-mono">{role.replace('_ROLE', '')}</div>
                <div className="text-sm font-bold mt-1">{held ? 'GRANTED' : 'NO'}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Grant / Revoke Actions */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <Shield className="w-4 h-4 text-blue-400" /> Role Administration (Admin Only)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Target Account</label>
            <input
              type="text"
              placeholder="0x..."
              value={targetAccount}
              onChange={(e) => setTargetAccount(e.target.value)}
              className="w-full bg-gray-900 border border-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Select Role</label>
            <select
              value={selectedRole}
              onChange={(e: any) => setSelectedRole(e.target.value)}
              className="w-full bg-gray-900 border border-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
            >
              <option value="USER_ROLE">USER_ROLE (Operational Access)</option>
              <option value="MANAGER_ROLE">MANAGER_ROLE (Transfer & Audit)</option>
              <option value="AUDITOR_ROLE">AUDITOR_ROLE (Read/Audit Only)</option>
              <option value="ADMIN_ROLE">ADMIN_ROLE (Root Mint/Allocation)</option>
            </select>
          </div>

          <div className="flex items-end gap-2">
            <button
              onClick={handleGrant}
              disabled={actionLoading || !targetAccount}
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm py-2 rounded-lg transition disabled:opacity-50"
            >
              Grant Role
            </button>
            <button
              onClick={handleRevoke}
              disabled={actionLoading || !targetAccount}
              className="flex-1 bg-rose-700 hover:bg-rose-600 text-white font-medium text-sm py-2 rounded-lg transition disabled:opacity-50"
            >
              Revoke Role
            </button>
          </div>
        </div>
      </div>

      {/* Permission Matrix Table */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-base font-semibold text-white mb-4">Baseline SIH26125 Permission Matrix</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border border-border">
            <thead className="bg-gray-900 text-gray-400 text-xs border-b border-border">
              <tr>
                <th className="p-3">Capability</th>
                <th className="p-3 text-center">ADMIN</th>
                <th className="p-3 text-center">MANAGER</th>
                <th className="p-3 text-center">AUDITOR</th>
                <th className="p-3 text-center">USER</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-xs">
              <tr>
                <td className="p-3 font-medium text-white">Identity Administration</td>
                <td className="p-3 text-center text-emerald-400 font-bold">✓</td>
                <td className="p-3 text-center text-rose-500">✗</td>
                <td className="p-3 text-center text-rose-500">✗</td>
                <td className="p-3 text-center text-rose-500">✗</td>
              </tr>
              <tr>
                <td className="p-3 font-medium text-white">NFT Asset Minting</td>
                <td className="p-3 text-center text-emerald-400 font-bold">✓</td>
                <td className="p-3 text-center text-rose-500">✗</td>
                <td className="p-3 text-center text-rose-500">✗</td>
                <td className="p-3 text-center text-rose-500">✗</td>
              </tr>
              <tr>
                <td className="p-3 font-medium text-white">Initial Asset Allocation</td>
                <td className="p-3 text-center text-emerald-400 font-bold">✓</td>
                <td className="p-3 text-center text-rose-500">✗</td>
                <td className="p-3 text-center text-rose-500">✗</td>
                <td className="p-3 text-center text-rose-500">✗</td>
              </tr>
              <tr>
                <td className="p-3 font-medium text-white">Operational Transfer</td>
                <td className="p-3 text-center text-blue-400">Policy</td>
                <td className="p-3 text-center text-blue-400">Policy</td>
                <td className="p-3 text-center text-rose-500">✗</td>
                <td className="p-3 text-center text-blue-400">Policy</td>
              </tr>
              <tr>
                <td className="p-3 font-medium text-white">Audit & Evidence Viewing</td>
                <td className="p-3 text-center text-emerald-400 font-bold">✓</td>
                <td className="p-3 text-center text-emerald-400 font-bold">✓</td>
                <td className="p-3 text-center text-emerald-400 font-bold">✓</td>
                <td className="p-3 text-center text-blue-400">Policy</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
