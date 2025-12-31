import axios from 'axios';
import { Sermon, SermonFilters, SermonResponse } from '@/types/sermon';

const getApiUrl = (path: string): string => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  return `${baseUrl}${path}`;
};

export type { Sermon, SermonFilters, SermonResponse };

interface AxiosErrorResponse {
  response?: {
    data?: any;
    status?: number;
    headers?: any;
  };
  request?: any;
  message: string;
}

export const getSermons = async (filters?: SermonFilters): Promise<SermonResponse> => {
  try {
    console.log('Fetching sermons with filters:', JSON.stringify(filters, null, 2));
    const params = {
      ...filters,
      page: filters?.page || 1,
      limit: filters?.limit || 10,
      sortBy: filters?.sortBy || 'sermon_date',
      order: filters?.order || 'desc'
    };
    
    // Ensure we're using the correct endpoint path
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const endpoint = `${apiUrl}/api/sermons`;
    console.log('Request URL:', endpoint);
    console.log('Request params:', JSON.stringify(params, null, 2));
    
    // Make the request directly to the full URL to avoid any path resolution issues
    const response = await axios.get<SermonResponse>(endpoint, { params });
    
    console.log('Sermons API response:', response);
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as AxiosErrorResponse;
    
    console.error('Error fetching sermons:', error);
    
    if (axiosError.response) {
      console.error('Response data:', axiosError.response.data);
      console.error('Response status:', axiosError.response.status);
      console.error('Response headers:', axiosError.response.headers);
      
      // If unauthorized, redirect to login
      if (axiosError.response.status === 401 && typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    } else if (axiosError.request) {
      console.error('No response received. The request was made but no response was received.');
      console.error('Request:', axiosError.request);
    } else {
      console.error('Error message:', axiosError.message);
    }
    
    // Return empty response to prevent UI from breaking
    return {
      success: false,
      data: [],
      count: 0,
      totalPages: 0,
      currentPage: 1
    };
  }
};

export const getSermon = async (id: string): Promise<Sermon> => {
  try {
    const url = getApiUrl(`/api/sermons/${id}`);
    const { data } = await axios.get<Sermon>(url);
    return data;
  } catch (error) {
    console.error(`Error fetching sermon ${id}:`, error);
    throw error;
  }
};

export const createSermon = async (data: Omit<Sermon, 'id' | 'created_at' | 'updated_at' | 'view_count' | 'like_count' | 'share_count'>): Promise<Sermon> => {
  try {
    const url = getApiUrl('/api/sermons');
    const { data: responseData } = await axios.post<Sermon>(url, data);
    return responseData;
  } catch (error) {
    console.error('Error creating sermon:', error);
    throw error;
  }
};

export const updateSermon = async (id: string, data: Partial<Omit<Sermon, 'id' | 'created_at' | 'updated_at' | 'view_count' | 'like_count' | 'share_count'>>): Promise<Sermon> => {
  try {
    const url = getApiUrl(`/api/sermons/${id}`);
    const { data: responseData } = await axios.put<Sermon>(url, data);
    return responseData;
  } catch (error) {
    console.error(`Error updating sermon ${id}:`, error);
    throw error;
  }
};

export const deleteSermon = async (id: string): Promise<void> => {
  try {
    const url = getApiUrl(`/api/sermons/${id}`);
    await axios.delete(url);
  } catch (error) {
    console.error(`Error deleting sermon ${id}:`, error);
    throw error;
  }
};

export const incrementDownloadCount = async (id: string): Promise<{ download_count: number }> => {
  try {
    const url = getApiUrl(`/api/sermons/${id}/download`);
    const { data } = await axios.put<{ download_count: number }>(url);
    return data;
  } catch (error) {
    console.error(`Error incrementing download count for sermon ${id}:`, error);
    throw error;
  }
};

export const toggleLike = async (id: string, action: 'like' | 'unlike'): Promise<{ like_count: number }> => {
  try {
    const url = getApiUrl(`/api/sermons/${id}/like`);
    const { data } = await axios.post<{ like_count: number }>(url, { action });
    return data;
  } catch (error) {
    console.error(`Error toggling like for sermon ${id}:`, error);
    throw error;
  }
};

export const incrementShareCount = async (id: string, platform: string = 'link'): Promise<{ share_count: number }> => {
  try {
    const url = getApiUrl(`/api/sermons/${id}/share`);
    const { data } = await axios.post<{ share_count: number }>(url, { platform });
    return data;
  } catch (error) {
    console.error(`Error incrementing share count for sermon ${id}:`, error);
    throw error;
  }
};

export default {
  getSermons,
  getSermon,
  createSermon,
  updateSermon,
  deleteSermon,
  incrementDownloadCount,
  toggleLike,
  incrementShareCount,
};
