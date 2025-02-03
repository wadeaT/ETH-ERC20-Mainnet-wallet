// src/components/token/TokenPriceChart.js
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { priceWs } from '@/services/priceWebSocket';
import { formatNumber } from '@/lib/utils';

export default function TokenPriceChart({ token, height = "h-64" }) {
  const [priceData, setPriceData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token?.binanceSymbol) return;

    // Initialize with current price
    setPriceData([{
      time: Date.now(),
      price: token.price || 0
    }]);

    // Subscribe to price updates
    const unsubscribe = priceWs.subscribe(
      token.binanceSymbol,
      (data) => {
        setPriceData(prev => {
          const newData = [...prev, {
            time: data.timestamp,
            price: data.price
          }];
          return newData.slice(-30); // Keep last 30 data points
        });
      }
    );

    return () => {
      unsubscribe();
    };
  }, [token?.binanceSymbol]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 bg-destructive/10 rounded-lg text-destructive">
        Failed to load price data
      </div>
    );
  }

  return (
    <div className={height}>
      <ResponsiveContainer>
        <LineChart data={priceData}>
          <XAxis 
            dataKey="time"
            type="number"
            domain={['auto', 'auto']}
            tickFormatter={(ts) => new Date(ts).toLocaleTimeString()}
            stroke="currentColor"
            opacity={0.5}
          />
          <YAxis 
            domain={['auto', 'auto']}
            tickFormatter={(value) => `$${formatNumber(value)}`}
            stroke="currentColor"
            opacity={0.5}
          />
          <Tooltip 
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              return (
                <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg p-2">
                  <p className="text-sm font-medium">
                    ${formatNumber(payload[0].value)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(payload[0].payload.time).toLocaleString()}
                  </p>
                </div>
              );
            }}
          />
          <Line 
            type="monotone"
            dataKey="price"
            stroke="currentColor"
            dot={false}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}