// src/components/WalletInterface.js
'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { WalletControls } from './wallet/WalletControls';

export default function WalletInterface() {
  const [wallet, setWallet] = useState(null);

  useEffect(() => {
    const updateBalance = async () => {
      if (!wallet?.address || !window.ethereum) return;
      try {
        const balance = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [wallet.address, 'latest']
        });
        const balanceInEth = parseInt(balance, 16) / 1e18;
        setWallet(prev => prev ? {...prev, balance: `${balanceInEth.toFixed(4)} ETH`} : null);
      } catch (error) {
        console.error('Error getting balance:', error);
      }
    };

    if (wallet) {
      updateBalance();
      const interval = setInterval(updateBalance, 10000);
      return () => clearInterval(interval);
    }
  }, [wallet?.address]);

  const createNewWallet = async () => {
    const mockAddress = '0x' + Array.from(crypto.getRandomValues(new Uint8Array(20)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    const mockPrivateKey = '0x' + Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    setWallet({
      address: mockAddress,
      privateKey: mockPrivateKey,
      balance: '0.0 ETH'
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Ethereum Wallet Manager</CardTitle>
      </CardHeader>
      <CardContent>
        {wallet && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground">
                Wallet Address
              </label>
              <div className="mt-1 truncate font-mono">{wallet.address}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground">
                Balance
              </label>
              <div className="mt-1">{wallet.balance}</div>
            </div>
          </div>
        )}
        <WalletControls 
          wallet={wallet} 
          onCreateWallet={createNewWallet} 
        />
      </CardContent>
    </Card>
  );
}