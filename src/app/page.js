// src/app/page.js
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { TokenPriceGrid } from '@/components/TokenPriceGrid';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import ClientProvider from './ClientProvider';
import './globals.css';

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);

  return (
    <main className="bg-background text-foreground min-h-screen">
      {/* Landing Section */}
      <section className="min-h-screen relative flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 right-0 w-72 sm:w-96 h-72 sm:h-96 bg-primary rounded-full filter blur-3xl opacity-10" />
          <div className="absolute top-1/2 left-0 w-72 sm:w-96 h-72 sm:h-96 bg-primary rounded-full filter blur-3xl opacity-10" />
        </div>

        {/* Custom Header for Landing Page */}
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
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center max-w-2xl mx-auto px-4">
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
        </div>
      </section>

      {/* Mainnet Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
          {/* Balance Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-card/50 backdrop-blur-sm p-4 sm:p-6">
              <h3 className="text-muted-foreground text-sm">Total Balance</h3>
              <p className="text-xl sm:text-2xl font-bold text-foreground">$0.00</p>
              <p className="text-sm text-green-400">+0.00%</p>
            </Card>
            
            <Card className="bg-card/50 backdrop-blur-sm p-4 sm:p-6">
              <h3 className="text-muted-foreground text-sm">ETH Balance</h3>
              <p className="text-xl sm:text-2xl font-bold text-foreground">0.00 ETH</p>
              <p className="text-sm text-foreground">$0.00</p>
            </Card>
            
            <Card className="bg-card/50 backdrop-blur-sm p-4 sm:p-6">
              <h3 className="text-muted-foreground text-sm">Token Balance</h3>
              <p className="text-xl sm:text-2xl font-bold text-foreground">0 Tokens</p>
              <p className="text-sm text-foreground">$0.00</p>
            </Card>
            
            <Card className="bg-card/50 backdrop-blur-sm p-4 sm:p-6">
              <h3 className="text-muted-foreground text-sm">Gas Price</h3>
              <p className="text-xl sm:text-2xl font-bold text-foreground">0 Gwei</p>
              <p className="text-sm text-foreground">≈ $0.00 / transfer</p>
            </Card>
          </div>

          {/* Token List */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-center mb-6">
              ETH Mainnet wallet supports ETH and all ERC-20 tokens!
            </h2>
            <Card className="bg-card/50 backdrop-blur-sm overflow-hidden p-4">
              <TokenPriceGrid />
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}