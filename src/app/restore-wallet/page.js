// src/app/restore-wallet/page.js
'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { ethers } from 'ethers';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { RestoreWalletForm } from '@/components/wallet/RestoreWalletForm';
import { CredentialsForm } from '@/components/wallet/CredentialsForm';

export default function RestoreWallet() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [wallet, setWallet] = useState(null);
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRestore = async (phrase) => {
    setIsLoading(true);
    setError('');

    try {
      const words = phrase.trim().split(' ');
      if (words.length !== 12) {
        throw new Error('Please enter exactly 12 words');
      }
      
      const restoredWallet = ethers.Wallet.fromPhrase(words.join(' ').toLowerCase());
      setWallet(restoredWallet);
      setStep(2);
    } catch (err) {
      setError(err.message || 'Failed to restore wallet');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const userRef = doc(db, 'users', credentials.username);
      const existingUser = await getDoc(userRef);
      
      if (existingUser.exists()) {
        throw new Error('Username already taken');
      }

      await setDoc(userRef, {
        username: credentials.username,
        password: credentials.password,
        ethAddress: wallet.address,
        encryptedKey: wallet.privateKey,
        createdAt: new Date().toISOString()
      });

      localStorage.setItem('username', credentials.username);
      localStorage.setItem('walletAddress', wallet.address);
      localStorage.setItem('privateKey', wallet.privateKey);

      router.push('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to create account');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <Header showBackButton={true}/>

      <main className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-blue-400 mb-8 text-center">
          {step === 1 ? 'Restore Your Wallet' : 'Set Up Your Account'}
        </h2>

        <Card className="bg-card/50 backdrop-blur-sm p-8">
          {step === 1 ? (
            <RestoreWalletForm 
              onRestore={handleRestore}
              isLoading={isLoading}
              error={error}
            />
          ) : (
            <CredentialsForm
              credentials={credentials}
              onChange={setCredentials}
              onSubmit={handleCredentialsSubmit}
              isLoading={isLoading}
              error={error}
              walletAddress={wallet.address}
            />
          )}
        </Card>
      </main>
    </div>
  );
}