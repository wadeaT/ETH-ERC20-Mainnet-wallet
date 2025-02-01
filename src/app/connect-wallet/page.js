// src/app/connect-wallet/page.js
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { ethers } from 'ethers';

export default function ConnectWallet() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.username.trim()) {
      setError('Please enter your username');
      return;
    }

    if (!formData.password) {
      setError('Please enter your password');
      return;
    }

    setIsLoading(true);

    try {
      // Log the username we're looking up
      console.log('Looking up user:', formData.username);

      const userDoc = await getDoc(doc(db, 'users', formData.username));
      
      if (!userDoc.exists()) {
        setError('Invalid username or password');
        setIsLoading(false);
        return;
      }

      const userData = userDoc.data();
      console.log('User data retrieved:', { ...userData, password: '[REDACTED]' });
      
      if (userData.password !== formData.password) {
        setError('Invalid username or password');
        setIsLoading(false);
        return;
      }

      // Get the wallet address from the correct location in userData
      let walletAddress = userData.ethAddress || userData.wallet?.address;

      // Log the address we found
      console.log('Found wallet address:', walletAddress);

      // Verify the wallet address is valid
      if (!walletAddress || !ethers.isAddress(walletAddress)) {
        console.error('Invalid address in userData:', walletAddress);
        setError('Invalid wallet data found');
        return;
      }

      // Ensure the address is properly checksummed
      const checksummedAddress = ethers.getAddress(walletAddress);

      // Clear any old data first
      localStorage.clear();

      // Store the new data
      localStorage.setItem('username', formData.username);
      localStorage.setItem('walletAddress', checksummedAddress);
      
      // Handle private key storage
      const privateKey = userData.encryptedKey || userData.wallet?.privateKey;
      if (privateKey) {
        localStorage.setItem('privateKey', privateKey);
      }

      console.log('Successfully stored wallet data:', {
        username: formData.username,
        address: checksummedAddress
      });

      router.push('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred during login. Please try again');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header showBackButton={true} />

      <main className="max-w-md mx-auto p-4">
        <Card className="bg-card/50 backdrop-blur-sm p-8">
          <h2 className="text-2xl font-bold text-primary mb-8 text-center">
            Connect to Your Wallet
          </h2>

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
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full bg-input/50 border border-input rounded-md px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
                placeholder="Enter your username"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full bg-input/50 border border-input rounded-md px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
                placeholder="Enter your password"
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
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
        </Card>

        <div className="mt-8 p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="flex items-start gap-3">
            <span className="text-primary">🛡️</span>
            <div>
              <h3 className="text-primary font-medium mb-2">Security Note</h3>
              <p className="text-muted-foreground text-sm">
                If you've forgotten your password, you can restore your wallet using your recovery phrase.
                Never share your recovery phrase or password with anyone.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}