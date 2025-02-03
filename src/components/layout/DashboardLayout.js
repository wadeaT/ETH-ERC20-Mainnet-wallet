// src/components/layout/DashboardLayout.js
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Home, Send, Inbox, Repeat, History, LogOut } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

const NAV_ITEMS = [
  { name: 'Overview', path: '/dashboard', icon: Home },
  { name: 'Send', path: '/dashboard/send', icon: Send },
  { name: 'Receive', path: '/dashboard/receive', icon: Inbox },
  { name: 'Swap', path: '/dashboard/swap', icon: Repeat },
  { name: 'History', path: '/dashboard/history', icon: History }
];

function NavLink({ item, isActive, onClick }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.path}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
        isActive 
          ? 'bg-primary text-primary-foreground' 
          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
      }`}
    >
      <Icon size={20} />
      <span className="md:inline">{item.name}</span>
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
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 border-r border-border bg-background">
        {/* Logo */}
        <div className="flex items-center gap-2 p-4 border-b border-border">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-primary-foreground">Ξ</span>
          </div>
          <span className="font-bold text-foreground">ETH Wallet Hub</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="flex-1 flex flex-col p-4 gap-1">
          {NAV_ITEMS.map(item => (
            <NavLink 
              key={item.path} 
              item={item} 
              isActive={pathname === item.path}
            />
          ))}
        </nav>

        {/* Desktop Footer */}
        <div className="p-4 border-t border-border">
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
      </aside>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-background border-t border-border z-50">
        <nav className="flex items-center justify-around p-2">
          {NAV_ITEMS.map(item => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex flex-col items-center p-2 rounded-lg ${
                pathname === item.path 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <item.icon size={20} />
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <main className="md:pl-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
          <div className="max-w-[1200px] mx-auto">
            {/* Mobile Header */}
            <div className="flex items-center justify-between mb-6 md:hidden">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground">Ξ</span>
                </div>
                <span className="font-bold text-foreground">ETH Wallet Hub</span>
              </div>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <button
                  onClick={handleLogout}
                  className="p-2 text-muted-foreground hover:text-foreground"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </div>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}