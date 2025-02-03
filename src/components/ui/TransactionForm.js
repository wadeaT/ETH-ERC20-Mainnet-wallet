// src/components/ui/TransactionForm.js
'use client';

import React, { useState } from 'react';
import { Button } from './Button';
import { FormField } from '@/components/common/FormField';

const TransactionForm = ({ senderAddress, onSend }) => {
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSend(recipientAddress, amount);
    // Clear form
    setRecipientAddress('');
    setAmount('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField
        label="Recipient Address"
        value={recipientAddress}
        onChange={(e) => setRecipientAddress(e.target.value)}
        placeholder="0x..."
        required
      />

      <FormField
        label="Amount (ETH)"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="0.0"
        step="0.000001"
        min="0"
        required
      />

      <Button 
        variant="primary" 
        size="md" 
        type="submit" 
        className="w-full"
      >
        Send ETH
      </Button>
    </form>
  );
};

export default TransactionForm;