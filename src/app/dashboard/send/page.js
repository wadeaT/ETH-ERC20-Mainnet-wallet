// src/app/dashboard/send/page.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { TokenSelector } from '@/components/token/TokenSelector';
import { AmountInput } from '@/components/transaction/AmountInput';
import { useWallet } from '@/hooks/useWallet';
import { sendTransaction } from '@/services/transactionService';
import { SecurityNotice } from '@/components/common/SecurityNotice';

export default function SendPage() {
  const router = useRouter();
  const { tokens, loading } = useWallet();
  
  const [formData, setFormData] = useState({
    toAddress: '',
    amount: '',
    selectedToken: tokens[0]
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showTokenSelect, setShowTokenSelect] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await sendTransaction(
        formData.toAddress, 
        formData.amount, 
        formData.selectedToken
      );
      router.push('/dashboard');
    } catch (error) {
      console.error('Send error:', error);
      setError(error.message || 'Transaction failed. Please try again.');
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-foreground mb-8">
        Send {formData.selectedToken?.symbol}
      </h1>

      <Card className="bg-card/50 backdrop-blur-sm p-6">
        <form onSubmit={handleSend} className="space-y-6">
          <div>
            <label className="block text-sm text-muted-foreground mb-1">
              Select Token
            </label>
            <TokenSelector 
              selectedToken={formData.selectedToken}
              tokens={tokens}
              onSelect={(token) => {
                setFormData(prev => ({ ...prev, selectedToken: token }));
                setShowTokenSelect(false);
              }}
              showSelect={showTokenSelect}
              onToggleSelect={() => setShowTokenSelect(!showTokenSelect)}
            />
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-1">
              Recipient
            </label>
            <input
              type="text"
              value={formData.toAddress}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                toAddress: e.target.value 
              }))}
              placeholder="0x..."
              className="w-full bg-muted/50 border border-input rounded-lg px-4 py-3 
                text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
            />
          </div>

          <AmountInput
            amount={formData.amount}
            onAmountChange={(value) => setFormData(prev => ({ 
              ...prev, 
              amount: value 
            }))}
            onSetMax={() => setFormData(prev => ({ 
              ...prev, 
              amount: prev.selectedToken.balance 
            }))}
            token={formData.selectedToken}
          />

          {error && <SecurityNotice type="error">{error}</SecurityNotice>}

          <Button
            type="submit"
            disabled={isLoading || !formData.amount || !formData.toAddress}
            className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50"
          >
            {isLoading ? 'Sending...' : 'Send'}
          </Button>
        </form>
      </Card>
    </div>
  );
}