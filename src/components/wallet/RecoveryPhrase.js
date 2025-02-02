// src/components/wallet/RecoveryPhrase.js
'use client';

import { Button } from '@/components/ui/Button';

export function RecoveryPhrase({ phrase, onConfirm }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Save Your Recovery Phrase</h2>
      
      <div className="bg-card/30 rounded-lg p-6">
        <p className="text-muted-foreground mb-4">
          Write down these 24 words in order and keep them safe.
        </p>
        <div className="grid grid-cols-3 gap-3">
          {phrase.split(' ').map((word, index) => (
            <div key={index} className="flex items-center bg-card/50 p-2 rounded-lg">
              <span className="text-muted-foreground text-sm w-6">
                {(index + 1).toString().padStart(2, '0')}.
              </span>
              <span className="text-foreground flex-1 text-center">{word}</span>
            </div>
          ))}
        </div>
      </div>

      <Button
        variant="primary"
        size="lg"
        className="w-full bg-primary hover:bg-primary/90"
        onClick={onConfirm}
      >
        I've Saved My Recovery Phrase →
      </Button>
    </div>
  );
}