// src/components/home/TokenSection.js
'use client';

import { TokenDisplay } from '@/components/token/TokenDisplay';

export function TokenSection() {
  return (
    <div className="container mx-auto px-4 py-20">
      <h2 className="text-2xl font-bold text-center mb-6">
        Live Token Prices
      </h2>
      <TokenDisplay />
    </div>
  );
}