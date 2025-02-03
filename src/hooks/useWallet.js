// src/hooks/useWallet.js
'use client';

import { useState, useEffect } from 'react';
import { SUPPORTED_TOKENS } from '@/lib/constants/tokens';
import rpcProvider from '@/lib/rpcProvider';
import { getTokenBalance } from '@/services/transactionService';
import { useTokenPrices } from './useTokenPrices';

export function useWallet() {
  const { prices, loading: pricesLoading } = useTokenPrices();
  const [state, setState] = useState({
    address: '',
    balances: {},
    loading: true,
    error: null
  });

  useEffect(() => {
    let mounted = true;
    const walletAddress = localStorage.getItem('walletAddress');

    if (!walletAddress) {
      setState(prev => ({ ...prev, loading: false }));
      return;
    }

    const fetchBalances = async () => {
      try {
        const balances = await Promise.all(
          SUPPORTED_TOKENS.map(token => 
            getTokenBalance(
              token.contractAddress,
              walletAddress
            )
          )
        );

        if (mounted) {
          setState({
            address: walletAddress,
            balances: SUPPORTED_TOKENS.reduce((acc, token, i) => ({ 
              ...acc, [token.symbol]: balances[i] 
            }), {}),
            loading: false,
            error: null
          });
        }
      } catch (error) {
        console.error('Balance fetch error:', error);
        if (mounted) {
          setState(prev => ({
            ...prev,
            loading: false,
            error: 'Failed to load wallet data'
          }));
        }
      }
    };

    fetchBalances();
    const interval = setInterval(fetchBalances, 30000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const tokens = SUPPORTED_TOKENS.map(token => ({
    ...token,
    balance: state.balances[token.symbol] || '0',
    price: prices[token.id]?.usd || 0,
    priceChange: prices[token.id]?.usd_24h_change || 0,
    value: (parseFloat(state.balances[token.symbol] || '0') * (prices[token.id]?.usd || 0))
  }));

  return {
    tokens,
    totalValue: tokens.reduce((sum, token) => sum + (token.value || 0), 0),
    address: state.address,
    loading: state.loading || pricesLoading,
    error: state.error
  };
}