// src/app/page.js
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { getTokenPrices, SUPPORTED_TOKENS, cleanup } from '@/lib/tokenPrices';

export default function Home() {
  const [prices, setPrices] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const initializePrices = async () => {
      try {
        // Initial price fetch
        const initialPrices = await getTokenPrices((updatedPrices) => {
          if (mounted) {
            setPrices(updatedPrices);
          }
        });

        if (mounted) {
          setPrices(initialPrices);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching prices:', err);
        if (mounted) {
          setError('Failed to load token prices');
          setLoading(false);
        }
      }
    };

    initializePrices();

    // Cleanup function
    return () => {
      mounted = false;
      cleanup(); // Clean up WebSocket connection
    };
  }, []);

  return (
    <main className="bg-background text-foreground min-h-screen">
      {/* Landing Section */}
      <section className="min-h-screen relative flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 right-0 w-72 sm:w-96 h-72 sm:h-96 bg-primary rounded-full filter blur-3xl opacity-10" />
          <div className="absolute top-1/2 left-0 w-72 sm:w-96 h-72 sm:h-96 bg-primary rounded-full filter blur-3xl opacity-10" />
        </div>

        {/* Custom Header */}
        <header className="absolute top-0 left-0 right-0 p-4 sm:p-6">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-background">Ξ</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold">ETH Wallet Hub</h1>
            </div>
            <ThemeToggle />
          </div>
        </header>

        {/* Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-4 sm:mb-6">
              ETH Wallet Hub
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              Your secure gateway to the Ethereum ecosystem. Buy, sell, store, and manage your
              digital assets with ease and confidence.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center max-w-2xl mx-auto px-4 mb-12">
            <Link href="/create-wallet" className="w-full sm:w-auto">
              <Button 
                variant="primary"
                size="lg"
                className="w-full bg-blue-600 hover:bg-blue-700 text-sm sm:text-base"
              >
                Create New Wallet
              </Button>
            </Link>

            <Link href="/restore-wallet" className="w-full sm:w-auto">
              <Button 
                variant="primary"
                size="lg"
                className="w-full bg-amber-600 hover:bg-amber-700 text-sm sm:text-base"
              >
                Restore Using Recovery Phrase
              </Button>
            </Link>

            <Link href="/connect-wallet" className="w-full sm:w-auto">
              <Button 
                variant="primary"
                size="lg"
                className="w-full bg-green-600 hover:bg-green-700 text-sm sm:text-base"
              >
                Connect Existing Wallet
              </Button>
            </Link>
          </div>

          {/* Token Grid */}
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-xl sm:text-2xl font-bold text-center mb-6">
              Supported Tokens
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {SUPPORTED_TOKENS.map(token => {
                const tokenData = prices?.[token.id];
                const price = tokenData?.usd || 0;
                const change = tokenData?.usd_24h_change || 0;
                const volume = tokenData?.volume_24h || 0;

                return (
                  <Card 
                    key={token.symbol} 
                    className="bg-card/50 backdrop-blur-sm p-6 flex items-center justify-between hover:scale-[1.02] transition-transform duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-lg">
                        {token.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-foreground">{token.name}</h3>
                          {token.contractAddress && (
                            <span className="text-xs text-muted-foreground border border-muted-foreground/30 rounded px-1">
                              ERC20
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{token.symbol}</p>
                      </div>
                    </div>
                    {loading ? (
                      <div className="text-right animate-pulse">
                        <div className="h-5 w-20 bg-muted rounded mb-1"></div>
                        <div className="h-4 w-16 bg-muted rounded"></div>
                      </div>
                    ) : (
                      <div className="text-right">
                        <p className="font-bold text-foreground">
                          ${price.toFixed(price < 1 ? 4 : 2)}
                        </p>
                        <p className={change >= 0 ? 'text-green-400' : 'text-red-400'}>
                          {change > 0 ? '+' : ''}{change.toFixed(2)}%
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Vol: ${(volume / 1e6).toFixed(2)}M
                        </p>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-center text-red-400">
                {error}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}