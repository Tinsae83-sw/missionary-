// frontend/src/lib/api/pastors.ts
import { Pastor } from '@/types/pastor';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const API_URL = `${API_BASE_URL}/api/pastors`;  // Added /api here

export interface ApiResponse<T> {
  status: string;
  message?: string;
  data?: T;
}

export interface PastorsResponse {
  pastors: Pastor[];
}

export const getPastors = async (): Promise<ApiResponse<Pastor[]>> => {
  try {
    const response = await fetch(API_URL, {  // Using API_URL which now includes /api
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch pastors');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching pastors:', error);
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Failed to fetch pastors',
    };
  }
};

export const createOrUpdatePastor = async (pastorData: Partial<Pastor>): Promise<ApiResponse<Pastor>> => {
  try {
    const response = await fetch(API_URL, {  // Using API_URL which now includes /api
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pastorData),
    });

    if (!response.ok) {
      throw new Error('Failed to save pastor information');
    }

    return await response.json();
  } catch (error) {
    console.error('Error saving pastor:', error);
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Failed to save pastor information',
    };
  }
};