export interface Sermon {
  id: string;
  title: string;
  speaker: string;
  bible_passage?: string | null;
  sermon_date: string;
  description?: string | null;
  transcript?: string | null;
  thumbnail_url?: string | null;
  video_url?: string | null;
  audio_url?: string | null;
  is_published: boolean;
  is_featured: boolean;
  view_count: number;
  like_count: number;
  share_count: number;
  download_count: number;
  duration?: number | null;
  created_at: string;
  updated_at: string;
  // For frontend use only
  speakerName?: string;
  biblePassage?: string;
  date?: string;
  videoUrl?: string;
  audioUrl?: string;
  sermonNotesUrl?: string;
  thumbnailUrl?: string;
  viewCount?: number;
  downloadCount?: number;
  isPublished?: boolean;
  seriesId?: string;
  seriesName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SermonResponse {
  success: boolean;
  data: Sermon[];
  count: number;
  totalPages: number;
  currentPage: number;
}

export interface SermonFilters {
  page?: number;
  limit?: number;
  search?: string;
  speaker?: string;
  bible_passage?: string;
  startDate?: string;
  endDate?: string;
  is_published?: boolean;
  is_featured?: boolean;
  sortBy?: 'sermon_date' | 'title' | 'speaker' | 'view_count' | 'like_count' | 'created_at';
  order?: 'asc' | 'desc';
}
