interface ChapaConfig {
  publicKey: string;
  baseUrl?: string;
}

interface PaymentRequest {
  amount: number;
  currency?: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  tx_ref: string;
  callback_url?: string;
  return_url?: string;
  customization?: {
    title?: string;
    description?: string;
    logo?: string;
  };
}

interface USSDRequest extends PaymentRequest {
  bank_code: string;
  account_number: string;
}

interface MobileAppRequest extends PaymentRequest {
  app_name: 'telebirr' | 'cbe_birr' | 'amole';
}

class ChapaService {
  private config: ChapaConfig;
  private readonly defaultConfig = {
    baseUrl: 'https://api.chapa.co/v1',
  };

  constructor(config: ChapaConfig) {
    this.config = { ...this.defaultConfig, ...config };
  }

  /**
   * Initialize a payment with USSD push
   */
  async initiateUSSD(payment: USSDRequest) {
    const url = `${this.config.baseUrl}/ussd/initialize`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.publicKey}`
      },
      body: JSON.stringify({
        ...payment,
        payment_type: 'ussd',
        currency: payment.currency || 'ETB',
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to initialize USSD payment');
    }

    return response.json();
  }

  /**
   * Initialize a payment with mobile app integration
   */
  async initiateMobileApp(payment: MobileAppRequest) {
    const url = `${this.config.baseUrl}/mobile/initialize`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.publicKey}`
      },
      body: JSON.stringify({
        ...payment,
        payment_type: 'mobile',
        currency: payment.currency || 'ETB',
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to initialize mobile payment');
    }

    return response.json();
  }

  /**
   * Make a direct API payment
   */
  async makePayment(payment: PaymentRequest) {
    const url = `${this.config.baseUrl}/payment/initialize`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.publicKey}`
      },
      body: JSON.stringify({
        ...payment,
        currency: payment.currency || 'ETB',
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Payment initialization failed');
    }

    return response.json();
  }

  /**
   * Verify a transaction
   */
  async verifyTransaction(reference: string) {
    const url = `${this.config.baseUrl}/transaction/verify/${reference}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.config.publicKey}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to verify transaction');
    }

    return response.json();
  }
}

// Example usage:
/*
const chapa = new ChapaService({
  publicKey: 'your_chapa_public_key_here',
});

// USSD Payment
try {
  const ussdResponse = await chapa.initiateUSSD({
    amount: 100,
    email: 'user@example.com',
    first_name: 'John',
    last_name: 'Doe',
    phone_number: '0912345678',
    tx_ref: 'tx-ref-' + Date.now(),
    bank_code: '01', // Example bank code
    account_number: '1000000000000',
  });
  console.log('USSD Payment Initialized:', ussdResponse);
} catch (error) {
  console.error('USSD Payment Error:', error);
}
*/

export default ChapaService;
