// src/app/create-wallet/page.js
'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Header } from '@/components/layout/Header';
import { ethers } from 'ethers';
import { AccountForm } from '@/components/wallet/AccountForm';
import { RecoveryPhrase } from '@/components/wallet/RecoveryPhrase';
import { SuccessScreen } from '@/components/wallet/SuccessScreen';

export default function CreateWallet() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [recoveryPhrase, setRecoveryPhrase] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateAccount = async () => {
    setIsLoading(true);
    try {
      const wallet = ethers.Wallet.createRandom();
      setRecoveryPhrase(wallet.mnemonic.phrase);

      await setDoc(doc(db, 'users', formData.username), {
        username: formData.username,
        password: formData.password,
        createdAt: new Date().toISOString(),
        wallet: { address: wallet.address }
      });

      // Save to localStorage
      localStorage.setItem('walletAddress', wallet.address);
      localStorage.setItem('privateKey', wallet.privateKey);
      localStorage.setItem('username', formData.username);

      setStep(2);
    } catch (err) {
      setError(err.code === 'permission-denied' 
        ? 'Username already taken' 
        : 'Failed to create wallet');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header showBackButton={true}/>
      
      <Card className="max-w-3xl mx-auto bg-card/50 backdrop-blur-sm p-8">
        {step === 1 && (
          <AccountForm
            formData={formData}
            showPassword={showPassword}
            showConfirmPassword={showConfirmPassword}
            error={error}
            isLoading={isLoading}
            onInputChange={(e) => {
              setFormData(prev => ({
                ...prev,
                [e.target.name]: e.target.value
              }));
              setError('');
            }}
            onTogglePassword={() => setShowPassword(!showPassword)}
            onToggleConfirmPassword={() => setShowConfirmPassword(!showConfirmPassword)}
            onSubmit={handleCreateAccount}
          />
        )}
        
        {step === 2 && recoveryPhrase && (
          <RecoveryPhrase
            phrase={recoveryPhrase}
            onConfirm={() => {
              setStep(3);
              setRecoveryPhrase('');
            }}
          />
        )}
        
        {step === 3 && (
          <SuccessScreen onContinue={() => router.push('/dashboard')} />
        )}
      </Card>
    </div>
  );
}