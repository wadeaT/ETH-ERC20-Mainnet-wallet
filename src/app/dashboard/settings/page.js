// src/app/dashboard/settings/page.js
'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { SecurityNotice } from '@/components/common/SecurityNotice';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { updateEmail } from 'firebase/auth';
import { ProfileSettings } from '@/components/settings/ProfileSettings';
import { SecuritySettings } from '@/components/settings/SecuritySettings';

export default function SettingsPage() {
  const [profile, setProfile] = useState({ username: '', email: '' });
  const [recoveryPhrase, setRecoveryPhrase] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No user logged in');

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
      setError('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No user logged in');

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
      setError('Failed to update profile: ' + err.message);
      setTimeout(() => setError(''), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-foreground mb-8">Settings</h1>

      {error && <SecurityNotice type="error">{error}</SecurityNotice>}
      {success && <SecurityNotice type="info">{success}</SecurityNotice>}

      <ProfileSettings
        profile={profile}
        onProfileChange={setProfile}
        onSave={handleUpdateProfile}
        isLoading={loading}
      />

      <SecuritySettings recoveryPhrase={recoveryPhrase} />

      <Card className="bg-card/50 backdrop-blur-sm p-6 opacity-50 pointer-events-none">
        <h2 className="text-lg font-medium text-foreground mb-6">Preferences</h2>
        <p className="text-sm text-muted-foreground">
          Additional preferences coming soon
        </p>
      </Card>
    </div>
  );
}