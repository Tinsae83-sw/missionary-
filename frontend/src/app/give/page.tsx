import React from 'react';
import GiveForm from './give-form';

export default function GivePage() {
  return (
    <div className="container mx-auto px-4 py-8" style={{ backgroundColor: '#E3F2FD', color: '#0D47A1' }}>
      <h1 className="text-3xl font-bold mb-8 text-center" style={{ color: '#0D47A1' }}>Support Our Ministry</h1>
      <div className="max-w-2xl mx-auto p-6 rounded-lg shadow-md" style={{ backgroundColor: '#BBDEFB', color: '#0D47A1' }}>
        <GiveForm />
      </div>
    </div>
  );
}
