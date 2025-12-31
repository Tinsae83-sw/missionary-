'use client';

import { useRouter } from 'next/navigation';
import { MinistryForm } from '../../../../components/admin/ministry/MinistryForm';
import { toast } from 'sonner';

export default function NewMinistryPage() {
  const router = useRouter();

  const handleSuccess = () => {
    toast.success('Ministry created successfully');
    router.push('/admin/ministries');
    router.refresh();
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Create New Ministry</h1>
        <p className="text-muted-foreground">
          Add a new ministry or group to your church
        </p>
      </div>

      <MinistryForm onSuccess={handleSuccess} />
    </div>
  );
}
