// src/components/layout/dashboard/MobileHeader.js
import Link from 'next/link';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { NavItem } from './NavItem';
import { Logo } from '@/components/common/Logo';

export const MobileHeader = ({ navItems, pathname, onLogout }) => (
  <div className="md:hidden fixed top-0 left-0 right-0 bg-background border-b border-border z-50">
    <div className="flex items-center justify-between p-4">
      <Logo />
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Button variant="ghost" size="sm" onClick={onLogout}>
          <LogOut size={20} className="text-muted-foreground hover:text-foreground" />
        </Button>
      </div>
    </div>
    
    <nav className="p-2 overflow-x-auto flex space-x-2">
      {navItems.map(item => (
        <NavItem 
          key={item.path} 
          item={item} 
          isActive={pathname === item.path} 
          isMobile={true}
        />
      ))}
    </nav>
  </div>
);