// src/components/home/HeroSection.js
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

const WALLET_ACTIONS = [
  { path: 'create-wallet', text: 'Create New Wallet', color: 'bg-blue-600 hover:bg-blue-700' },
  { path: 'restore-wallet', text: 'Restore Using Recovery Phrase', color: 'bg-amber-600 hover:bg-amber-700' },
  { path: 'connect-wallet', text: 'Connect Existing Wallet', color: 'bg-green-600 hover:bg-green-700' }
];

export const HeroSection = () => (
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

    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center max-w-2xl mx-auto px-4 mb-12">
      {WALLET_ACTIONS.map(({ path, text, color }) => (
        <Link key={path} href={`/${path}`} className="w-full sm:w-auto">
          <Button 
            variant="primary"
            size="lg"
            className={`w-full text-sm sm:text-base ${color}`}
          >
            {text}
          </Button>
        </Link>
      ))}
    </div>
  </div>
);