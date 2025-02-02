// src/components/wallet/WalletSecurityGuidelines.js
import { SecurityNotice } from '@/components/common/SecurityNotice';

export function WalletSecurityGuidelines() {
  return (
    <SecurityNotice type="info" title="Security Best Practices">
      <ul className="text-muted-foreground text-sm space-y-2">
        <li>• Use a unique password that you don't use elsewhere</li>
        <li>• Enable two-factor authentication once your account is created</li>
        <li>• Never share your login credentials with anyone</li>
        <li>• Make sure you're always on the correct website URL</li>
      </ul>
    </SecurityNotice>
  );
}