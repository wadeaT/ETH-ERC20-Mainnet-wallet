// src/components/layout/CommonHeader.js
'use client';

import Link from 'next/link';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export function CommonHeader({ showBackButton = true }) {
  return (
    <header className="flex items-center justify-between p-4 mb-8">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
          <span className="text-white">Ξ</span>
        </div>
        <h1 className="text-xl font-bold text-foreground">ETH Wallet Hub</h1>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        {showBackButton && (
          <Link href="/" className="text-muted-foreground hover:text-foreground">
            ← Back
          </Link>
        )}
      </div>
    </header>
  );
}