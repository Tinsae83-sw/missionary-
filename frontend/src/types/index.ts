// Core Church Types
export interface ChurchInfo {
  id: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
  logoUrl?: string;
  facebookUrl?: string;
  youtubeUrl?: string;
  instagramUrl?: string;
  twitterUrl?: string;
  googleMapsEmbed?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PastorInfo {
  id: string;
  pastorName: string;
  pastorTitle?: string;
  pastorMessage?: string;
  pastorBio?: string;
  pastorPhotoUrl?: string;
  pastorEmail?: string;
  pastorPhone?: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Ministry {
  id: string;
  name: string;
  description: string;
  shortDescription?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactPerson?: string;
  meetingTimes?: string;
  meetingLocation?: string;
  coverImageUrl?: string;
  iconClass?: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  shortDescription?: string;
  startDate: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  coverImageUrl?: string;
  isRecurring: boolean;
  recurrencePattern?: string;
  isPublished: boolean;
  registrationRequired: boolean;
  maxAttendees?: number;
  rsvpCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Sermon {
  id: string;
  title: string;
  description?: string;
  speakerName?: string;
  biblePassage?: string;
  date: string;
  duration?: number;
  videoUrl?: string;
  audioUrl?: string;
  sermonNotesUrl?: string;
  slidesUrl?: string;
  thumbnailUrl?: string;
  viewCount: number;
  downloadCount: number;
  isPublished: boolean;
  seriesId?: string;
  seriesName?: string; // Added for display purposes
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'pastor' | 'leader' | 'member';
  isActive: boolean;
  lastLogin?: string;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

// Blog Types
export * from './blog';
