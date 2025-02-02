// src/components/wallet/ConnectWalletForm.js
'use client';

import { useState } from 'react';
import { Button } from '../ui/Button';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { ethers } from 'ethers';
import { PasswordField } from '../shared/PasswordField';

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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-destructive text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            Username
          </label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => {
              setFormData(prev => ({...prev, username: e.target.value}));
              if (error) setError('');
            }}
            className="w-full bg-input/50 border border-input rounded-lg px-4 py-2 text-foreground"
            placeholder="Enter your username"
            required
          />
        </div>

        <PasswordField
          value={formData.password}
          onChange={(e) => {
            setFormData(prev => ({...prev, password: e.target.value}));
            if (error) setError('');
          }}
          label="Password"
          placeholder="Enter your password"
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
              <div className="w-5 h-5 border-2 border-background border-t-transparent rounded-full animate-spin" />
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
    </>
  );
}