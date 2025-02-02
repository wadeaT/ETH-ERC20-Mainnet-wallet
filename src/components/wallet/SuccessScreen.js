// src/components/wallet/SuccessScreen.js
import { Button } from '@/components/ui/Button';

export function SuccessScreen({ onContinue }) {
  return (
    <div className="space-y-6 text-center">
      <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto">
        <span className="text-success text-3xl">✓</span>
      </div>
      
      <h2 className="text-2xl font-bold text-foreground">
        Wallet Created Successfully!
      </h2>
      
      <p className="text-muted-foreground">
        Your wallet has been created and secured. You can now access it through the dashboard.
      </p>

      <Button
        variant="primary"
        size="lg"
        className="w-full bg-primary hover:bg-primary/90"
        onClick={onContinue}
      >
        Go to Dashboard →
      </Button>
    </div>
  );
}