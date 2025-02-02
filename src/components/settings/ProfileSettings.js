// src/components/settings/ProfileSettings.js
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export function ProfileSettings({ 
  profile, 
  onProfileChange, 
  onSave, 
  isLoading 
}) {
  return (
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
            onChange={(e) => onProfileChange({ ...profile, username: e.target.value })}
            className="w-full bg-muted/50 border border-input rounded-lg px-4 py-2 text-foreground"
          />
        </div>
        <div>
          <label className="block text-sm text-muted-foreground mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={profile.email}
            onChange={(e) => onProfileChange({ ...profile, email: e.target.value })}
            className="w-full bg-muted/50 border border-input rounded-lg px-4 py-2 text-foreground"
          />
        </div>
        <Button
          onClick={onSave}
          className="mt-4 w-full bg-primary hover:bg-primary/90"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </Card>
  );
}