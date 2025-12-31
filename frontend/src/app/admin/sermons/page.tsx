'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Loader2 } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { DataTable } from '../../../components/ui/data-table';
import { columns, FrontendSermon } from './columns';
import { Sermon } from '../../../types/sermon';
import { getSermons, deleteSermon, updateSermon } from '../../../lib/api/sermonApi';
import { toast } from 'sonner';

// Define the API response type
interface ApiSermonResponse extends Omit<Sermon, 'sermon_date' | 'is_published' | 'is_featured' | 'view_count' | 'like_count' | 'share_count' | 'download_count'> {
  sermon_date: string;
  is_published: boolean;
  is_featured: boolean;
  view_count: number;
  like_count: number;
  share_count: number;
  download_count: number;
  series_name?: string;
  sermon_notes_url?: string;
  speaker_name?: string;
  speaker_title?: string;
  speaker_photo_url?: string;
  series_thumbnail_url?: string;
  series_description?: string;
}

export default function SermonsPage() {
  const [sermons, setSermons] = useState<FrontendSermon[]>([]);
  const [pagination, setPagination] = useState({
    count: 0,
    totalPages: 1,
    currentPage: 1,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const router = useRouter();

  // Transform API sermon to frontend sermon type
  const transformSermon = (sermon: any): FrontendSermon => {
    const sermonDate = sermon.sermon_date ? new Date(sermon.sermon_date) : new Date();
    
    return {
      ...sermon,
      id: sermon.id,
      title: sermon.title,
      description: sermon.description || '',
      speaker: sermon.speaker,
      bible_passage: sermon.bible_passage || '',
      sermon_date: sermon.sermon_date,
      video_url: sermon.video_url || '',
      audio_url: sermon.audio_url || '',
      thumbnail_url: sermon.thumbnail_url || '',
      sermon_notes_url: sermon.sermon_notes_url || '',
      series_name: sermon.series_name || '',
      created_at: sermon.created_at,
      updated_at: sermon.updated_at,
      
      // Mapped fields
      date: sermonDate.toISOString(),
      isPublished: sermon.is_published || false,
      isFeatured: sermon.is_featured || false,
      viewCount: sermon.view_count || 0,
      likeCount: sermon.like_count || 0,
      shareCount: sermon.share_count || 0,
      downloadCount: sermon.download_count || 0,
      speakerName: sermon.speaker || '',
      biblePassage: sermon.bible_passage || '',
      videoUrl: sermon.video_url || '',
      audioUrl: sermon.audio_url || '',
      thumbnailUrl: sermon.thumbnail_url || '',
      sermonNotesUrl: sermon.sermon_notes_url || '',
      seriesName: sermon.series_name || ''
    };
  };

  // Wrapper function to fetch sermons with current filters
  const fetchSermons = async () => {
    try {
      setLoading(true);
      const response = await getSermons({
        page: pagination.currentPage,
        limit: 10,
        is_published: activeTab === 'published' ? true : activeTab === 'drafts' ? false : undefined,
        search: searchTerm || undefined
      });
      
      // Transform API response to match FrontendSermon type
      const transformedSermons = response.data.map(transformSermon);
      
      setSermons(transformedSermons);
      setPagination(prev => ({
        ...prev,
        count: response.count,
        totalPages: response.totalPages,
        currentPage: response.currentPage
      }));
    } catch (error) {
      console.error('Error fetching sermons:', error);
      toast.error('Failed to load sermons. Please try again.');
      setSermons([]);
      setPagination(prev => ({
        ...prev,
        count: 0,
        totalPages: 1,
        currentPage: 1
      }));
    } finally {
      setLoading(false);
    }
  };

  // Fetch sermons when search term or active tab changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSermons();
    }, 500); // Debounce search

    return () => clearTimeout(timer);
  }, [searchTerm, activeTab]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this sermon? This action cannot be undone.')) {
      try {
        await deleteSermon(id);
        toast.success('Sermon deleted successfully');
        // Refresh the sermons list
        fetchSermons();
      } catch (error: any) {
        console.error('Error deleting sermon:', error);
        const errorMessage = error.response?.data?.message || 'Failed to delete sermon';
        toast.error(errorMessage);
      }
    }
  };

  const handlePublishToggle = async (id: string, currentStatus: boolean) => {
    try {
      await updateSermon(id, { is_published: !currentStatus });
      toast.success('Sermon published status updated successfully');
      // Refresh the sermons list
      fetchSermons();
    } catch (error: any) {
      console.error('Error updating sermon published status:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update sermon published status';
      toast.error(errorMessage);
    }
  };

  const handlePageChange = async (page: number) => {
    try {
      setLoading(true);
      const response = await getSermons({
        page,
        limit: 10,
        is_published: activeTab === 'published' ? true : activeTab === 'drafts' ? false : undefined,
        search: searchTerm || undefined
      }) as unknown as ApiSermonResponse[];
      
      const transformedSermons = response.map(transformSermon);
      
      setSermons(transformedSermons);
      setPagination(prev => ({
        ...prev,
        currentPage: page,
      }));
    } catch (error) {
      console.error('Error fetching sermons:', error);
      toast.error('Failed to load sermons');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Filtering is handled by the API, but we can add additional client-side filtering if needed
  const filteredSermons = (sermons || []).filter((sermon) => {
    // Since we're already filtering by is_published in the API call,
    // this is just a fallback in case the API filtering fails
    if (activeTab === 'published') return sermon.isPublished;
    if (activeTab === 'drafts') return !sermon.isPublished;
    return true;
  });

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64" style={{ backgroundColor: '#E3F2FD' }}> {/* Light Blue background */}
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: '#0D47A1' }}></div> {/* Dark Blue spinner */}
      </div>
    );
  }

  // Handle empty or undefined state
  if (!sermons || sermons.length === 0) {
    return (
      <div className="container mx-auto py-10" style={{ backgroundColor: '#E3F2FD', minHeight: '100vh' }}> {/* Light Blue background */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight" style={{ color: '#0D47A1' }}> {/* Dark Blue text */}
              Sermons
            </h1>
            <p className="text-muted-foreground" style={{ color: '#0D47A1' }}> {/* Dark Blue text */}
              Manage and organize your church's sermons
            </p>
          </div>
          <Button 
            onClick={() => router.push('/admin/sermons/new')}
            style={{ 
              backgroundColor: '#BBDEFB', // Light Blue Accent
              color: '#0D47A1', // Dark Blue text
              border: '1px solid #0D47A1' // Dark Blue border
            }}
            className="hover:opacity-90 transition-opacity"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Sermon
          </Button>
        </div>

        <Card className="shadow-sm" style={{ border: '1px solid #0D47A1' }}> {/* Dark Blue border */}
          <CardHeader className="border-b" style={{ borderColor: '#0D47A1' }}> {/* Dark Blue border */}
            <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center justify-between">
              <div>
                <CardTitle className="text-xl" style={{ color: '#0D47A1' }}> {/* Dark Blue text */}
                  Sermon Library
                </CardTitle>
                <p className="text-sm text-muted-foreground" style={{ color: '#0D47A1' }}> {/* Dark Blue text */}
                  No sermons found
                </p>
              </div>
              <div className="relative w-full md:w-80">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4" style={{ color: '#0D47A1' }} /> {/* Dark Blue icon */}
                <Input
                  type="search"
                  placeholder="Search by title, speaker, or passage..."
                  className="w-full pl-8"
                  style={{ 
                    borderColor: '#0D47A1', // Dark Blue border
                    color: '#0D47A1', // Dark Blue text
                  }}
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 text-center">
            <div className="py-12">
              <h3 className="text-lg font-medium mb-2" style={{ color: '#0D47A1' }}> {/* Dark Blue text */}
                No sermons found
              </h3>
              <p className="text-muted-foreground mb-6" style={{ color: '#0D47A1' }}> {/* Dark Blue text */}
                {searchTerm 
                  ? 'No sermons match your search. Try adjusting your search term.' 
                  : 'Get started by creating your first sermon.'}
              </p>
              <Button 
                onClick={() => router.push('/admin/sermons/new')}
                style={{ 
                  backgroundColor: '#BBDEFB', // Light Blue Accent
                  color: '#0D47A1', // Dark Blue text
                  border: '1px solid #0D47A1' // Dark Blue border
                }}
                className="hover:opacity-90 transition-opacity"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Sermon
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10" style={{ backgroundColor: '#E3F2FD', minHeight: '100vh' }}> {/* Light Blue background */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: '#0D47A1' }}> {/* Dark Blue text */}
            Sermons
          </h1>
          <p className="text-muted-foreground" style={{ color: '#0D47A1' }}> {/* Dark Blue text */}
            Manage and organize your church's sermons
          </p>
        </div>
        <Button 
          onClick={() => router.push('/admin/sermons/new')}
          style={{ 
            backgroundColor: '#BBDEFB', // Light Blue Accent
            color: '#0D47A1', // Dark Blue text
            border: '1px solid #0D47A1' // Dark Blue border
          }}
          className="hover:opacity-90 transition-opacity"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Sermon
        </Button>
      </div>

      <Card className="shadow-sm" style={{ border: '1px solid #0D47A1' }}> {/* Dark Blue border */}
        <CardHeader className="border-b" style={{ borderColor: '#0D47A1' }}> {/* Dark Blue border */}
          <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center justify-between">
            <div>
              <CardTitle className="text-xl" style={{ color: '#0D47A1' }}> {/* Dark Blue text */}
                Sermon Library
              </CardTitle>
              <p className="text-sm text-muted-foreground" style={{ color: '#0D47A1' }}> {/* Dark Blue text */}
                {filteredSermons.length} {filteredSermons.length === 1 ? 'sermon' : 'sermons'} found
              </p>
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4" style={{ color: '#0D47A1' }} /> {/* Dark Blue icon */}
              <Input
                type="search"
                placeholder="Search by title, speaker, or passage..."
                className="w-full pl-8"
                style={{ 
                  borderColor: '#0D47A1', // Dark Blue border
                  color: '#0D47A1', // Dark Blue text
                }}
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {sermons.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground" style={{ color: '#0D47A1' }}> {/* Dark Blue text */}
                  {pagination.count} {pagination.count === 1 ? 'sermon' : 'sermons'} found
                </div>
              </div>
              <DataTable 
                columns={columns} 
                data={sermons}
                searchKey="title"
                pageCount={pagination.totalPages}
                currentPage={pagination.currentPage}
                totalItems={pagination.count}
                onPageChange={handlePageChange}
              />
            </div>
          ) : (
            <div className="py-12 text-center">
              <h3 className="text-lg font-medium mb-2" style={{ color: '#0D47A1' }}> {/* Dark Blue text */}
                No sermons found
              </h3>
              <p className="text-muted-foreground mb-6" style={{ color: '#0D47A1' }}> {/* Dark Blue text */}
                {searchTerm 
                  ? 'No sermons match your search. Try adjusting your search term.' 
                  : 'Get started by creating your first sermon.'}
              </p>
              <Button 
                onClick={() => router.push('/admin/sermons/new')}
                style={{ 
                  backgroundColor: '#BBDEFB', // Light Blue Accent
                  color: '#0D47A1', // Dark Blue text
                  border: '1px solid #0D47A1' // Dark Blue border
                }}
                className="hover:opacity-90 transition-opacity"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Sermon
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}