// frontend/src/lib/api/missionVision.ts
import { MissionVisionType, ApiResponse } from '@/types/missionVision';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/mission-vision`;

export const getMissionVision = async (): Promise<ApiResponse<MissionVisionType>> => {
  try {
    const response = await fetch(API_BASE_URL, {
      cache: 'no-store',
    });
    return await response.json();
  } catch (error) {
    console.error('Error fetching mission and vision:', error);
    return {
      status: 'error',
      message: 'Failed to fetch mission and vision',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

export const createOrUpdateMissionVision = async (
  data: Omit<MissionVisionType, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ApiResponse<MissionVisionType>> => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    return await response.json();
  } catch (error) {
    console.error('Error saving mission and vision:', error);
    return {
      status: 'error',
      message: 'Failed to save mission and vision',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};