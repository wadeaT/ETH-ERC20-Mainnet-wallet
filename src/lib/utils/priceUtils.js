// src/lib/utils/priceUtils.js - IMPROVED FILE
import { SUPPORTED_TOKENS } from '../constants/tokens';

export async function fetchTokenPrices() {
    try {
      const response = await fetch('/api/prices', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store' // Disable caching
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch prices');
      }
  
      const prices = await response.json();
      
      if (prices.error) {
        throw new Error(prices.error);
      }
  
      return prices;
    } catch (error) {
      console.error('Price fetching error:', error);
      return null;
    }
  }

export function setupPriceWebSocket(tokens, onPriceUpdate) {
  const connections = new Map();

  tokens.forEach(token => {
    if (token.symbol === 'USDT') return; // Skip USDT as it's our base pair

    const symbol = `${token.binanceSymbol.toLowerCase()}usdt`;
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol}@ticker`);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (!data.s) return;

        const priceData = {
          id: token.id,
          usd: parseFloat(data.c) || 0,
          usd_24h_change: parseFloat(data.P) || 0,
          volume: parseFloat(data.v) * parseFloat(data.c) || 0,
          lastUpdate: Date.now()
        };

        onPriceUpdate(token.id, priceData);
      } catch (err) {
        console.error('WebSocket message error:', err);
      }
    };

    ws.onerror = () => {
      connections.delete(token.symbol);
      setTimeout(() => {
        if (!connections.has(token.symbol)) {
          setupPriceWebSocket([token], onPriceUpdate);
        }
      }, 5000);
    };

    connections.set(token.symbol, ws);
  });

  return () => {
    connections.forEach(ws => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    });
    connections.clear();
  };
}