// src/lib/tokenPrices.js
'use client';

import { useState, useEffect } from 'react';

export const SUPPORTED_TOKENS = [
  {
    id: 'ethereum',
    symbol: 'ETH',
    name: 'Ethereum',
    icon: 'Ξ',
    binanceSymbol: 'ETH',
  },
  {
    id: 'tether',
    symbol: 'USDT',
    name: 'Tether USD',
    icon: '₮',
    binanceSymbol: 'USDT',
  },
  {
    id: 'chainlink',
    symbol: 'LINK',
    name: 'Chainlink',
    icon: '⬡',
    binanceSymbol: 'LINK',
  },
  {
    id: 'uniswap',
    symbol: 'UNI',
    name: 'Uniswap',
    icon: '🦄',
    binanceSymbol: 'UNI',
  },
  {
    id: 'aave',
    symbol: 'AAVE',
    name: 'Aave',
    icon: '👻',
    binanceSymbol: 'AAVE',
  }
];

let priceCache = new Map();
let wsConnections = new Map();

async function fetchPrices() {
  try {
    const response = await fetch('/api/binance', {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.details || 'Failed to fetch prices');
    }

    const prices = await response.json();
    Object.entries(prices).forEach(([tokenId, price]) => {
      priceCache.set(tokenId, price);
    });

    return prices;
  } catch (error) {
    console.error('Error fetching prices:', error);
    return priceCache.size ? Object.fromEntries(priceCache) : null;
  }
}

function setupWebSocket(onPriceUpdate) {
  SUPPORTED_TOKENS.forEach(token => {
    if (wsConnections.has(token.symbol)) return;

    const symbol = token.binanceSymbol.toLowerCase();
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol}usdt@ticker`);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (!data.s) return;

        const price = {
          usd: parseFloat(data.c) || 0,
          usd_24h_change: parseFloat(data.P) || 0,
          volume: parseFloat(data.v) * parseFloat(data.c) || 0
        };

        priceCache.set(token.id, price);

        if (onPriceUpdate) {
          onPriceUpdate(Object.fromEntries(priceCache));
        }
      } catch (err) {}
    };

    ws.onerror = () => {
      wsConnections.delete(token.symbol);
      setTimeout(() => {
        if (!wsConnections.has(token.symbol)) {
          setupWebSocket(onPriceUpdate);
        }
      }, 5000);
    };

    wsConnections.set(token.symbol, ws);
  });

  return () => {
    wsConnections.forEach(ws => {
      if (ws.readyState === WebSocket.OPEN) ws.close();
    });
    wsConnections.clear();
  };
}

export function useTokenPrices() {
  const [prices, setPrices] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const updatePrices = async () => {
      try {
        const data = await fetchPrices();
        if (!mounted) return;
        
        if (data) {
          setPrices(data);
          setError(null);
        }
      } catch (err) {
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    updatePrices();
    const cleanup = setupWebSocket(newPrices => {
      if (mounted) setPrices(newPrices);
    });

    const interval = setInterval(updatePrices, 30000);

    return () => {
      mounted = false;
      clearInterval(interval);
      cleanup?.();
    };
  }, []);

  return { prices, loading, error };
}

export function formatNumber(num, decimals = 2) {
  if (!num) return '0';
  if (num >= 1e9) return (num / 1e9).toFixed(decimals) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(decimals) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(decimals) + 'K';
  return num.toFixed(decimals);
}

export function formatCryptoAmount(amount, decimals = 6) {
  if (!amount) return '0';
  if (amount < 0.000001) return '<0.000001';
  return parseFloat(amount).toFixed(decimals);
}