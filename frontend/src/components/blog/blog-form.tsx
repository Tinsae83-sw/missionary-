'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Loader2, Save, X } from 'lucide-react';
import { BlogPost, CreateBlogPostDto, UpdateBlogPostDto } from '@/types';
import { toast } from 'sonner';
import { uploadBlogImage } from '@/lib/api/blogApi';
import { generateSlug } from '@/lib/utils';

const blogFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().optional(),
  featuredImage: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.string().optional(),
});

type BlogFormValues = z.infer<typeof blogFormSchema>;

interface BlogFormProps {
  initialData?: BlogPost | null;
  onSubmit: (data: CreateBlogPostDto | UpdateBlogPostDto) => Promise<void>;
  isSubmitting: boolean;
}

export function BlogForm({ initialData, onSubmit, isSubmitting }: BlogFormProps) {
  const router = useRouter();
  const [isImageUploading, setIsImageUploading] = useState(false);
  
  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: initialData?.title || '',
      content: initialData?.content || '',
      excerpt: initialData?.excerpt || '',
      featuredImage: initialData?.featuredImage || '',
      status: initialData?.status || 'draft',
      metaTitle: initialData?.metaTitle || '',
      metaDescription: initialData?.metaDescription || '',
      metaKeywords: initialData?.metaKeywords || '',
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsImageUploading(true);
      const { url } = await uploadBlogImage(file);
      form.setValue('featuredImage', url);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setIsImageUploading(false);
    }
  };

  const handleGenerateSlug = () => {
    const title = form.getValues('title');
    if (title) {
      const slug = generateSlug(title);
      // If you want to show the slug to the user, you can add a slug field to the form
      // For now, we'll just log it
      console.log('Generated slug:', slug);
    }
  };

  const handleSubmit = async (data: BlogFormValues) => {
    try {
      await onSubmit(data);
      toast.success(initialData 
        ? 'Blog post updated successfully' 
        : 'Blog post created successfully'
      );
      router.push('/admin/blog');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to save blog post. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="space-y-6 md:col-span-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="title">Title *</Label>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleGenerateSlug}
                >
                  Generate Slug
                </Button>
              </div>
              <Input
                id="title"
                placeholder="Enter blog post title"
                {...form.register('title')}
              />
              {form.formState.errors.title && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                placeholder="Write your blog post content here..."
                rows={10}
                {...form.register('content')}
                className="min-h-[300px]"
              />
              {form.formState.errors.content && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.content.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                placeholder="A short excerpt that will appear in blog listings..."
                rows={3}
                {...form.register('excerpt')}
              />
              <p className="text-sm text-muted-foreground">
                If left blank, an excerpt will be generated from the content.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-4 rounded-lg border p-4">
              <h3 className="font-medium">Publish</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...form.register('status')}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div className="flex justify-end">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        {initialData ? 'Update Post' : 'Publish Post'}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-lg border p-4">
              <h3 className="font-medium">Featured Image</h3>
              <div className="space-y-2">
                {form.watch('featuredImage') ? (
                  <div className="relative">
                    <img
                      src={form.watch('featuredImage')}
                      alt="Featured"
                      className="h-48 w-full rounded-md object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute right-2 top-2 h-8 w-8 rounded-full"
                      onClick={() => form.setValue('featuredImage', '')}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-md border-2 border-dashed border-muted-foreground/25 p-6 text-center">
                    <Label
                      htmlFor="featured-image"
                      className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground"
                    >
                      {isImageUploading ? (
                        <Loader2 className="mx-auto h-8 w-8 animate-spin" />
                      ) : (
                        <>
                          <span>Upload an image</span>
                          <Input
                            id="featured-image"
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={handleImageUpload}
                            disabled={isImageUploading}
                          />
                        </>
                      )}
                    </Label>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border p-4">
          <h3 className="mb-4 font-medium">SEO Settings</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="metaTitle">Meta Title</Label>
              <Input
                id="metaTitle"
                placeholder="SEO title for search engines"
                {...form.register('metaTitle')}
              />
              <p className="text-sm text-muted-foreground">
                If empty, the blog post title will be used.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="metaDescription">Meta Description</Label>
              <Textarea
                id="metaDescription"
                placeholder="SEO description for search engines"
                rows={3}
                {...form.register('metaDescription')}
              />
              <p className="text-sm text-muted-foreground">
                If empty, the excerpt will be used.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="metaKeywords">Meta Keywords</Label>
              <Input
                id="metaKeywords"
                placeholder="keyword1, keyword2, keyword3"
                {...form.register('metaKeywords')}
              />
              <p className="text-sm text-muted-foreground">
                Separate keywords with commas.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/blog')}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>{initialData ? 'Update Post' : 'Publish Post'}</>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
