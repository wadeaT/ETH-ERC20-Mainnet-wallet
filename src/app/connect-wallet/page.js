// src/app/connect-wallet/page.js
'use client';

import { Card } from '@/components/ui/Card';
import { Header } from '@/components/layout/Header';
import { ConnectWalletForm } from '@/components/wallet/ConnectWalletForm';

export default function ConnectWallet() {
  return (
    <div className="min-h-screen bg-background">
      <Header showBackButton={true} />

      <main className="max-w-md mx-auto p-4">
        <Card className="bg-card/50 backdrop-blur-sm p-8">
          <h2 className="text-2xl font-bold text-primary mb-8 text-center">
            Connect to Your Wallet
          </h2>
          <ConnectWalletForm />
        </Card>

        <div className="mt-8 p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="flex items-start gap-3">
            <span className="text-primary">🛡️</span>
            <div>
              <h3 className="text-primary font-medium mb-2">Security Note</h3>
              <p className="text-muted-foreground text-sm">
                If you've forgotten your password, you can restore your wallet using your recovery phrase.
                Never share your recovery phrase or password with anyone.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}