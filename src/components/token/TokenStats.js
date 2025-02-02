// src/components/token/TokenStats.js
import { ExternalLink } from 'lucide-react';
import { formatNumber } from '@/lib/utils';

export const TokenStats = ({ token }) => {
  const stats = [
    { 
      label: 'Market Cap', 
      value: token.marketCap || 0,
      type: 'currency'
    },
    { 
      label: '24h Volume', 
      value: token.volume24h || 0,
      type: 'currency'
    },
    { 
      label: 'Circulating Supply', 
      value: token.circulatingSupply || 0,
      type: 'number',
      suffix: token.symbol
    },
    { 
      label: 'Total Supply', 
      value: token.totalSupply || 0,
      type: 'number',
      suffix: token.symbol
    }
  ];

  // Only add contract address if it exists
  if (token.contractAddress) {
    stats.push({
      label: 'Contract Address',
      value: token.contractAddress,
      type: 'address'
    });
  }

  const formatValue = (stat) => {
    if (stat.type === 'currency') {
      return `$${formatNumber(stat.value)}`;
    }
    if (stat.type === 'number') {
      return `${formatNumber(stat.value)} ${stat.suffix || ''}`;
    }
    return stat.value;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium mb-4">Token Stats</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {stats.map(stat => (
          <div key={stat.label} className="bg-muted/30 rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
            {stat.type === 'address' ? (
              <div className="flex items-center gap-2">
                <p className="text-sm font-mono truncate">
                  {`${stat.value.slice(0, 6)}...${stat.value.slice(-4)}`}
                </p>
                <a
                  href={`https://etherscan.io/token/${stat.value}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ExternalLink size={14} />
                </a>
              </div>
            ) : (
              <p className="text-foreground font-medium">{formatValue(stat)}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};