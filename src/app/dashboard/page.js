// src/app/dashboard/page.js - IMPROVED ERROR HANDLING
'use client';

import { Card } from '@/components/ui/Card';
import { formatAddress, formatNumber, formatCryptoAmount } from '@/lib/utils';
import { useWallet } from '@/hooks/useWallet';
import { useTokenPrices } from '@/hooks/useTokenPrices';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardPage() {
  const { tokens: walletTokens, address } = useWallet();
  const { tokens: priceData, loading, error } = useTokenPrices();

  // Combine wallet data with live price data with safety checks
  const tokens = walletTokens.map(token => {
    const priceInfo = priceData.find(p => p.id === token.id);
    const balance = parseFloat(token.balance) || 0;
    const price = parseFloat(priceInfo?.price) || 0;
    
    return {
      ...token,
      balance,
      price,
      priceChange: parseFloat(priceInfo?.priceChange) || 0,
      value: balance * price
    };
  });

  const totalValue = tokens.reduce((sum, token) => sum + (token.value || 0), 0);

  if (loading) {
    return (
      <Card className="p-6 animate-pulse">
        <div className="h-8 bg-muted rounded w-1/4 mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-muted rounded"></div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {address && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm text-muted-foreground">Wallet Address</h2>
              <p className="font-mono text-foreground">{formatAddress(address)}</p>
            </div>
            <div className="text-right">
              <h2 className="text-sm text-muted-foreground">Total Portfolio Value</h2>
              <p className="text-xl font-bold text-foreground">
                ${formatNumber(totalValue)}
              </p>
            </div>
          </div>
        </Card>
      )}

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="p-4 text-left text-muted-foreground font-medium">Asset</th>
                <th className="p-4 text-right text-muted-foreground font-medium">Balance</th>
                <th className="p-4 text-right text-muted-foreground font-medium">Price</th>
                <th className="p-4 text-right text-muted-foreground font-medium">24h Change</th>
                <th className="p-4 text-right text-muted-foreground font-medium">Value</th>
              </tr>
            </thead>
            <tbody>
              {tokens.map((token) => (
                <tr key={token.id} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                        {token.icon ? (
                          <img
                            src={token.icon}
                            alt={token.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-lg">{token.symbol[0]}</span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{token.name}</p>
                        <p className="text-sm text-muted-foreground">{token.symbol}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <p className="text-foreground">
                      {formatCryptoAmount(token.balance)} {token.symbol}
                    </p>
                  </td>
                  <td className="p-4 text-right">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={token.price}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-foreground"
                      >
                        ${formatNumber(token.price)}
                      </motion.div>
                    </AnimatePresence>
                  </td>
                  <td className="p-4 text-right">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={token.priceChange}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={token.priceChange >= 0 ? 'text-green-500' : 'text-red-500'}
                      >
                        {token.priceChange > 0 ? '+' : ''}{formatNumber(token.priceChange)}%
                      </motion.div>
                    </AnimatePresence>
                  </td>
                  <td className="p-4 text-right">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={token.value}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-foreground"
                      >
                        ${formatNumber(token.value)}
                      </motion.div>
                    </AnimatePresence>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}