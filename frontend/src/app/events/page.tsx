'use client';

import { useEffect, useState } from 'react';
import { eventApi, type EventData } from '../../lib/api/eventApi';
import { format, parseISO } from 'date-fns';
import Image from 'next/image';

export default function EventsPage() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [eventTypeFilter, setEventTypeFilter] = useState('all');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const eventsData = await eventApi.getEvents();
        setEvents(eventsData);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMMM d, yyyy h:mm a');
    } catch (error) {
      return dateString;
    }
  };

  const getEventTypeColor = (eventType?: string) => {
    const colors: Record<string, string> = {
      service: 'bg-blue-100 text-blue-800',
      meeting: 'bg-green-100 text-green-800',
      conference: 'bg-purple-100 text-purple-800',
      social: 'bg-yellow-100 text-yellow-800',
      default: 'bg-gray-100 text-gray-800'
    };
    return eventType ? colors[eventType.toLowerCase()] || colors.default : colors.default;
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = searchTerm === '' || 
      (event.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (event.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    const matchesType = eventTypeFilter === 'all' || 
      (event.eventType?.toLowerCase() || '') === eventTypeFilter.toLowerCase();
    
    return matchesSearch && matchesType;
  });

  const eventTypes = [...new Set(events.map(event => event.eventType))];

  return (
    <div className="container mx-auto px-4 py-8" style={{ backgroundColor: '#E3F2FD', color: '#0D47A1' }}>
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2" style={{ color: '#0D47A1' }}>Upcoming Events</h1>
        <p style={{ color: '#0D47A1' }}>Join us for worship, fellowship, and community events</p>
      </div>

      <div className="mb-8 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="w-full md:w-1/2">
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-md focus:outline-none"
            style={{ borderColor: '#0D47A1' }}
          />
        </div>
        <div className="w-full md:w-1/3">
          <select
            value={eventTypeFilter}
            onChange={(e) => setEventTypeFilter(e.target.value)}
            className="w-full px-4 py-2 rounded-md focus:outline-none"
            style={{ borderColor: '#0D47A1' }}
          >
            <option value="all">All Event Types</option>
            {eventTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
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
              </div>
            </div>
          ))}
        </div>
      ) : filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full">
              <div className="relative h-48 bg-gray-100">
                {event.featuredImage ? (
                  <Image
                    src={event.featuredImage}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                <span className="absolute top-2 right-2 text-xs font-medium px-2.5 py-0.5 rounded-full" style={{ backgroundColor: '#BBDEFB', color: '#0D47A1' }}>
                  {event.eventType}
                </span>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                
                <div className="space-y-3 text-sm mb-4" style={{ color: '#0D47A1' }}>
                  <div className="flex items-start">
                    <svg className="h-5 w-5 mr-2 text-gray-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <div>{formatDate(event.startDate)}</div>
                      {event.endDate && (
                        <div className="text-gray-500 text-xs">to {formatDate(event.endDate)}</div>
                      )}
                    </div>
                  </div>
                  
                  {event.location && (
                    <div className="flex items-center">
                      <svg className="h-5 w-5 mr-2 text-gray-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{event.location}</span>
                    </div>
                  )}
                </div>

                {event.description && (
                  <p className="text-sm mb-4 line-clamp-3" style={{ color: '#0D47A1' }}>
                    {event.description}
                  </p>
                )}

                <div className="mt-auto pt-4 border-t border-gray-100">
                  <button className="w-full px-4 py-2 text-sm font-medium rounded-md focus:outline-none"
                    style={{ backgroundColor: '#BBDEFB', color: '#0D47A1', borderColor: '#BBDEFB' }}>
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No events found</h3>
          <p className="mt-1 text-gray-500">
            {searchTerm 
              ? `No events match your search for "${searchTerm}"`
              : "There are no upcoming events at the moment. Please check back later."}
          </p>
        </div>
      )}
    </div>
  );
}