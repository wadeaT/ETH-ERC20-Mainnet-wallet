// src/app/api/transactions/route.js
import { NextResponse } from 'next/server';

const ETHERSCAN_API_KEY = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY;
const ETHERSCAN_API = 'https://api.etherscan.io/api';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');

    if (!address) {
      return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 });
    }

    if (!ETHERSCAN_API_KEY) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    // Fetch both normal and token transactions
    const [normalResponse, tokenResponse] = await Promise.all([
      fetch(`${ETHERSCAN_API}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${ETHERSCAN_API_KEY}`),
      fetch(`${ETHERSCAN_API}?module=account&action=tokentx&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${ETHERSCAN_API_KEY}`)
    ]);

    const [normalData, tokenData] = await Promise.all([
      normalResponse.json(),
      tokenResponse.json()
    ]);

    // Handle API responses
    const transactions = {
      normal: normalData.result && Array.isArray(normalData.result) ? normalData.result : [],
      token: tokenData.result && Array.isArray(tokenData.result) ? tokenData.result : []
    };

    // If both API calls return no transactions, return an empty result
    if (transactions.normal.length === 0 && transactions.token.length === 0) {
      return NextResponse.json({ normal: [], token: [] });
    }

    return NextResponse.json(transactions);

  } catch (error) {
    console.error('Transaction API error:', error);
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}