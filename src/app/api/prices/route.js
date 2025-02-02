// src/app/api/prices/route.js
import { NextResponse } from 'next/server';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const id = searchParams.get('id');
    const days = searchParams.get('days') || '1';

    if (!id) {
      return NextResponse.json(
        { error: 'Token ID is required' },
        { status: 400 }
      );
    }

    let apiUrl;
    if (action === 'history') {
      apiUrl = `${COINGECKO_API}/coins/${id}/market_chart?vs_currency=usd&days=${days}`;
    } else if (action === 'market') {
      apiUrl = `${COINGECKO_API}/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`;
    } else {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }

    console.log(`Fetching ${action} data for ${id}`);
    
    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 60 }
    });

    if (!response.ok) {
      console.error(`CoinGecko API error (${id}):`, response.status);
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data = await response.json();
    
    // For market chart data, ensure prices array exists
    if (action === 'history' && !data.prices) {
      return NextResponse.json({ prices: [] });
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch data' },
      { status: 500 }
    );
  }
}