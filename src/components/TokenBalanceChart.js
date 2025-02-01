// src/components/TokenBalanceChart.js
'use client';

import React from 'react';
import { PieChart, Pie, Cell } from 'recharts';
import { formatNumber } from '@/lib/tokenPrices';

const TokenBalanceChart = ({ tokens }) => {
  // Filter tokens with non-zero balances
  const tokenData = tokens
    .filter(token => parseFloat(token.balance) > 0)
    .map(token => ({
      name: token.symbol,
      value: token.value,
      color: token.color || getTokenColor(token.symbol)
    }));

  const totalValue = tokenData.reduce((sum, token) => sum + token.value, 0);

  // If no tokens with balance, show empty state
  if (tokenData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        No tokens with balance
      </div>
    );
  }

  return (
    <div className="relative w-64 h-64 mx-auto">
      <PieChart width={256} height={256}>
        <Pie
          data={tokenData}
          cx={128}
          cy={128}
          innerRadius={80}
          outerRadius={120}
          paddingAngle={2}
          dataKey="value"
        >
          {tokenData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color || '#3B82F6'} />
          ))}
        </Pie>
      </PieChart>
      
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <div className="text-muted-foreground text-sm">Total Value</div>
        <div className="text-foreground text-xl font-bold">
          ${formatNumber(totalValue)}
        </div>
      </div>
      
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex flex-wrap justify-center gap-2 w-full">
        {tokenData.map((token, index) => (
          <div key={index} className="flex items-center gap-1">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: token.color || '#3B82F6' }}
            />
            <span className="text-sm text-muted-foreground">{token.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Helper function to get token colors
const getTokenColor = (symbol) => {
  const colors = {
    'ETH': '#627EEA',
    'USDT': '#26A17B',
    'USDC': '#2775CA',
    'SHIB': '#FFA409',
    'DEFAULT': '#3B82F6'
  };
  return colors[symbol] || colors.DEFAULT;
};

export default TokenBalanceChart;