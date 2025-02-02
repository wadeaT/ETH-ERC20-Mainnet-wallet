// src/components/TokenDashboard.js
'use client';

import { Card } from './ui/Card';
import { ExternalLink } from 'lucide-react';
import { formatNumber, formatCryptoAmount } from '@/lib/utils';
import { motion } from 'framer-motion';

export function TokenDashboard({ tokens, loading }) {
  if (loading) {
    return (
      <div className="grid gap-4 animate-pulse">
        {[1, 2, 3].map(i => (
          <Card key={i} className="h-24 bg-muted/50" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tokens.map((token, i) => (
        <TokenRow 
          key={token.id} 
          token={token}
          delay={i * 0.1}
        />
      ))}
    </div>
  );
}

function TokenRow({ token, delay }) {
  const {
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <Card className="p-4 hover:bg-muted/50 transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
            {icon ? (
              <img src={icon} alt={name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-lg">{symbol[0]}</span>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 flex-1 gap-4">
            <div>
              <h3 className="font-medium text-foreground">{name}</h3>
              <p className="text-sm text-muted-foreground">{symbol}</p>
            </div>

            <div className="text-right md:text-left">
              <p className="text-foreground">
                {formatCryptoAmount(balance)} {symbol}
              </p>
              <p className="text-sm text-muted-foreground">
                ${formatNumber(value)}
              </p>
            </div>

            <div className="text-right md:text-left">
              <p className="text-foreground">${formatNumber(price)}</p>
              <p className={`text-sm ${
                priceChange >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {priceChange > 0 ? '+' : ''}{formatNumber(priceChange)}%
              </p>
            </div>

            <div className="flex items-center justify-end gap-2">
              {contractAddress && (
                <a
                  href={`https://etherscan.io/token/${contractAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 hover:bg-muted rounded-full transition-colors"
                >
                  <ExternalLink size={16} className="text-muted-foreground hover:text-foreground" />
                </a>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}