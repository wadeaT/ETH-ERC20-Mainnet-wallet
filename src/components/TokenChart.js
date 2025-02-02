// src/components/TokenChart.js
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Card } from './ui/Card';
import { formatNumber } from '@/lib/utils';

export function TokenChart({ tokens }) {
  const data = tokens
    .filter(token => parseFloat(token.value) > 0)
    .map(token => ({
      name: token.symbol,
      value: token.value,
      color: getTokenColor(token.symbol)
    }));

  const totalValue = data.reduce((sum, item) => sum + item.value, 0);

  if (data.length === 0) {
    return (
      <Card className="p-6 text-center text-muted-foreground">
        No tokens with balance
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="relative h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-muted-foreground text-sm">Total Value</p>
          <p className="text-2xl font-bold text-foreground">
            ${formatNumber(totalValue)}
          </p>
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          {data.map(item => (
            <div key={item.name} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-muted-foreground">
                {item.name} ({formatNumber((item.value / totalValue) * 100, 1)}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

function getTokenColor(symbol) {
  const colors = {
    'ETH': '#627EEA',
    'USDT': '#26A17B',
    'USDC': '#2775CA',
    'DAI': '#F5AC37',
    'LINK': '#2A5ADA',
    'UNI': '#FF007A',
    'AAVE': '#B6509E',
    'MATIC': '#8247E5',
    'MKR': '#1AAB9B',
    'ARB': '#28A0F0',
    'OP': '#FF0420'
  };
  return colors[symbol] || '#3B82F6';
}