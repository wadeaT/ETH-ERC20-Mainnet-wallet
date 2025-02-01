// src/components/home/Hero.js
import { motion } from 'framer-motion';

export const Hero = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="text-center mb-8 sm:mb-12"
  >
    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-4">
      ETH Wallet Hub
    </h1>
    <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
      Your secure gateway to the Ethereum ecosystem. Buy, sell, store, and manage your
      digital assets with ease and confidence.
    </p>
  </motion.div>
);