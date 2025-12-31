'use client';

import { useRouter } from 'next/navigation';
import SermonForm from '../../../../components/admin/sermon/SermonForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewSermonPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/admin/sermons');
    router.refresh();
  };

  return (
    <div 
      className="container mx-auto py-10"
      style={{ 
        backgroundColor: '#E3F2FD', // Light Blue background
        minHeight: '100vh'
      }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 
            className="text-3xl font-bold"
            style={{ color: '#0D47A1' }} // Dark Blue text
          >
            Add New Sermon
          </h1>
          <p 
            className="text-muted-foreground"
            style={{ color: '#0D47A1', opacity: 0.8 }} // Dark Blue text with opacity
          >
            Fill in the details below to add a new sermon
          </p>
        </div>
        <Button 
          asChild 
          variant="outline"
          style={{
            color: '#0D47A1', // Dark Blue text
            borderColor: '#0D47A1', // Dark Blue border
            backgroundColor: 'transparent',
          }}
          className="hover:bg-[#E3F2FD] hover:opacity-90"
        >
          <Link href="/admin/sermons" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Sermons
          </Link>
        </Button>
      </div>

      <Card 
        style={{
          border: '1px solid #0D47A1', // Dark Blue border
          backgroundColor: 'white',
        }}
      >
        <CardHeader>
          <CardTitle 
            style={{ color: '#0D47A1' }} // Dark Blue text
          >
            Sermon Details
          </CardTitle>
          <CardDescription 
            style={{ color: '#0D47A1', opacity: 0.8 }} // Dark Blue text with opacity
          >
            Enter the sermon details below. All fields marked with * are required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SermonForm onSuccess={handleSuccess} />
        </CardContent>
      </Card>
    </div>
  );
}