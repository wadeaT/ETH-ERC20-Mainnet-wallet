// src/app/dashboard/page.js
'use client';

import { Card } from '@/components/ui/Card';
import { useWallet } from '@/hooks/useWallet';
import { formatAddress, formatNumber } from '@/lib/utils';
import { ExpandableTokenRow } from '@/components/token/ExpandableTokenRow';
import { TokenChart } from '@/components/TokenChart';

export default function DashboardPage() {
  const { tokens, totalValue, address, loading, error } = useWallet();

  if (error) {
    return (
      <Card className="p-6 bg-destructive/10 text-destructive">
        <p>Failed to load wallet data: {error}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <h3 className="text-sm text-muted-foreground">Wallet Address</h3>
          <p className="mt-1 font-mono text-foreground">
            {loading ? 'Loading...' : formatAddress(address)}
          </p>
        </Card>

        <Card className="p-4">
          <h3 className="text-sm text-muted-foreground">Total Value</h3>
          <p className="mt-1 text-xl font-bold text-foreground">
            ${loading ? '...' : totalValue.toFixed(2)}
          </p>
        </Card>

        <Card className="p-4">
          <h3 className="text-sm text-muted-foreground">Active Tokens</h3>
          <p className="mt-1 text-xl font-bold text-foreground">
            {loading ? '...' : tokens.filter(t => parseFloat(t.balance) > 0).length}
          </p>
        </Card>

        <Card className="p-4">
          <h3 className="text-sm text-muted-foreground">24h Change</h3>
          <p className="mt-1 text-xl font-bold text-foreground">
            {loading ? '...' : formatTotalChange(tokens)}
          </p>
        </Card>
      </div>

      {/* Token List */}
      <div className="space-y-4">
        {loading ? (
          <LoadingState />
        ) : (
          tokens.map(token => (
            <ExpandableTokenRow
              key={token.id}
              token={token}
              priceHistory={[]} // We'll update this with real data
            />
          ))
        )}
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map(i => (
        <Card key={i} className="h-16 animate-pulse bg-muted" />
      ))}
    </div>
  );
}

function formatTotalChange(tokens) {
  const totalValue = tokens.reduce((sum, t) => sum + t.value, 0);
  const prevValue = tokens.reduce((sum, t) => {
    const prevPrice = t.price / (1 + t.priceChange / 100);
    return sum + (parseFloat(t.balance) * prevPrice);
  }, 0);
  
  const changePercent = ((totalValue - prevValue) / prevValue) * 100;
  const sign = changePercent >= 0 ? '+' : '';
  return `${sign}${changePercent.toFixed(2)}%`;
}