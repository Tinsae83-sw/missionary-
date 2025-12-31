'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { getBlogBySlug } from '@/lib/api/blogApi';
import { BlogPost } from '@/types';
import { format } from 'date-fns';
import { FiClock, FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';

export default function BlogPostPage() {
  const params = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
        const response = await getBlogBySlug(slug);
        setPost(response.data);
      } catch (err) {
        console.error('Error fetching blog post:', err);
        setError('Failed to load the blog post. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchPost();
    }
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h1>
        <p className="text-gray-600 mb-6">The blog post you're looking for doesn't exist or has been removed.</p>
        <Link 
          href="/blog" 
          className="inline-flex items-center text-indigo-600 hover:text-indigo-500 font-medium"
        >
          <FiArrowLeft className="mr-2 h-4 w-4" />
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link 
            href="/blog" 
            className="inline-flex items-center text-indigo-600 hover:text-indigo-500 font-medium mb-6"
          >
            <FiArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>
        </div>

        <article className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {post.featured_image && (
            <div className="relative h-96 w-full">
              <Image
                src={post.featured_image}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
          
          <div className="p-8">
            <div className="flex items-center text-sm text-gray-500 mb-6">
              <FiClock className="mr-1.5 h-4 w-4 flex-shrink-0" />
              <time dateTime={post.created_at}>
                {format(new Date(post.created_at), 'MMMM d, yyyy')}
              </time>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {post.title}
            </h1>
            
            <div 
              className="prose max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </article>
      </div>
    </div>
  );
}
