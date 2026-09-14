'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { History, Search, RefreshCw, Layers } from 'lucide-react';

export default function AuditPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<string>('');

  const loadEvents = async () => {
    setLoading(true);
    try {
      const endpoint = selectedEvent
        ? `/audit/events?eventName=${selectedEvent}`
        : `/audit/events`;
      const data = await apiFetch(endpoint);
      setEvents(data.events || []);
    } catch (err) {
      console.error('Failed to load audit events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [selectedEvent]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <History className="w-6 h-6 text-blue-400" /> Immutable Audit Trail
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Replayable event indexer capturing on-chain transitions across Identity, RBAC, Asset NFT, and Document Anchor contracts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            className="bg-card border border-border text-xs rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
          >
            <option value="">All Audit Events</option>
            <option value="IdentityRegistered">IdentityRegistered</option>
            <option value="RoleGranted">RoleGranted</option>
            <option value="RoleRevoked">RoleRevoked</option>
            <option value="AssetMinted">AssetMinted</option>
            <option value="AssetAllocated">AssetAllocated</option>
            <option value="AssetTransferAuthorized">AssetTransferAuthorized</option>
            <option value="MerkleRootAnchored">MerkleRootAnchored</option>
            <option value="RecoveryRequested">RecoveryRequested</option>
            <option value="AccessRecovered">AccessRecovered</option>
          </select>

          <button
            onClick={loadEvents}
            className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-200 px-3 py-2 rounded-lg border border-border flex items-center gap-1.5 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-900/80 text-gray-400 text-xs border-b border-border">
              <tr>
                <th className="px-6 py-3 font-medium">Event</th>
                <th className="px-6 py-3 font-medium">Block</th>
                <th className="px-6 py-3 font-medium">Contract</th>
                <th className="px-6 py-3 font-medium">Transaction</th>
                <th className="px-6 py-3 font-medium">Decoded Arguments</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-xs font-mono">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Loading audit events...
                  </td>
                </tr>
              ) : events.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No indexed audit events found. Events populate automatically as contracts emit logs on Polygon Amoy.
                  </td>
                </tr>
              ) : (
                events.map((evt) => (
                  <tr key={evt.id} className="hover:bg-gray-800/30">
                    <td className="px-6 py-4">
                      <span className="bg-blue-950 text-blue-400 border border-blue-800/60 px-2 py-0.5 rounded font-bold">
                        {evt.event_name}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      #{evt.block_number}
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {evt.contract_addr.slice(0, 8)}...{evt.contract_addr.slice(-6)}
                    </td>
                    <td className="px-6 py-4 text-purple-400 truncate max-w-xs">
                      {evt.tx_hash.slice(0, 10)}...{evt.tx_hash.slice(-8)}
                    </td>
                    <td className="px-6 py-4 max-w-md">
                      <pre className="bg-gray-900 p-2 rounded text-[11px] overflow-x-auto text-emerald-300 border border-border">
                        {JSON.stringify(evt.decoded, null, 2)}
                      </pre>
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
