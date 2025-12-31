export interface BlogAuthor {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage?: string;
  author: BlogAuthor;
  status: 'draft' | 'published' | 'archived';
  publishedAt?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogListResponse {
  data: BlogPost[];
  pagination: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
}

export interface CreateBlogPostDto {
  title: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  status?: 'draft' | 'published' | 'archived';
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
}

export interface UpdateBlogPostDto extends Partial<CreateBlogPostDto> {}

export interface BlogFilters {
  status?: 'draft' | 'published' | 'archived';
  page?: number;
  limit?: number;
  search?: string;
}
