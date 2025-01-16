'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

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

    // Form validation
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
      // Get user document from Firestore using username
      const userDoc = await getDoc(doc(db, 'users', formData.username));
      
      if (!userDoc.exists()) {
        setError('Invalid username or password');
        setIsLoading(false);
        return;
      }

      const userData = userDoc.data();
      
      // Verify password (In production, use proper password hashing)
      if (userData.password !== formData.password) {
        setError('Invalid username or password');
        setIsLoading(false);
        return;
      }

      // Store wallet info in localStorage for the session
      window.localStorage.setItem('walletAddress', userData.wallet.address);
      window.localStorage.setItem('username', formData.username);
      
      // If there's a private key stored (encrypted), also store that
      if (userData.wallet.encryptedKey) {
        window.localStorage.setItem('privateKey', userData.wallet.encryptedKey);
      }

      console.log('Logged in successfully');
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
    <div className="min-h-screen bg-[#0B1120] p-4">
      {/* Header */}
      <header className="flex items-center justify-between max-w-md mx-auto mb-12">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white">Ξ</span>
          </div>
          <h1 className="text-xl font-bold text-white">ETH Wallet Manager</h1>
        </div>
        <Link href="/" className="text-gray-400 hover:text-white">
          ← Back
        </Link>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto">
        <Card className="bg-gray-800/50 backdrop-blur-sm p-8">
          <h2 className="text-2xl font-bold text-blue-400 mb-8 text-center">
            Connect to Your Wallet
          </h2>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-md px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                placeholder="Enter your username"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-md px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                placeholder="Enter your password"
                required
              />
            </div>

            {/* Connect Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || !formData.username || !formData.password}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Connecting...</span>
                </div>
              ) : (
                'Connect Wallet'
              )}
            </Button>

            {/* Help Links */}
            <div className="flex justify-between text-sm">
              <Link href="/restore-wallet" className="text-blue-400 hover:text-blue-300">
                Restore Using Phrase
              </Link>
              <Link href="/create-wallet" className="text-blue-400 hover:text-blue-300">
                Create New Wallet
              </Link>
            </div>
          </form>
        </Card>

        {/* Security Notice */}
        <div className="mt-8 p-4 bg-blue-900/20 border border-blue-900/50 rounded-lg">
          <div className="flex items-start gap-3">
            <span className="text-blue-400">🛡️</span>
            <div>
              <h3 className="text-blue-400 font-medium mb-2">Security Note</h3>
              <p className="text-gray-300 text-sm">
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