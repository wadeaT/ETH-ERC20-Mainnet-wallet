// src/hooks/useWallet.js
'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { SUPPORTED_TOKENS } from '@/lib/constants/tokens';
import rpcProvider from '@/lib/rpcProvider';
import { useLiveTokenPrices } from './useLiveTokenPrices';

const ERC20_ABI = [
  'function balanceOf(address) view returns (uint256)',
  'function decimals() view returns (uint8)'
];

export function useWallet() {
  const { prices, loading: pricesLoading } = useLiveTokenPrices();
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
        const provider = rpcProvider.provider;
        const balances = await Promise.all(
          SUPPORTED_TOKENS.map(async token => {
            try {
              if (!token.contractAddress) {
                const balance = await provider.getBalance(walletAddress);
                return ethers.formatEther(balance);
              }
              const contract = new ethers.Contract(token.contractAddress, ERC20_ABI, provider);
              const [balance, decimals] = await Promise.all([
                contract.balanceOf(walletAddress),
                contract.decimals()
              ]);
              return ethers.formatUnits(balance, decimals);
            } catch (error) {
              console.error(`Balance fetch error for ${token.symbol}:`, error);
              return '0';
            }
          })
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