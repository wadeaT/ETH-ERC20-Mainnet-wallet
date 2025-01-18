// src/app/mainnet/page.js
'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { TokenPriceGrid } from '@/components/TokenPriceGrid';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Button } from '@/components/ui/Button';
import { CommonHeader } from '@/components/layout/CommonHeader';
import Link from 'next/link';

const queryClient = new QueryClient();

export default function MainnetPage() {
  const [isConnected, setIsConnected] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <main className="min-h-screen bg-background text-foreground">
        {/* Landing Section */}
        <section className="min-h-screen flex flex-col items-center justify-center px-4 relative">
          {/* Replace header with CommonHeader */}
          <CommonHeader showBackButton={false} />

          {/* Landing Content */}
          <div className="text-center space-y-6">
            <h2 className="text-4xl font-bold mb-4">
              Connect your wallet to view your assets
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Connect your wallet to see your ETH and token balances
            </p>
            <Button
              variant="primary"
              size="lg"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => setIsConnected(true)}
            >
              Connect Wallet
            </Button>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 14l-7 7m0 0l-7-7m7 7V3" 
              />
            </svg>
          </div>
        </section>

        {/* Mainnet Section */}
        <section className="min-h-screen px-4 py-16">
          {isConnected ? (
            <div className="space-y-6 max-w-7xl mx-auto">
              {/* Balance Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-card/50 backdrop-blur-sm p-4">
                  <h3 className="text-muted-foreground text-sm">Total Balance</h3>
                  <p className="text-2xl font-bold text-foreground">$0.00</p>
                  <p className="text-sm text-green-400">+0.00%</p>
                </Card>
                
                <Card className="bg-card/50 backdrop-blur-sm p-4">
                  <h3 className="text-muted-foreground text-sm">ETH Balance</h3>
                  <p className="text-2xl font-bold text-foreground">0.00 ETH</p>
                  <p className="text-sm text-foreground">$0.00</p>
                </Card>
                
                <Card className="bg-card/50 backdrop-blur-sm p-4">
                  <h3 className="text-muted-foreground text-sm">Token Balance</h3>
                  <p className="text-2xl font-bold text-foreground">0 Tokens</p>
                  <p className="text-sm text-foreground">$0.00</p>
                </Card>
                
                <Card className="bg-card/50 backdrop-blur-sm p-4">
                  <h3 className="text-muted-foreground text-sm">Gas Price</h3>
                  <p className="text-2xl font-bold text-foreground">0 Gwei</p>
                  <p className="text-sm text-foreground">≈ $0.00 / transfer</p>
                </Card>
              </div>

              {/* Token List */}
              <Card className="bg-card/50 backdrop-blur-sm">
                <TokenPriceGrid />
              </Card>
            </div>
          ) : (
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Connect your wallet to view your assets
              </h2>
              <p className="text-muted-foreground mb-8">
                Connect your wallet to see your ETH and token balances
              </p>
              <Button
                variant="primary"
                size="lg"
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => setIsConnected(true)}
              >
                Connect Wallet
              </Button>
            </div>
          )}
        </section>
      </main>
    </QueryClientProvider>
  );
}