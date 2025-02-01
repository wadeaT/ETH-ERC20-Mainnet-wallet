// src/lib/priceWebSocket.js - UPDATED WITH DEBUGGING
import { SUPPORTED_TOKENS } from './constants/tokens';

export function setupPriceWebSocket(onPriceUpdate) {
  const connections = new Map();
  
  // Create mapping of symbols to token IDs
  const symbolMap = SUPPORTED_TOKENS.reduce((acc, token) => {
    const symbol = token.binanceSymbol.toUpperCase();
    acc[symbol] = token.id;
    // Add debugging
    console.log(`Setting up WebSocket for ${symbol} -> ${token.id}`);
    return acc;
  }, {});

  Object.keys(symbolMap).forEach(symbol => {
    const wsSymbol = symbol.toLowerCase();
    const wsUrl = `wss://stream.binance.com:9443/ws/${wsSymbol}@ticker`;
    console.log(`Connecting to WebSocket: ${wsUrl}`);
    
    const ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const tokenId = symbolMap[data.s];

        if (tokenId) {
          const priceData = {
            usd: parseFloat(data.c),
            usd_24h_change: parseFloat(data.P),
            volume: parseFloat(data.v) * parseFloat(data.c),
            lastUpdate: Date.now()
          };
          onPriceUpdate(tokenId, priceData);
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    };

    ws.onopen = () => {
      console.log(`WebSocket connected for ${symbol}`);
    };

    connections.set(symbol, ws);
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