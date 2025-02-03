// src/components/token/TokenDashboard.js
'use client';

import { ExpandableTokenRow } from './ExpandableTokenRow';
import { useWallet } from '@/hooks/useWallet';
import { SecurityNotice } from '@/components/common/SecurityNotice';
import { Card } from '@/components/ui/Card';
import { useLiveTokenPrices } from '@/hooks/useLiveTokenPrices';

export function TokenDashboard() {
  const { tokens, loading, error } = useWallet();
  const { priceHistory } = useLiveTokenPrices();

  if (error) {
    return <SecurityNotice type="error">{error}</SecurityNotice>;
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="h-20 animate-pulse bg-muted/50" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tokens.map((token) => (
        <ExpandableTokenRow
          key={token.id}
          token={token}
          priceHistory={priceHistory[token.id] || []}
        />
      ))}
      
      {tokens.length === 0 && (
        <Card className="p-6 text-center text-muted-foreground">
          No tokens found in your wallet
        </Card>
      )}
    </div>
  );
}