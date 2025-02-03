// src/components/wallet/WalletCard.js
'use client';

import { useState } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { Card } from '@/components/ui/Card';
import { ExternalLink } from 'lucide-react';
import { formatNumber, formatCryptoAmount, formatAddress } from '@/lib/utils';
import { motion } from 'framer-motion';

export function WalletCard() {
  const { tokens, totalValue, address, loading, error } = useWallet();
  const [copySuccess, setCopySuccess] = useState('');

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopySuccess('Copied!');
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      setCopySuccess('Failed to copy');
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <Card className="h-12 bg-muted rounded mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="h-16 bg-muted rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-4 text-center text-destructive bg-destructive/10">
        {error}
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Total Value Card */}
      <Card className="p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-sm text-muted-foreground">Wallet Address</h2>
            <div className="flex items-center gap-2">
              <p className="font-mono text-foreground">{formatAddress(address)}</p>
              <button
                onClick={handleCopyAddress}
                className="text-sm text-primary hover:text-primary/80"
              >
                {copySuccess || 'Copy'}
              </button>
              <a
                href={`https://etherscan.io/address/${address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-sm text-muted-foreground">Total Value</h2>
            <p className="text-2xl font-bold text-foreground">
              ${formatNumber(totalValue)}
            </p>
          </div>
        </div>
      </Card>

      {/* Token List */}
      <div className="grid gap-4">
        {tokens.map(token => (
          <motion.div
            key={token.symbol}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                    {token.icon ? (
                      <img 
                        src={token.icon} 
                        alt={token.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="50%" x="50%" dominant-baseline="middle" text-anchor="middle" font-size="50">${token.symbol[0]}</text></svg>`;
                        }}
                      />
                    ) : (
                      <span className="text-lg">{token.symbol[0]}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">{token.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {formatCryptoAmount(token.balance)} {token.symbol}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-medium text-foreground">${formatNumber(token.value)}</p>
                  <p className={`text-sm ${token.priceChange >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {token.priceChange > 0 ? '+' : ''}{formatNumber(token.priceChange)}%
                  </p>
                </div>
              </div>

              {token.contractAddress && (
                <div className="mt-2 pt-2 border-t border-border">
                  <a
                    href={`https://etherscan.io/token/${token.contractAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <span>{formatAddress(token.contractAddress)}</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              )}
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}