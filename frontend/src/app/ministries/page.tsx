'use client';

import { useState, useEffect } from 'react';
import { ministryApi, type Ministry } from '../../lib/api/ministryApi';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Search, Clock, MapPin, Mail, Phone, Users, Filter } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function MinistriesPage() {
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'active'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMinistries = async () => {
      try {
        setIsLoading(true);
        const ministriesData = activeFilter === 'active' 
          ? await ministryApi.getActiveMinistries() 
          : await ministryApi.getMinistries();
        setMinistries(ministriesData);
      } catch (error) {
        console.error('Error fetching ministries:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMinistries();
  }, [activeFilter]);

  const filteredMinistries = ministries
    .filter(ministry => 
      (activeFilter === 'all' || ministry.is_active) &&
      (ministry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ministry.short_description?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (ministry.description?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (ministry.contact_person?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (ministry.meeting_location?.toLowerCase() || '').includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => (a.display_order || 0) - (b.display_order || 0) || a.name.localeCompare(b.name));

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderTopColor: '#0D47A1', borderBottomColor: '#0D47A1' }}></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#E3F2FD', color: '#0D47A1' }}>
      {/* Hero Section */}
      <div className="py-16" style={{ backgroundColor: '#BBDEFB', color: '#0D47A1' }}>
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#0D47A1' }}>Our Ministries</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto" style={{ color: '#0D47A1' }}>
            Discover ways to get involved and serve in our church community through our various ministries.
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5" style={{ color: '#0D47A1' }} />
              </div>
              <Input
                type="text"
                placeholder="Search ministries..."
                className="pl-10 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ borderColor: '#0D47A1' }}
              />
            </div>
            <div className="flex items-center">
              <Filter className="h-5 w-5 mr-2" style={{ color: '#0D47A1' }} />
              <select
                className="rounded-md p-2 text-sm"
                style={{ borderColor: '#0D47A1' }}
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value as 'all' | 'active')}
              >
                <option value="all">All Ministries</option>
                <option value="active">Active Ministries Only</option>
              </select>
            </div>
          </div>

          {/* Ministries Grid */}
          {filteredMinistries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMinistries.map((ministry) => (
                <div key={ministry.id} className="group">
                  <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg">
                    {ministry.cover_image_url ? (
                      <div className="relative h-48 w-full">
                        <Image
                          src={ministry.cover_image_url || '/images/ministry-placeholder.jpg'}
                          alt={ministry.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                    ) : (
                      <div className="h-48 flex items-center justify-center" style={{ backgroundColor: '#BBDEFB' }}>
                        <h3 className="text-xl font-bold text-center px-4" style={{ color: '#0D47A1' }}>
                          {ministry.name}
                        </h3>
                      </div>
                    )}
                    
                    <CardHeader>
                      <CardTitle className="text-xl font-bold">
                        <Link href={`/ministries/${ministry.id}`} className="transition-colors hover:text-[#0D47A1]" style={{ color: '#0D47A1' }}>
                          {ministry.name}
                        </Link>
                      </CardTitle>
                      {ministry.short_description && (
                        <p className="line-clamp-2" style={{ color: '#0D47A1' }}>{ministry.short_description}</p>
                      )}
                    </CardHeader>
                    
                    <CardContent className="flex-grow space-y-3">
                      {ministry.meeting_times && (
                        <div className="flex items-start text-sm" style={{ color: '#0D47A1' }}>
                          <Clock className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0" style={{ color: '#0D47A1' }} />
                          <span className="line-clamp-2">{ministry.meeting_times}</span>
                        </div>
                      )}
                      
                      {ministry.meeting_location && (
                        <div className="flex items-start text-sm" style={{ color: '#0D47A1' }}>
                          <MapPin className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0" style={{ color: '#0D47A1' }} />
                          <span>{ministry.meeting_location}</span>
                        </div>
                      )}
                      
                      {ministry.contact_person && (
                        <div className="flex items-center text-sm" style={{ color: '#0D47A1' }}>
                          <Users className="h-4 w-4 mr-2 flex-shrink-0" style={{ color: '#0D47A1' }} />
                          <span>Contact: {ministry.contact_person}</span>
                        </div>
                      )}
                    </CardContent>
                    
                    <CardFooter className="mt-auto border-t pt-4">
                      <Button asChild variant="outline" className="w-full group-hover:bg-[#BBDEFB]">
                        <Link href={`/ministries/${ministry.id}`} style={{ color: '#0D47A1' }}>
                          Learn More
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm">
              <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium" style={{ color: '#0D47A1' }}>No ministries found</h3>
              <p className="mt-2" style={{ color: '#0D47A1' }}>
                {searchTerm 
                  ? `No ministries match your search for "${searchTerm}"`
                  : "There are no ministries available at the moment. Please check back later."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}