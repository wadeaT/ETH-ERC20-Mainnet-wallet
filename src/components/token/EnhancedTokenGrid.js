// src/components/token/EnhancedTokenGrid.js
'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { motion } from 'framer-motion';
import { 
  SUPPORTED_TOKENS,
  useTokenPrices,
  formatNumber 
} from '@/lib/tokenPrices';

export const EnhancedTokenGrid = () => {
  const [tokenData, setTokenData] = useState(() => 
    SUPPORTED_TOKENS.map(token => ({
      ...token,
      price: 0,
      priceChange: 0,
      volume: 0,
      prevPrice: 0
    }))
  );

  const { prices, loading, error } = useTokenPrices();

  useEffect(() => {
    if (prices) {
      setTokenData(prevData => 
        prevData.map(token => ({
          ...token,
          prevPrice: token.price,
          price: prices[token.id]?.usd || 0,
          priceChange: prices[token.id]?.usd_24h_change || 0,
          volume: prices[token.id]?.volume || 0,
          lastUpdate: Date.now()
        }))
      );
    }
  }, [prices]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {tokenData.map((token) => (
        <motion.div
          key={token.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-card/50 backdrop-blur-sm p-6 hover:scale-[1.02] transition-transform">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xl">{token.icon}</span>
                </div>
                <div>
                  <h3 className="font-medium text-foreground">{token.name}</h3>
                  <p className="text-sm text-muted-foreground">{token.symbol}</p>
                </div>
              </div>
              <div className="text-right">
                <motion.div
                  key={`price-${token.lastUpdate}`}
                  initial={{ scale: 1.05 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`font-bold ${
                    token.price > token.prevPrice ? 'text-green-500' : 
                    token.price < token.prevPrice ? 'text-red-500' : 
                    'text-foreground'
                  }`}
                >
                  ${formatNumber(token.price || 0, token.symbol === 'SHIB' ? 8 : 2)}
                </motion.div>
                <p className={`text-sm ${(token.priceChange || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {(token.priceChange || 0) > 0 ? '+' : ''}
                  {formatNumber(token.priceChange || 0, 2)}%
                </p>
                {token.volume > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Vol: ${formatNumber(token.volume)}
                  </p>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};