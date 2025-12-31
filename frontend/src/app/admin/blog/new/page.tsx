'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BlogForm } from '../../../../components/blog/blog-form';
import { createBlog } from '../../../../lib/api/blogApi';
import { toast } from 'sonner';

export default function NewBlogPostPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      await createBlog({
        ...data,
        status: data.status || 'draft',
      });
      toast.success('Blog post created successfully');
      router.push('/admin/blog');
    } catch (error) {
      console.error('Error creating blog post:', error);
      toast.error('Failed to create blog post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create New Blog Post</h1>
        <p className="text-muted-foreground">
          Write a new blog post for your church website
        </p>
      </div>
      
      <BlogForm 
        onSubmit={handleSubmit} 
        isSubmitting={isSubmitting} 
      />
    </div>
  );
}
