// src/components/token/TokenCard.js
import { Card } from '@/components/ui/Card';
import { formatNumber, formatCryptoAmount } from '@/lib/utils';

export const TokenCard = ({ token, price, change, balance, icon }) => {
  const value = balance ? parseFloat(balance) * price : 0;

  return (
    <Card className="bg-card/50 backdrop-blur-sm p-6 flex items-center justify-between hover:scale-[1.02] transition-transform duration-200">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-primary/10">
          {icon ? (
            <img 
              src={icon} 
              alt={token.name} 
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="50%" x="50%" dominant-baseline="middle" text-anchor="middle" font-size="50">${token.symbol[0]}</text></svg>`;
              }}
            />
          ) : (
            <span className="text-xl">{token.symbol[0]}</span>
          )}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-foreground">{token.name}</h3>
          </div>
          <p className="text-sm text-muted-foreground">{token.symbol}</p>
        </div>
      </div>
      <div className="text-right">
        {balance && (
          <>
            <p className="text-sm text-muted-foreground">
              {formatCryptoAmount(balance)} {token.symbol}
            </p>
            <p className="font-bold text-foreground">
              ${formatNumber(value, 2)}
            </p>
          </>
        )}
        <p className="font-bold text-foreground">
          ${formatNumber(price, price < 1 ? 4 : 2)}
        </p>
        <p className={`text-sm ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {change > 0 ? '+' : ''}{formatNumber(change, 2)}%
        </p>
      </div>
    </Card>
  );
};