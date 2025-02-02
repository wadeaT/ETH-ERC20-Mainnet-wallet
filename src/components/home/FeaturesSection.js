// src/components/home/FeaturesSection.js
'use client';

import { motion } from 'framer-motion';
import { FeatureCard } from './FeatureCard';
import { 
  Wallet, 
  SendHorizontal, 
  History, 
  Shield, 
  ArrowLeftRight,
  LineChart 
} from 'lucide-react';

const features = [
  {
    icon: Wallet,
    title: 'Secure Storage',
    description: 'Store your ETH and tokens securely with our advanced encryption technology.'
  },
  {
    icon: SendHorizontal,
    title: 'Easy Transfers',
    description: 'Send crypto to any address with just a few clicks. Fast and secure transactions.'
  },
  {
    icon: History,
    title: 'Transaction History',
    description: 'Track all your transactions with detailed history and status updates.'
  },
  {
    icon: Shield,
    title: 'Advanced Security',
    description: 'Multi-layer security with encryption and secure recovery options.'
  },
  {
    icon: ArrowLeftRight,
    title: 'Token Swaps',
    description: 'Swap tokens directly from your wallet with best available rates.'
  },
  {
    icon: LineChart,
    title: 'Live Tracking',
    description: 'Monitor your portfolio with real-time price updates and charts.'
  }
];

export function FeaturesSection() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Features & Benefits</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need to manage your crypto assets in one secure place
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              {...feature}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}