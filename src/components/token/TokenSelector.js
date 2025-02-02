// src/components/token/TokenSelector.js
import { ChevronDown } from 'lucide-react';
import { formatNumber } from '@/lib/utils';
import { DEFAULT_ICONS } from '@/lib/constants/tokens';

export function TokenSelector({ 
  selectedToken, 
  tokens, 
  onSelect, 
  showSelect, 
  onToggleSelect 
}) {
  const getTokenIcon = (token) => {
    // Use default icon if available, otherwise use first letter
    return DEFAULT_ICONS[token.symbol] || token.symbol[0];
  };

  return (
    <div className="relative">
      <button
        type="button"
        className="w-full flex items-center justify-between bg-muted/50 border border-input rounded-lg px-4 py-3 text-foreground"
        onClick={onToggleSelect}
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
            <span>{getTokenIcon(selectedToken)}</span>
          </div>
          <span>{selectedToken.symbol}</span>
        </div>
        <ChevronDown size={20} className="text-muted-foreground" />
      </button>

      {showSelect && (
        <div className="absolute w-full mt-2 bg-card border border-input rounded-lg shadow-lg z-10">
          <div className="p-2 space-y-1">
            {tokens.map(token => (
              <button
                key={token.id}
                type="button"
                className="w-full flex items-center gap-2 px-3 py-2 rounded hover:bg-muted"
                onClick={() => onSelect(token)}
              >
                <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                  <span>{getTokenIcon(token)}</span>
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-foreground">{token.name}</span>
                  <span className="text-xs text-muted-foreground">{token.symbol}</span>
                </div>
                <span className="text-muted-foreground text-sm ml-auto">
                  {formatNumber(token.balance, token.decimals === 18 ? 6 : token.decimals)}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}