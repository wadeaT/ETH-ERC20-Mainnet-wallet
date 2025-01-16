// src/components/ui/Toast.js
'use client';

import { useState, useEffect, createContext, useContext } from 'react';

const ToastContext = createContext(null);

export const Toast = ({ message, type = 'success', onClose }) => {
  return (
    <div className={`
      flex items-center gap-2 
      px-4 py-3 rounded-lg 
      animate-slide-up
      shadow-lg
      ${type === 'success' ? 'bg-green-500/20 text-green-500 border border-green-500/20' : 
        type === 'error' ? 'bg-red-500/20 text-red-400 border border-red-500/20' :
        type === 'info' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/20' : 
        'bg-yellow-500/20 text-yellow-400 border border-yellow-500/20'}
    `}>
      {message}
      <button 
        onClick={onClose}
        className="ml-2 hover:opacity-70 transition-opacity"
      >
        ×
      </button>
    </div>
  );
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};