// src/app/dashboard/send/page.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ethers } from 'ethers';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { TokenSelector } from '@/components/token/TokenSelector';
import { useWallet } from '@/hooks/useWallet';
import { formatNumber } from '@/lib/utils';

const ERC20_ABI = [
  'function transfer(address to, uint256 value) returns (bool)',
  'function balanceOf(address account) view returns (uint256)',
  'function decimals() view returns (uint8)'
];

export default function SendPage() {
  const router = useRouter();
  const { tokens, loading } = useWallet();
  
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showTokenSelect, setShowTokenSelect] = useState(false);
  const [selectedToken, setSelectedToken] = useState(tokens[0]);

  const usdValue = (parseFloat(amount) || 0) * (selectedToken?.price || 0);

  const handleSend = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!ethers.isAddress(toAddress)) {
        throw new Error('Invalid Ethereum address');
      }

      const amountNum = parseFloat(amount);
      if (isNaN(amountNum) || amountNum <= 0) {
        throw new Error('Please enter a valid amount');
      }

      const privateKey = window.localStorage.getItem('privateKey');
      if (!privateKey) {
        throw new Error('Private key not found. Please reconnect your wallet.');
      }

      const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_MAINNET_RPC_URL);
      const wallet = new ethers.Wallet(privateKey, provider);

      let tx;
      if (selectedToken.symbol === 'ETH') {
        const parsedAmount = ethers.parseEther(amount);
        tx = await wallet.sendTransaction({
          to: toAddress,
          value: parsedAmount
        });
      } else {
        const contract = new ethers.Contract(
          selectedToken.contractAddress,
          ERC20_ABI,
          wallet
        );

        const parsedAmount = ethers.parseUnits(amount, selectedToken.decimals);
        tx = await contract.transfer(toAddress, parsedAmount);
      }

      await tx.wait();
      router.push('/dashboard');
    } catch (error) {
      console.error('Send error:', error);
      setError(error.message || 'Transaction failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-foreground mb-8">Send {selectedToken?.symbol}</h1>

      <Card className="bg-card/50 backdrop-blur-sm p-6">
        <form onSubmit={handleSend} className="space-y-6">
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Select Token</label>
            <TokenSelector 
              selectedToken={selectedToken}
              tokens={tokens}
              onSelect={(token) => {
                setSelectedToken(token);
                setShowTokenSelect(false);
              }}
              showSelect={showTokenSelect}
              onToggleSelect={() => setShowTokenSelect(!showTokenSelect)}
            />
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-1">Recipient</label>
            <input
              type="text"
              value={toAddress}
              onChange={(e) => setToAddress(e.target.value)}
              placeholder="0x..."
              className="w-full bg-muted/50 border border-input rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-1">Amount</label>
            <div className="space-y-2">
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.0"
                  min="0"
                  step="any"
                  className="w-full bg-muted/50 border border-input rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => setAmount(selectedToken.balance)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-primary hover:text-primary/80"
                >
                  Max
                </button>
              </div>
              
              <div className="flex justify-between items-center px-1 text-sm text-muted-foreground">
                <span>≈ ${formatNumber(usdValue, 2)} USD</span>
                <span>Balance: {formatNumber(selectedToken.balance)} {selectedToken.symbol}</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-destructive">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading || !amount || !toAddress}
            className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50"
          >
            {isLoading ? 'Sending...' : 'Send'}
          </Button>
        </form>
      </Card>
    </div>
  );
}