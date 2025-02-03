// src/app/dashboard/page.js
'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { useWallet } from '@/hooks/useWallet';
import { formatAddress, formatNumber, formatCryptoAmount } from '@/lib/utils';
import { TokenDisplay } from '@/components/token/TokenDisplay';
import { SecurityNotice } from '@/components/common/SecurityNotice';

export default function DashboardPage() {
  const { tokens, totalValue, address, loading, error } = useWallet();
  const [copySuccess, setCopySuccess] = useState('');

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopySuccess('Copied!');
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      console.error('Failed to copy!', err);
      setCopySuccess('Failed to copy');
    }
  };

  if (error) {
    return (
      <SecurityNotice type="error">
        Failed to load wallet data: {error}
      </SecurityNotice>
    );
  }

  const activeTokens = tokens.filter(t => parseFloat(t.balance) > 0);
  const totalChange = tokens.reduce((acc, token) => {
    if (!token.price || !token.priceChange) return acc;
    const prevValue = token.value / (1 + token.priceChange / 100);
    return acc + (token.value - prevValue);
  }, 0);
  
  const changePercentage = totalValue > 0 ? (totalChange / (totalValue - totalChange)) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Wallet Card */}
        <Card className="p-4">
          <h3 className="text-sm text-muted-foreground">Wallet Address</h3>
          <div className="mt-1 flex items-center gap-2">
            <p className="font-mono text-foreground">
              {loading ? 'Loading...' : formatAddress(address)}
            </p>
            {!loading && (
              <button
                onClick={handleCopyAddress}
                className="text-sm text-primary hover:text-primary/80"
              >
                Copy
              </button>
            )}
          </div>
          {copySuccess && (
            <p className="mt-1 text-xs text-success">{copySuccess}</p>
          )}
        </Card>

        {/* Total Value Card */}
        <Card className="p-4">
          <h3 className="text-sm text-muted-foreground">Portfolio Value</h3>
          <p className="mt-1 text-xl font-bold text-foreground">
            ${loading ? '...' : formatNumber(totalValue, 2)}
          </p>
        </Card>

        {/* Token Count Card */}
        <Card className="p-4">
          <h3 className="text-sm text-muted-foreground">Active Tokens</h3>
          <p className="mt-1 text-xl font-bold text-foreground">
            {loading ? '...' : activeTokens.length}
          </p>
        </Card>

        {/* Change Card */}
        <Card className="p-4">
          <h3 className="text-sm text-muted-foreground">24h Change</h3>
          <p className={`mt-1 text-xl font-bold ${
            changePercentage >= 0 ? 'text-success' : 'text-destructive'
          }`}>
            {loading 
              ? '...' 
              : `${changePercentage >= 0 ? '+' : ''}${formatNumber(changePercentage, 2)}%`
            }
          </p>
        </Card>
      </div>

      {/* Token List */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
          {[1, 2, 3].map(i => (
            <Card key={i} className="h-24 bg-muted/50" />
          ))}
        </div>
      ) : (
        <TokenDisplay 
          showBalances={true} 
          walletData={{ balances: tokens.reduce((acc, t) => ({
            ...acc, 
            [t.symbol]: t.balance
          }), {}) }} 
        />
      )}
    </div>
  );
}