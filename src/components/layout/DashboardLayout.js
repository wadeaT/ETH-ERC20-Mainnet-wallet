// src/components/layout/DashboardLayout.js
'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Home, Send, Inbox, Repeat, History, Settings, LogOut } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { Header } from './Header';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { NavItem } from './dashboard/NavItem';
import { MobileHeader } from './dashboard/MobileHeader';
import { Logo } from '@/components/common/Logo';

const NAV_ITEMS = [
  { name: 'Overview', path: '/dashboard', icon: Home },
  { name: 'Send', path: '/dashboard/send', icon: Send },
  { name: 'Receive', path: '/dashboard/receive', icon: Inbox },
  { name: 'Swap', path: '/dashboard/swap', icon: Repeat },
  { name: 'History', path: '/dashboard/history', icon: History },
  { name: 'Settings', path: '/dashboard/settings', icon: Settings },
];

export function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      ['walletAddress', 'privateKey', 'username'].forEach(key => 
        window.localStorage.removeItem(key)
      );
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="w-64 border-r border-border hidden md:flex flex-col">
        <div className="p-4 border-b border-border">
          <Logo />
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {NAV_ITEMS.map(item => (
              <li key={item.path}>
                <NavItem item={item} isActive={pathname === item.path} />
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-border space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Theme</span>
            <ThemeToggle />
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 text-muted-foreground hover:text-foreground w-full px-4 py-2 rounded-lg transition-colors hover:bg-secondary"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <MobileHeader 
        navItems={NAV_ITEMS}
        pathname={pathname}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main className="flex-1 md:ml-64 min-h-screen pt-[120px] md:pt-0">
        <Header variant="dashboard" />
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}