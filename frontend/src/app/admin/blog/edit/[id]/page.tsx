'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { BlogForm } from '@/components/blog/blog-form';
import { getBlogBySlug, updateBlog } from '@/lib/api/blogApi';
import { useToast } from '@/components/ui/use-toast';
import { BlogPost } from '@/types';

export default function EditBlogPostPage() {
  const router = useRouter();
  const { id } = useParams();
  const { toast } = useToast();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const data = await getBlogBySlug(id as string);
        setBlog(data);
      } catch (error) {
        console.error('Error fetching blog post:', error);
        toast({
          title: 'Error',
          description: 'Failed to load blog post',
          variant: 'destructive',
        });
        router.push('/admin/blog');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchBlog();
    }
  }, [id, router, toast]);

  const handleSubmit = async (data: any) => {
    if (!blog) return;
    
    try {
      setIsSubmitting(true);
      await updateBlog(blog.id, {
        ...data,
        status: data.status || 'draft',
      });
      toast({
        title: 'Success',
        description: 'Blog post updated successfully',
      });
      router.push('/admin/blog');
    } catch (error) {
      console.error('Error updating blog post:', error);
      toast({
        title: 'Error',
        description: 'Failed to update blog post',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold">Blog post not found</h2>
          <p className="text-muted-foreground mt-2">
            The blog post you are looking for does not exist or has been deleted.
          </p>
          <button
            onClick={() => router.push('/admin/blog')}
            className="mt-4 text-primary hover:underline"
          >
            Back to Blog Posts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit Blog Post</h1>
        <p className="text-muted-foreground">
          Make changes to your blog post
        </p>
      </div>
      
      <BlogForm 
        initialData={blog}
        onSubmit={handleSubmit} 
        isSubmitting={isSubmitting} 
      />
    </div>
  );
}
