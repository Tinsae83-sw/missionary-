'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, Eye, Search, Filter } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Badge } from '../../../components/ui/badge';
import { format } from 'date-fns';
import { BlogPost, BlogFilters } from '../../../types';
import { getBlogs, deleteBlog } from '../../../lib/api/blogApi';
import { toast } from 'sonner';
import { ConfirmDialog } from '../../../components/confirm-dialog';

export default function BlogAdminPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<BlogFilters>({
    page: 1,
    limit: 10,
    status: 'published',
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);

  useEffect(() => {
    fetchBlogs();
  }, [filters]);

  const fetchBlogs = async () => {
    try {
      setIsLoading(true);
      const response = await getBlogs(filters);
      const blogData = Array.isArray(response?.data) ? response.data : [];
      setBlogs(blogData);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      toast.error('Failed to fetch blog posts');
      setBlogs([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedBlog) return;
    
    try {
      await deleteBlog(selectedBlog.id);
      toast.success('Blog post deleted successfully');
      fetchBlogs();
    } catch (error) {
      console.error('Error deleting blog:', error);
      toast.error('Failed to delete blog post');
    } finally {
      setDeleteDialogOpen(false);
      setSelectedBlog(null);
    }
  };

  const getStatusBadgeVariant = (status?: string) => {
    if (!status) return 'outline';
    switch (status.toLowerCase()) {
      case 'published':
        return 'default';
      case 'draft':
        return 'secondary';
      case 'archived':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const formatStatus = (status?: string) => {
    if (!status) return 'Draft';
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? '-' : format(date, 'MMM d, yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return '-';
    }
  };

  return (
    <div className="container mx-auto p-6" style={{ backgroundColor: '#E3F2FD', color: '#0D47A1' }}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#0D47A1' }}>Blog Posts</h1>
          <p style={{ color: '#0D47A1' }}>Manage your church's blog posts</p>
        </div>
        <Button onClick={() => router.push('/admin/blog/new')} style={{ backgroundColor: '#BBDEFB', color: '#0D47A1' }}>
          <Plus className="mr-2 h-4 w-4" />
          New Post
        </Button>
      </div>

      <div className="bg-card rounded-lg border p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: '#0D47A1' }} />
            <Input
              placeholder="Search blog posts..."
              className="pl-10"
              style={{ borderColor: '#0D47A1' }}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value, page: 1 })
              }
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" style={{ color: '#0D47A1' }} />
            <select
              className="flex h-10 w-full rounded-md bg-background px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
              style={{ borderColor: '#0D47A1', color: '#0D47A1' }}
              value={filters.status}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  status: e.target.value as 'published' | 'draft' | 'archived',
                  page: 1,
                })
              }
            >
              <option value="">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Featured</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Excerpt</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Published</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : blogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    No blog posts found
                  </TableCell>
                </TableRow>
              ) : (
                blogs.map((blog) => (
                  <TableRow key={blog.id}>
                    <TableCell>
                      {blog.featuredImage ? (
                        <img 
                          src={blog.featuredImage} 
                          alt={blog.title} 
                          className="h-10 w-10 object-cover rounded"
                        />
                      ) : (
                        <div className="h-10 w-10 bg-gray-100 rounded flex items-center justify-center">
                          <span className="text-xs text-gray-400">No Image</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="font-semibold">{blog.title}</div>
                      <div className="text-xs text-muted-foreground">{blog.slug}</div>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {blog.excerpt || 'No excerpt provided'}
                    </TableCell>
                    <TableCell>{blog.author?.name || 'Unknown'}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(blog.publishedAt ? 'published' : 'draft')}>
                        {blog.publishedAt ? 'Published' : 'Draft'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {blog.publishedAt ? formatDate(blog.publishedAt) : 'Not published'}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDate(blog.createdAt)}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDate(blog.updatedAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            router.push(`/blog/${blog.slug}`)
                          }
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            router.push(`/admin/blog/edit/${blog.id}`)
                          }
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedBlog(blog);
                            setDeleteDialogOpen(true);
                          }}
                          title="Delete"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Delete Blog Post"
        description={`Are you sure you want to delete "${selectedBlog?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="destructive"
      />
    </div>
  );
}