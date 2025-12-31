export interface ChurchHistory {
  id: string;
  year: string;
  title: string;
  description: string;
  isPublished?: boolean;
  displayOrder?: number;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ChurchHistoryResponse {
  status: string;
  data: ChurchHistory[];
}
