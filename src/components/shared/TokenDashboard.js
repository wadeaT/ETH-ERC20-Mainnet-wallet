// src/components/shared/TokenDashboard.js
'use client';

import { Card } from '@/components/ui/Card';
import { formatNumber, formatCryptoAmount } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

export function TokenDashboard({ tokens, totalValue, loading, error }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
        {[1, 2, 3].map(i => (
          <Card key={i} className="h-32 bg-muted/50" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6 bg-destructive/10 text-destructive">
        <p>{error}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Total Value Display */}
      <Card className="p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-foreground">Total Portfolio Value</h2>
          <p className="text-2xl font-bold text-foreground">
            ${formatNumber(totalValue)}
          </p>
        </div>
      </Card>

      {/* Tokens Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tokens.map(token => (
          <TokenCard key={token.id} token={token} />
        ))}
      </div>
    </div>
  );
}

function TokenCard({ token }) {
  const {
    id,
    name,
    symbol,
    icon,
    balance,
    price,
    priceChange,
    value,
    contractAddress
  } = token;

  return (
    <Card className="p-6 hover:scale-[1.02] transition-transform">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
          {icon ? (
            <img src={icon} alt={name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-xl">{symbol[0]}</span>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-foreground">{name}</h3>
            {contractAddress && (
              <a
                href={`https://etherscan.io/token/${contractAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                <ExternalLink size={16} />
              </a>
            )}
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={`${id}-${price}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-1"
            >
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Balance:</span>
                <span className="text-foreground">
                  {formatCryptoAmount(balance)} {symbol}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Value:</span>
                <span className="text-foreground">${formatNumber(value)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Price:</span>
                <span className={priceChange >= 0 ? 'text-green-500' : 'text-red-500'}>
                  ${formatNumber(price)} ({priceChange > 0 ? '+' : ''}{formatNumber(priceChange)}%)
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </Card>
  );
}