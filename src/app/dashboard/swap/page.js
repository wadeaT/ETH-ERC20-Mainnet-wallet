// src/app/dashboard/swap/page.js
'use client';

import { Card } from '@/components/ui/Card';
import { Repeat } from 'lucide-react';

export default function SwapPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Swap Tokens</h1>

      <Card className="bg-card/50 backdrop-blur-sm p-8 text-center max-w-2xl">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Repeat className="w-8 h-8 text-primary" />
          </div>
          
          <h2 className="text-xl font-semibold text-foreground">
            Token Swaps Coming Soon
          </h2>
          
          <p className="text-muted-foreground max-w-sm">
            We're working on bringing you secure and efficient token swaps. 
            This feature will be available in a future update.
          </p>

          <div className="mt-4 p-4 bg-primary/5 rounded-lg text-sm text-muted-foreground w-full">
            <p>Future features will include:</p>
            <ul className="mt-2 space-y-1">
              <li>• Direct token-to-token swaps</li>
              <li>• Best price routing</li>
              <li>• Multiple DEX support</li>
              <li>• Low slippage trades</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}