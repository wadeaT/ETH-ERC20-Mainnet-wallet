// src/components/wallet/ProgressSteps.js
import React from 'react';

export function ProgressSteps({ currentStep }) {
  const steps = [
    { icon: '🔒', label: 'Account' },
    { icon: '🔑', label: 'Recovery Phrase' },
    { icon: '✓', label: 'Confirm' }
  ];
  
  return (
    <div className="flex justify-between items-center mb-4">
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div className={`flex items-center ${currentStep >= index + 1 ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center">
              {step.icon}
            </div>
            <span className="ml-2">{step.label}</span>
          </div>
          {index < steps.length - 1 && (
            <div className="flex-1 h-0.5 mx-4 bg-border">
              <div 
                className="h-full bg-primary transition-all duration-300" 
                style={{ width: `${(currentStep - 1) * 50}%` }}
              />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}