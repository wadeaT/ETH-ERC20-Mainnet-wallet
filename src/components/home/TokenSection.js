// src/components/home/TokenSection.js
'use client';

import dynamic from 'next/dynamic';

const TokenDisplay = dynamic(() => import('@/components/token/TokenDisplay'), {
  ssr: false,
});

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