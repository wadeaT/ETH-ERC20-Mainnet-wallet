// app/api/getPrices/route.js
import { NextResponse } from 'next/server';
import { getTokenPrice } from '@/lib/ethers';

const tokens = [
  { symbol: 'ETH' },
  { symbol: 'USDT' },
  { symbol: 'USDC' },
  { symbol: 'BNB' },
  { symbol: 'LINK' },
  { symbol: 'UNI' },
  { symbol: 'AAVE' },
  { symbol: 'DAI' },
  { symbol: 'MATIC' },
  { symbol: 'SHIB' },
];

let cachedData = null;
let lastFetchTime = 0;
const CACHE_DURATION = 30000; // 30 seconds

export async function GET() {
  const currentTime = Date.now();
  if (cachedData && currentTime - lastFetchTime < CACHE_DURATION) {
    return NextResponse.json(cachedData);
  }

  try {
    const results = await Promise.allSettled(
      tokens.map(async (token) => {
        const price = await getTokenPrice(token.symbol);
        return { symbol: token.symbol, price };
      })
    );

    const prices = results.reduce((acc, result) => {
      if (result.status === 'fulfilled' && result.value.price !== null) {
        acc[result.value.symbol] = {
          usd: result.value.price,
          usd_24h_change: 0, // Chainlink doesn't provide 24-hour change
        };
      }
      return acc;
    }, {});

    cachedData = prices;
    lastFetchTime = currentTime;

    return NextResponse.json(prices);
  } catch (error) {
    console.error('Error fetching token prices:', error);
    return NextResponse.json({ error: 'Failed to fetch prices' }, { status: 500 });
  }
}
