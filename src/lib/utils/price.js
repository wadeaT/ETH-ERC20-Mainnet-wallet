// src/lib/utils/price.js
import { SUPPORTED_TOKENS } from '@/lib/constants/tokens';

// Cache mechanism
let priceCache = new Map();
let lastFetchTime = 0;
const CACHE_DURATION = 30000; // 30 seconds

export async function fetchTokenPrices() {
  try {
    // Check cache first
    const now = Date.now();
    if (priceCache.size && now - lastFetchTime < CACHE_DURATION) {
      return Object.fromEntries(priceCache);
    }

    const response = await fetch('/api/prices', {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store'
    });
    
    if (!response.ok) throw new Error('Failed to fetch prices');
    const data = await response.json();

    // Update cache
    Object.entries(data).forEach(([key, value]) => priceCache.set(key, value));
    lastFetchTime = now;

    return data;
  } catch (error) {
    console.error('Price fetching error:', error);
    return priceCache.size ? Object.fromEntries(priceCache) : null;
  }
}

export function setupPriceWebSocket(onPriceUpdate) {
  const connections = new Map();

  function connectWebSocket(token) {
    if (token.symbol === 'USDT') return;

    const symbol = `${token.binanceSymbol.toLowerCase()}usdt`;
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol}@ticker`);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (!data.s) return;

        const priceData = {
          usd: parseFloat(data.c) || 0,
          usd_24h_change: parseFloat(data.P) || 0,
          volume: parseFloat(data.v) * parseFloat(data.c) || 0,
          lastUpdate: Date.now()
        };

        // Update cache
        priceCache.set(token.id, priceData);
        onPriceUpdate(token.id, priceData);
      } catch (err) {
        console.warn(`WebSocket message error for ${token.symbol}:`, err);
      }
    };

    ws.onerror = (event) => {
      console.warn(`WebSocket error for ${token.symbol}:`, event);
      ws.close();
    };

    ws.onclose = () => {
      console.log(`WebSocket closed for ${token.symbol}, attempting reconnect...`);
      connections.delete(token.symbol);
      setTimeout(() => {
        if (!connections.has(token.symbol)) {
          connectWebSocket(token);
        }
      }, 5000);
    };

    connections.set(token.symbol, ws);
  }

  // Setup connections for all tokens
  SUPPORTED_TOKENS.forEach(token => connectWebSocket(token));

  return () => {
    connections.forEach(ws => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    });
    connections.clear();
  };
}