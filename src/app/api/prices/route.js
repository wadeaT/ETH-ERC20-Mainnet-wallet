// src/app/api/prices/route.js - USING CRYPTOCOMPARE API
import { NextResponse } from 'next/server';
import { SUPPORTED_TOKENS } from '@/lib/constants/tokens';

const CRYPTOCOMPARE_API = 'https://min-api.cryptocompare.com/data';
const API_KEY = 'YOUR_API_KEY'; // You can even use it without API key

async function fetchPrices() {
  try {
    // Get all symbols for the request
    const symbols = SUPPORTED_TOKENS.map(token => token.symbol).join(',');
    
    const response = await fetch(
      `${CRYPTOCOMPARE_API}/pricemultifull?fsyms=${symbols}&tsyms=USD`,
      {
        headers: API_KEY ? { 'authorization': `Apikey ${API_KEY}` } : {}
      }
    );
    
    const data = await response.json();
    const prices = {};

    if (data.RAW) {
      SUPPORTED_TOKENS.forEach(token => {
        const rawData = data.RAW[token.symbol]?.USD;
        if (rawData) {
          prices[token.id] = {
            usd: rawData.PRICE,
            usd_24h_change: ((rawData.PRICE - rawData.OPEN24HOUR) / rawData.OPEN24HOUR) * 100,
            volume: rawData.VOLUME24HOUR,
            lastUpdate: Date.now()
          };
        } else {
          // Fallback for stable coins
          if (['USDC', 'DAI'].includes(token.symbol)) {
            prices[token.id] = {
              usd: 1,
              usd_24h_change: 0,
              volume: 0,
              lastUpdate: Date.now()
            };
          } else {
            console.warn(`No price data for ${token.symbol}`);
            prices[token.id] = {
              usd: 0,
              usd_24h_change: 0,
              volume: 0,
              lastUpdate: Date.now()
            };
          }
        }
      });
    }

    return prices;
  } catch (error) {
    console.error('Error fetching prices:', error);
    throw error;
  }
}

export async function GET() {
  try {
    const prices = await fetchPrices();
    return NextResponse.json(prices);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch prices' },
      { status: 500 }
    );
  }
}