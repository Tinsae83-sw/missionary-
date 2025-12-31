import api from './api';
import { BlogPost, BlogListResponse, CreateBlogPostDto, UpdateBlogPostDto, BlogFilters } from '@/types';

const BLOG_ENDPOINT = '/api/blogs';

export const getBlogs = async (filters?: BlogFilters): Promise<BlogListResponse> => {
  const params = new URLSearchParams();
  
  if (filters) {
    if (filters.status) params.append('status', filters.status);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.search) params.append('search', filters.search);
  }

  const response = await api.get<BlogListResponse>(`${BLOG_ENDPOINT}?${params.toString()}`);
  return response.data;
};

export const getBlogBySlug = async (slug: string): Promise<BlogPost> => {
  const response = await api.get<BlogPost>(`${BLOG_ENDPOINT}/${slug}`);
  return response.data;
};

export const createBlog = async (data: CreateBlogPostDto): Promise<BlogPost> => {
  const response = await api.post<BlogPost>(BLOG_ENDPOINT, data);
  return response.data;
};

export const updateBlog = async (id: string, data: UpdateBlogPostDto): Promise<BlogPost> => {
  const response = await api.put<BlogPost>(`${BLOG_ENDPOINT}/${id}`, data);
  return response.data;
};

export const deleteBlog = async (id: string): Promise<void> => {
  await api.delete(`${BLOG_ENDPOINT}/${id}`);
};

export const uploadBlogImage = async (file: File): Promise<{ url: string }> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post<{ url: string }>('/api/upload/blog', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};
