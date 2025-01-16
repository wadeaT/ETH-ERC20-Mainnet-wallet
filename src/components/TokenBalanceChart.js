import React from 'react';
import { PieChart, Pie, Cell } from 'recharts';

const TokenBalanceChart = ({ tokens }) => {
  // Filter tokens with non-zero balances and calculate total value
  const tokenData = tokens
    .filter(token => parseFloat(token.balance) > 0)
    .map(token => ({
      name: token.symbol,
      value: parseFloat(token.balance) * token.price,
      color: token.symbol === 'ETH' ? '#E4CCFF' : 
             token.symbol === 'USDT' ? '#26A17B' : 
             '#95A5A6'
    }));

  const totalValue = tokenData.reduce((sum, token) => sum + token.value, 0);

  return (
    <div className="relative w-64 h-64 mx-auto my-8">
      <PieChart width={256} height={256}>
        <Pie
          data={tokenData}
          cx={128}
          cy={128}
          innerRadius={80}
          outerRadius={120}
          startAngle={90}
          endAngle={450}
          dataKey="value"
        >
          {tokenData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
      </PieChart>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <div className="text-gray-400 text-sm">balance</div>
        <div className="text-white text-xl font-bold">
          ${totalValue.toFixed(2)}
        </div>
      </div>
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex gap-2">
        {tokenData.map((token, index) => (
          <div 
            key={index}
            className="flex items-center gap-1"
          >
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: token.color }}
            />
            <span className="text-sm text-gray-400">{token.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TokenBalanceChart;