// src/app/page.js
'use client';

import { Header } from '@/components/layout/Header';
import { Hero } from '@/components/home/Hero';
import { WalletActions } from '@/components/home/WalletActions';
import dynamic from 'next/dynamic';

// Dynamically import TokenDisplay with no SSR
const TokenDisplay = dynamic(() => import('@/components/token/TokenDisplay'), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="bg-background text-foreground min-h-screen">
      <section className="min-h-screen relative flex flex-col items-center justify-center px-4">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 right-0 w-72 sm:w-96 h-72 sm:h-96 bg-primary rounded-full filter blur-3xl opacity-10" />
          <div className="absolute top-1/2 left-0 w-72 sm:w-96 h-72 sm:h-96 bg-primary rounded-full filter blur-3xl opacity-10" />
        </div>
        
        <Header />
        
        <div className="relative z-10 w-full max-w-7xl mx-auto">
          <Hero />
          <WalletActions />

          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-xl sm:text-2xl font-bold text-center mb-6">
              Live Token Prices
            </h2>
            <TokenDisplay />
          </div>
        </div>
      </section>
    </main>
  );
}