// src/app/restore-wallet/page.js
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ethers } from 'ethers';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';


export default function RestoreWallet() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [recoveryPhrase, setRecoveryPhrase] = useState('');
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [wallet, setWallet] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [restoredAddress, setRestoredAddress] = useState('');

  const validateMnemonic = (phrase) => {
    const words = phrase.trim().split(' ');
    if (words.length !== 12) {
      throw new Error('Please enter exactly 12 words');
    }
    
    const containsOnlyWords = words.every(word => /^[a-zA-Z]+$/.test(word));
    if (!containsOnlyWords) {
      throw new Error('Recovery phrase should only contain letters');
    }
    
    return words.join(' ').toLowerCase();
  };

  const handleRestore = async () => {
    setIsLoading(true);
    setError('');

    try {
      const cleanPhrase = validateMnemonic(recoveryPhrase);
      const restoredWallet = ethers.Wallet.fromPhrase(cleanPhrase);
      
      setWallet(restoredWallet);
      setRestoredAddress(restoredWallet.address);
      setStep(2);
      setRecoveryPhrase(''); // Clear sensitive data

    } catch (err) {
      console.error('Error restoring wallet:', err);
      if (err.message.includes('invalid mnemonic')) {
        setError('Invalid recovery phrase. Please check your words and try again.');
      } else {
        setError(err.message || 'Failed to restore wallet');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCredentialsSubmit = async () => {
    setError('');
    setIsLoading(true);

    // Basic validation
    if (!credentials.username.trim()) {
      setError('Username is required');
      setIsLoading(false);
      return;
    }

    if (credentials.password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    if (credentials.password !== credentials.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      if (!wallet || !wallet.address) {
        throw new Error('Wallet data not found');
      }

      // Check if username already exists
      const userRef = doc(db, 'users', credentials.username);
      const existingUser = await getDoc(userRef);
      
      if (existingUser.exists()) {
        setError('Username already taken. Please choose another.');
        setIsLoading(false);
        return;
      }

      // Prepare user data
      const userData = {
        username: credentials.username,
        password: credentials.password,
        ethAddress: wallet.address,
        encryptedKey: wallet.privateKey,
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      };

      // Save to Firestore
      await setDoc(userRef, userData);

      // Store in localStorage
      localStorage.clear(); // Clear any existing data
      localStorage.setItem('username', credentials.username);
      localStorage.setItem('walletAddress', wallet.address);
      localStorage.setItem('privateKey', wallet.privateKey);

      console.log('Wallet restored successfully:', {
        username: credentials.username,
        address: wallet.address
      });

      // Navigate to dashboard
      router.push('/dashboard');

    } catch (err) {
      console.error('Error handling account:', err);
      setError('Failed to create account: ' + err.message);
      setIsLoading(false);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setRecoveryPhrase(text);
    } catch (err) {
      console.error('Failed to read clipboard:', err);
      setError('Failed to paste from clipboard');
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
            // Step 1: Recovery Phrase Input
            <div className="space-y-4">
              <div className="mb-6 p-4 bg-blue-900/20 rounded-lg">
                <p className="text-muted-foreground text-sm">
                  Enter your 12-word recovery phrase to restore your wallet. 
                  Make sure to enter the words in the correct order, separated by spaces.
                </p>
              </div>

              <textarea
                value={recoveryPhrase}
                onChange={(e) => setRecoveryPhrase(e.target.value)}
                placeholder="Enter your 12-word recovery phrase..."
                className="w-full h-32 bg-card/50 border border-border rounded-lg p-4 text-foreground placeholder-muted-foreground focus:outline-none focus:border-blue-500"
              />

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
                  {error}
                </div>
              )}

              <div className="flex gap-4">
                <Button
                  variant="secondary"
                  onClick={handlePaste}
                  className="flex-1 bg-card hover:bg-card/80"
                >
                  📋 Paste Phrase
                </Button>
                <Button
                  variant="primary"
                  onClick={handleRestore}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={!recoveryPhrase.trim() || isLoading}
                >
                  {isLoading ? 'Restoring...' : '🔑 Restore Wallet'}
                </Button>
              </div>
            </div>
          ) : (
            // Step 2: Credentials Setup
            <div className="space-y-6">
              <div className="mb-6 p-4 bg-blue-900/20 rounded-lg">
                <p className="text-muted-foreground text-sm">
                  Wallet restored successfully! Set up your account credentials to continue.
                  Your address: {restoredAddress.slice(0, 6)}...{restoredAddress.slice(-4)}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    value={credentials.username}
                    onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                    className="w-full bg-card/50 border border-border rounded-lg p-3 text-foreground"
                    placeholder="Choose a username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={credentials.password}
                    onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                    className="w-full bg-card/50 border border-border rounded-lg p-3 text-foreground"
                    placeholder="Create a password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={credentials.confirmPassword}
                    onChange={(e) => setCredentials({...credentials, confirmPassword: e.target.value})}
                    className="w-full bg-card/50 border border-border rounded-lg p-3 text-foreground"
                    placeholder="Confirm your password"
                  />
                </div>

                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
                    {error}
                  </div>
                )}

                <Button
                  variant="primary"
                  onClick={handleCredentialsSubmit}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating Account...' : 'Complete Setup'}
                </Button>
              </div>
            </div>
          )}
        </Card>

        {step === 1 && (
          <div className="mt-8 p-4 bg-red-900/20 border border-red-900/50 rounded-lg">
            <div className="flex items-start gap-3">
              <span className="text-red-400">⚠️</span>
              <div>
                <h3 className="text-red-400 font-medium mb-2">Security Warning</h3>
                <p className="text-muted-foreground text-sm">
                  Never share your recovery phrase with anyone. Double-check that you're entering 
                  the correct 12 words in the exact order they were provided.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}