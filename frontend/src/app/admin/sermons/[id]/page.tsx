'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SermonForm } from '../../../../components/admin/sermon/SermonForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Sermon } from '../../../../types';
import api from '../../../../lib/api/churchApi';

export default function EditSermonPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [sermon, setSermon] = useState<Sermon | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSermon = async () => {
      try {
        const data = await api.getSermonById(id);
        setSermon(data);
      } catch (err) {
        console.error('Error fetching sermon:', err);
        setError('Failed to load sermon data');
        toast.error('Failed to load sermon data');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchSermon();
    }
  }, [id]);

  const handleSuccess = () => {
    router.push('/admin/sermons');
    router.refresh();
  };

  if (isLoading) {
    return (
      <div 
        className="flex items-center justify-center h-64"
        style={{ backgroundColor: '#E3F2FD' }} // Light Blue background
      >
        <Loader2 
          className="h-8 w-8 animate-spin" 
          style={{ color: '#0D47A1' }} // Dark Blue spinner
        />
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className="text-center py-10"
        style={{ 
          backgroundColor: '#E3F2FD', // Light Blue background
          minHeight: '100vh'
        }}
      >
        <p 
          className="mb-4"
          style={{ color: '#D32F2F' }} // Red error text
        >
          {error}
        </p>
        <Button 
          onClick={() => router.push('/admin/sermons')} 
          variant="outline"
          style={{
            color: '#0D47A1', // Dark Blue text
            borderColor: '#0D47A1', // Dark Blue border
            backgroundColor: 'transparent',
          }}
          className="hover:bg-[#E3F2FD] hover:opacity-90"
        >
          Back to Sermons
        </Button>
      </div>
    );
  }

  if (!sermon) {
    return (
      <div 
        className="text-center py-10"
        style={{ 
          backgroundColor: '#E3F2FD', // Light Blue background
          minHeight: '100vh'
        }}
      >
        <p 
          className="mb-4"
          style={{ color: '#0D47A1' }} // Dark Blue text
        >
          Sermon not found
        </p>
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
          <Link href="/admin/sermons">Back to Sermons</Link>
        </Button>
      </div>
    );
  }

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
            Edit Sermon
          </h1>
          <p 
            className="text-muted-foreground"
            style={{ color: '#0D47A1', opacity: 0.8 }} // Dark Blue text with opacity
          >
            Update the sermon details below
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
            Edit Sermon
          </CardTitle>
          <CardDescription
            style={{ color: '#0D47A1', opacity: 0.8 }} // Dark Blue text with opacity
          >
            Update the sermon details below. All fields marked with * are required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SermonForm sermonId={sermon.id} onSuccess={handleSuccess} />
        </CardContent>
      </Card>
    </div>
  );
}