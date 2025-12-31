import api from './api';

export interface Ministry {
  id: string;
  name: string;
  description: string;
  short_description?: string;
  contact_email?: string;
  contact_phone?: string;
  contact_person?: string;
  meeting_times?: string;
  meeting_location?: string;
  cover_image_url?: string;
  icon_class?: string;
  is_active: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export type CreateMinistryData = Omit<Ministry, 'id' | 'created_at' | 'updated_at'> & {
  imageFile?: File;
};

export type UpdateMinistryData = Partial<CreateMinistryData>;

export const ministryApi = {
  /**
   * Get all ministries, optionally filtered by active status
   */
  getMinistries: async (options?: { activeOnly?: boolean }): Promise<Ministry[]> => {
    const url = options?.activeOnly ? '/api/ministries/active' : '/api/ministries';
    const response = await api.get<Ministry[]>(url);
    return response.data || [];
  },

  /**
   * Get a single ministry by ID
   */
  getMinistryById: async (id: string): Promise<Ministry> => {
    const response = await api.get<Ministry>(`/api/ministries/${id}`);
    return response.data;
  },

  /**
   * Create a new ministry
   */
  createMinistry: async (ministryData: FormData | CreateMinistryData): Promise<Ministry> => {
    const isFormData = ministryData instanceof FormData;
    
    if (!isFormData) {
      const { imageFile, ...data } = ministryData;
      const formData = new FormData();
      
      // Append all fields to form data
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, String(value));
        }
      });
      
      // Append file if present
      if (imageFile) {
        formData.append('file', imageFile);
      }
      
      const response = await api.post<Ministry>('/api/ministries', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    }
    
    // If it's already a FormData object, send it directly
    const response = await api.post<Ministry>('/api/ministries', ministryData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  /**
   * Update an existing ministry
   */
  updateMinistry: async (id: string, ministryData: FormData | UpdateMinistryData): Promise<Ministry> => {
    const isFormData = ministryData instanceof FormData;
    
    if (!isFormData) {
      const { imageFile, ...data } = ministryData;
      const formData = new FormData();
      
      // Append all fields to form data
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, String(value));
        }
      });
      
      // Append file if present
      if (imageFile) {
        formData.append('file', imageFile);
      }
      
      const response = await api.put<Ministry>(`/api/ministries/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    }
    
    // If it's already a FormData object, send it directly
    const response = await api.put<Ministry>(`/api/ministries/${id}`, ministryData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  /**
   * Delete a ministry by ID
   */
  deleteMinistry: async (id: string): Promise<void> => {
    await api.delete(`/api/ministries/${id}`);
  },
  
  /**
   * Upload a ministry image
   */
  uploadMinistryImage: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post<{ url: string }>('/api/ministries/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    
    return response.data;
  }
};

export default ministryApi;
