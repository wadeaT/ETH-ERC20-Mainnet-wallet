// src/components/token/TokenDisplay.js
'use client';

import { Card } from '@/components/ui/Card';
import { ExpandableTokenRow } from './ExpandableTokenRow';
import { SUPPORTED_TOKENS } from '@/lib/constants/tokens';

export function TokenDisplay({ showBalances = false, walletData = null }) {
  const tokens = SUPPORTED_TOKENS.map(token => ({
    ...token,
    balance: walletData?.balances?.[token.symbol] || '0'
  }));

  return (
    <div className="space-y-4">
      {tokens.map((token) => (
        <ExpandableTokenRow
          key={token.id}
          token={token}
          showBalance={showBalances}
        />
      ))}
      
      {tokens.length === 0 && (
        <Card className="p-6 text-center text-muted-foreground">
          No tokens found
        </Card>
      )}
    </div>
  );
}