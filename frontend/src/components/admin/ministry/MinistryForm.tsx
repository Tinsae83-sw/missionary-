'use client';

import { useState, useEffect, useRef, ChangeEvent } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, Save, X, Upload, XCircle } from 'lucide-react';
import ministryApi from '@/lib/api/ministryApi';

// Form schema that matches the database schema
const ministryFormSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(255, 'Name cannot exceed 255 characters'),
  description: z.string()
    .min(10, 'Description must be at least 10 characters'),
  short_description: z.string()
    .max(500, 'Short description cannot exceed 500 characters')
    .optional()
    .or(z.literal('')),
  contact_email: z.string()
    .email('Please enter a valid email')
    .max(255, 'Email is too long')
    .optional()
    .or(z.literal('')),
  contact_phone: z.string()
    .max(50, 'Phone number is too long')
    .optional()
    .or(z.literal('')),
  contact_person: z.string()
    .max(255, 'Name is too long')
    .optional()
    .or(z.literal('')),
  meeting_times: z.string()
    .optional()
    .or(z.literal('')),
  meeting_location: z.string()
    .optional()
    .or(z.literal('')),
  cover_image_url: z.string().optional(),
  icon_class: z.string()
    .max(100, 'Icon class is too long')
    .optional()
    .or(z.literal('')),
  is_active: z.boolean().default(true),
  display_order: z.coerce.number().int().min(0).default(0)
});

type MinistryFormValues = z.infer<typeof ministryFormSchema> & {
  cover_image_file?: File;
};

interface MinistryFormProps {
  ministryId?: string;
  onSuccess?: () => void;
}

