import { Metadata } from 'next';
import { ChurchInfoForm } from '../../../components/admin/church/ChurchInfoForm';

export const metadata: Metadata = {
  title: 'Church Information | Admin Dashboard',
  description: 'Manage your church\'s information and settings',
};

export default function ChurchInfoPage() {
  return (
    <div className="container mx-auto py-6 about-theme admin-theme">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Church Information</h1>
        <p className="text-muted-foreground">
          Update your church's contact information, address, and social media links
        </p>
      </div>

      <ChurchInfoForm />

      
    </div>
  );
}
