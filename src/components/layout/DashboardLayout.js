// src/components/layout/DashboardLayout.js
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Home, Send, Inbox, Repeat, History, Settings, LogOut } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

const NAV_ITEMS = [
  { name: 'Overview', path: '/dashboard', icon: Home },
  { name: 'Send', path: '/dashboard/send', icon: Send },
  { name: 'Receive', path: '/dashboard/receive', icon: Inbox },
  { name: 'Swap', path: '/dashboard/swap', icon: Repeat },
  { name: 'History', path: '/dashboard/history', icon: History },
  { name: 'Settings', path: '/dashboard/settings', icon: Settings }
];

function NavLink({ item, isActive }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.path}
      className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
        isActive 
          ? 'bg-primary text-primary-foreground' 
          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
      }`}
    >
      <Icon size={20} />
      <span className="hidden md:inline">{item.name}</span>
    </Link>
  );
}

export function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.clear();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar - Collapses to top bar on mobile */}
      <div className="fixed bottom-0 left-0 right-0 md:relative md:w-64 border-t md:border-t-0 md:border-r border-border bg-background z-50">
        {/* Logo - Hidden on mobile */}
        <div className="hidden md:flex items-center gap-2 p-4 border-b border-border">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-primary-foreground">Ξ</span>
          </div>
          <span className="font-bold text-foreground">ETH Wallet Hub</span>
        </div>

        {/* Navigation */}
        <nav className="flex md:flex-col p-2 md:p-4 gap-1 overflow-x-auto md:overflow-x-visible">
          {NAV_ITEMS.map(item => (
            <NavLink 
              key={item.path} 
              item={item} 
              isActive={pathname === item.path}
            />
          ))}
        </nav>

        {/* Footer - Hidden on mobile */}
        <div className="hidden md:block p-4 border-t border-border mt-auto">
          <div className="flex items-center justify-between mb-4">
            <span className="text-muted-foreground">Theme</span>
            <ThemeToggle />
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 pb-20 md:pb-0">
        <main className="p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}