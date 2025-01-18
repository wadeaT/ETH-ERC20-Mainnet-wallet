// src/components/layout/DashboardLayout.js
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Home, Send, Inbox, Repeat, History, Settings, LogOut } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

export function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { name: 'Overview', path: '/dashboard', icon: Home },
    { name: 'Send', path: '/dashboard/send', icon: Send },
    { name: 'Receive', path: '/dashboard/receive', icon: Inbox },
    { name: 'Swap', path: '/dashboard/swap', icon: Repeat },
    { name: 'History', path: '/dashboard/history', icon: History },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      // Sign out from Firebase
      await signOut(auth);
      
      // Clear local storage
      window.localStorage.removeItem('walletAddress');
      window.localStorage.removeItem('privateKey');
      window.localStorage.removeItem('username');
      
      // Redirect to home page
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border hidden md:flex flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-border">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground">Ξ</span>
            </div>
            <span className="text-xl font-bold text-foreground">ETH Wallet Hub</span>
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
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
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

        {/* Bottom Actions */}
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
      <div className="md:hidden fixed top-0 left-0 right-0 bg-background border-b border-border z-50">
        <div className="flex items-center justify-between p-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground">Ξ</span>
            </div>
            <span className="text-xl font-bold text-foreground">ETH Wallet Hub</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleLogout}
            >
              <LogOut size={20} className="text-muted-foreground hover:text-foreground" />
            </Button>
          </div>
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
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
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