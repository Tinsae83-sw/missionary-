// Chapa API configuration
export const chapaConfig = {
  // Use test key for development
  testPublicKey: 'CHAPUBK_TEST-XXXXXXXXXXXXXXXXXXXX',
  testSecretKey: 'CHASECK_TEST-XXXXXXXXXXXXXXXXXXXX',
  baseUrl: 'https://api.chapa.co/v1',
  // Webhook secret for verifying webhook signatures
  webhookSecret: process.env.CHAPA_WEBHOOK_SECRET || 'your_webhook_secret',
  // Currency and default values
  currency: 'ETB',
  defaultAmount: 100,
  // Return URLs
  successUrl: '/give/success',
  cancelUrl: '/give',
  // Test account details (for demo purposes)
  testAccounts: [
    {
      bank: 'Awash Bank',
      accountNumber: '01320811435000',
      accountName: 'Test Account',
      amount: 100
    },
    {
      bank: 'Dashen Bank',
      accountNumber: '01320811435001',
      accountName: 'Test Account 2',
      amount: 200
    }
  ]
} as const;
