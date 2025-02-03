// src/components/token/TokenCard.js
'use client';

import { Card } from '../ui/Card';
import LiveTokenPrice from '../token/LiveTokenPrice';
import TokenPriceChart from '../token/TokenPriceChart';
import { formatCryptoAmount } from '@/lib/utils';

export function TokenCard({ token, showBalance = false, onClick }) {
  return (
    <Card 
      className="p-4 hover:bg-muted/50 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
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
            <h3 className="font-medium">{token.name}</h3>
            <LiveTokenPrice token={token} />
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

      <div className="mt-4 h-24">
        <TokenPriceChart token={token} height="h-24" />
      </div>
    </Card>
  );
}