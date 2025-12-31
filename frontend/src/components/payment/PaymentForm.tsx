'use client';

import React, { useState, useEffect } from 'react';
import { useChapa } from '@/contexts/ChapaContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CreditCard, Phone, Banknote } from 'lucide-react';
import { chapaConfig } from '@/config/chapa';

const PaymentForm = () => {
  const {
    amount,
    setAmount,
    paymentMethod,
    setPaymentMethod,
    paymentStatus,
    paymentError,
    processPayment,
    isProcessing,
  } = useChapa();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isProcessing) return;
    
    const paymentData = {
      ...formData,
      amount: amount.toString(),
      tx_ref: `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      callback_url: `${window.location.origin}/api/chapa/callback`,
      return_url: `${window.location.origin}/give/thank-you`,
      customization: {
        title: 'Church Donation',
        description: 'Thank you for your generous donation',
      },
    };

    await processPayment(paymentData);
  };

  // Pre-fill with test data for demo
  useEffect(() => {
    setFormData({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      phone: '0912345678',
    });
  }, []);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Make a Donation</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount (ETB)</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <span className="text-gray-500">ETB</span>
                </div>
                <Input
                  id="amount"
                  type="number"
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="pl-16"
                  required
                />
              </div>
              <div className="flex gap-2 mt-2">
                {[100, 200, 500, 1000].map((value) => (
                  <Button
                    key={value}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setAmount(value)}
                    className={`${amount === value ? 'bg-primary text-primary-foreground' : ''}`}
                  >
                    {value} ETB
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Payment Method</Label>
              <RadioGroup
                value={paymentMethod}
                onValueChange={setPaymentMethod}
                className="grid gap-4 grid-cols-2"
              >
                <div>
                  <RadioGroupItem value="card" id="card" className="peer sr-only" />
                  <Label
                    htmlFor="card"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <CreditCard className="mb-2 h-6 w-6" />
                    Card
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="mobile" id="mobile" className="peer sr-only" />
                  <Label
                    htmlFor="mobile"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <Phone className="mb-2 h-6 w-6" />
                    Mobile Money
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="bank" id="bank" className="peer sr-only" />
                  <Label
                    htmlFor="bank"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <Banknote className="mb-2 h-6 w-6" />
                    Bank Transfer
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {paymentMethod === 'mobile' && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-700">
                <p>You will be redirected to complete your mobile money payment.</p>
              </div>
            )}

            {paymentError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
                {paymentError}
              </div>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isProcessing}>
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              `Donate ${amount} ETB`
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Your donation is secure and encrypted. By donating, you agree to our terms of service and privacy policy.
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default PaymentForm;
