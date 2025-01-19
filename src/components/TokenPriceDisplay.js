// src/components/TokenPriceDisplay.js
'use client';

import { useState, useEffect } from 'react';
import { getTokenPrices, SUPPORTED_TOKENS, formatNumber, formatCryptoAmount, cleanup } from '@/services/tokenPrices';
import { Card } from '@/components/ui/Card';
import { Tooltip } from '@/components/ui/Tooltip';
import { Info } from 'lucide-react';

export function TokenPriceDisplay({ 
  compact = false, 
  showVolume = false,
  className = '',
  onPriceUpdate = null
}) {
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function initializePrices() {
      const initialPrices = await getTokenPrices((updatedPrices) => {
        if (mounted) {
          setPrices(updatedPrices);
          onPriceUpdate?.(updatedPrices);
        }
      });
      
      if (mounted && initialPrices) {
        setPrices(initialPrices);
        onPriceUpdate?.(initialPrices);
        setLoading(false);
      }
    }

    initializePrices();

    return () => {
      mounted = false;
      cleanup();
    };
  }, [onPriceUpdate]);

  if (loading) {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
        {SUPPORTED_TOKENS.map((_, i) => (
          <Card key={i} className="bg-card/50 backdrop-blur-sm p-4 animate-pulse">
            <div className="h-12 bg-muted/50 rounded"></div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {SUPPORTED_TOKENS.map((token) => {
        const price = prices[token.id];
        if (!price) return null;

        return (
          <Card 
            key={token.id} 
            className="bg-card/50 backdrop-blur-sm p-4 transition-all duration-200 hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-lg">
                  <span>{token.icon}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-foreground">
                      {compact ? token.symbol : token.name}
                    </h3>
                    {token.contractAddress && (
                      <Tooltip content="ERC20 Token">
                        <Info size={16} className="text-muted-foreground" />
                      </Tooltip>
                    )}
                  </div>
                  {!compact && (
                    <p className="text-sm text-muted-foreground">
                      {token.symbol}
                    </p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-foreground">
                  ${formatNumber(price.usd)}
                </p>
                <p className={`text-sm ${
                  price.usd_24h_change >= 0 
                    ? 'text-green-400' 
                    : 'text-red-400'
                }`}>
                  {price.usd_24h_change >= 0 ? '+' : ''}
                  {price.usd_24h_change.toFixed(2)}%
                </p>
                {showVolume && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Vol: ${formatNumber(price.volume_24h)}
                  </p>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}