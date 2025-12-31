'use client';

import React, { useState } from 'react';

export default function GiveForm() {
  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reference, setReference] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // In a real implementation, you would send this data to your backend
    console.log('Bank transfer details:', { amount, name, email, reference });
    // Simulate processing
    setTimeout(() => {
      setIsSubmitting(false);
      // Here you would typically redirect to a thank you page or show a success message
      alert('Thank you for your donation! Please use the bank details below to complete your transfer.');
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
          Donation Amount
        </label>
          <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">$</span>
          </div>
          <input
            type="number"
            name="amount"
            id="amount"
            className="block w-full pl-7 pr-12 sm:text-sm rounded-md p-2 border"
            style={{ borderColor: '#0D47A1' }}
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          className="mt-1 block w-full rounded-md shadow-sm py-2 px-3 focus:outline-none sm:text-sm"
          style={{ borderColor: '#0D47A1' }}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          name="email"
          id="email"
          className="mt-1 block w-full rounded-md shadow-sm py-2 px-3 focus:outline-none sm:text-sm"
          style={{ borderColor: '#0D47A1' }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="reference" className="block text-sm font-medium text-gray-700">
          Payment Reference (Your Name/ID)
        </label>
        <input
          type="text"
          name="reference"
          id="reference"
          className="mt-1 block w-full rounded-md shadow-sm py-2 px-3 focus:outline-none sm:text-sm"
          style={{ borderColor: '#0D47A1' }}
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          placeholder="e.g., JohnDoe-001"
          required
        />
      </div>

      <div className="p-4 rounded-md" style={{ backgroundColor: '#BBDEFB', border: '1px solid #BBDEFB' }}>
        <h3 className="text-lg font-medium mb-2" style={{ color: '#0D47A1' }}>Bank Transfer Details</h3>
        <div className="space-y-2 text-sm" style={{ color: '#0D47A1' }}>
          <p><span className="font-medium">Bank Name:</span> [YOUR BANK NAME]</p>
          <p><span className="font-medium">Account Name:</span> [YOUR CHURCH NAME]</p>
          <p><span className="font-medium">Account Number:</span> [YOUR ACCOUNT NUMBER]</p>
          <p><span className="font-medium">SWIFT/BIC:</span> [YOUR SWIFT CODE]</p>
          <p className="mt-3" style={{ color: '#0D47A1' }}>
            Please use the reference above when making your transfer.
          </p>
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full flex justify-center py-2 px-4 rounded-md shadow-sm text-sm font-medium ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
          style={{ backgroundColor: '#BBDEFB', color: '#0D47A1', border: '1px solid #BBDEFB' }}
        >
          {isSubmitting ? 'Processing...' : 'I will make the transfer'}
        </button>
      </div>
    </form>
  );
}
