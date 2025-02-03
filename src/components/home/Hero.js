// src/components/home/Hero.js
'use client';

import { motion } from 'framer-motion';

export function Hero() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-8 md:py-12 text-center"
    >
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-4 sm:mb-6 px-4">
        ETH Wallet Hub
      </h1>
      <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
        Your secure gateway to the Ethereum ecosystem. Buy, sell, store, and manage your
        digital assets with ease and confidence.
      </p>
    </motion.div>
  );
}