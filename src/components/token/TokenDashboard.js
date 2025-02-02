// src/components/token/TokenDashboard.js
import { Card } from '@/components/ui/Card';
import { ExpandableTokenRow } from './ExpandableTokenRow';
import { useLiveTokenPrices } from '@/hooks/useLiveTokenPrices';

export function TokenDashboard({ tokens }) {
  const { priceHistory } = useLiveTokenPrices();

  return (
    <div className="space-y-4">
      {tokens.map((token) => (
        <ExpandableTokenRow 
          key={token.id} 
          token={token}
          priceHistory={priceHistory[token.id] || []}
        />
      ))}
    </div>
  );
}