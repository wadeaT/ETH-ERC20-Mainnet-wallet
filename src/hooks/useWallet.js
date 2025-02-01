// src/hooks/useWallet.js - CONSOLIDATED WALLET HOOK
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import rpcProvider from '@/lib/rpcProvider';
import { SUPPORTED_TOKENS } from '@/lib/constants/tokens';
import { useTokenPrices } from './useTokenPrices';

const ERC20_ABI = [
  'function balanceOf(address) view returns (uint256)',
  'function decimals() view returns (uint8)',
];

async function getTokenBalance(provider, token, walletAddress) {
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
}

export function useWallet() {
  const { rawPrices: prices, loading: pricesLoading } = useTokenPrices();
  const [walletData, setWalletData] = useState({
    address: '',
    balances: {},
    totalValue: 0,
    loading: true,
    error: null
  });

  const refreshWalletData = async () => {
    try {
      const walletAddress = localStorage.getItem('walletAddress');
      if (!walletAddress) {
        setWalletData(prev => ({ ...prev, loading: false }));
        return;
      }

      const provider = rpcProvider.provider;

      // Fetch all token balances in parallel
      const balancePromises = SUPPORTED_TOKENS.map(token => 
        getTokenBalance(provider, token, walletAddress)
      );

      const balanceResults = await Promise.all(balancePromises);
      const balances = SUPPORTED_TOKENS.reduce((acc, token, index) => {
        acc[token.symbol] = balanceResults[index];
        return acc;
      }, {});

      // Calculate total value
      const totalValue = SUPPORTED_TOKENS.reduce((total, token) => {
        const balance = parseFloat(balances[token.symbol] || 0);
        const price = prices?.[token.id]?.usd || 0;
        return total + (balance * price);
      }, 0);

      setWalletData({
        address: walletAddress,
        balances,
        totalValue,
        loading: false,
        error: null
      });

    } catch (error) {
      console.error('Wallet refresh error:', error);
      setWalletData(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }));
    }
  };

  useEffect(() => {
    if (!pricesLoading) {
      refreshWalletData();
    }
  }, [pricesLoading, prices]);

  useEffect(() => {
    const interval = setInterval(refreshWalletData, 30000);
    return () => clearInterval(interval);
  }, []);

  const tokens = SUPPORTED_TOKENS.map(token => ({
    ...token,
    balance: walletData.balances[token.symbol] || '0',
    price: prices?.[token.id]?.usd || 0,
    priceChange: prices?.[token.id]?.usd_24h_change || 0,
    value: parseFloat(walletData.balances[token.symbol] || '0') * (prices?.[token.id]?.usd || 0)
  }));

  return {
    tokens,
    totalValue: walletData.totalValue,
    address: walletData.address,
    loading: walletData.loading || pricesLoading,
    error: walletData.error,
    refreshWalletData
  };
}