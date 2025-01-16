'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Home, Send, Inbox, Repeat, History, Settings, LogOut } from 'lucide-react';

export function DashboardLayout({ children }) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Overview', path: '/dashboard', icon: Home },
    { name: 'Send', path: '/dashboard/send', icon: Send },
    { name: 'Receive', path: '/dashboard/receive', icon: Inbox },
    { name: 'Swap', path: '/dashboard/swap', icon: Repeat },
    { name: 'History', path: '/dashboard/history', icon: History },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#0B1120] flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-800 hidden md:flex flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-gray-800">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white">Ξ</span>
            </div>
            <span className="text-xl font-bold text-white">ETH Wallet Hub</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <Link href={item.path}>
                    <div
                      className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                        pathname === item.path
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                      }`}
                    >
                      <Icon size={20} />
                      <span>{item.name}</span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-800">
          <button className="flex items-center gap-3 text-gray-400 hover:text-white w-full px-4 py-2 rounded-lg transition-colors hover:bg-gray-800">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-[#0B1120] border-b border-gray-800 z-50">
        <div className="flex items-center justify-between p-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white">Ξ</span>
            </div>
            <span className="text-xl font-bold text-white">ETH Wallet Hub</span>
          </Link>
          <Button variant="ghost" size="sm">
            <LogOut size={20} className="text-gray-400" />
          </Button>
        </div>
        
        {/* Mobile Navigation */}
        <nav className="p-2 overflow-x-auto flex space-x-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.path} href={item.path}>
                <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap ${
                    pathname === item.path
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 min-h-screen pt-[120px] md:pt-0">
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}