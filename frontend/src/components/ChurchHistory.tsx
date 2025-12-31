import React from 'react';
import Image from 'next/image';

interface HistoryItem {
  id: string;
  title: string;
  description: string;
  year: number;
  end_year?: number | null;
  image_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

interface ChurchHistoryProps {
  history: HistoryItem[] | string;
}

export function ChurchHistory({ history }: ChurchHistoryProps) {
  // If history is a string, it means it's coming directly from churchInfo
  // If it's an array, it's already in the correct format
  let historyItems: HistoryItem[] = [];
  
  if (typeof history === 'string') {
    try {
      // Try to parse the history string if it's a JSON string
      historyItems = JSON.parse(history);
    } catch (e) {
      // If it's not a JSON string, create a single history item with the string as description
      historyItems = [{
        id: '1',
        title: 'Our History',
        description: history,
        year: new Date().getFullYear()
      }];
    }
  } else if (Array.isArray(history)) {
    historyItems = history;
  }

  // Sort history items by year in descending order (newest first)
  const sortedHistory = [...historyItems].sort((a, b) => b.year - a.year);

  if (sortedHistory.length === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <p className="text-gray-500">No history available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-primary mb-4">Our History</h2>
        <div className="w-20 h-1 bg-secondary mx-auto mb-6"></div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          A journey of faith, growth, and community through the years.
        </p>
      </div>
      
      <div className="relative">
        {/* Timeline line */}
        <div className="hidden md:block absolute left-1/2 w-1 h-full bg-primary/20 transform -translate-x-1/2"></div>
        
        <div className="space-y-12">
          {sortedHistory.map((item, index) => (
            <div 
              key={item.id} 
              className={`relative flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8`}
              data-aos={index % 2 === 0 ? 'fade-right' : 'fade-left'}
            >
              {/* Year Badge - Hidden on mobile, shown on md and up */}
              <div className="hidden md:flex w-1/2">
                <div className={`p-1 rounded-lg w-full ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary text-white text-xl font-bold border-4 border-white shadow-lg">
                    {item.year}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="w-full md:w-1/2 px-4">
                <div className={`bg-white p-6 rounded-lg shadow-md ${index % 2 === 0 ? 'md:mr-8' : 'md:ml-8'}`}>
                  {item.image_url && (
                    <div className="mb-4 rounded-lg overflow-hidden">
                      <Image
                        src={item.image_url}
                        alt={item.title}
                        width={600}
                        height={400}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                  {item.end_year && (
                    <div className="mt-2 text-sm text-gray-500">
                      {item.year} - {item.end_year}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
