import api from './api';
import { ChurchInfo, PastorInfo, Ministry, Event, Sermon, User } from '@/types';

// Auth
export const login = async (credentials: { email: string; password: string }): Promise<{ user: User; token: string }> => {
  const response = await api.post('/api/auth/login', credentials);
  return response.data;
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get('/api/auth/me');
  return response.data;
};

// Church History
export const getChurchHistory = async (): Promise<any[]> => {
  const response = await api.get('/api/church-history');
  return response.data;
};

// Church Info
export const getChurchInfo = async (): Promise<ChurchInfo> => {
  const response = await api.get('/api/church-info');
  return response.data;
};

export const updateChurchInfo = async (data: Partial<ChurchInfo>): Promise<ChurchInfo> => {
  const response = await api.put('/api/church-info', data);
  return response.data;
};

// Pastor Info
export const getPastorInfo = async (): Promise<PastorInfo[]> => {
  try {
    console.log('Fetching pastors...');
    const response = await api.get('/api/pastors');
    console.log('Pastors API Response:', response);
    
    // Handle case where response.data might be undefined or null
    if (!response?.data) {
      console.warn('No data received from pastors API');
      return [];
    }
    
    // If data is already an array, return it
    if (Array.isArray(response.data)) {
      return response.data;
    }
    
    // If data is an object with a data property that's an array (common in some APIs)
    if (response.data.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    
    console.warn('Unexpected pastors API response format:', response.data);
    return [];
  } catch (error) {
    console.error('Error fetching pastors:', error);
    return [];
  }
};

export const updatePastorInfo = async (id: string, data: Partial<PastorInfo>): Promise<PastorInfo> => {
  const response = await api.put(`/api/pastors/${id}`, data);
  return response.data;
};

// Ministries
export const getMinistries = async (): Promise<Ministry[]> => {
  const response = await api.get('/api/ministries');
  return response.data;
};

export const getMinistryById = async (id: string): Promise<Ministry> => {
  const response = await api.get(`/api/ministries/${id}`);
  return response.data;
};

export const createMinistry = async (formData: FormData): Promise<Ministry> => {
  try {
    const response = await api.post('/api/ministries', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating ministry:', error);
    throw error;
  }
};

export const updateMinistry = async (id: string, formData: FormData): Promise<Ministry> => {
  try {
    const response = await api.put(`/api/ministries/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating ministry ${id}:`, error);
    throw error;
  }
};

export const uploadMinistryImage = async (file: File): Promise<{ url: string }> => {
  try {
    const formData = new FormData();
    formData.append('coverImage', file);
    
    const response = await api.post('/api/ministries/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error uploading ministry image:', error);
    throw error;
  }
};

export const deleteMinistry = async (id: string): Promise<void> => {
  await api.delete(`/api/ministries/${id}`);
};

// Events
export const getEvents = async (): Promise<Event[]> => {
  const response = await api.get('/api/events');
  return response.data;
};

export const getEventById = async (id: string): Promise<Event> => {
  const response = await api.get(`/api/events/${id}`);
  return response.data;
};

export const createEvent = async (data: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Promise<Event> => {
  const response = await api.post('/api/events', data);
  return response.data;
};

export const updateEvent = async (id: string, data: Partial<Event>): Promise<Event> => {
  const response = await api.put(`/api/events/${id}`, data);
  return response.data;
};

export const deleteEvent = async (id: string): Promise<void> => {
  await api.delete(`/api/events/${id}`);
};

// Sermons
export const getSermons = async (): Promise<Sermon[]> => {
  const response = await api.get('/api/sermons');
  return response.data;
};

export const getSermonById = async (id: string): Promise<Sermon> => {
  const response = await api.get(`/api/sermons/${id}`);
  return response.data;
};

export const createSermon = async (data: Omit<Sermon, 'id' | 'createdAt' | 'updatedAt'>): Promise<Sermon> => {
  const response = await api.post('/api/sermons', data);
  return response.data;
};

export const updateSermon = async (id: string, data: Partial<Sermon>): Promise<Sermon> => {
  const response = await api.put(`/api/sermons/${id}`, data);
  return response.data;
};

export const deleteSermon = async (id: string): Promise<void> => {
  await api.delete(`/api/sermons/${id}`);
};

export const getSermonSeries = async (): Promise<Array<{ id: string; name: string }>> => {
  const response = await api.get('/api/sermons/series');
  return response.data;
};

export const uploadSermonFile = async (
  file: File,
  type: 'video' | 'audio' | 'notes' | 'thumbnail'
): Promise<{ url: string }> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);
  
  const response = await api.post('/api/upload/sermon', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// File Upload
export const uploadFile = async (file: File, folder: string): Promise<{ url: string }> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);
  
  const response = await api.post('/api/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Beliefs
export interface Belief {
  id?: string;
  title: string;
  description: string;
  icon_class?: string;
  display_order?: number;
  is_published?: boolean;
  created_at?: string;
  updated_at?: string;
}

export const getBeliefs = async (): Promise<Belief[]> => {
  const response = await api.get('/api/beliefs');
  return response.data;
};

export const getBeliefById = async (id: string): Promise<Belief> => {
  const response = await api.get(`/api/beliefs/${id}`);
  return response.data;
};

export const createBelief = async (data: Omit<Belief, 'id' | 'created_at' | 'updated_at'>): Promise<Belief> => {
  const response = await api.post('/api/beliefs', data);
  return response.data;
};

export const updateBelief = async (id: string, data: Partial<Belief>): Promise<Belief> => {
  const response = await api.put(`/api/beliefs/${id}`, data);
  return response.data;
};

export const deleteBelief = async (id: string): Promise<void> => {
  await api.delete(`/api/beliefs/${id}`);
};

// Mission & Vision
export interface MissionVision {
  id?: string;
  mission: string;
  vision: string;
  purpose: string;
  coreValues: string;
  created_at?: string;
  updated_at?: string;
}

export const getMissionVision = async (): Promise<MissionVision> => {
  const response = await api.get('/api/mission-vision');
  return response.data;
};

// Core Values
export interface CoreValue {
  id?: string;
  title: string;
  description: string;
  icon_class?: string;
  display_order?: number;
  is_published?: boolean;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export const getCoreValues = async (): Promise<CoreValue[]> => {
  const response = await api.get('/api/core-values');
  return response.data;
};

export const getCoreValueById = async (id: string): Promise<CoreValue> => {
  const response = await api.get(`/api/core-values/${id}`);
  return response.data;
};

export const createCoreValue = async (data: Omit<CoreValue, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>): Promise<CoreValue> => {
  const response = await api.post('/api/core-values', data);
  return response.data;
};

export const updateCoreValue = async (id: string, data: Partial<CoreValue>): Promise<CoreValue> => {
  const response = await api.put(`/api/core-values/${id}`, data);
  return response.data;
};

export const deleteCoreValue = async (id: string): Promise<void> => {
  await api.delete(`/api/core-values/${id}`);
};