// src/app/create-wallet/page.js
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { ethers } from 'ethers';
import { Header } from '@/components/layout/Header';

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  useEffect(() => {
    return () => {
      setRecoveryPhrase('');
    };
  }, []);

  const validateForm = () => {
    if (formData.username.length < 3 || formData.username.length > 20) return false;
    if (!/^[a-zA-Z0-9]+$/.test(formData.username)) return false;
    if (formData.password.length < 8) return false;
    if (!/\d/.test(formData.password)) return false;
    if (!/[!@#$%^&*]/.test(formData.password)) return false;
    if (formData.password !== formData.confirmPassword) return false;
    return true;
  };

  const handleCreateAccount = async () => {
    if (!validateForm()) {
      setError('Please check all form requirements');
      return;
    }

    setIsLoading(true);
    try {
      const wallet = ethers.Wallet.createRandom();
      const mnemonic = wallet.mnemonic.phrase;
      setRecoveryPhrase(mnemonic);

      const userDoc = {
        username: formData.username,
        password: formData.password,
        createdAt: new Date().toISOString(),
        wallet: {
          address: wallet.address
        }
      };

      await setDoc(doc(db, 'users', formData.username), userDoc);

      window.localStorage.setItem('walletAddress', wallet.address);
      window.localStorage.setItem('privateKey', wallet.privateKey);
      window.localStorage.setItem('username', formData.username);

      setStep(2);
    } catch (err) {
      console.error('Error creating account:', err);
      if (err.code === 'permission-denied') {
        setError('Username already taken. Please choose another.');
      } else {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmRecoveryPhrase = () => {
    setStep(3);
    setRecoveryPhrase('');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header showBackButton={true}/>

      {/* Progress Steps */}
      <div className="max-w-3xl mx-auto mb-8 px-4">
        <div className="flex justify-between items-center mb-4">
          <div className={`flex items-center ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center">
              🔒
            </div>
            <span className="ml-2">Account</span>
          </div>
          <div className="flex-1 h-0.5 mx-4 bg-border">
            <div 
              className="h-full bg-primary transition-all duration-300" 
              style={{ width: `${(step - 1) * 50}%` }}
            />
          </div>
          <div className={`flex items-center ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center">
              🔑
            </div>
            <span className="ml-2">Recovery Phrase</span>
          </div>
          <div className="flex-1 h-0.5 mx-4 bg-border">
            <div 
              className="h-full bg-primary transition-all duration-300" 
              style={{ width: `${(step - 2) * 50}%` }}
            />
          </div>
          <div className={`flex items-center ${step >= 3 ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center">
              ✓
            </div>
            <span className="ml-2">Confirm</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Card className="max-w-3xl mx-auto bg-card/50 backdrop-blur-sm p-8">
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Create Your Wallet Account</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    placeholder="Choose a username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full bg-input/50 border border-input rounded-md px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full bg-input/50 border border-input rounded-md px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? "👁" : "👁‍🗨"}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full bg-input/50 border border-input rounded-md px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? "👁" : "👁‍🗨"}
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-card/30 rounded-lg p-4">
                <h3 className="text-primary font-medium mb-4">Account Requirements</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className={formData.username.length >= 3 && formData.username.length <= 20 ? "text-green-500" : "text-muted-foreground"}>✓</div>
                    Username (3-20 characters, letters and numbers only)
                  </li>
                  <li className="flex items-center gap-2">
                    <div className={formData.password.length >= 8 ? "text-green-500" : "text-muted-foreground"}>✓</div>
                    Password: at least 8 characters
                  </li>
                  <li className="flex items-center gap-2">
                    <div className={/\d/.test(formData.password) ? "text-green-500" : "text-muted-foreground"}>✓</div>
                    Password: include numbers
                  </li>
                  <li className="flex items-center gap-2">
                    <div className={/[!@#$%^&*]/.test(formData.password) ? "text-green-500" : "text-muted-foreground"}>✓</div>
                    Password: include special characters
                  </li>
                  <li className="flex items-center gap-2">
                    <div className={formData.password === formData.confirmPassword && formData.password !== '' ? "text-green-500" : "text-muted-foreground"}>✓</div>
                    Passwords match
                  </li>
                </ul>
              </div>
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-destructive">
                {error}
              </div>
            )}

            <Button
              variant="primary"
              size="lg"
              className="w-full bg-primary hover:bg-primary/90 mt-6"
              onClick={handleCreateAccount}
              disabled={!validateForm() || isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Continue →'}
            </Button>
          </div>
        )}

        {step === 2 && recoveryPhrase && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Save Your Recovery Phrase</h2>
            
            <div className="bg-card/30 rounded-lg p-6">
              <p className="text-muted-foreground mb-4">
                Write down these 24 words in order and keep them safe. This recovery phrase follows the BIP39 standard and can be used to recover your wallet in any compatible wallet software.
              </p>
              <div className="grid grid-cols-3 gap-3">
                {recoveryPhrase.split(' ').map((word, index) => (
                  <div key={index} className="flex items-center bg-card/50 p-2 rounded-lg">
                    <span className="text-muted-foreground text-sm w-6">{(index + 1).toString().padStart(2, '0')}.</span>
                    <span className="text-foreground flex-1 text-center">{word}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 text-warning">
              <h3 className="font-medium mb-2">⚠️ Important Security Warning</h3>
              <ul className="text-sm space-y-2">
                <li>• Never share your recovery phrase with anyone</li>
                <li>• Store it in a secure, offline location</li>
                <li>• Anyone with these words can access your wallet</li>
                <li>• This phrase cannot be recovered if lost</li>
              </ul>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full bg-primary hover:bg-primary/90"
              onClick={handleConfirmRecoveryPhrase}
            >
              I've Saved My Recovery Phrase →
            </Button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto">
              <span className="text-success text-3xl">✓</span>
            </div>
            
            <h2 className="text-2xl font-bold text-foreground">Wallet Created Successfully!</h2>
            
            <p className="text-muted-foreground">
              Your wallet has been created and secured. You can now access it through the dashboard.
            </p>

            <Button
              variant="primary"
              size="lg"
              className="w-full bg-primary hover:bg-primary/90"
              onClick={() => router.push('/dashboard')}
            >
              Go to Dashboard →
            </Button>
          </div>
        )}
      </Card>

      {/* Security Info Footer */}
      {step === 1 && (
        <div className="max-w-3xl mx-auto mt-8 px-4">
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-primary">🛡️</span>
              <div>
                <h3 className="text-primary font-medium mb-2">Security Best Practices</h3>
                <ul className="text-muted-foreground text-sm space-y-2">
                  <li>• Use a unique password that you don't use elsewhere</li>
                  <li>• Enable two-factor authentication once your account is created</li>
                  <li>• Never share your login credentials with anyone</li>
                  <li>• Make sure you're always on the correct website URL</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}