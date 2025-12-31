import { NextResponse } from 'next/server';

// Mock data - in a real app, this would come from a database
const mockSermonSeries = [
  { id: '1', name: 'Faith Series' },
  { id: '2', name: 'Love & Relationships' },
  { id: '3', name: 'The Gospel of John' },
  { id: '4', name: 'End Times Prophecy' },
  { id: '5', name: 'Prayer & Fasting' },
];

const mockSermons = [
  {
    id: '1',
    title: 'The Power of Faith',
    speakerName: 'Pastor John',
    biblePassage: 'Hebrews 11:1-6',
    date: '2025-12-15',
    duration: 45,
    audioUrl: '/sermons/audio/1',
    videoUrl: '/sermons/video/1',
    isPublished: true,
    seriesId: '1',
    viewCount: 150,
    downloadCount: 75,
    thumbnailUrl: '/images/sermon-placeholder.jpg',
    description: 'Understanding the true meaning of faith and how it transforms lives.',
    createdAt: '2025-12-10T10:00:00Z',
    updatedAt: '2025-12-10T10:00:00Z'
  },
  {
    id: '2',
    title: 'Love Your Neighbor',
    speakerName: 'Pastor Sarah',
    biblePassage: 'Mark 12:28-34',
    date: '2025-12-08',
    duration: 38,
    audioUrl: '/sermons/audio/2',
    videoUrl: '/sermons/video/2',
    isPublished: true,
    seriesId: '2',
    viewCount: 120,
    downloadCount: 60,
    thumbnailUrl: '/images/sermon-placeholder-2.jpg',
    description: 'Learning to love others as Christ loved us.',
    createdAt: '2025-12-03T10:00:00Z',
    updatedAt: '2025-12-03T10:00:00Z'
  }
  // Add more sample sermons as needed
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const path = request.url.split('?')[0];
  
  // Handle /api/sermons/series endpoint
  if (path.endsWith('/api/sermons/series')) {
    try {
      return NextResponse.json(mockSermonSeries);
    } catch (error) {
      console.error('Error fetching sermon series:', error);
      return NextResponse.json(
        { error: 'Failed to fetch sermon series' },
        { status: 500 }
      );
    }
  }

  // Handle regular /api/sermons endpoint
  try {
    return NextResponse.json(mockSermons);
  } catch (error) {
    console.error('Error fetching sermons:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sermons' },
      { status: 500 }
    );
  }
}

// For handling POST requests to create a new sermon
export async function POST(request: Request) {
  try {
    const sermonData = await request.json();
    // In a real app, you would save this to a database
    const newSermon = {
      id: Date.now().toString(),
      ...sermonData,
      createdAt: new Date().toISOString(),
      isPublished: sermonData.isPublished || false,
    };
    
    // Add to our mock data (in a real app, this would be a database operation)
    mockSermons.push(newSermon);
    
    return NextResponse.json(newSermon, { status: 201 });
  } catch (error) {
    console.error('Error creating sermon:', error);
    return NextResponse.json(
      { error: 'Failed to create sermon' },
      { status: 500 }
    );
  }
}
