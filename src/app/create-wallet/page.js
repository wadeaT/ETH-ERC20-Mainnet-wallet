'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { ethers } from 'ethers';
import { useEffect } from 'react';

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
    setError(''); // Clear any previous errors
  };

  useEffect(() => {
    // Clear recovery phrase when component unmounts
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

  // Remove the old generateRecoveryPhrase function and replace handleCreateAccount:

'use client';

const handleCreateAccount = async () => {
  if (!validateForm()) {
    setError('Please check all form requirements');
    return;
  }

  setIsLoading(true);
  try {
    // Generate wallet with BIP39 mnemonic
    const wallet = ethers.Wallet.createRandom();
    const mnemonic = wallet.mnemonic.phrase;
    setRecoveryPhrase(mnemonic);

    console.log('Wallet created:', wallet.address);

    // Store in Firebase - only username and wallet address
    const userDoc = {
      username: formData.username,
      password: formData.password, // In production, hash this
      createdAt: new Date().toISOString(),
      wallet: {
        address: wallet.address
      }
    };

    // Create user document in Firebase using username as ID
    await setDoc(doc(db, 'users', formData.username), userDoc);

    // Store wallet info in localStorage (temporary, only for this session)
    window.localStorage.setItem('walletAddress', wallet.address);
    window.localStorage.setItem('privateKey', wallet.privateKey);
    window.localStorage.setItem('username', formData.username);

    setStep(2); // Move to recovery phrase step
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
  setRecoveryPhrase(''); // Clear the recovery phrase after user confirms saving it
};

  return (
    <div className="min-h-screen bg-[#0B1120] p-4">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white">Ξ</span>
          </div>
          <h1 className="text-xl font-bold text-white">Create ETH Wallet</h1>
        </div>
        <Link href="/" className="text-gray-400 hover:text-white">
          ← Back
        </Link>
      </header>

      {/* Progress Steps */}
      <div className="max-w-3xl mx-auto mb-8">
        <div className="flex justify-between items-center mb-4">
          <div className={`flex items-center ${step >= 1 ? 'text-blue-500' : 'text-gray-500'}`}>
            <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center">
              🔒
            </div>
            <span className="ml-2">Account</span>
          </div>
          <div className="flex-1 h-0.5 mx-4 bg-gray-700">
            <div 
              className="h-full bg-blue-500 transition-all duration-300" 
              style={{ width: `${(step - 1) * 50}%` }}
            />
          </div>
          <div className={`flex items-center ${step >= 2 ? 'text-blue-500' : 'text-gray-500'}`}>
            <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center">
              🔑
            </div>
            <span className="ml-2">Recovery Phrase</span>
          </div>
          <div className="flex-1 h-0.5 mx-4 bg-gray-700">
            <div 
              className="h-full bg-blue-500 transition-all duration-300" 
              style={{ width: `${(step - 2) * 50}%` }}
            />
          </div>
          <div className={`flex items-center ${step >= 3 ? 'text-blue-500' : 'text-gray-500'}`}>
            <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center">
              ✓
            </div>
            <span className="ml-2">Confirm</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Card className="max-w-3xl mx-auto bg-gray-800/50 backdrop-blur-sm p-8">
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Create Your Wallet Account</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    placeholder="Choose a username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-md px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                </div>

                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-md px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    >
                      {showPassword ? "👁" : "👁‍🗨"}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-md px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    >
                      {showConfirmPassword ? "👁" : "👁‍🗨"}
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-gray-700/30 rounded-lg p-4">
                <h3 className="text-blue-400 font-medium mb-4">Account Requirements</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-center gap-2">
                    <div className={formData.username.length >= 3 && formData.username.length <= 20 ? "text-green-400" : "text-gray-500"}>✓</div>
                    Username (3-20 characters, letters and numbers only)
                  </li>
                  <li className="flex items-center gap-2">
                    <div className={formData.password.length >= 8 ? "text-green-400" : "text-gray-500"}>✓</div>
                    Password: at least 8 characters
                  </li>
                  <li className="flex items-center gap-2">
                    <div className={/\d/.test(formData.password) ? "text-green-400" : "text-gray-500"}>✓</div>
                    Password: include numbers
                  </li>
                  <li className="flex items-center gap-2">
                    <div className={/[!@#$%^&*]/.test(formData.password) ? "text-green-400" : "text-gray-500"}>✓</div>
                    Password: include special characters
                  </li>
                  <li className="flex items-center gap-2">
                    <div className={formData.password === formData.confirmPassword && formData.password !== '' ? "text-green-400" : "text-gray-500"}>✓</div>
                    Passwords match
                  </li>
                </ul>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400">
                {error}
              </div>
            )}

            <Button
              variant="primary"
              size="lg"
              className="w-full bg-blue-600 hover:bg-blue-700 mt-6"
              onClick={handleCreateAccount}
              disabled={!validateForm() || isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Continue →'}
            </Button>
          </div>
        )}

{step === 2 && recoveryPhrase && (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-white">Save Your Recovery Phrase</h2>
    
    <div className="bg-gray-700/30 rounded-lg p-6">
      <p className="text-gray-300 mb-4">
        Write down these 24 words in order and keep them safe. This recovery phrase follows the BIP39 standard and can be used to recover your wallet in any compatible wallet software.
      </p>
      <div className="grid grid-cols-3 gap-3">
        {recoveryPhrase.split(' ').map((word, index) => (
          <div key={index} className="flex items-center bg-gray-800/50 p-2 rounded-lg">
            <span className="text-gray-400 text-sm w-6">{(index + 1).toString().padStart(2, '0')}.</span>
            <span className="text-white flex-1 text-center">{word}</span>
          </div>
        ))}
      </div>
    </div>

    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 text-yellow-400">
      <h3 className="font-medium mb-2">⚠️ Important Security Warning</h3>
      <ul className="text-sm space-y-2">
        <li>• Never share your recovery phrase with anyone</li>
        <li>• Store it in a secure, offline location</li>
        <li>• Anyone with these words can access your wallet</li>
        <li>• This phrase cannot be recovered if lost</li>
      </ul>
    </div>

    {/* Add verification step */}
    <Button
      variant="primary"
      size="lg"
      className="w-full bg-blue-600 hover:bg-blue-700"
      onClick={handleConfirmRecoveryPhrase}
    >
      I've Saved My Recovery Phrase →
    </Button>
  </div>
)}

        {step === 3 && (
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
              <span className="text-green-500 text-3xl">✓</span>
            </div>
            
            <h2 className="text-2xl font-bold text-white">Wallet Created Successfully!</h2>
            
            <p className="text-gray-300">
              Your wallet has been created and secured. You can now access it through the dashboard.
            </p>

            <Button
              variant="primary"
              size="lg"
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={() => router.push('/dashboard')}
            >
              Go to Dashboard →
            </Button>
          </div>
        )}
      </Card>

      {/* Security Info Footer */}
      {step === 1 && (
        <div className="max-w-3xl mx-auto mt-8">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-blue-400">🛡️</span>
              <div>
                <h3 className="text-blue-400 font-medium mb-2">Security Best Practices</h3>
                <ul className="text-gray-300 text-sm space-y-2">
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
              