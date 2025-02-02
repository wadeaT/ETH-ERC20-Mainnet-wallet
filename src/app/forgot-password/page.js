// src/app/forgot-password/page.js
'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import { auth } from '@/lib/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { Header } from '@/components/layout/Header';
import { PasswordResetForm } from '@/components/auth/PasswordResetForm';
import { SecurityNotice } from '@/components/common/SecurityNotice';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
      setEmail('');
    } catch (err) {
      console.error('Password reset error:', err);
      setError(
        err.code === 'auth/user-not-found' ? 'No account found with this email address' :
        err.code === 'auth/invalid-email' ? 'Please enter a valid email address' :
        'An error occurred. Please try again'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <Header showBackButton={true}/>

      <main className="max-w-md mx-auto">
        <Card className="bg-card/50 backdrop-blur-sm p-8">
          <h2 className="text-2xl font-bold text-primary mb-8 text-center">
            Reset Your Password
          </h2>

          <div className="mb-6 p-4 bg-primary/5 rounded-lg">
            <p className="text-muted-foreground text-sm">
              Enter your email address below and we'll send you instructions 
              to reset your password.
            </p>
          </div>

          <PasswordResetForm
            email={email}
            onEmailChange={(e) => {
              setEmail(e.target.value);
              setError('');
            }}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
            success={success}
          />
        </Card>

        <SecurityNotice 
          type="info" 
          title="Next Steps"
          className="mt-8"
        >
          After submitting, check your email (including spam folder) for reset instructions.
          The reset link will expire after 1 hour for security reasons.
        </SecurityNotice>

        <footer className="mt-12 py-4 border-t border-border">
          <div className="flex justify-between text-sm text-muted-foreground">
            <p>ETH Wallet Manager © 2024</p>
            <div className="space-x-4">
              <Link href="/terms" className="hover:text-foreground">Terms</Link>
              <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}