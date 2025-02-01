// src/hooks/useTokenPrices.js - UPDATED WITH DEBUGGING
import { useState, useEffect } from 'react';
import { SUPPORTED_TOKENS } from '@/lib/constants/tokens';
import { setupPriceWebSocket } from '@/lib/priceWebSocket';

export function useTokenPrices() {
  const [data, setData] = useState({
    tokens: SUPPORTED_TOKENS,
    prices: {},
    loading: true,
    error: null
  });

  useEffect(() => {
    let mounted = true;

    // Initial price fetch
    const fetchInitialPrices = async () => {
      try {
        const response = await fetch('/api/prices');
        if (!response.ok) throw new Error('Failed to fetch initial prices');
        
        const initialPrices = await response.json();
        console.log('Initial prices fetched:', initialPrices); // Debug log
        
        if (mounted) {
          setData(prev => ({
            ...prev,
            prices: initialPrices,
            loading: false
          }));
        }
      } catch (error) {
        console.error('Initial price fetch error:', error);
        if (mounted) {
          setData(prev => ({
            ...prev,
            loading: false,
            error: error.message
          }));
        }
      }
    };

    fetchInitialPrices();

    // Set up WebSocket for real-time updates
    const cleanup = setupPriceWebSocket((tokenId, priceData) => {
      if (mounted) {
        setData(prev => {
          console.log(`Updating price for ${tokenId}:`, priceData); // Debug log
          return {
            ...prev,
            prices: {
              ...prev.prices,
              [tokenId]: {
                ...prev.prices[tokenId],
                ...priceData,
                lastUpdate: Date.now()
              }
            }
          };
        });
      }
    });

    return () => {
      mounted = false;
      cleanup();
    };
  }, []);

  // Transform data for components with logging
  const tokenData = data.tokens
    .filter(token => token.id in data.prices)
    .map(token => {
      const tokenInfo = {
        ...token,
        price: data.prices[token.id]?.usd || 0,
        priceChange: data.prices[token.id]?.usd_24h_change || 0,
        volume: data.prices[token.id]?.volume || 0,
        lastUpdate: data.prices[token.id]?.lastUpdate
      };
      return tokenInfo;
    });

  console.log('Processed token data:', tokenData); // Debug log

  return {
    tokens: tokenData,
    loading: data.loading,
    error: data.error,
    rawPrices: data.prices
  };
}