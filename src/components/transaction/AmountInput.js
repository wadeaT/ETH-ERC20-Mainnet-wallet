// src/components/transaction/AmountInput.js
import { formatNumber } from '@/lib/utils';

export function AmountInput({ 
  amount, 
  onAmountChange, 
  onSetMax, 
  token, 
  className = '' 
}) {
  const usdValue = (parseFloat(amount) || 0) * (token?.price || 0);

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm text-muted-foreground mb-1">Amount</label>
      <div className="relative">
        <input
          type="number"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          placeholder="0.0"
          min="0"
          step="any"
          className="w-full bg-muted/50 border border-input rounded-lg px-4 py-3 
            text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
        />
        <button
          type="button"
          onClick={onSetMax}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-primary hover:text-primary/80"
        >
          Max
        </button>
      </div>
      
      <div className="flex justify-between items-center px-1 text-sm text-muted-foreground">
        <span>≈ ${formatNumber(usdValue, 2)} USD</span>
        <span>
          Balance: {formatNumber(token?.balance)} {token?.symbol}
        </span>
      </div>
    </div>
  );
}