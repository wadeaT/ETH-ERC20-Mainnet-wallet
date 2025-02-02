// src/lib/priceWebSocket.js - IMPROVED WITH DEBUGGING

import { SUPPORTED_TOKENS } from './constants/tokens';

export function setupPriceWebSocket(onPriceUpdate) {
  const lastUpdateTimes = new Map();

  // Track updates for each token
  function trackUpdate(tokenId) {
    lastUpdateTimes.set(tokenId, Date.now());
  }

  // Check for stale tokens every minute
  setInterval(() => {
    const now = Date.now();
    SUPPORTED_TOKENS.forEach(token => {
      const lastUpdate = lastUpdateTimes.get(token.id);
      if (!lastUpdate || (now - lastUpdate) > 30000) {
        console.log(`Token ${token.symbol} hasn't updated in 30 seconds`);
      }
    });
  }, 60000);

  // Setup Binance WebSocket
  function setupBinanceSocket() {
    // Create pairs for trading tokens
    const tradingPairs = SUPPORTED_TOKENS
      .map(token => token.symbol === 'WETH' ? 'ETHUSDT' : `${token.symbol}USDT`)
      .filter(pair => pair !== 'WBETHUSDT' && pair !== 'STETHUSDT') // Exclude non-trading pairs
      .map(pair => pair.toLowerCase() + '@ticker');

    const wsUrl = `wss://stream.binance.com:9443/stream?streams=${tradingPairs.join('/')}`;
    const ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
      try {
        const { data } = JSON.parse(event.data);
        if (!data) return;

        // Extract symbol from stream data
        let symbol = data.s.replace('USDT', '');
        
        // Handle special cases
        if (symbol === 'ETH') {
          // Update WETH, STETH, and WBETH with ETH price
          ['WETH', 'STETH', 'WBETH'].forEach(derivativeSymbol => {
            const token = SUPPORTED_TOKENS.find(t => t.symbol === derivativeSymbol);
            if (token) {
              onPriceUpdate(token.id, {
                usd: parseFloat(data.c),
                usd_24h_change: parseFloat(data.P),
                lastUpdate: Date.now()
              });
              trackUpdate(token.id);
            }
          });
        }

        // Update regular token
        const token = SUPPORTED_TOKENS.find(t => t.symbol === symbol);
        if (token) {
          onPriceUpdate(token.id, {
            usd: parseFloat(data.c),
            usd_24h_change: parseFloat(data.P),
            lastUpdate: Date.now()
          });
          trackUpdate(token.id);
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket closed, attempting to reconnect...');
      setTimeout(setupBinanceSocket, 5000);
    };

    return ws;
  }

  // Setup REST API polling for tokens that don't update via WebSocket
  let pollTimer = setInterval(async () => {
    try {
      const now = Date.now();
      const staleTokens = Array.from(SUPPORTED_TOKENS).filter(token => {
        const lastUpdate = lastUpdateTimes.get(token.id);
        return !lastUpdate || (now - lastUpdate) > 30000;
      });

      if (staleTokens.length > 0) {
        console.log('Polling for stale tokens:', staleTokens.map(t => t.symbol));
        const response = await fetch('/api/prices');
        const prices = await response.json();
        
        staleTokens.forEach(token => {
          if (prices[token.id]) {
            onPriceUpdate(token.id, prices[token.id]);
            trackUpdate(token.id);
          }
        });
      }
    } catch (error) {
      console.error('Polling error:', error);
    }
  }, 30000);  // Poll every 30 seconds

  // Start WebSocket
  const ws = setupBinanceSocket();

  // Return cleanup function
  return () => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.close();
    }
    clearInterval(pollTimer);
  };
}