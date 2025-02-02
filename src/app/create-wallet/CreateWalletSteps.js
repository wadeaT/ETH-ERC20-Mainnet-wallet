// src/components/create-wallet/CreateWalletSteps.js
import { useState } from 'react';
import { AccountForm } from './AccountForm';
import { RecoveryPhrase } from './RecoveryPhrase';
import { SuccessScreen } from './SuccessScreen';

export function CreateWalletSteps() {
  const [step, setStep] = useState(1);
  const [walletData, setWalletData] = useState(null);

  const handleAccountCreated = (data) => {
    setWalletData(data);
    setStep(2);
  };

  const handlePhraseConfirmed = () => {
    setStep(3);
  };

  return (
    <div>
      {step === 1 && <AccountForm onSuccess={handleAccountCreated} />}
      {step === 2 && <RecoveryPhrase phrase={walletData?.mnemonic} onConfirm={handlePhraseConfirmed} />}
      {step === 3 && <SuccessScreen />}
    </div>
  );
}