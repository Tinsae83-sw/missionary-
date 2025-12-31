import { Toast } from '@/components/ui/toast';

export interface PaymentData {
  amount: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  purpose?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export async function initializePayment(data: PaymentData) {
  try {
    const response = await fetch('/api/chapa', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: data.amount.toString(),
        currency: 'ETB',
        email: data.email,
        first_name: data.firstName,
        last_name: data.lastName,
        phone_number: data.phoneNumber || '',
        tx_ref: `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        purpose: data.purpose || 'Donation',
        callback_url: `${window.location.origin}/give/thank-you`,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      const error = new Error(result.message || 'Failed to process payment');
      if (data.onError) data.onError(error);
      throw error;
    }

    if (result.status === 'success' && result.data && result.data.checkout_url) {
      if (data.onSuccess) data.onSuccess();
      window.location.href = result.data.checkout_url;
    } else {
      const error = new Error('Invalid response from payment gateway');
      if (data.onError) data.onError(error);
      throw error;
    }
  } catch (error) {
    console.error('Payment initialization error:', error);
    if (data.onError) data.onError(error as Error);
    throw error;
  }
}
