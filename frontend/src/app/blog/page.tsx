'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiClock, FiArrowRight, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { getBlogs } from './../../lib/api/blogApi';
import { BlogPost, BlogListResponse } from '../../types';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function BlogPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 1,
  });

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await getBlogs({
          status: 'published',
          page: pagination.page,
          limit: pagination.limit,
        });
        
        setBlogs(response.data);
        setPagination(prev => ({
          ...prev,
          totalItems: response.pagination.totalItems,
          totalPages: response.pagination.totalPages,
        }));
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError('Failed to load blog posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [pagination.page, pagination.limit]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderTopColor: '#0D47A1', borderBottomColor: '#0D47A1' }}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#E3F2FD', color: '#0D47A1' }}>
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-3 py-1 text-sm font-medium rounded-full mb-4" style={{ color: '#0D47A1', backgroundColor: '#BBDEFB' }}>
            Latest Updates
          </span>
          <h1 className="text-4xl font-bold sm:text-5xl lg:text-6xl" style={{ color: '#0D47A1' }}>
            Church Blog
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
            Discover inspiring stories, devotionals, and news from our church community.
          </p>
        </motion.div>

        {blogs.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: '#BBDEFB' }}>
              <FiClock className="w-8 h-8" style={{ color: '#0D47A1' }} />
            </div>
            <p className="text-lg" style={{ color: '#0D47A1' }}>No blog posts found. Check back later!</p>
          </motion.div>
        ) : (
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {blogs.map((blog) => (
              <motion.article 
                key={blog.id} 
                variants={item}
                className="group flex flex-col rounded-2xl bg-white shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100"
              >
                {blog.featured_image && (
                  <div className="relative h-56 w-full overflow-hidden">
                    <Image
                      src={blog.featured_image}
                      alt={blog.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={false}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                )}
                <div className="flex-1 p-6 flex flex-col">
                  <div className="flex-1">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <FiClock className="mr-1.5 h-4 w-4 flex-shrink-0" />
                      <time dateTime={new Date(blog.created_at).toISOString()}>
                        {new Date(blog.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </time>
                    </div>
                    <Link href={`/blog/${blog.slug}`} className="block mt-1">
                      <h3 className="text-xl font-bold group-hover:text-[#0D47A1] transition-colors duration-200 line-clamp-2" style={{ color: '#0D47A1' }}>
                        {blog.title}
                      </h3>
                    </Link>
                    <p className="mt-3 text-gray-600 line-clamp-3">
                      {blog.excerpt || blog.content.substring(0, 160) + '...'}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <Link 
                      href={`/blog/${blog.slug}`}
                      className="inline-flex items-center font-medium group-hover:translate-x-1 transition-transform duration-200"
                      style={{ color: '#0D47A1' }}
                    >
                      Read more
                      <FiArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}

        {pagination.totalPages > 1 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-16 flex justify-center"
          >
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                disabled={pagination.page === 1}
                className="p-2.5 rounded-full text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200"
                aria-label="Previous page"
                style={{ ...(pagination.page === 1 ? {} : { backgroundColor: 'transparent' }) }}
                onMouseOver={(e) => { if (!e.currentTarget.hasAttribute('disabled')) (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#BBDEFB'; (e.currentTarget as HTMLButtonElement).style.color = '#0D47A1'; }}
                onMouseOut={(e) => { if (!e.currentTarget.hasAttribute('disabled')) (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = ''; }}
              >
                <FiChevronLeft className="h-5 w-5" />
              </button>
              <span className="px-4 py-2 text-sm font-medium text-gray-700">
                Page {pagination.page} <span className="text-gray-400">/</span> {pagination.totalPages}
              </span>
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: Math.min(pagination.totalPages, prev.page + 1) }))}
                disabled={pagination.page === pagination.totalPages}
                className="p-2.5 rounded-full text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200"
                aria-label="Next page"
                onMouseOver={(e) => { if (!e.currentTarget.hasAttribute('disabled')) (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#BBDEFB'; (e.currentTarget as HTMLButtonElement).style.color = '#0D47A1'; }}
                onMouseOut={(e) => { if (!e.currentTarget.hasAttribute('disabled')) (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = ''; }}
              >
                <FiChevronRight className="h-5 w-5" />
              </button>
            </nav>
          </motion.div>
        )}
      </div>
    </div>
  );
}