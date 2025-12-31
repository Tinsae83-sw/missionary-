import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../../components/ui/button';

export default function ThankYouPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
          <CheckCircle className="h-10 w-10 text-green-600" aria-hidden="true" />
        </div>
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          Thank You for Your Generosity!
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Your donation has been received. A confirmation email has been sent to your email address.
        </p>
        <div className="mt-8 flex justify-center space-x-4">
          <Link href="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
          <Link href="/give">
            <Button>Make Another Donation</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
