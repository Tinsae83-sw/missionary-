'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { DataTable } from '../../../components/ui/data-table';
import { columns } from './columns';
import { ColumnDef } from '@tanstack/react-table';
import { Ministry } from '../../../types';

// Database model fields - matches the actual database schema
interface MinistryDB {
  id: string;
  name: string;
  description: string;
  short_description: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  contact_person: string | null;
  meeting_times: string | null;
  meeting_location: string | null;
  cover_image_url: string | null;
  icon_class: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

// Frontend interface with all fields
interface MinistryTableData {
  id: string;
  name: string;
  description: string;
  shortDescription?: string;
  contactEmail: string | null;
  contactPhone: string | null;
  contactPerson: string | null;
  meetingTimes: string | null;
  meetingLocation: string | null;
  coverImageUrl: string | null;
  iconClass: string | null;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
  
  // Computed fields
  statusBadge: React.ReactNode;
  contactInfo: {
    person: string;
    email: string;
    phone: string;
  };
  meetingInfo: {
    times: string;
    location: string;
  };
}
import { getMinistries, deleteMinistry } from '../../../lib/api/churchApi';
import { toast } from 'sonner';

export default function MinistriesPage() {
  const [ministries, setMinistries] = useState<MinistryTableData[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchMinistries = async () => {
      try {
        setLoading(true);
        const ministries = await getMinistries();
        
        // Transform the data from database format to frontend format
        const tableData: MinistryTableData[] = ministries.map((ministry: any) => ({
          // Map database fields to frontend fields
          id: ministry.id,
          name: ministry.name || 'Unnamed Ministry',
          description: ministry.description || '',
          shortDescription: ministry.short_description || null,
          
          // Contact information
          contactPerson: ministry.contact_person || null,
          contactEmail: ministry.contact_email || null,
          contactPhone: ministry.contact_phone || null,
          
          // Meeting information
          meetingTimes: ministry.meeting_times || null,
          meetingLocation: ministry.meeting_location || null,
          
          // Media
          coverImageUrl: ministry.cover_image_url || null,
          iconClass: ministry.icon_class || 'ri-organization-chart',
          
          // Status and ordering
          isActive: ministry.is_active,
          displayOrder: ministry.display_order || 0,
          
          // Dates
          createdAt: ministry.created_at || new Date().toISOString(),
          updatedAt: ministry.updated_at || new Date().toISOString(),
          
          // Computed fields for display
          statusBadge: (
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                ministry.is_active ? 'dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
              }`}
              style={ministry.is_active ? { backgroundColor: '#BBDEFB', color: '#0D47A1' } : undefined}
            >
              {ministry.is_active ? 'Active' : 'Inactive'}
            </span>
          ),
          contactInfo: {
            person: ministry.contact_person || 'Not specified',
            email: ministry.contact_email || 'Not specified',
            phone: ministry.contact_phone || 'Not specified'
          },
          meetingInfo: {
            times: ministry.meeting_times || 'Not scheduled',
            location: ministry.meeting_location || 'Not specified'
          }
        }));
        
        setMinistries(tableData);
      } catch (error) {
        console.error('Error fetching ministries:', error);
        toast.error('Failed to load ministries');
      } finally {
        setLoading(false);
      }
    };

    fetchMinistries();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this ministry?')) {
      try {
        await deleteMinistry(id);
        setMinistries(prev => prev.filter(ministry => ministry.id !== id));
        toast.success('Ministry deleted successfully');
      } catch (error) {
        console.error('Error deleting ministry:', error);
        toast.error('Failed to delete ministry');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="text-muted-foreground">Loading ministries...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6 about-theme">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Ministries</h1>
          <p className="text-muted-foreground">Manage your church ministries and groups</p>
        </div>
        <Button onClick={() => router.push('/admin/ministries/new')} className="button-brand">
          <Plus className="mr-2 h-4 w-4" /> Add Ministry
        </Button>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Ministries Overview</h2>
            <p className="text-muted-foreground">
              Manage all church ministries and groups in one place
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
                <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                <path d="M3 3v5h5"/>
                <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
                <path d="M16 16h5v5"/>
              </svg>
              Refresh
            </Button>
            <Button onClick={() => router.push('/admin/ministries/new')} className="button-brand">
              <Plus className="mr-2 h-4 w-4" />
              Add Ministry
            </Button>
          </div>
        </div>

        <Card className="border-none shadow-sm">
          <CardHeader className="px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">All Ministries</CardTitle>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                  {ministries.length} {ministries.length === 1 ? 'ministry' : 'ministries'} found
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <DataTable
              columns={columns}
              data={ministries}
              searchKey="name"
              placeholder="Search ministries..."
              emptyState={
                <div className="flex flex-col items-center justify-center py-12 space-y-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12 text-muted-foreground">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                  <h3 className="text-lg font-medium">No ministries found</h3>
                  <p className="text-sm text-muted-foreground">
                    Get started by creating a new ministry.
                  </p>
                  <Button className="mt-4 button-brand" onClick={() => router.push('/admin/ministries/new')}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Ministry
                  </Button>
                </div>
              }
            />
          </CardContent>
        </Card>
      </div>
      
    </div>
  );
}
