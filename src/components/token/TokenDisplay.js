// src/components/token/TokenDisplay.js - UPDATED IMAGE HANDLING
'use client';

import { useTokenPrices } from '@/hooks/useTokenPrices';
import { Card } from '@/components/ui/Card';
import { formatNumber } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function TokenDisplay() {
  const { tokens, loading, error } = useTokenPrices();

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="bg-card/50 backdrop-blur-sm p-6 animate-pulse">
            <div className="h-8 bg-muted rounded w-1/2 mb-4"></div>
            <div className="h-6 bg-muted rounded w-3/4"></div>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="bg-destructive/10 text-destructive p-6 text-center">
        <p>Unable to load token prices. Please try again later.</p>
        <p className="text-sm mt-2">Error: {error}</p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {tokens.map((token) => (
        <Card 
          key={token.id}
          className="bg-card/50 backdrop-blur-sm p-6 relative overflow-hidden hover:scale-[1.02] transition-transform duration-200"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
              {token.icon ? (
                <img
                  src={token.icon}
                  alt={token.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `data:image/svg+xml,${encodeURIComponent(
                      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                        <rect width="100" height="100" fill="#4B5563"/>
                        <text x="50" y="50" font-family="Arial" font-size="40" fill="#fff" text-anchor="middle" dy=".3em">
                          ${token.symbol[0]}
                        </text>
                      </svg>`
                    )}`;
                  }}
                />
              ) : (
                <span className="text-lg">{token.symbol[0]}</span>
              )}
            </div>
            <div>
              <h3 className="font-medium text-foreground">{token.name}</h3>
              <p className="text-sm text-muted-foreground">{token.symbol}</p>
            </div>
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={`${token.id}-${token.price}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-1"
            >
              <div className="text-xl font-bold text-foreground">
                ${formatNumber(token.price, 2)}
              </div>
              <div className={`text-sm ${token.priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {token.priceChange > 0 ? '+' : ''}{formatNumber(token.priceChange, 2)}%
              </div>
              {token.volume > 0 && (
                <div className="text-xs text-muted-foreground">
                  Vol: ${formatNumber(token.volume / 1e6, 2)}M
                </div>
              )}
            </motion.div>
          </AnimatePresence>
          
          {token.lastUpdate && (
            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          )}
        </Card>
      ))}
    </div>
  );
}