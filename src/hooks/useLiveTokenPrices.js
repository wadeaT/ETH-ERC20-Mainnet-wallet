// src/hooks/useLiveTokenPrices.js
'use client';

import { useState, useEffect } from 'react';
import { SUPPORTED_TOKENS } from '@/lib/constants/tokens';

export function useLiveTokenPrices() {
  const [prices, setPrices] = useState({});
  const [priceHistory, setPriceHistory] = useState({});
  const [status, setStatus] = useState({ loading: true, error: null });

  // Initialize and maintain price history
  useEffect(() => {
    if (Object.keys(prices).length > 0) {
      // Update history when new prices come in
      Object.entries(prices).forEach(([tokenId, priceData]) => {
        setPriceHistory(prev => ({
          ...prev,
          [tokenId]: [
            ...(prev[tokenId] || []).slice(-23), // Keep last 23 points
            {
              time: priceData.lastUpdate || Date.now(),
              price: priceData.usd
            }
          ]
        }));
      });
    }
  }, [prices]);

  // Main WebSocket and price fetching logic
  useEffect(() => {
    let mounted = true;
    let heartbeatInterval;
    let reconnectTimeout;

    async function fetchInitialPrices() {
      try {
        const response = await fetch('/api/prices');
        const data = await response.json();
        if (mounted) {
          setPrices(data);
          setStatus({ loading: false, error: null });
        }
      } catch (error) {
        console.error('Initial price fetch error:', error);
        if (mounted) {
          setStatus({ loading: false, error: 'Failed to fetch prices' });
        }
      }
    }

    function connectWebSocket() {
      const validTokens = SUPPORTED_TOKENS.filter(token => 
        !['STETH', 'WBETH'].includes(token.symbol)
      );

      const streams = validTokens
        .map(token => `${token.symbol.toLowerCase()}usdt@ticker`)
        .join('/');

      const ws = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${streams}`);

      ws.onopen = () => {
        console.log('WebSocket Connected');
        
        heartbeatInterval = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ ping: Date.now() }));
          }
        }, 30000);
      };

      ws.onmessage = (event) => {
        if (!mounted) return;
        try {
          const message = JSON.parse(event.data);
          
          if (message.pong) return;

          if (message.data && message.data.s) {
            const data = message.data;
            const symbol = data.s.replace('USDT', '');
            const token = SUPPORTED_TOKENS.find(t => t.symbol === symbol);

            if (token) {
              const currentPrice = parseFloat(data.c);
              setPrices(prev => ({
                ...prev,
                [token.id]: {
                  usd: currentPrice,
                  usd_24h_change: parseFloat(data.P),
                  volume: parseFloat(data.v) * currentPrice,
                  lastUpdate: Date.now()
                }
              }));

              // Handle ETH derivatives
              if (symbol === 'ETH') {
                const derivatives = ['STETH', 'WBETH'];
                derivatives.forEach(derivativeSymbol => {
                  const derivativeToken = SUPPORTED_TOKENS.find(t => t.symbol === derivativeSymbol);
                  if (derivativeToken) {
                    setPrices(prev => ({
                      ...prev,
                      [derivativeToken.id]: {
                        usd: currentPrice,
                        usd_24h_change: parseFloat(data.P),
                        lastUpdate: Date.now()
                      }
                    }));
                  }
                });
              }
            }
          }
        } catch (error) {
          console.warn('WebSocket message parsing error:', error);
        }
      };

      ws.onerror = (error) => {
        console.warn('WebSocket error, reconnecting...', error);
        cleanup();
        reconnectTimeout = setTimeout(connectWebSocket, 5000);
      };

      ws.onclose = () => {
        console.log('WebSocket closed, reconnecting...');
        cleanup();
        reconnectTimeout = setTimeout(connectWebSocket, 5000);
      };

      return ws;
    }

    function cleanup() {
      if (heartbeatInterval) clearInterval(heartbeatInterval);
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
    }

    fetchInitialPrices();
    const ws = connectWebSocket();
    const pollInterval = setInterval(fetchInitialPrices, 30000);

    return () => {
      mounted = false;
      cleanup();
      if (ws) ws.close();
      clearInterval(pollInterval);
    };
  }, []);

  return {
    prices,
    priceHistory,
    loading: status.loading,
    error: status.error,
    isLive: Object.keys(prices).length > 0
  };
}