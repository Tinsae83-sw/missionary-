'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getSermons, type Sermon, type SermonFilters } from '../../lib/api/sermonApi';
import { format } from 'date-fns';

export default function SermonsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<SermonFilters>({
    limit: 1000, // Set a high limit to get all sermons
    sortBy: 'sermon_date',
    order: 'desc',
    is_published: true
  });

  useEffect(() => {
    const fetchSermons = async () => {
      try {
        setIsLoading(true);
        const response = await getSermons(filters);
        console.log('API Response:', response); // Log the full response
        
        // The response should have a data property containing the array of sermons
        const sermonsData = response.data || [];
        
        setSermons(sermonsData);
      } catch (error) {
        console.error('Error fetching sermons:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSermons();
  }, [filters]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev: SermonFilters) => ({
      ...prev,
      search: e.target.value
    }));
  };

  const handleSortChange = (value: string) => {
    const [sortBy, order] = value.split('_');
    setFilters((prev: SermonFilters) => ({
      ...prev,
      sortBy: sortBy as SermonFilters['sortBy'],
      order: order as 'asc' | 'desc'
    }));
  };

  const formatDate = (dateString: string): string => {
    try {
      return format(new Date(dateString), 'MMMM d, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <div className="container mx-auto px-4 py-8" style={{ backgroundColor: '#E3F2FD', color: '#0D47A1' }}>
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2" style={{ color: '#0D47A1' }}>Sermons</h1>
        <p style={{ color: '#0D47A1' }}>Watch or listen to our latest sermons and teachings</p>
      </div>

      <div className="mb-8 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="w-full md:w-1/2">
          <input
            type="text"
            placeholder="Search sermons..."
            onChange={handleSearch}
            value={filters.search || ''}
            className="w-full px-4 py-2 rounded-md focus:outline-none"
            style={{ borderColor: '#0D47A1' }}
          />
        </div>
        <div className="w-full md:w-1/3">
          <select
            value={`${filters.sortBy}_${filters.order}`}
            onChange={(e) => handleSortChange(e.target.value)}
            className="w-full px-4 py-2 rounded-md focus:outline-none"
            style={{ borderColor: '#0D47A1' }}
          >
            <option value="sermon_date_desc">Newest First</option>
            <option value="sermon_date_asc">Oldest First</option>
            <option value="title_asc">Title (A-Z)</option>
            <option value="title_desc">Title (Z-A)</option>
            <option value="speaker_asc">Speaker (A-Z)</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200 animate-pulse"></div>
              <div className="p-4">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 mb-4 animate-pulse"></div>
                <div className="flex justify-between">
                  <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
                  <div className="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : sermons.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {sermons.map((sermon) => (
              <div key={sermon.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full">
                <div className="relative pt-[56.25%] bg-gray-100">
                  {sermon.thumbnail_url ? (
                    <img 
                      src={sermon.thumbnail_url} 
                      alt={sermon.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                      <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  {sermon.is_featured && (
                    <span className="absolute top-2 right-2 text-xs font-medium px-2.5 py-0.5 rounded" style={{ backgroundColor: '#0D47A1', color: '#E3F2FD' }}>
                      Featured
                    </span>
                  )}
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="text-lg font-semibold mb-2 line-clamp-2" style={{ color: '#0D47A1' }}>{sermon.title}</h3>
                  {sermon.description && (
                    <p className="text-sm mb-4 line-clamp-2" style={{ color: '#0D47A1' }}>
                      {truncateText(sermon.description, 100)}
                    </p>
                  )}
                  
                  <div className="space-y-2 text-sm mt-2" style={{ color: '#0D47A1' }}>
                    <div className="flex items-center">
                      <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#0D47A1' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>{sermon.speaker}</span>
                    </div>
                    {sermon.bible_passage && (
                      <div className="flex items-center">
                        <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#0D47A1' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <span>{sermon.bible_passage}</span>
                      </div>
                    )}
                    <div className="flex items-center">
                      <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#0D47A1' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{formatDate(sermon.sermon_date)}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <div className="flex space-x-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: '#BBDEFB', color: '#0D47A1' }}>
                        <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {sermon.view_count || 0}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: '#BBDEFB', color: '#0D47A1' }}>
                        <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        {sermon.like_count || 0}
                      </span>
                    </div>
                    <button 
                      onClick={() => router.push(`/sermons/${sermon.id}`)}
                      className="px-4 py-2 text-sm font-medium rounded-md focus:outline-none"
                      style={{ backgroundColor: '#BBDEFB', color: '#0D47A1', border: '1px solid #BBDEFB' }}
                    >
                      Watch Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium" style={{ color: '#0D47A1' }}>No sermons found</h3>
          <p className="mt-1" style={{ color: '#0D47A1' }}>
            {filters.search 
              ? `No sermons match your search for "${filters.search}"`
              : "There are no sermons available at the moment."}
          </p>
        </div>
      )}
    </div>
  );
}