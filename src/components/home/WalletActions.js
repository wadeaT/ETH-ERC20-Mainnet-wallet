// src/components/home/WalletActions.js
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

const ACTIONS = [
  { path: 'create-wallet', text: 'Create New Wallet', color: 'bg-blue-600 hover:bg-blue-700' },
  { path: 'restore-wallet', text: 'Restore Using Recovery Phrase', color: 'bg-amber-600 hover:bg-amber-700' },
  { path: 'connect-wallet', text: 'Connect Existing Wallet', color: 'bg-green-600 hover:bg-green-700' }
];

export const WalletActions = () => (
  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center max-w-2xl mx-auto px-4 mb-12">
    {ACTIONS.map(({ path, text, color }) => (
      <Link key={path} href={`/${path}`} className="w-full sm:w-auto">
        <Button 
          variant="primary" 
          size="lg" 
          className={`w-full text-sm sm:text-base ${color}`}
        >
          {text}
        </Button>
      </Link>
    ))}
  </div>
);