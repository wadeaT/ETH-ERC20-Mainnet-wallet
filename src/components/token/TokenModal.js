// src/components/token/TokenModal.js
'use client';

import { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { X } from 'lucide-react';
import { TokenPriceChart } from './TokenPriceChart';
import { formatNumber, formatCryptoAmount } from '@/lib/utils';

export function TokenModal({ token, onClose }) {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl">
        <Card className="p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
          >
            <X size={24} />
          </button>

          <div className="mb-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
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
                <span className="text-2xl">{token.symbol[0]}</span>
              )}
            </div>
            
            <div>
              <h2 className="text-2xl font-bold">{token.name}</h2>
              <p className="text-muted-foreground">{token.symbol}</p>
            </div>

            <div className="ml-auto text-right">
              <p className="text-2xl font-bold">${formatNumber(token.price)}</p>
              <p className={`${token.priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {token.priceChange >= 0 ? '+' : ''}{formatNumber(token.priceChange)}%
              </p>
            </div>
          </div>

          <TokenPriceChart symbol={token.symbol} />

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="p-4 bg-card/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Balance</p>
              <p className="text-lg font-medium">
                {formatCryptoAmount(token.balance)} {token.symbol}
              </p>
            </div>
            <div className="p-4 bg-card/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Value</p>
              <p className="text-lg font-medium">
                ${formatNumber(token.value)}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}