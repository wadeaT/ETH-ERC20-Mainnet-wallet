// src/app/api/prices/route.js - NEW API ROUTE FILE
import { NextResponse } from 'next/server';
import { SUPPORTED_TOKENS } from '@/lib/constants/tokens';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';
const BINANCE_API = 'https://api.binance.com/api/v3';

let priceCache = new Map();
let lastFetchTime = 0;
const CACHE_DURATION = 30000; // 30 seconds

async function fetchCoingeckoPrices() {
  const ids = SUPPORTED_TOKENS.map(token => token.id).join(',');
  const response = await fetch(
    `${COINGECKO_API}/simple/price?ids=${ids}&vs_currencies=usd&include_24h_change=true`
  );

  if (!response.ok) {
    throw new Error('CoinGecko API error');
  }

  const data = await response.json();
  const prices = {};

  SUPPORTED_TOKENS.forEach(token => {
    const priceData = data[token.id];
    if (priceData) {
      prices[token.id] = {
        usd: priceData.usd,
        usd_24h_change: priceData.usd_24h_change
      };
    }
  });

  return prices;
}

async function fetchBinancePrices() {
  const responses = await Promise.all(
    SUPPORTED_TOKENS.map(token =>
      fetch(`${BINANCE_API}/ticker/24hr?symbol=${token.binanceSymbol}`)
    )
  );

  const data = await Promise.all(
    responses.map(response => response.json())
  );

  const prices = {};
  SUPPORTED_TOKENS.forEach((token, index) => {
    const tickerData = data[index];
    if (!tickerData.code) { // Check if there's no error
      prices[token.id] = {
        usd: parseFloat(tickerData.lastPrice) || 0,
        usd_24h_change: parseFloat(tickerData.priceChangePercent) || 0,
        volume: parseFloat(tickerData.volume) * parseFloat(tickerData.lastPrice) || 0
      };
    }
  });

  return prices;
}

export async function GET() {
  try {
    const now = Date.now();
    
    // Return cached data if valid
    if (priceCache.size && now - lastFetchTime < CACHE_DURATION) {
      return NextResponse.json(Object.fromEntries(priceCache));
    }

    // Try CoinGecko first, fallback to Binance
    try {
      const prices = await fetchCoingeckoPrices();
      
      // Update cache
      Object.entries(prices).forEach(([key, value]) => {
        priceCache.set(key, value);
      });
      lastFetchTime = now;

      return NextResponse.json(prices);
    } catch (error) {
      console.log('CoinGecko failed, trying Binance...');
      const prices = await fetchBinancePrices();
      
      // Update cache
      Object.entries(prices).forEach(([key, value]) => {
        priceCache.set(key, value);
      });
      lastFetchTime = now;

      return NextResponse.json(prices);
    }
  } catch (error) {
    console.error('All price fetching attempts failed:', error);
    
    // Return cached data if available
    if (priceCache.size) {
      return NextResponse.json(Object.fromEntries(priceCache));
    }

    // Return default values if everything fails
    const defaultPrices = SUPPORTED_TOKENS.reduce((acc, token) => {
      acc[token.id] = { usd: 0, usd_24h_change: 0 };
      return acc;
    }, {});

    return NextResponse.json(defaultPrices);
  }
}