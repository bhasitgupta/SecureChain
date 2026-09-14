'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useWallet } from '@/context/WalletContext';
import { Shield, FileCheck, Users, Box, Key, History, Activity } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/', icon: Activity },
  { name: 'Identity (DID)', href: '/identity', icon: Users },
  { name: 'RBAC', href: '/roles', icon: Key },
  { name: 'Assets (NFT)', href: '/assets', icon: Box },
  { name: 'Documents', href: '/documents', icon: FileCheck },
  { name: 'Verify', href: '/verify', icon: Shield },
  { name: 'Recovery', href: '/recovery', icon: Key },
  { name: 'Audit', href: '/audit', icon: History },
];

export function Navbar() {
  const pathname = usePathname();
  const { address, isConnected, connect, disconnect } = useWallet();


  return (
    <header className="border-b border-border bg-card/60 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Shield className="w-8 h-8 text-blue-500" />
          <div>
            <span className="font-bold text-lg text-white">SIH26125</span>
            <span className="ml-2 text-xs bg-blue-900/60 text-blue-400 border border-blue-700/50 px-2 py-0.5 rounded font-mono">
              BEL Enterprise
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div>
          {isConnected ? (
            <div className="flex items-center space-x-2">
              <span className="text-xs bg-emerald-950 text-emerald-400 border border-emerald-700/50 px-2.5 py-1 rounded font-mono">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
              <button
                onClick={() => disconnect()}
                className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-2.5 py-1 rounded border border-gray-700"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={() => connect()}
              className="text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-1.5 rounded-lg shadow"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
