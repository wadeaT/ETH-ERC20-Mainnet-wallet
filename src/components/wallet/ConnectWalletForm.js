// src/components/wallet/ConnectWalletForm.js
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { ethers } from 'ethers';
import { FormField } from '@/components/common/FormField';
import { SecurityNotice } from '@/components/common/SecurityNotice';

export function ConnectWalletForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.username.trim()) {
      setError('Please enter your username');
      return;
    }

    setIsLoading(true);

    try {
      const userDoc = await getDoc(doc(db, 'users', formData.username));
      
      if (!userDoc.exists() || userDoc.data().password !== formData.password) {
        setError('Invalid username or password');
        setIsLoading(false);
        return;
      }

      const userData = userDoc.data();
      const walletAddress = ethers.getAddress(userData.ethAddress || userData.wallet?.address);
      
      localStorage.clear();
      localStorage.setItem('username', formData.username);
      localStorage.setItem('walletAddress', walletAddress);
      
      if (userData.encryptedKey || userData.wallet?.privateKey) {
        localStorage.setItem('privateKey', userData.encryptedKey || userData.wallet.privateKey);
      }

      router.push('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred during login');
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && <SecurityNotice type="error">{error}</SecurityNotice>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField
          label="Username"
          type="text"
          value={formData.username}
          onChange={(e) => {
            setFormData(prev => ({...prev, username: e.target.value}));
            setError('');
          }}
          placeholder="Enter your username"
          required
        />

        <FormField
          type="password"
          label="Password"
          value={formData.password}
          onChange={(e) => {
            setFormData(prev => ({...prev, password: e.target.value}));
            setError('');
          }}
          placeholder="Enter your password"
          required
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={isLoading || !formData.username || !formData.password}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              <span>Connecting...</span>
            </div>
          ) : (
            'Connect Wallet'
          )}
        </Button>

        <div className="flex justify-between text-sm">
          <Link href="/restore-wallet" className="text-primary hover:text-primary/80">
            Restore Using Phrase
          </Link>
          <Link href="/create-wallet" className="text-primary hover:text-primary/80">
            Create New Wallet
          </Link>
        </div>
      </form>
    </div>
  );
}