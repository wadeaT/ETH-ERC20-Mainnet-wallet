// src/components/WalletInterface.js
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/Card';
import { Button } from './ui/Button';
import TransactionForm from './ui/TransactionForm';

const WalletInterface = () => {
  const [wallet, setWallet] = useState(null);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [showSendForm, setShowSendForm] = useState(false);

  const updateBalance = async () => {
    if (!wallet?.address || !window.ethereum) return;

    try {
      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [wallet.address, 'latest']
      });
      
      // Convert balance from Wei to ETH
      const balanceInEth = parseInt(balance, 16) / 1e18;
      setWallet(prev => prev ? {...prev, balance: `${balanceInEth.toFixed(4)} ETH`} : null);
    } catch (error) {
      console.error('Error getting balance:', error);
    }
  };

  useEffect(() => {
    if (wallet) {
      updateBalance();
      const interval = setInterval(updateBalance, 10000); // Update every 10 seconds
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

  const togglePrivateKeyVisibility = () => {
    setShowPrivateKey(!showPrivateKey);
  };

  const handleSendTransaction = async (to, amount) => {
    if (!wallet || !window.ethereum) {
      alert('Please install MetaMask or another Web3 wallet');
      return;
    }

    try {
      // First request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      // Check if we have access to the account
      if (!accounts || accounts.length === 0) {
        alert('Please connect your wallet first');
        return;
      }

      // Get the current network
      const chainId = await window.ethereum.request({
        method: 'eth_chainId'
      });

      // Check if we're on the right network (1 for mainnet, 5 for goerli testnet)
      if (chainId !== '0x1' && chainId !== '0x5') {
        alert('Please switch to Ethereum Mainnet or Goerli Testnet');
        return;
      }

      try {
        // Convert amount to Wei (1 ETH = 10^18 Wei)
        const amountInWei = `0x${(BigInt(parseFloat(amount) * 1e18)).toString(16)}`;

        // Create transaction object
        const transaction = {
          from: accounts[0], // Use the connected account
          to: to,
          value: amountInWei,
          chainId: chainId
        };

        // Send transaction
        const txHash = await window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [transaction],
        });

        alert(`Transaction sent! Hash: ${txHash}`);
        setShowSendForm(false);
      } catch (error) {
        console.error('Transaction failed:', error);
        alert(`Transaction failed: ${error.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Wallet connection failed:', error);
      alert(`Wallet connection failed: ${error.message || 'Unknown error'}`);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Ethereum Wallet Manager</CardTitle>
      </CardHeader>
      <CardContent>
        {wallet ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Wallet Address</label>
              <div className="mt-1 truncate">{wallet.address}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Balance</label>
              <div className="mt-1">{wallet.balance}</div>
            </div>
            {wallet.privateKey && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Private Key</label>
                <div className="mt-1">
                  {showPrivateKey ? wallet.privateKey : '**********************'}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={togglePrivateKeyVisibility} 
                    className="ml-2"
                  >
                    {showPrivateKey ? 'Hide' : 'Show'}
                  </Button>
                </div>
              </div>
            )}
            {showSendForm && (
              <div className="mt-4">
                <h3 className="text-lg font-medium mb-4">Send ETH</h3>
                <TransactionForm 
                  senderAddress={wallet.address}
                  onSend={handleSendTransaction}
                />
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-500">No wallet created yet</p>
        )}
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        {wallet ? (
          <Button 
            variant="primary" 
            size="md" 
            onClick={() => setShowSendForm(!showSendForm)} 
            className="w-full"
          >
            {showSendForm ? 'Hide Send Form' : 'Send ETH'}
          </Button>
        ) : (
          <Button 
            variant="primary" 
            size="md" 
            onClick={createNewWallet} 
            className="w-full"
          >
            Create New Wallet
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default WalletInterface;