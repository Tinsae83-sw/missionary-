'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { chapaConfig } from '../config/chapa';

interface ChapaContextType {
  amount: number;
  setAmount: (amount: number) => void;
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  paymentStatus: 'idle' | 'processing' | 'success' | 'error';
  paymentError: string | null;
  processPayment: (paymentData: any) => Promise<void>;
  resetPayment: () => void;
  isProcessing: boolean;
}

const ChapaContext = createContext<ChapaContextType | undefined>(undefined);

export function ChapaProvider({ children }: { children: ReactNode }) {
  const [amount, setAmount] = useState<number>(chapaConfig.defaultAmount);
  const [paymentMethod, setPaymentMethod] = useState<string>('card');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const processPayment = async (paymentData: any) => {
    try {
      setIsProcessing(true);
      setPaymentStatus('processing');
      setPaymentError(null);

      // In a real app, you would call your API endpoint here
      const response = await fetch('/api/chapa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...paymentData,
          amount: amount.toString(),
          currency: chapaConfig.currency,
          payment_method: paymentMethod,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Payment processing failed');
      }

      const data = await response.json();
      
      if (data.checkout_url) {
        // Redirect to Chapa checkout page
        window.location.href = data.checkout_url;
      } else {
        setPaymentStatus('success');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      setPaymentStatus('error');
      setPaymentError(error.message || 'An error occurred during payment processing');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetPayment = () => {
    setPaymentStatus('idle');
    setPaymentError(null);
  };

  return (
    <ChapaContext.Provider
      value={{
        amount,
        setAmount,
        paymentMethod,
        setPaymentMethod,
        paymentStatus,
        paymentError,
        processPayment,
        resetPayment,
        isProcessing,
      }}
    >
      {children}
    </ChapaContext.Provider>
  );
}

export const useChapa = (): ChapaContextType => {
  const context = useContext(ChapaContext);
  if (context === undefined) {
    throw new Error('useChapa must be used within a ChapaProvider');
  }
  return context;
};
