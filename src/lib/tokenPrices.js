// src/lib/tokenPrices.js

const COINGECKO_API = 'https://api.coingecko.com/api/v3';
const BINANCE_API = 'https://api.binance.com/api/v3';

// List of supported tokens with their identifiers and contract addresses
export const SUPPORTED_TOKENS = [
  {
    id: 'ethereum',
    symbol: 'ETH',
    name: 'Ethereum',
    icon: 'Ξ',
    binanceSymbol: 'ETHUSDT',
    isNative: true
  },
  {
    id: 'tether',
    symbol: 'USDT',
    name: 'Tether USD',
    icon: '₮',
    binanceSymbol: 'USDTUSDT',
    contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7'
  },
  {
    id: 'usd-coin',
    symbol: 'USDC',
    name: 'USD Coin',
    icon: '$',
    binanceSymbol: 'USDCUSDT',
    contractAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
  },
  {
    id: 'chainlink',
    symbol: 'LINK',
    name: 'Chainlink',
    icon: '🔗',
    binanceSymbol: 'LINKUSDT',
    contractAddress: '0x514910771AF9Ca656af840dff83E8264EcF986CA'
  },
  {
    id: 'uniswap',
    symbol: 'UNI',
    name: 'Uniswap',
    icon: '🦄',
    binanceSymbol: 'UNIUSDT',
    contractAddress: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984'
  },
  {
    id: 'aave',
    symbol: 'AAVE',
    name: 'Aave',
    icon: '👻',
    binanceSymbol: 'AAVEUSDT',
    contractAddress: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9'
  }
];

// Cache management
let priceCache = new Map();
let lastFetchTime = 0;
const CACHE_DURATION = 10000; // 10 seconds cache

// WebSocket connection for real-time updates
let binanceWs = null;
const subscribers = new Set();

function initializeWebSocket() {
  if (binanceWs) return;

  const symbols = SUPPORTED_TOKENS.map(token => token.binanceSymbol.toLowerCase());
  const streams = symbols.map(symbol => `${symbol.toLowerCase()}@ticker`).join('/');
  
  try {
    binanceWs = new WebSocket(`wss://stream.binance.com:9443/ws/${streams}`);

    binanceWs.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const token = SUPPORTED_TOKENS.find(t => 
        t.binanceSymbol.toLowerCase() === data.s.toLowerCase()
      );
      
      if (token) {
        const price = parseFloat(data.c);
        const change24h = parseFloat(data.P);
        const volume24h = parseFloat(data.v) * price;
        
        priceCache.set(token.id, {
          usd: price,
          usd_24h_change: change24h,
          volume_24h: volume24h,
          lastUpdated: Date.now()
        });

        // Notify subscribers
        subscribers.forEach(callback => callback(Object.fromEntries(priceCache)));
      }
    };

    binanceWs.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    binanceWs.onclose = () => {
      console.log('WebSocket closed, attempting to reconnect...');
      binanceWs = null;
      setTimeout(initializeWebSocket, 5000); // Reconnect after 5 seconds
    };
  } catch (error) {
    console.error('WebSocket initialization error:', error);
  }
}

// Fetch initial prices from CoinGecko
async function fetchInitialPrices() {
  try {
    const ids = SUPPORTED_TOKENS.map(token => token.id).join(',');
    const response = await fetch(
      `${COINGECKO_API}/simple/price?ids=${ids}&vs_currencies=usd&include_24h_change=true&include_24h_vol=true`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch prices from CoinGecko');
    }

    const data = await response.json();
    SUPPORTED_TOKENS.forEach(token => {
      if (data[token.id]) {
        priceCache.set(token.id, {
          usd: data[token.id].usd,
          usd_24h_change: data[token.id].usd_24h_change,
          volume_24h: data[token.id].usd_24h_vol,
          lastUpdated: Date.now()
        });
      }
    });

    return Object.fromEntries(priceCache);
  } catch (error) {
    console.error('Error fetching initial prices:', error);
    return fetchBackupPrices();
  }
}

// Backup price fetch from Binance
async function fetchBackupPrices() {
  try {
    const promises = SUPPORTED_TOKENS.map(token => 
      fetch(`${BINANCE_API}/ticker/24h?symbol=${token.binanceSymbol}`)
        .then(res => res.json())
    );

    const results = await Promise.all(promises);
    results.forEach((data, index) => {
      const token = SUPPORTED_TOKENS[index];
      priceCache.set(token.id, {
        usd: parseFloat(data.lastPrice),
        usd_24h_change: parseFloat(data.priceChangePercent),
        volume_24h: parseFloat(data.volume) * parseFloat(data.lastPrice),
        lastUpdated: Date.now()
      });
    });

    return Object.fromEntries(priceCache);
  } catch (error) {
    console.error('Error fetching backup prices:', error);
    return null;
  }
}

// Main function to get prices
export async function getTokenPrices(callback) {
  // Initialize WebSocket if not already done
  if (typeof window !== 'undefined') { // Only initialize WebSocket in browser environment
    initializeWebSocket();
  }

  // Add subscriber if callback is provided
  if (callback) {
    subscribers.add(callback);
  }

  // Check if cache is valid
  const now = Date.now();
  if (priceCache.size > 0 && now - lastFetchTime < CACHE_DURATION) {
    return Object.fromEntries(priceCache);
  }

  // Fetch initial prices if cache is empty or expired
  const prices = await fetchInitialPrices();
  if (prices) {
    lastFetchTime = now;
    return prices;
  }

  // Return cached data if fetch fails
  return priceCache.size > 0 ? Object.fromEntries(priceCache) : null;
}

// Cleanup function
export function cleanup() {
  if (binanceWs) {
    binanceWs.close();
    binanceWs = null;
  }
  subscribers.clear();
  priceCache.clear();
}

// Format numbers with appropriate suffixes
export function formatNumber(num, decimals = 2) {
  if (num >= 1e9) {
    return (num / 1e9).toFixed(decimals) + 'B';
  }
  if (num >= 1e6) {
    return (num / 1e6).toFixed(decimals) + 'M';
  }
  if (num >= 1e3) {
    return (num / 1e3).toFixed(decimals) + 'K';
  }
  return num.toFixed(decimals);
}

// Format crypto amounts
export function formatCryptoAmount(amount, symbol) {
  if (amount < 0.00001) {
    return '<0.00001';
  }
  return amount.toFixed(5);
}