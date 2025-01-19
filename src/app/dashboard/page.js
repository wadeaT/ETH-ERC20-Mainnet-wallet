// src/app/dashboard/page.js
'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { MoreVertical } from 'lucide-react';
import TokenBalanceChart from '@/components/TokenBalanceChart';
import { fetchTokenPrices } from '@/lib/api';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { ethers } from 'ethers';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [walletData, setWalletData] = useState({
    address: '',
    ethBalance: '0',
    usdtBalance: '0',
    shibBalance: '0'
  });
  const [loading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [prices, setPrices] = useState(null);

  // Calculate total balance
  const calculateTotalBalance = () => {
    if (!prices) return 0;

    const ethValue = parseFloat(walletData.ethBalance) * (prices.ethereum?.usd || 0);
    const usdtValue = parseFloat(walletData.usdtBalance) * (prices.tether?.usd || 1); // USDT usually = $1
    const shibValue = parseFloat(walletData.shibBalance) * (prices['shiba-inu']?.usd || 0);

    return ethValue + usdtValue + shibValue;
  };

  useEffect(() => {
    const initializeWallet = async () => {
      try {
        console.log('Initializing wallet...');
        
        // Get data from localStorage
        const username = localStorage.getItem('username');
        let walletAddress = localStorage.getItem('walletAddress');

        console.log('Retrieved from localStorage:', { username, walletAddress });

        if (!username || !walletAddress) {
          console.error('Missing wallet data in localStorage');
          router.push('/connect-wallet');
          return;
        }

        try {
          // Ensure the address is valid and checksummed
          walletAddress = ethers.getAddress(walletAddress);
          console.log('Validated address:', walletAddress);
        } catch (error) {
          console.error('Address validation failed:', error);
          router.push('/connect-wallet');
          return;
        }

        // Initialize provider with error handling
        const providerUrl = process.env.NEXT_PUBLIC_MAINNET_RPC_URL;
        if (!providerUrl) {
          throw new Error('RPC URL not configured');
        }

        const provider = new ethers.JsonRpcProvider(providerUrl);
        
        // Test provider connection
        await provider.getNetwork();
        
        console.log('Provider connected, fetching balance for:', walletAddress);

        // Get ETH balance with retry logic
        let ethBalance;
        try {
          ethBalance = await provider.getBalance(walletAddress);
          console.log('ETH balance fetched:', ethers.formatEther(ethBalance));
        } catch (error) {
          console.error('Balance fetch failed:', error);
          ethBalance = ethers.parseEther('0');
        }

        const formattedEthBalance = ethers.formatEther(ethBalance);

        // Update wallet data
        setWalletData(prev => ({
          ...prev,
          address: walletAddress,
          ethBalance: formattedEthBalance
        }));

        // Fetch token prices
        try {
          const priceData = await fetchTokenPrices();
          setPrices(priceData);
        } catch (error) {
          console.error('Error fetching prices:', error);
        }

        // Set up token contracts
        const USDT_ADDRESS = '0xdAC17F958D2ee523a2206206994597C13D831ec7';
        const SHIB_ADDRESS = '0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce';
        
        const ERC20_ABI = [
          'function balanceOf(address) view returns (uint256)',
          'function decimals() view returns (uint8)'
        ];

        try {
          // Get token balances
          const usdtContract = new ethers.Contract(USDT_ADDRESS, ERC20_ABI, provider);
          const shibContract = new ethers.Contract(SHIB_ADDRESS, ERC20_ABI, provider);

          const [usdtBalance, usdtDecimals, shibBalance, shibDecimals] = await Promise.all([
            usdtContract.balanceOf(walletAddress),
            usdtContract.decimals(),
            shibContract.balanceOf(walletAddress),
            shibContract.decimals()
          ]);

          setWalletData(prev => ({
            ...prev,
            usdtBalance: ethers.formatUnits(usdtBalance, usdtDecimals),
            shibBalance: ethers.formatUnits(shibBalance, shibDecimals)
          }));
        } catch (error) {
          console.error('Error fetching token balances:', error);
        }

      } catch (err) {
        console.error('Initialization error:', err);
        setError(err.message || 'Failed to load wallet data');
      } finally {
        setIsLoading(false);
      }
    };

    initializeWallet();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-destructive/10 border border-destructive rounded-lg m-4">
        <h2 className="text-lg font-semibold text-destructive mb-2">Error Loading Wallet</h2>
        <p className="text-destructive/80">{error}</p>
      </div>
    );
  }

  const totalBalance = calculateTotalBalance();

  const tokens = [
    {
      symbol: 'ETH',
      name: 'Ethereum',
      icon: '⟠',
      balance: walletData.ethBalance,
      price: prices?.ethereum?.usd || 0,
      change24h: prices?.ethereum?.usd_24h_change || 0
    },
    {
      symbol: 'USDT',
      name: 'Tether USD',
      icon: '₮',
      balance: walletData.usdtBalance,
      price: prices?.tether?.usd || 1,
      change24h: prices?.tether?.usd_24h_change || 0
    },
    {
      symbol: 'SHIB',
      name: 'Shiba Inu',
      icon: '🐕',
      balance: walletData.shibBalance,
      price: prices?.['shiba-inu']?.usd || 0,
      change24h: prices?.['shiba-inu']?.usd_24h_change || 0
    }
  ];

  return (
    <div className="space-y-4">
      {walletData.address && (
        <div className="p-4 bg-primary/10 border border-primary rounded-lg">
          <h2 className="text-primary text-sm">Your Wallet Address</h2>
          <p className="font-mono text-foreground">{walletData.address}</p>
        </div>
      )}

      {/* Balance Display */}
      <div className="text-center py-8">
        <div className="text-muted-foreground text-sm">Total Balance</div>
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
                  <td className={`py-4 text-right ${token.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {token.change24h > 0 ? '+' : ''}{token.change24h.toFixed(2)}%
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