export function MinistryForm({ ministryId, onSuccess }: MinistryFormProps) {
  const [isLoading, setIsLoading] = useState(!!ministryId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  
  const form = useForm<MinistryFormValues>({
    resolver: zodResolver(ministryFormSchema),
    defaultValues: {
      name: '',
      description: '',
      short_description: '',
      contact_email: '',
      contact_phone: '',
      contact_person: '',
      meeting_times: '',
      meeting_location: '',
      cover_image_url: '',
      icon_class: '',
      is_active: true,
      display_order: 0,
      cover_image_file: undefined,
    },
  });
  
  const { control, handleSubmit, reset, formState, setValue, getValues, watch } = form;
  const { errors, isDirty } = formState;
  
  // Watch for changes to trigger validations
  const watchedFields = watch();

  useEffect(() => {
    if (ministryId) {
      const fetchMinistry = async () => {
        try {
          const data = await ministryApi.getMinistryById(ministryId);
          
          // Format the data to match form schema
          const formattedData = {
            name: data.name || '',
            description: data.description || '',
            short_description: data.short_description || '',
            contact_email: data.contact_email || '',
            contact_phone: data.contact_phone || '',
            contact_person: data.contact_person || '',
            meeting_times: data.meeting_times || '',
            meeting_location: data.meeting_location || '',
            cover_image_url: data.cover_image_url || '',
            icon_class: data.icon_class || '',
            is_active: data.is_active ?? true,
            display_order: data.display_order || 0,
          };
          
          reset(formattedData);
          
          // Set preview image if exists
          if (data.cover_image_url) {
            setPreviewImage(data.cover_image_url);
          }
        } catch (error: any) {
          console.error('Error fetching ministry:', error);
          toast.error('Failed to load ministry data');
          router.push('/admin/ministries');
        } finally {
          setIsLoading(false);
        }
      };

      fetchMinistry();
    } else {
      setIsLoading(false);
    }
  }, [ministryId, reset, router]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast.error('Invalid file type. Please upload an image (JPEG, PNG, GIF, WEBP).');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File too large. Maximum size is 5MB.');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }
      
      // Update form value
      setValue('cover_image_file', file, { shouldValidate: true });
      
      // Clear existing URL if any
      setValue('cover_image_url', '');
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      console.log('📸 Image selected:', file.name, 'Size:', (file.size / 1024).toFixed(2), 'KB');
    }
  };

  const removeImage = () => {
    setPreviewImage(null);
    setValue('cover_image_url', '');
    setValue('cover_image_file', undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmit = async (formData: MinistryFormValues) => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      
      // Validate required fields
      if (!formData.name.trim()) {
        toast.error('Name is required');
        return;
      }
      
      if (!formData.description.trim()) {
        toast.error('Description is required');
        return;
      }
      
      // Create a new FormData instance
      const formDataToSend = new FormData();
      
      // Append all form fields
      const formFields = {
        name: formData.name,
        description: formData.description,
        short_description: formData.short_description || '',
        contact_email: formData.contact_email || '',
        contact_phone: formData.contact_phone || '',
        contact_person: formData.contact_person || '',
        meeting_times: formData.meeting_times || '',
        meeting_location: formData.meeting_location || '',
        cover_image_url: formData.cover_image_url || '',
        icon_class: formData.icon_class || '',
        is_active: String(formData.is_active),
        display_order: String(formData.display_order)
      };
      
      // Append each field to FormData
      Object.entries(formFields).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formDataToSend.append(key, value);
        }
      });
      
      // Handle file upload - CRITICAL: use 'file' as the field name
      if (formData.cover_image_file) {
        formDataToSend.append('file', formData.cover_image_file);
        console.log('📤 File attached:', formData.cover_image_file.name);
      }
      
      // Debug: log what's being sent
      console.log('📤 Submitting form data...');
      for (let [key, value] of formDataToSend.entries()) {
        if (value instanceof File) {
          console.log(`  ${key}: File - ${value.name} (${value.size} bytes)`);
        } else {
          console.log(`  ${key}: ${value}`);
        }
      }

      let result;
      if (ministryId) {
        console.log(`🔄 Updating ministry: ${ministryId}`);
        result = await ministryApi.updateMinistry(ministryId, formDataToSend);
        toast.success('Ministry updated successfully');
      } else {
        console.log('🆕 Creating new ministry');
        result = await ministryApi.createMinistry(formDataToSend);
        toast.success('Ministry created successfully');
      }
      
      console.log('✅ API Response:', result);
      
      // Call success callback
      if (onSuccess) {
        onSuccess();
      } else {
        // Navigate back to ministries list
        router.push('/admin/ministries');
        router.refresh();
      }
    } catch (error: any) {
      console.error('❌ Error saving ministry:', error);
      
      // Handle different error formats
      if (error.response?.data) {
        const errorData = error.response.data;
        
        if (errorData.errors && Array.isArray(errorData.errors)) {
          // Validation errors
          errorData.errors.forEach((err: any) => {
            toast.error(`${err.field}: ${err.message}`);
          });
        } else if (errorData.message) {
          // General error message
          toast.error(errorData.message);
        } else if (typeof errorData === 'string') {
          // String error
          toast.error(errorData);
        } else {
          toast.error('Failed to save ministry');
        }
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error('Failed to save ministry');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading ministry data...</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <div className="space-y-6">
        {/* Cover Image Upload Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Cover Image</h3>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label
                htmlFor="cover_image"
                className="cursor-pointer bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 inline-flex items-center transition-colors duration-200"
              >
                <Upload className="h-4 w-4 mr-2" />
                {previewImage || getValues('cover_image_url') ? 'Change Image' : 'Upload Image'}
                <input
                  id="cover_image"
                  name="cover_image"
                  type="file"
                  className="sr-only"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  disabled={isSubmitting}
                />
              </label>
              
              {(previewImage || getValues('cover_image_url')) && (
                <div className="relative group">
                  <img
                    src={previewImage || getValues('cover_image_url') || ''}
                    alt="Preview"
                    className="h-20 w-20 object-cover rounded-md border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100"
                    aria-label="Remove image"
                    disabled={isSubmitting}
                  >
                    <XCircle className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
            
            <p className="text-sm text-gray-500">
              Upload a high-quality image for the ministry. Max file size: 5MB. Supported formats: JPG, PNG, GIF, WEBP.
            </p>
            
            {errors.cover_image_file && (
              <p className="text-sm text-red-500">{errors.cover_image_file.message}</p>
            )}
          </div>
        </div>

        {/* Basic Information Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
          
          <div className="space-y-4">
            {/* Name Field */}
            <div>
              <Label htmlFor="name" className="flex items-center">
                Name <span className="text-red-500 ml-1">*</span>
              </Label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="name"
                    placeholder="Ministry Name"
                    className={`mt-1 ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
                    disabled={isSubmitting}
                  />
                )}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Short Description */}
            <div>
              <Label htmlFor="short_description">Short Description</Label>
              <Controller
                name="short_description"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    id="short_description"
                    placeholder="A brief description of the ministry (max 500 characters)"
                    rows={2}
                    className={`mt-1 ${errors.short_description ? 'border-red-500 focus:ring-red-500' : ''}`}
                    disabled={isSubmitting}
                  />
                )}
              />
              <div className="flex justify-between mt-1">
                {errors.short_description ? (
                  <p className="text-sm text-red-500">{errors.short_description.message}</p>
                ) : (
                  <p className="text-xs text-gray-500">Optional</p>
                )}
                <p className="text-xs text-gray-500">
                  {watch('short_description')?.length || 0}/500 characters
                </p>
              </div>
            </div>

            {/* Full Description */}
            <div>
              <Label htmlFor="description" className="flex items-center">
                Full Description <span className="text-red-500 ml-1">*</span>
              </Label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    id="description"
                    placeholder="Detailed description of the ministry..."
                    rows={4}
                    className={`mt-1 ${errors.description ? 'border-red-500 focus:ring-red-500' : ''}`}
                    disabled={isSubmitting}
                  />
                )}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contact_person">Contact Person</Label>
              <Controller
                name="contact_person"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="contact_person"
                    placeholder="Contact person's name"
                    className="mt-1"
                    disabled={isSubmitting}
                  />
                )}
              />
              <p className="mt-1 text-xs text-gray-500">Optional</p>
            </div>
            
            <div>
              <Label htmlFor="contact_email">Contact Email</Label>
              <Controller
                name="contact_email"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="contact_email"
                    type="email"
                    placeholder="contact@example.com"
                    className={`mt-1 ${errors.contact_email ? 'border-red-500 focus:ring-red-500' : ''}`}
                    disabled={isSubmitting}
                  />
                )}
              />
              {errors.contact_email && (
                <p className="mt-1 text-sm text-red-500">{errors.contact_email.message}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">Optional</p>
            </div>
            
            <div>
              <Label htmlFor="contact_phone">Contact Phone</Label>
              <Controller
                name="contact_phone"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="contact_phone"
                    type="tel"
                    placeholder="(123) 456-7890"
                    className="mt-1"
                    disabled={isSubmitting}
                  />
                )}
              />
              <p className="mt-1 text-xs text-gray-500">Optional</p>
            </div>
            
            <div>
              <Label htmlFor="icon_class">Icon Class</Label>
              <Controller
                name="icon_class"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="icon_class"
                    placeholder="e.g., fas fa-users"
                    className="mt-1"
                    disabled={isSubmitting}
                  />
                )}
              />
              <p className="mt-1 text-xs text-gray-500">
                Optional. Font Awesome or other icon class
              </p>
            </div>
          </div>
        </div>

        {/* Meeting Information Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Meeting Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="meeting_times">Meeting Times</Label>
              <Controller
                name="meeting_times"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="meeting_times"
                    placeholder="e.g., Every Sunday at 10:00 AM"
                    className="mt-1"
                    disabled={isSubmitting}
                  />
                )}
              />
              <p className="mt-1 text-xs text-gray-500">Optional</p>
            </div>
            
            <div>
              <Label htmlFor="meeting_location">Meeting Location</Label>
              <Controller
                name="meeting_location"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="meeting_location"
                    placeholder="e.g., Main Sanctuary, Room 101"
                    className="mt-1"
                    disabled={isSubmitting}
                  />
                )}
              />
              <p className="mt-1 text-xs text-gray-500">Optional</p>
            </div>
          </div>
        </div>

        {/* Settings Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Settings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="display_order">Display Order</Label>
              <Controller
                name="display_order"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="display_order"
                    type="number"
                    min="0"
                    step="1"
                    className={`mt-1 ${errors.display_order ? 'border-red-500 focus:ring-red-500' : ''}`}
                    disabled={isSubmitting}
                  />
                )}
              />
              <p className="mt-1 text-sm text-gray-500">
                Lower numbers appear first. Default is 0.
              </p>
              {errors.display_order && (
                <p className="mt-1 text-sm text-red-500">{errors.display_order.message}</p>
              )}
            </div>
            
            <div className="flex items-center space-x-4 pt-2">
              <div className="flex items-center space-x-2">
                <Controller
                  name="is_active"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id="is_active"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isSubmitting}
                    />
                  )}
                />
                <div>
                  <Label htmlFor="is_active" className="cursor-pointer">Active</Label>
                  <p className="text-sm text-gray-500">
                    {getValues('is_active') ? 'Ministry is visible' : 'Ministry is hidden'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
          className="min-w-[100px]"
        >
          <X className="mr-2 h-4 w-4" />
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting || (!isDirty && !!ministryId)}
          className="min-w-[150px]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {ministryId ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {ministryId ? 'Update Ministry' : 'Create Ministry'}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}