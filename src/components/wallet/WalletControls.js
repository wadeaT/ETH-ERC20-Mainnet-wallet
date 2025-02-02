// src/components/wallet/WalletControls.js
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { TransactionForm } from '@/components/ui/TransactionForm';

export function WalletControls({ wallet, onCreateWallet }) {
  const [showSendForm, setShowSendForm] = useState(false);
  const [showPrivateKey, setShowPrivateKey] = useState(false);

  if (!wallet) {
    return (
      <Button 
        variant="primary" 
        size="md" 
        onClick={onCreateWallet} 
        className="w-full"
      >
        Create New Wallet
      </Button>
    );
  }

  return (
    <div className="space-y-4">
      <Button 
        variant="primary" 
        size="md" 
        onClick={() => setShowSendForm(!showSendForm)} 
        className="w-full"
      >
        {showSendForm ? 'Hide Send Form' : 'Send ETH'}
      </Button>

      {showSendForm && <TransactionForm senderAddress={wallet.address} />}

      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">Private Key:</span>
        <span className="font-mono">
          {showPrivateKey ? wallet.privateKey : '**********************'}
        </span>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowPrivateKey(!showPrivateKey)}
        >
          {showPrivateKey ? 'Hide' : 'Show'}
        </Button>
      </div>
    </div>
  );
}