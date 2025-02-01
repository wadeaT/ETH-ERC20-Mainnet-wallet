// src/components/common/Logo.js
import Link from 'next/link';

export const Logo = ({ href = '/dashboard' }) => (
  <Link href={href} className="flex items-center gap-2">
    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
      <span className="text-primary-foreground">Ξ</span>
    </div>
    <span className="text-xl font-bold text-foreground">ETH Wallet Hub</span>
  </Link>
);