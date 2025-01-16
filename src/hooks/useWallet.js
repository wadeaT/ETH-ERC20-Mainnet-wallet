// hooks/useWallet.js
import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { getTokenBalance, sendTransaction } from '@/lib/ethers';
import { fetchTokenPrices } from '@/lib/api';

export function useWallet() {
  const [walletData, setWalletData] = useState({
    address: '',
    ethBalance: '0',
    usdtBalance: '0',
    shibBalance: '0',
    assets: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleSendTransaction = async (toAddress, amount, tokenSymbol) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Please login to send transactions');

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) throw new Error('Wallet not found');

      const userData = userDoc.data();
      
      // Check if we have the private key
      if (!userData.encryptedKey) {
        throw new Error('Wallet private key not found');
      }

      // Make sure the private key has the 0x prefix
      const privateKey = userData.encryptedKey.startsWith('0x') 
        ? userData.encryptedKey 
        : `0x${userData.encryptedKey}`;

      console.log('Sending transaction with token:', tokenSymbol);
      console.log('Amount:', amount);
      
      // Get token contract address based on symbol
      let contractAddress = null;
      if (tokenSymbol !== 'ETH') {
        const tokenConfig = {
          'USDT': '0xdAC17F958D2ee523a2206206994597C13D831ec7',
          'SHIB': '0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce'
        };
        contractAddress = tokenConfig[tokenSymbol];
        if (!contractAddress) throw new Error('Unsupported token');
      }

      // Send the transaction
      const receipt = await sendTransaction(privateKey, toAddress, amount.toString(), {
        symbol: tokenSymbol,
        contractAddress: contractAddress
      });

      // Refresh balances
      await refreshWalletData();

      return receipt;
    } catch (error) {
      console.error('Transaction error:', error);
      throw new Error(error.message || 'Failed to send transaction');
    }
  };

  const refreshWalletData = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        setLoading(false);
        return;
      }

      const userData = userDoc.data();
      const address = userData.ethAddress;

      // Get balances
      const [ethBalance, usdtBalance, shibBalance, prices] = await Promise.all([
        getTokenBalance(null, address),
        getTokenBalance('0xdAC17F958D2ee523a2206206994597C13D831ec7', address),
        getTokenBalance('0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce', address),
        fetchTokenPrices()
      ]);

      const assets = [
        {
          symbol: 'ETH',
          balance: ethBalance,
          price: prices?.ethereum?.usd || 0,
          change24h: prices?.ethereum?.usd_24h_change || 0
        },
        {
          symbol: 'USDT',
          balance: usdtBalance,
          price: prices?.tether?.usd || 1,
          change24h: prices?.tether?.usd_24h_change || 0
        },
        {
          symbol: 'SHIB',
          balance: shibBalance,
          price: prices?.['shiba-inu']?.usd || 0,
          change24h: prices?.['shiba-inu']?.usd_24h_change || 0
        }
      ];

      setWalletData({
        address,
        ethBalance,
        usdtBalance,
        shibBalance,
        assets
      });
    } catch (error) {
      console.error('Error refreshing wallet data:', error);
      setError('Failed to refresh wallet data');
    }
    setLoading(false);
  };

  useEffect(() => {
    refreshWalletData();
    const interval = setInterval(refreshWalletData, 30000);
    return () => clearInterval(interval);
  }, []);

  return {
    walletData,
    loading,
    error,
    sendTransaction: handleSendTransaction,
    refreshWalletData
  };
}