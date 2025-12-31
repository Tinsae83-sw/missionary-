import api from './api';

export interface EventData {
  id?: string;
  title: string;
  description: string;
  startDate: string; // ISO string
  endDate: string | null; // ISO string or null
  location: string;
  eventType: string;
  isRecurring: boolean;
  recurringPattern: string | null;
  isPublic: boolean;
  maxAttendees?: number | null;
  featuredImage?: string | null;
  status?: 'draft' | 'published' | 'cancelled';
}

export const eventApi = {
  // Create a new event
  createEvent: async (eventData: Omit<EventData, 'id'>) => {
    try {
      // Prepare the data in the format expected by the backend
      const requestData: any = {
        title: eventData.title,
        description: eventData.description,
        start_date: eventData.startDate,
        end_date: eventData.endDate,
        location: eventData.location,
        event_type: eventData.eventType,
        is_recurring: eventData.isRecurring,
        recurring_pattern: eventData.recurringPattern || null,
        is_public: eventData.isPublic,
        max_attendees: eventData.maxAttendees || null,
        status: eventData.status || 'draft'
      };

      // Only add image_url if it's a valid URL
      try {
        if (eventData.featuredImage) {
          new URL(eventData.featuredImage); // Will throw if not a valid URL
          requestData.image_url = eventData.featuredImage;
        }
      } catch (e) {
        console.warn('Invalid image URL provided, skipping:', eventData.featuredImage);
      }
      
      console.log('Sending event data:', requestData);
      
      const response = await api.post('/api/events', requestData);
      return response.data;
    } catch (error: any) {
      console.error('Error creating event:', error);
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  // Upload image
  uploadImage: async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'events');
      
      const response = await api.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data.data.url;
    } catch (error: any) {
      console.error('Error uploading image:', error);
      throw error;
    }
  },

  // Update an existing event
  updateEvent: async (id: string, eventData: Partial<EventData>) => {
    const response = await api.put(`/api/events/${id}`, eventData);
    return response.data;
  },

  // Get all events
  getEvents: async () => {
    const response = await api.get('/api/events');
    return response.data.data || [];
  },

  // Get a single event by ID
  getEventById: async (id: string) => {
    const response = await api.get(`/api/events/${id}`);
    return response.data;
  },

  // Delete an event
  deleteEvent: async (id: string) => {
    const response = await api.delete(`/api/events/${id}`);
    return response.data;
  },

  // Update event status
  updateEventStatus: async (id: string, status: 'draft' | 'published' | 'cancelled') => {
    const response = await api.patch(`/api/events/${id}/status`, { status });
    return response.data;
  }
};

export default eventApi;