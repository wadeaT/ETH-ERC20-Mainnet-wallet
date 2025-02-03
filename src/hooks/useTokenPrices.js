// src/hooks/useTokenPrices.js
'use client';

import { useState, useEffect } from 'react';
import { priceWs } from '@/services/priceWebSocket';

export function useTokenPrices() {
  const [state, setState] = useState({
    prices: {},
    loading: true,
    error: null
  });

  useEffect(() => {
    const unsubscribers = new Map();
    setState(prev => ({ ...prev, loading: true }));

    try {
      // Initialize price data from API
      fetch('/api/prices')
        .then(res => res.json())
        .then(data => {
          setState(prev => ({
            ...prev,
            prices: data,
            loading: false,
            error: null
          }));

          // Subscribe to WebSocket updates for each token
          Object.keys(data).forEach(tokenId => {
            const unsubscribe = priceWs.subscribe(tokenId, priceData => {
              setState(prev => ({
                ...prev,
                prices: {
                  ...prev.prices,
                  [tokenId]: {
                    usd: priceData.price,
                    usd_24h_change: priceData.priceChange,
                    lastUpdate: priceData.timestamp
                  }
                }
              }));
            });
            unsubscribers.set(tokenId, unsubscribe);
          });
        })
        .catch(error => {
          console.error('Error fetching initial prices:', error);
          setState(prev => ({
            ...prev,
            loading: false,
            error: 'Failed to fetch prices'
          }));
        });
    } catch (error) {
      console.error('Error in price hook:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to initialize price service'
      }));
    }

    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
    };
  }, []);

  return state;
}