//// src/components/layout/ui/TransactionForm.js
'use client';

import React, { useState } from 'react';
import { Button } from './Button';

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
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Recipient Address
        </label>
        <input
          type="text"
          value={recipientAddress}
          onChange={(e) => setRecipientAddress(e.target.value)}
          placeholder="0x..."
          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Amount (ETH)
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.0"
          step="0.000001"
          min="0"
          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          required
        />
      </div>
      <Button variant="primary" size="md" type="submit" className="w-full">
        Send ETH
      </Button>
    </form>
  );
};

export default TransactionForm;