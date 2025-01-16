// lib/api.js

// Using multiple API endpoints for redundancy
const PRICE_APIS = {
  COINGECKO: 'https://api.coingecko.com/api/v3',
  BINANCE: 'https://api.binance.com/api/v3',
  BACKUP: 'https://min-api.cryptocompare.com/data'
};

let priceCache = null;
let lastFetchTime = 0;
const CACHE_DURATION = 60000; // Increased to 60 seconds to avoid rate limits

async function fetchCoinGeckoPrices() {
  const ids = ['ethereum', 'tether', 'shiba-inu'];
  const response = await fetch(
    `${PRICE_APIS.COINGECKO}/simple/price?ids=${ids.join(',')}&vs_currencies=usd&include_24h_change=true`
  );

  if (!response.ok) {
    throw new Error('CoinGecko API error');
  }

  const data = await response.json();
  return {
    ethereum: {
      usd: data.ethereum?.usd || 0,
      usd_24h_change: data.ethereum?.usd_24h_change || 0
    },
    tether: {
      usd: data.tether?.usd || 1,
      usd_24h_change: data.tether?.usd_24h_change || 0
    },
    'shiba-inu': {
      usd: data['shiba-inu']?.usd || 0,
      usd_24h_change: data['shiba-inu']?.usd_24h_change || 0
    }
  };
}

async function fetchBinancePrices() {
  const symbols = ['ETHUSDT', 'SHIBUSDT'];
  const responses = await Promise.all(
    symbols.map(symbol => 
      fetch(`${PRICE_APIS.BINANCE}/ticker/24hr?symbol=${symbol}`)
    )
  );

  const data = await Promise.all(
    responses.map(response => response.json())
  );

  return {
    ethereum: {
      usd: parseFloat(data[0]?.lastPrice) || 0,
      usd_24h_change: parseFloat(data[0]?.priceChangePercent) || 0
    },
    tether: {
      usd: 1,
      usd_24h_change: 0
    },
    'shiba-inu': {
      usd: parseFloat(data[1]?.lastPrice) || 0,
      usd_24h_change: parseFloat(data[1]?.priceChangePercent) || 0
    }
  };
}

export async function fetchTokenPrices() {
  try {
    // Check cache first
    const now = Date.now();
    if (priceCache && now - lastFetchTime < CACHE_DURATION) {
      return priceCache;
    }

    // Try CoinGecko first
    try {
      const prices = await fetchCoinGeckoPrices();
      priceCache = prices;
      lastFetchTime = now;
      return prices;
    } catch (error) {
      console.log('CoinGecko failed, trying Binance...');
      // If CoinGecko fails, try Binance
      const prices = await fetchBinancePrices();
      priceCache = prices;
      lastFetchTime = now;
      return prices;
    }

  } catch (error) {
    console.error('All price fetching attempts failed:', error);
    
    // Return cached data if available
    if (priceCache) {
      return priceCache;
    }

    // Return default values if everything fails
    return {
      ethereum: { usd: 0, usd_24h_change: 0 },
      tether: { usd: 1, usd_24h_change: 0 },
      'shiba-inu': { usd: 0, usd_24h_change: 0 }
    };
  }
}