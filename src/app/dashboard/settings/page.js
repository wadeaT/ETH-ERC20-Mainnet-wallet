'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { updateEmail } from 'firebase/auth';

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    username: '',
    email: ''
  });
  const [recoveryPhrase, setRecoveryPhrase] = useState('');
  const [showRecoveryPhrase, setShowRecoveryPhrase] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        setError('No user logged in');
        return;
      }

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setProfile({
          username: userData.username || '',
          email: userData.email || ''
        });
        setRecoveryPhrase(userData.recoveryPhrase || '');
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        setError('No user logged in');
        return;
      }

      // Update Firestore document
      await updateDoc(doc(db, 'users', user.uid), {
        username: profile.username,
        email: profile.email
      });

      // Update Firebase Auth email
      if (user.email !== profile.email) {
        await updateEmail(user, profile.email);
      }

      setSuccess('Profile updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile: ' + err.message);
      setTimeout(() => setError(''), 3000);
    }
  };

  const toggleRecoveryPhrase = () => {
    setShowRecoveryPhrase(!showRecoveryPhrase);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white mb-8">Settings</h1>

      {error && (
        <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 text-red-500">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-500/10 border border-green-500 rounded-lg p-4 text-green-500">
          {success}
        </div>
      )}

      {/* Profile Settings */}
      <Card className="bg-gray-800/50 backdrop-blur-sm p-6">
        <h2 className="text-lg font-medium text-white mb-6">Profile Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Display Name
            </label>
            <input
              type="text"
              value={profile.username}
              onChange={(e) => setProfile(prev => ({ ...prev, username: e.target.value }))}
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>
          <Button
            onClick={handleUpdateProfile}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700"
          >
            Save Changes
          </Button>
        </div>
      </Card>

      {/* Security Settings */}
      <Card className="bg-gray-800/50 backdrop-blur-sm p-6">
        <h2 className="text-lg font-medium text-white mb-6">Security</h2>
        <div className="space-y-6">
          {/* Recovery Phrase */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium">Backup Phrase</h3>
                <p className="text-sm text-gray-400">View your wallet recovery phrase</p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={toggleRecoveryPhrase}
                className="bg-gray-700 hover:bg-gray-600"
              >
                {showRecoveryPhrase ? 'Hide' : 'View'}
              </Button>
            </div>
            
            {showRecoveryPhrase && (
              <div className="bg-gray-700/30 rounded-lg p-6">
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-4 text-yellow-400">
                  <p className="text-sm">
                    ⚠️ Never share your recovery phrase with anyone. Store it in a secure location.
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {recoveryPhrase.split(' ').map((word, index) => (
                    <div key={index} className="bg-gray-800/50 p-2 rounded-lg text-center">
                      <span className="text-gray-400 text-sm">{index + 1}.</span>{' '}
                      <span className="text-white">{word}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Disabled features */}
          <div className="opacity-50 pointer-events-none">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-400">Coming soon</p>
              </div>
              <Button
                variant="primary"
                size="sm"
                disabled
                className="bg-gray-700"
              >
                Enable
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Disabled Preferences */}
      <Card className="bg-gray-800/50 backdrop-blur-sm p-6 opacity-50 pointer-events-none">
        <h2 className="text-lg font-medium text-white mb-6">Preferences</h2>
        <p className="text-sm text-gray-400">Additional preferences coming soon</p>
      </Card>
    </div>
  );
}