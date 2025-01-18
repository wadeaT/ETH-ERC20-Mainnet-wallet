// src/components/TokenPriceGrid.js
import { useQuery } from '@tanstack/react-query';
import { fetchTokenPrices } from '@/lib/api';
import { Card } from '@/components/ui/Card';

const tokenIds = {
  ETH: { symbol: 'ETH', name: 'Ethereum' },
  USDT: { symbol: 'USDT', name: 'Tether' },
  USDC: { symbol: 'USDC', name: 'USD Coin' },
  BNB: { symbol: 'BNB', name: 'Binance Coin' },
  LINK: { symbol: 'LINK', name: 'Chainlink' },
  UNI: { symbol: 'UNI', name: 'Uniswap' },
  AAVE: { symbol: 'AAVE', name: 'Aave' },
  DAI: { symbol: 'DAI', name: 'Dai' },
  MATIC: { symbol: 'MATIC', name: 'Polygon' },
  SHIB: { symbol: 'SHIB', name: 'Shiba Inu' },
};

export function TokenPriceGrid() {
  const { data, error, isLoading } = useQuery({
    queryKey: ['tokenPrices'],
    queryFn: fetchTokenPrices,
    refetchInterval: 30000, // Refetch every 30 seconds
    retry: 3,
    staleTime: 10000, // Consider data fresh for 10 seconds
  });

  if (isLoading) return <div className="text-center py-4">Loading token prices...</div>;
  if (error) return <div className="text-center py-4 text-red-500">Error fetching token prices: {error.message}</div>;
  if (!data) return <div className="text-center py-4">No data available. Please try again.</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Object.entries(tokenIds).map(([id, { symbol, name }]) => {
        const tokenData = data[symbol];
        if (!tokenData || tokenData.usd === null || typeof tokenData.usd_24h_change === 'undefined') {
          return (
            <Card key={id} className="bg-gray-800/50 backdrop-blur-sm p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                  <span>{symbol[0]}</span>
                </div>
                <div>
                  <p className="font-medium text-white">{name}</p>
                  <p className="text-sm text-gray-400">{symbol}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-white">N/A</p>
                <p className="text-sm text-gray-400">No data</p>
              </div>
            </Card>
          );
        }

        const price = tokenData.usd.toFixed(2);
        const change = tokenData.usd_24h_change.toFixed(2);
        const isPositive = parseFloat(change) >= 0;

        return (
          <Card key={id} className="bg-gray-800/50 backdrop-blur-sm p-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                <span>{symbol[0]}</span>
              </div>
              <div>
                <p className="font-medium text-white">{name}</p>
                <p className="text-sm text-gray-400">{symbol}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-white">${price}</p>
              <p className={`text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                {isPositive ? '+' : ''}{change}%
              </p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
