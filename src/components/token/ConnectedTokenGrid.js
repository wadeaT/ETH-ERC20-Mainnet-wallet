// src/components/token/ConnectedTokenGrid.js
'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { fetchTokenPrices } from '@/lib/api';
import { SUPPORTED_TOKENS } from '@/lib/constants/tokens';
import { formatNumber, formatCryptoAmount } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useWallet } from '@/hooks/useWallet';

export const ConnectedTokenGrid = () => {
  const { walletData } = useWallet();
  const [prices, setPrices] = useState({});

  useEffect(() => {
    const updatePrices = async () => {
      const data = await fetchTokenPrices();
      setPrices(data);
    };

    updatePrices();
    const interval = setInterval(updatePrices, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {SUPPORTED_TOKENS.map((token) => {
        const balance = walletData?.balances?.[token.symbol] || '0';
        const price = prices[token.id]?.usd || 0;
        const value = parseFloat(balance) * price;

        return (
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
                    <p className="text-sm text-muted-foreground">
                      {formatCryptoAmount(balance)} {token.symbol}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-foreground">
                    ${formatNumber(value, 2)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    ${formatNumber(price, token.symbol === 'SHIB' ? 8 : 2)}
                  </p>
                  <p className={`text-sm ${(prices[token.id]?.usd_24h_change || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {(prices[token.id]?.usd_24h_change || 0) > 0 ? '+' : ''}
                    {formatNumber(prices[token.id]?.usd_24h_change || 0, 2)}%
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};