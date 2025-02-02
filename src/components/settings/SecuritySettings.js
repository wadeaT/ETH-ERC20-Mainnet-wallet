// src/components/settings/SecuritySettings.js
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SecurityNotice } from '@/components/common/SecurityNotice';
import { PasswordField } from '@/components/shared/PasswordField';

export function SecuritySettings({ recoveryPhrase }) {
  const [showPhrase, setShowPhrase] = useState(false);
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      if (passwords.new !== passwords.confirm) {
        throw new Error('New passwords do not match');
      }
      // Add password update logic here
      setSuccess('Password updated successfully');
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm p-6">
      <h2 className="text-lg font-medium text-foreground mb-6">Security</h2>
      <div className="space-y-8">
        {/* Password Change Section */}
        <div className="space-y-4">
          <div>
            <h3 className="text-foreground font-medium mb-1">Change Password</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Update your wallet password
            </p>
          </div>
          
          <form onSubmit={handlePasswordChange} className="space-y-4">
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
              variant="primary"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Updating Password...' : 'Update Password'}
            </Button>
          </form>
        </div>

        {/* Recovery Phrase Section */}
        <div className="space-y-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-foreground font-medium">Backup Phrase</h3>
              <p className="text-sm text-muted-foreground">
                View your wallet recovery phrase
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowPhrase(!showPhrase)}
              className="bg-muted hover:bg-muted/90"
            >
              {showPhrase ? 'Hide' : 'View'}
            </Button>
          </div>
          
          {showPhrase && (
            <div className="bg-muted/30 rounded-lg p-6">
              <SecurityNotice type="warning">
                Never share your recovery phrase with anyone. 
                Store it in a secure location.
              </SecurityNotice>
              <div className="grid grid-cols-3 gap-3 mt-4">
                {recoveryPhrase.split(' ').map((word, index) => (
                  <div key={index} className="bg-card/50 p-2 rounded-lg text-center">
                    <span className="text-muted-foreground text-sm">
                      {index + 1}.
                    </span>{' '}
                    <span className="text-foreground">{word}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 2FA Section */}
        <div className="opacity-50 pointer-events-none pt-4 border-t border-border">
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
  );
}