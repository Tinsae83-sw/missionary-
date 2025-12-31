// frontend/src/types/pastor.ts

export interface Pastor {
  id?: string;
  pastor_name: string;
  pastor_title: string;
  pastor_message: string;
  pastor_bio: string;
  pastor_photo_url?: string;
  pastor_email?: string;
  pastor_phone?: string;
  is_active?: boolean;
  display_order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface PastorResponse {
  status: 'success' | 'error';
  message?: string;
  data?: Pastor | Pastor[];
  pastors?: Pastor[];
}

export interface PastorsListResponse {
  status: 'success' | 'error';
  data: Pastor[];
  message?: string;
}
