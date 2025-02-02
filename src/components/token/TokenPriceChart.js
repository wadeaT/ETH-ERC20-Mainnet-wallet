// src/components/token/TokenPriceChart.js
'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { formatNumber } from '@/lib/utils';
import { getTokenPriceHistory } from '@/services/coingeckoService';

const timeRanges = [
  { label: '1H', value: '1h', days: 0.04 },
  { label: '24H', value: '24h', days: 1 },
  { label: '7D', value: '7d', days: 7 },
  { label: '30D', value: '30d', days: 30 }
];

export const TokenPriceChart = ({ symbol, priceHistory: initialPriceHistory = [] }) => {
  const [timeRange, setTimeRange] = useState('24h');
  const [priceData, setPriceData] = useState(initialPriceHistory);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPriceHistory = async () => {
      setIsLoading(true);
      const selectedRange = timeRanges.find(r => r.value === timeRange);
      const data = await getTokenPriceHistory(symbol, selectedRange.days);
      setPriceData(data);
      setIsLoading(false);
    };

    fetchPriceHistory();
  }, [symbol, timeRange]);

  if (isLoading) {
    return (
      <div className="bg-card/50 backdrop-blur-sm rounded-lg p-6 mt-4 h-[400px] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!priceData || priceData.length === 0) {
    return (
      <div className="bg-card/50 backdrop-blur-sm rounded-lg p-6 mt-4 h-[400px] flex items-center justify-center">
        <p className="text-muted-foreground">No price data available</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-card/50 backdrop-blur-sm rounded-lg p-6 mt-4"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">{symbol} Price Chart</h3>
        <div className="flex gap-2">
          {timeRanges.map(range => (
            <button
              key={range.value}
              onClick={() => setTimeRange(range.value)}
              className={`px-3 py-1 rounded-md text-sm transition-colors ${
                timeRange === range.value
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={priceData}>
            <XAxis 
              dataKey="time"
              type="number"
              domain={['auto', 'auto']}
              scale="time"
              tickFormatter={(time) => {
                const date = new Date(time);
                return timeRange === '1h' 
                  ? date.toLocaleTimeString()
                  : date.toLocaleDateString();
              }}
              stroke="currentColor"
              opacity={0.5}
            />
            <YAxis 
              domain={['auto', 'auto']}
              stroke="currentColor"
              opacity={0.5}
              tickFormatter={(value) => `$${formatNumber(value)}`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                return (
                  <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg p-2 shadow-lg">
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
    </motion.div>
  );
};