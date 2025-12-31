export interface MissionVisionType {
  id?: string;
  mission: string;
  vision: string;
  coreValues: string;
  purpose: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
  error?: string;
}
