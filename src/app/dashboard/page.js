'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { MoreVertical } from 'lucide-react';
import TokenBalanceChart from '@/components/TokenBalanceChart';
import { fetchTokenPrices } from '@/lib/api';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { ethers } from 'ethers';

export default function DashboardPage() {
  const [walletData, setWalletData] = useState({
    address: '',
    ethBalance: '0',
    usdtBalance: '0',
    shibBalance: '0'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [prices, setPrices] = useState(null);

  useEffect(() => {
    const initializeWallet = async () => {
      try {
        const username = window.localStorage.getItem('username');
        const walletAddress = window.localStorage.getItem('walletAddress');
        
        if (!username || !walletAddress) {
          router.push('/connect-wallet');
          return;
        }

        // Get user data from Firebase
        const userDoc = await getDoc(doc(db, 'users', username));
        if (!userDoc.exists()) {
          throw new Error('Wallet not found');
        }

        // Initialize provider
        const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_MAINNET_RPC_URL);
        
        // Get ETH balance
        const ethBalance = await provider.getBalance(walletAddress);
        const formattedEthBalance = ethers.formatEther(ethBalance);

        setWalletData({
          address: walletAddress,
          ethBalance: formattedEthBalance,
          usdtBalance: '0',
          shibBalance: '0'
        });

        // Fetch token prices
        const priceData = await fetchTokenPrices();
        setPrices(priceData);
      } catch (err) {
        console.error('Error initializing wallet:', err);
        setError('Failed to load wallet data');
      } finally {
        setLoading(false);
      }
    };

    initializeWallet();
  }, []);

  const tokens = [
    {
      symbol: 'ETH',
      name: 'MTW Ethereum',
      icon: '⟠',
      priceId: 'ethereum',
      balance: walletData.ethBalance || '0',
      price: prices?.ethereum?.usd || 0
    },
    {
      symbol: 'USDT',
      name: 'MTW USD',
      icon: '₮',
      priceId: 'tether',
      balance: walletData.usdtBalance || '0',
      price: prices?.tether?.usd || 1
    },
    {
      symbol: 'SHIB',
      name: 'MTW Shiba',
      icon: '🐕',
      priceId: 'shiba-inu',
      balance: walletData.shibBalance || '0',
      price: prices?.['shiba-inu']?.usd || 0
    }
  ];

  // Calculate total balance
  const totalBalance = tokens.reduce((sum, token) => {
    return sum + (parseFloat(token.balance) * (token.price || 0));
  }, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="p-4 bg-primary/10 border border-primary rounded-lg">
        <h2 className="text-primary text-sm">Your Wallet Address</h2>
        <p className="font-mono text-foreground">{walletData.address}</p>
      </div>

      {/* Balance Display */}
      <div className="text-center py-8">
        <div className="text-muted-foreground text-sm">balance</div>
        <div className="text-foreground text-2xl font-bold">
          ${totalBalance.toFixed(2)}
        </div>
      </div>

      <div className="bg-card rounded-lg p-4 text-card-foreground">
        <table className="w-full">
          <thead>
            <tr className="text-muted-foreground border-b border-border">
              <th className="text-left py-4">Asset</th>
              <th className="text-right py-4">Amount</th>
              <th className="text-right py-4">Price</th>
              <th className="text-right py-4">Change</th>
              <th className="text-right py-4">Balance</th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody>
            {tokens.map((token) => {
              const balance = parseFloat(token.balance);
              const price = token.price;
              const change = prices?.[token.priceId]?.usd_24h_change || 0;
              const totalValue = balance * price;

              return (
                <tr key={token.symbol} className="border-b border-border/30">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                        <span>{token.icon}</span>
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{token.name}</div>
                        <div className="text-sm text-muted-foreground">{token.symbol}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-right text-foreground">{balance.toFixed(token.symbol === 'SHIB' ? 8 : 6)}</td>
                  <td className="py-4 text-right text-foreground">${price.toFixed(token.symbol === 'SHIB' ? 8 : 2)}</td>
                  <td className={`py-4 text-right ${change >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {change > 0 ? '+' : ''}{change.toFixed(2)}%
                  </td>
                  <td className="py-4 text-right text-foreground">${totalValue.toFixed(2)}</td>
                  <td className="py-4">
                    <button className="p-1 hover:bg-secondary rounded">
                      <MoreVertical size={16} className="text-muted-foreground" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}