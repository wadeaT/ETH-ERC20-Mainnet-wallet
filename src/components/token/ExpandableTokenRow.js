// src/components/token/ExpandableTokenRow.js
'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import LiveTokenPrice from './LiveTokenPrice';
import TokenPriceChart from './TokenPriceChart';
import { formatCryptoAmount } from '@/lib/utils';

export function ExpandableTokenRow({ token, showBalance }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="overflow-hidden">
      <div 
        className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          {/* Token Icon */}
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
            {token.icon ? (
              <img 
                src={token.icon} 
                alt={token.name} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="50%" x="50%" dominant-baseline="middle" text-anchor="middle" font-size="50">${token.symbol[0]}</text></svg>`;
                }}
              />
            ) : (
              <span className="text-lg">{token.symbol[0]}</span>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{token.name}</h3>
                <p className="text-sm text-muted-foreground">{token.symbol}</p>
              </div>
              <div className="flex items-center gap-4">
                <LiveTokenPrice token={token} />
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                </motion.div>
              </div>
            </div>

            {showBalance && (
              <div className="mt-2 pt-2 border-t border-border">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Balance</span>
                  <span className="text-sm">
                    {formatCryptoAmount(token.balance)} {token.symbol}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 border-t border-border">
              <div className="h-64">
                <TokenPriceChart token={token} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}