'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MinistryForm } from '@/components/admin/ministry/MinistryForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api/churchApi';

export default function MinistryPage() {
  const { id } = useParams();
  const router = useRouter();
  const [ministry, setMinistry] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMinistry = async () => {
      try {
        const data = await api.getMinistryById(id as string);
        setMinistry(data);
      } catch (error) {
        console.error('Error fetching ministry:', error);
        toast.error('Failed to load ministry data');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMinistry();
    } else {
      setLoading(false);
    }
  }, [id]);

  const handleSuccess = () => {
    toast.success('Ministry updated successfully');
    router.push('/admin/ministries');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <Button
          variant="ghost"
          className="mb-4 pl-0"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Ministries
        </Button>
        
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {ministry ? 'Edit Ministry' : 'Ministry Not Found'}
            </h1>
            {ministry && (
              <p className="text-muted-foreground">
                Update ministry details and settings
              </p>
            )}
          </div>
        </div>
      </div>

      {ministry ? (
        <MinistryForm ministryId={id as string} onSuccess={handleSuccess} />
      ) : (
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Ministry Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The ministry you are looking for does not exist or has been removed.
          </p>
          <Button onClick={() => router.push('/admin/ministries')}>
            Back to Ministries
          </Button>
        </div>
      )}
    </div>
  );
}
