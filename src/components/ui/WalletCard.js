// src/components/ui/WalletCard.js - IMPROVED COMPONENT
'use client';

import { useWallet } from '@/hooks/useWallet';
import { Card } from '@/components/ui/Card';
import { ExternalLink } from 'lucide-react';
import { formatNumber, formatCryptoAmount } from '@/lib/utils';

export const WalletCard = () => {
  const { tokens, totalValue, loading, error } = useWallet();

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-12 bg-muted rounded mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-muted rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-destructive bg-destructive/10 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-border">
              <th className="p-4 text-muted-foreground font-medium">Asset</th>
              <th className="p-4 text-right text-muted-foreground font-medium">Balance</th>
              <th className="p-4 text-right text-muted-foreground font-medium">Price</th>
              <th className="p-4 text-right text-muted-foreground font-medium">24h Change</th>
              <th className="p-4 text-right text-muted-foreground font-medium">Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {tokens.map((token) => (
              <tr key={token.symbol} className="hover:bg-muted/30">
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
                  <p className="text-foreground">
                    ${formatNumber(token.price, 2)}
                  </p>
                </td>
                <td className="p-4 text-right">
                  <p className={`${token.priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {token.priceChange > 0 ? '+' : ''}{formatNumber(token.priceChange, 2)}%
                  </p>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <p className="text-foreground">
                      ${formatNumber(token.value, 2)}
                    </p>
                    {token.contractAddress && (
                      <a>
                        href={`https://etherscan.io/token/${token.contractAddress}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground"
                      
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};