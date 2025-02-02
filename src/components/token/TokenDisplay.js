// src/components/token/TokenDisplay.js
'use client';

import { useLiveTokenPrices } from '@/hooks/useLiveTokenPrices';
import { Card } from '@/components/ui/Card';
import { formatNumber } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { SUPPORTED_TOKENS } from '@/lib/constants/tokens';

function formatTimeDiff(timestamp) {
  if (!timestamp) return '';
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 5) return 'Just now';
  if (seconds < 60) return `${seconds}s ago`;
  return `${Math.floor(seconds / 60)}m ago`;
}

export default function TokenDisplay() {
  const { prices, loading, error } = useLiveTokenPrices();

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="h-24 animate-pulse bg-muted/50" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-destructive p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {SUPPORTED_TOKENS.map((token) => {
        const price = prices[token.id];
        return (
          <Card key={token.id} className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                {token.icon ? (
                  <img 
                    src={token.icon} 
                    alt={token.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xl">{token.symbol[0]}</span>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{token.name}</h3>
                  <span className="text-xs text-muted-foreground">
                    {price?.lastUpdate ? formatTimeDiff(price.lastUpdate) : ''}
                  </span>
                </div>
                
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${price?.usd}-${price?.lastUpdate}`}
                    initial={{ opacity: 0.8, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0.8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="flex items-center justify-between mt-1"
                  >
                    <p className="text-2xl font-bold">
                      ${formatNumber(price?.usd || 0)}
                    </p>
                    <p className={`text-sm ${
                      (price?.usd_24h_change || 0) >= 0 
                        ? 'text-green-500' 
                        : 'text-red-500'
                    }`}>
                      {(price?.usd_24h_change || 0) > 0 ? '+' : ''}
                      {formatNumber(price?.usd_24h_change || 0, 2)}%
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}