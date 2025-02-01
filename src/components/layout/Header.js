// src/components/layout/Header.js
'use client';

import Link from 'next/link';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export function Header({ variant = 'default', showBackButton = false }) {
  return (
    <header className={`w-full px-4 py-3 md:p-4 ${variant === 'default' ? 'absolute top-0 left-0 right-0' : 'mb-8'}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo and Title */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-primary-foreground">Ξ</span>
          </div>
          <h1 className="text-lg md:text-xl font-bold text-foreground hidden xs:block">
            ETH Wallet Hub
          </h1>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          <ThemeToggle />
          {showBackButton && (
            <Link 
              href="/" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="hidden sm:inline">←</span> Back
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}