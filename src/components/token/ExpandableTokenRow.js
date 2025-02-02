// src/components/token/ExpandableTokenRow.js
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ExternalLink } from 'lucide-react';
import { formatNumber, formatCryptoAmount } from '@/lib/utils';
import { TokenPriceChart } from './TokenPriceChart';
import { TokenStats } from './TokenStats';
import { getTokenMarketData, getTokenPriceHistory } from '@/services/coingeckoService';

export const ExpandableTokenRow = ({ token }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [marketData, setMarketData] = useState(null);
  const [priceHistory, setPriceHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isExpanded && !marketData) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const [marketInfo, history] = await Promise.all([
            getTokenMarketData(token.symbol),
            getTokenPriceHistory(token.symbol)
          ]);
          
          if (marketInfo) {
            setMarketData({
              marketCap: marketInfo.market_data?.market_cap?.usd,
              volume24h: marketInfo.market_data?.total_volume?.usd,
              totalSupply: marketInfo.market_data?.total_supply,
              circulatingSupply: marketInfo.market_data?.circulating_supply,
              contractAddress: token.contractAddress
            });
          }
          
          setPriceHistory(history);
        } catch (error) {
          console.error('Error fetching token data:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }
  }, [isExpanded, token.symbol, marketData, token.contractAddress]);

  return (
    <motion.div className="bg-card/50 backdrop-blur-sm rounded-lg overflow-hidden">
      {/* Token Row Header */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-4 flex items-center cursor-pointer hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-4 flex-1">
          {/* Token Icon */}
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
            {token.icon ? (
              <img 
                src={token.icon} 
                alt={token.name} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='50%' x='50%' dominant-baseline='middle' text-anchor='middle' font-size='50'>${token.symbol[0]}</text></svg>`;
                }}
              />
            ) : (
              <span className="text-lg">{token.symbol[0]}</span>
            )}
          </div>

          {/* Token Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 flex-1 gap-4">
            {/* Name and Symbol */}
            <div>
              <h3 className="font-medium text-foreground">{token.name}</h3>
              <p className="text-sm text-muted-foreground">{token.symbol}</p>
            </div>

            {/* Balance and Value */}
            <div className="text-right md:text-left">
              <p className="text-foreground">
                {formatCryptoAmount(token.balance)} {token.symbol}
              </p>
              <p className="text-sm text-muted-foreground">
                ${formatNumber(token.value)}
              </p>
            </div>

            {/* Price and Price Change */}
            <div className="text-right md:text-left">
              <p className="text-foreground">${formatNumber(token.price)}</p>
              <p className={`text-sm ${token.priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {token.priceChange > 0 ? '+' : ''}{formatNumber(token.priceChange)}%
              </p>
            </div>

            {/* Expand Arrow */}
            <div className="flex items-center justify-end">
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Expandable Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-6 border-t border-border">
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  <TokenPriceChart 
                    symbol={token.symbol}
                    priceHistory={priceHistory}
                  />
                  <TokenStats token={{ ...token, ...marketData }} />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};