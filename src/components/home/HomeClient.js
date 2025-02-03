// src/components/home/HomeClient.js
'use client';

import { Hero } from './Hero';
import { WalletActions } from './WalletActions';
import { TokenSection } from './TokenSection';
import { FeaturesSection } from './FeaturesSection';

export function HomeClient() {
  return (
    <>
      <div className="container mx-auto px-4">
        <Hero />
        <WalletActions />
      </div>

      {/* Live Token Prices Section */}
      <section className="py-20">
        <TokenSection />
      </section>

      {/* Features Section */}
      <FeaturesSection />
    </>
  );
}