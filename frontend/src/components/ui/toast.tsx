import * as React from 'react';
import { X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onDismiss: () => void;
}

export function Toast({ message, type = 'info', onDismiss }: ToastProps) {
  const bgColor = {
    success: 'bg-green-100 border-green-300',
    error: 'bg-red-100 border-red-300',
    info: 'bg-blue-100 border-blue-300',
  }[type];

  const textColor = {
    success: 'text-green-800',
    error: 'text-red-800',
    info: 'text-blue-800',
  }[type];

  return (
    <div className={`fixed bottom-4 right-4 p-4 rounded-lg border ${bgColor} ${textColor} shadow-lg max-w-xs`}>
      <div className="flex items-start justify-between">
        <p className="text-sm">{message}</p>
        <button
          onClick={onDismiss}
          className="ml-2 text-gray-500 hover:text-gray-700"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
