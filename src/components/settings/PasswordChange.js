// src/components/settings/PasswordChange.js
'use client';

import { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { PasswordField } from '../shared/PasswordField';
import { SecurityNotice } from '../common/SecurityNotice';

export function PasswordChange() {
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      // Implement password change logic here
      await updatePassword(passwords.current, passwords.new);
      setSuccess('Password updated successfully');
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-4">Change Password</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <PasswordField
          label="Current Password"
          value={passwords.current}
          onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))}
        />

        <PasswordField
          label="New Password"
          value={passwords.new}
          onChange={e => setPasswords(p => ({ ...p, new: e.target.value }))}
          showRequirements
        />

        <PasswordField
          label="Confirm New Password"
          value={passwords.confirm}
          onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))}
        />

        {error && <SecurityNotice type="error">{error}</SecurityNotice>}
        {success && <SecurityNotice type="success">{success}</SecurityNotice>}

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Updating...' : 'Update Password'}
        </Button>
      </form>
    </Card>
  );
}