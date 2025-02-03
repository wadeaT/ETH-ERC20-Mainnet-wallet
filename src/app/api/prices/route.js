// src/app/api/prices/route.js
import { NextResponse } from 'next/server';
import { SUPPORTED_TOKENS } from '@/lib/constants/tokens';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const cache = {};

async function fetchWithRetry(url, retries = 2) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'ETH Wallet Hub'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const id = searchParams.get('id');

    // Return cached data if available
    const cacheKey = `${action || 'all'}-${id || 'prices'}`;
    if (cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < CACHE_DURATION) {
      return NextResponse.json(cache[cacheKey].data);
    }

    // Get prices for all supported tokens
    if (!action && !id) {
      const ids = SUPPORTED_TOKENS.map(token => token.id).join(',');
      const data = await fetchWithRetry(
        `${COINGECKO_API}/simple/price?ids=${ids}&vs_currencies=usd&include_24h_change=true`
      );

      const transformedData = {};
      Object.entries(data).forEach(([tokenId, prices]) => {
        transformedData[tokenId] = {
          usd: prices.usd,
          usd_24h_change: prices.usd_24h_change,
          lastUpdate: Date.now()
        };
      });

      cache[cacheKey] = { timestamp: Date.now(), data: transformedData };
      return NextResponse.json(transformedData);
    }

    // Handle specific token requests
    if (!id) {
      return NextResponse.json({ error: 'Token ID required' }, { status: 400 });
    }

    const days = searchParams.get('days') || '1';
    const apiUrl = action === 'history' 
      ? `${COINGECKO_API}/coins/${id}/market_chart?vs_currency=usd&days=${days}`
      : `${COINGECKO_API}/coins/${id}?localization=false&market_data=true`;

    const data = await fetchWithRetry(apiUrl);
    cache[cacheKey] = { timestamp: Date.now(), data };
    
    return NextResponse.json(data);

  } catch (error) {
    console.error('API error:', error);

    // Return cached data if available
    const cacheKey = `all-prices`;
    if (cache[cacheKey]) {
      return NextResponse.json(cache[cacheKey].data);
    }

    // Fallback data
    return NextResponse.json(
      SUPPORTED_TOKENS.reduce((acc, token) => {
        acc[token.id] = { usd: 0, usd_24h_change: 0, lastUpdate: Date.now() };
        return acc;
      }, {}),
      { status: 200 }
    );
  }
}