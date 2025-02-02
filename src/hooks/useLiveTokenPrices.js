// src/hooks/useLiveTokenPrices.js - FIXED WEBSOCKET CONNECTION
'use client';

import { useState, useEffect } from 'react';
import { SUPPORTED_TOKENS } from '@/lib/constants/tokens';

export function useLiveTokenPrices() {
  const [prices, setPrices] = useState({});
  const [status, setStatus] = useState({ loading: true, error: null });

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
      // Filter out tokens that don't have Binance pairs
      const validTokens = SUPPORTED_TOKENS.filter(token => 
        !['STETH', 'WBETH'].includes(token.symbol)
      );

      // Create combined streams URL
      const streams = validTokens
        .map(token => `${token.symbol.toLowerCase()}usdt@ticker`)
        .join('/');

      const ws = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${streams}`);

      ws.onopen = () => {
        console.log('WebSocket Connected');
        
        // Setup heartbeat
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
          
          // Handle heartbeat response
          if (message.pong) return;

          // Handle price updates
          if (message.data && message.data.s) {
            const data = message.data;
            const symbol = data.s.replace('USDT', '');
            const token = SUPPORTED_TOKENS.find(t => t.symbol === symbol);

            if (token) {
              setPrices(prev => ({
                ...prev,
                [token.id]: {
                  usd: parseFloat(data.c),
                  usd_24h_change: parseFloat(data.P),
                  volume: parseFloat(data.v) * parseFloat(data.c),
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
                        usd: parseFloat(data.c),
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

    // Initial setup
    fetchInitialPrices();
    const ws = connectWebSocket();

    // Polling fallback for reliability
    const pollInterval = setInterval(fetchInitialPrices, 30000);

    // Cleanup on unmount
    return () => {
      mounted = false;
      cleanup();
      if (ws) ws.close();
      clearInterval(pollInterval);
    };
  }, []);

  return {
    prices,
    loading: status.loading,
    error: status.error,
    isLive: Object.keys(prices).length > 0
  };
}