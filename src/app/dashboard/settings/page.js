// src/app/dashboard/settings/page.js
'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { updateEmail } from 'firebase/auth';

export default function SettingsPage() {
  // Keep all state management and functions unchanged
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

      await updateDoc(doc(db, 'users', user.uid), {
        username: profile.username,
        email: profile.email
      });

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
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-foreground mb-8">Settings</h1>

      {error && (
        <div className="bg-destructive/10 border border-destructive rounded-lg p-4 text-destructive">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-success/10 border border-success rounded-lg p-4 text-success">
          {success}
        </div>
      )}

      {/* Profile Settings */}
      <Card className="bg-card/50 backdrop-blur-sm p-6">
        <h2 className="text-lg font-medium text-foreground mb-6">Profile Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-muted-foreground mb-2">
              Display Name
            </label>
            <input
              type="text"
              value={profile.username}
              onChange={(e) => setProfile(prev => ({ ...prev, username: e.target.value }))}
              className="w-full bg-muted/50 border border-input rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
              className="w-full bg-muted/50 border border-input rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
            />
          </div>
          <Button
            onClick={handleUpdateProfile}
            className="mt-4 w-full bg-primary hover:bg-primary/90"
          >
            Save Changes
          </Button>
        </div>
      </Card>

      {/* Security Settings */}
      <Card className="bg-card/50 backdrop-blur-sm p-6">
        <h2 className="text-lg font-medium text-foreground mb-6">Security</h2>
        <div className="space-y-6">
          {/* Recovery Phrase */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-foreground font-medium">Backup Phrase</h3>
                <p className="text-sm text-muted-foreground">View your wallet recovery phrase</p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={toggleRecoveryPhrase}
                className="bg-muted hover:bg-muted/90"
              >
                {showRecoveryPhrase ? 'Hide' : 'View'}
              </Button>
            </div>
            
            {showRecoveryPhrase && (
              <div className="bg-muted/30 rounded-lg p-6">
                <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 mb-4 text-warning">
                  <p className="text-sm">
                    ⚠️ Never share your recovery phrase with anyone. Store it in a secure location.
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {recoveryPhrase.split(' ').map((word, index) => (
                    <div key={index} className="bg-card/50 p-2 rounded-lg text-center">
                      <span className="text-muted-foreground text-sm">{index + 1}.</span>{' '}
                      <span className="text-foreground">{word}</span>
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
                <h3 className="text-foreground font-medium">Two-Factor Authentication</h3>
                <p className="text-sm text-muted-foreground">Coming soon</p>
              </div>
              <Button
                variant="primary"
                size="sm"
                disabled
                className="bg-muted"
              >
                Enable
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Disabled Preferences */}
      <Card className="bg-card/50 backdrop-blur-sm p-6 opacity-50 pointer-events-none">
        <h2 className="text-lg font-medium text-foreground mb-6">Preferences</h2>
        <p className="text-sm text-muted-foreground">Additional preferences coming soon</p>
      </Card>
    </div>
  );
}