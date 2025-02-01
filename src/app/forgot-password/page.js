// src/app/forgot-password/page.js
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import { auth } from '@/lib/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { Header } from '@/components/layout/Header';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    setIsLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
      setEmail(''); // Clear the email field after successful submission
    } catch (err) {
      console.error('Password reset error:', err);
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email address');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address');
      } else {
        setError('An error occurred. Please try again');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <Header showBackButton={true}/>

      {/* Main Content */}
      <main className="max-w-md mx-auto">
        <Card className="bg-card/50 backdrop-blur-sm p-8">
          <h2 className="text-2xl font-bold text-blue-400 mb-8 text-center">
            Reset Your Password
          </h2>

          {/* Info Text */}
          <div className="mb-6 p-4 bg-blue-900/20 rounded-lg">
            <p className="text-muted-foreground text-sm">
              Enter your email address below and we'll send you instructions to reset your password.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2">
              <span className="text-red-400">⚠️</span>
              <p className="text-red-400 text-sm flex-1">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <div className="text-green-400 text-sm flex-1">
                <p className="font-medium">Reset instructions sent!</p>
                <p className="mt-1">Please check your email for further instructions to reset your password.</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                className={`w-full bg-card/50 border ${
                  error && !email.trim() 
                    ? 'border-red-500' 
                    : 'border-border'
                } rounded-md px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-blue-500`}
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || !email.trim()}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
                  <span>Sending...</span>
                </div>
              ) : (
                'Send Reset Instructions'
              )}
            </Button>
          </form>
        </Card>

        {/* Security Notice */}
        <div className="mt-8 p-4 bg-blue-900/20 rounded-lg">
          <div className="flex items-start gap-3">
            <span className="text-blue-400">ℹ️</span>
            <div>
              <h3 className="text-blue-400 font-medium mb-2">Next Steps</h3>
              <p className="text-muted-foreground text-sm">
                After submitting, check your email (including spam folder) for reset instructions.
                The reset link will expire after 1 hour for security reasons.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-md mx-auto mt-12 py-4 border-t border-border">
        <div className="flex justify-between text-sm text-muted-foreground">
          <p>ETH Wallet Manager © 2024</p>
          <div className="space-x-4">
            <Link href="/terms" className="hover:text-foreground">Terms</Link>
            <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}