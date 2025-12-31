'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Calendar as CalendarIcon, Upload, X, Loader2, Save } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../../../lib/utils';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Label } from '../../../components/ui/label';
import { Switch } from '../../../components/ui/switch';
import { Calendar } from '../../../components/ui/calendar';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../../components/ui/card';
import { toast } from 'sonner';
import { createSermon, updateSermon, getSermon, type Sermon } from '../../../lib/api/sermonApi';
// Remove this line as we're importing Sermon from sermonApi
import api from '../../../lib/api/api';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../../components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';

// Schema for form validation
const sermonFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  speakerName: z.string().min(1, 'Speaker name is required'),
  biblePassage: z.string().min(1, 'Bible passage is required'),
  date: z.date({
    invalid_type_error: 'Please select a valid date',
    required_error: 'Date is required',
  }),
  duration: z.number().int().min(0, 'Duration cannot be negative').default(0),
  content: z.string().min(1, 'Content is required'),
  videoUrl: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
  audioUrl: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
  sermonNotesUrl: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
  thumbnailUrl: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
  isPublished: z.boolean().default(false),
  seriesId: z.string().optional().nullable(),
});

type SermonFormValues = z.infer<typeof sermonFormSchema>;

interface SermonFormProps {
  sermonId?: string;
  onSuccess?: () => void;
}

const SermonForm = ({ sermonId, onSuccess }: SermonFormProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(!!sermonId);
  const [series, setSeries] = useState<Array<{ id: string; name: string }>>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SermonFormValues>({
    resolver: zodResolver(sermonFormSchema),
    defaultValues: {
      title: '',
      speakerName: '',
      biblePassage: '',
      date: new Date(),
      duration: 0,
      content: '',
      videoUrl: '',
      audioUrl: '',
      sermonNotesUrl: '',
      thumbnailUrl: '',
      isPublished: false,
      seriesId: undefined,
    },
  });

  // Fetch initial data
  useEffect(() => {
    const initializeForm = async () => {
      try {
        // Fetch sermon data if editing
        if (sermonId) {
          const sermon = await getSermon(sermonId);
          reset({
            title: sermon.title,
            speakerName: sermon.speaker,
            biblePassage: sermon.bible_passage || '',
            date: new Date(sermon.sermon_date),
            duration: sermon.duration || 0,
            content: sermon.description || '',
            videoUrl: sermon.video_url || '',
            audioUrl: sermon.audio_url || '',
            sermonNotesUrl: (sermon as any).sermon_notes_url || '',
            thumbnailUrl: (sermon as any).thumbnail_url || '',
            isPublished: (sermon as any).is_published || false,
            seriesId: (sermon as any).series_id || null,
          });
        }

        // For now, we'll use an empty array for series
        // You can implement series fetching when the API is ready
        setSeries([]);
      } catch (error) {
        console.error('Error initializing form:', error);
        toast.error('Failed to load form data');
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    initializeForm();
  }, [sermonId, reset]);

  // Handle file upload
  const handleFileUpload = async (file: File, type: 'video' | 'audio' | 'notes' | 'thumbnail') => {
    if (!file) return null;
    
    setIsUploading(true);
    const toastId = toast.loading(`Uploading ${type}...`);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);
      
      // Use the API client to upload the file
      const response = await api.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} uploaded successfully`, { id: toastId });
      return response.data.url;
    } catch (error: any) {
      console.error(`Error uploading ${type}:`, error);
      
      let errorMessage = `Failed to upload ${type}`;
      let errorDetails = 'Please try again later.';
      
      if (error.response) {
        const { status, data } = error.response;
        
        if (status === 400) {
          errorMessage = 'Invalid File';
          errorDetails = data?.message || 'The selected file is not valid.';
        } else if (status === 401) {
          errorMessage = 'Unauthorized';
          errorDetails = 'Please log in to upload files.';
        } else if (status === 413) {
          errorMessage = 'File Too Large';
          errorDetails = 'The selected file is too large. Please choose a smaller file.';
        } else if (status >= 500) {
          errorMessage = 'Server Error';
          errorDetails = 'An error occurred while uploading the file. Please try again later.';
        }
      } else if (error.request) {
        errorMessage = 'Network Error';
        errorDetails = 'Unable to connect to the server. Please check your internet connection.';
      } else if (error.message) {
        errorDetails = error.message;
      }
      
      toast.error(errorMessage, { 
        id: toastId,
        description: errorDetails,
        duration: 10000
      });
      
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  // Handle form submission
  const onSubmit = async (formData: SermonFormValues) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    const toastId = toast.loading(sermonId ? 'Updating sermon...' : 'Creating sermon...');
    
    try {
      // Prepare the sermon data for the API
      const sermonData: Omit<Sermon, 'id' | 'created_at' | 'updated_at' | 'view_count' | 'like_count' | 'share_count' | 'download_count'> = {
        title: formData.title,
        speaker: formData.speakerName,
        bible_passage: formData.biblePassage || null,
        sermon_date: formData.date.toISOString(),
        description: formData.content || null,
        transcript: formData.content || null, // Using the same content for transcript
        thumbnail_url: formData.thumbnailUrl || null,
        video_url: formData.videoUrl || null,
        audio_url: formData.audioUrl || null,
        sermon_notes_url: formData.sermonNotesUrl || null,
        is_published: formData.isPublished || false,
        is_featured: false,
        duration: formData.duration || 0,
        series_id: formData.seriesId || null,
      };

      let response: Sermon;
      
      if (sermonId) {
        // Update existing sermon
        response = await updateSermon(sermonId, sermonData);
        toast.success('Sermon updated successfully!', { 
          id: toastId,
          description: `"${formData.title}" has been updated.`,
          action: {
            label: 'View',
            onClick: () => router.push(`/admin/sermons/${sermonId}`)
          }
        });
      } else {
        // Create new sermon
        response = await createSermon(sermonData as any);
        toast.success('Sermon created successfully!', { 
          id: toastId,
          description: `"${formData.title}" has been added to your sermons.`,
          action: {
            label: 'View',
            onClick: () => router.push(`/admin/sermons/${response.id}`)
          }
        });
      }

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      } else {
        // Otherwise, redirect to sermons list
        router.push('/admin/sermons');
        router.refresh();
      }
    } catch (error: any) {
      console.error('Error saving sermon:', error);
      
      let errorMessage = 'Failed to save sermon';
      let errorDetails = 'Please check your connection and try again.';
      
      // Handle different types of errors
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const { status, data } = error.response;
        
        if (status === 400) {
          errorMessage = 'Validation Error';
          errorDetails = data?.message || 'Please check your input and try again.';
          
          // Handle validation errors
          if (data.errors) {
            errorDetails = Object.values(data.errors)
              .flat()
              .join('\n');
          }
        } else if (status === 401) {
          errorMessage = 'Unauthorized';
          errorDetails = 'Your session has expired. Please log in again.';
          router.push('/login');
        } else if (status === 403) {
          errorMessage = 'Access Denied';
          errorDetails = 'You do not have permission to perform this action.';
        } else if (status === 404) {
          errorMessage = 'Not Found';
          errorDetails = 'The requested resource was not found.';
        } else if (status === 500) {
          errorMessage = 'Server Error';
          errorDetails = 'Something went wrong on our end. Please try again later.';
        } else {
          errorMessage = `Error ${status}`;
          errorDetails = data?.message || 'An unknown error occurred.';
        }
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = 'Network Error';
        errorDetails = 'Unable to connect to the server. Please check your internet connection.';
      } else {
        // Something happened in setting up the request
        errorMessage = 'Request Error';
        errorDetails = error.message || 'An error occurred while setting up the request.';
      }
      
      // Show error toast with retry option
      toast.error(errorMessage, { 
        id: toastId,
        description: errorDetails,
        duration: 10000,
        action: {
          label: 'Retry',
          onClick: () => onSubmit(formData)
        }
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle file input change
  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'video' | 'audio' | 'notes' | 'thumbnail'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const toastId = toast.loading(`Uploading ${type}...`);
    try {
      const url = await handleFileUpload(file, type);
      if (url) {
        const fieldMap = {
          video: 'videoUrl',
          audio: 'audioUrl',
          notes: 'sermonNotesUrl',
          thumbnail: 'thumbnailUrl'
        };
        
        const fieldName = fieldMap[type] as keyof SermonFormValues;
        setValue(fieldName, url, { shouldValidate: true });
        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} uploaded successfully`, { id: toastId });
      }
    } catch (error) {
      toast.error(`Failed to upload ${type}`, { id: toastId });
    } finally {
      e.target.value = ''; // Reset file input
    }
  };

  if (isLoading || !isInitialized) {
    return (
      <div 
        className="flex items-center justify-center h-64"
        style={{ backgroundColor: '#E3F2FD' }} // Light Blue background
      >
        <div className="flex flex-col items-center space-y-4">
          <Loader2 
            className="h-8 w-8 animate-spin" 
            style={{ color: '#0D47A1' }} // Dark Blue spinner
          />
          <p 
            className="text-muted-foreground"
            style={{ color: '#0D47A1', opacity: 0.8 }} // Dark Blue text with opacity
          >
            {isLoading ? 'Loading sermon data...' : 'Initializing form...'}
          </p>
        </div>
      </div>
    );
  }

  const onSubmitForm = handleSubmit((data) => {
    return onSubmit(data);
  });

  return (
    <form onSubmit={onSubmitForm} className="space-y-6" noValidate>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-6">
          <Card
            style={{
              border: '1px solid #0D47A1', // Dark Blue border
            }}
          >
            <CardHeader>
              <CardTitle style={{ color: '#0D47A1' }}> {/* Dark Blue text */}
                Sermon Details
              </CardTitle>
              <CardDescription style={{ color: '#0D47A1', opacity: 0.8 }}> {/* Dark Blue text with opacity */}
                Basic information about the sermon
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label 
                  htmlFor="title"
                  style={{ color: '#0D47A1' }} // Dark Blue text
                >
                  Title *
                </Label>
                <Input
                  id="title"
                  placeholder="Enter sermon title"
                  {...register('title')}
                  error={errors.title?.message}
                  style={{
                    borderColor: '#0D47A1', // Dark Blue border
                    color: '#0D47A1', // Dark Blue text
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label 
                  htmlFor="speakerName"
                  style={{ color: '#0D47A1' }} // Dark Blue text
                >
                  Speaker *
                </Label>
                <Input
                  id="speakerName"
                  placeholder="Enter speaker name"
                  {...register('speakerName')}
                  error={errors.speakerName?.message}
                  style={{
                    borderColor: '#0D47A1', // Dark Blue border
                    color: '#0D47A1', // Dark Blue text
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label 
                  htmlFor="biblePassage"
                  style={{ color: '#0D47A1' }} // Dark Blue text
                >
                  Bible Passage *
                </Label>
                <Input
                  id="biblePassage"
                  placeholder="e.g. John 3:16"
                  {...register('biblePassage')}
                  error={errors.biblePassage?.message}
                  style={{
                    borderColor: '#0D47A1', // Dark Blue border
                    color: '#0D47A1', // Dark Blue text
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label 
                    htmlFor="date"
                    style={{ color: '#0D47A1' }} // Dark Blue text
                  >
                    Date *
                  </Label>
                  <Controller
                    name="date"
                    control={control}
                    render={({ field }) => (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                            style={{
                              borderColor: '#0D47A1', // Dark Blue border
                              color: field.value ? '#0D47A1' : '#0D47A180', // Dark Blue text, with opacity if no value
                            }}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" style={{ color: '#0D47A1' }} /> {/* Dark Blue icon */}
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent 
                          className="w-auto p-0" 
                          align="start"
                          style={{
                            borderColor: '#0D47A1', // Dark Blue border
                            backgroundColor: '#E3F2FD', // Light Blue background
                          }}
                        >
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                  />
                  {errors.date && (
                    <p className="text-sm font-medium" style={{ color: '#D32F2F' }}> {/* Red error text */}
                      {errors.date.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label 
                    htmlFor="duration"
                    style={{ color: '#0D47A1' }} // Dark Blue text
                  >
                    Duration (minutes)
                  </Label>
                  <Input
                    id="duration"
                    type="number"
                    min="0"
                    placeholder="e.g. 45"
                    {...register('duration', { valueAsNumber: true })}
                    error={errors.duration?.message}
                    style={{
                      borderColor: '#0D47A1', // Dark Blue border
                      color: '#0D47A1', // Dark Blue text
                    }}
                  />
                </div>
              </div>

              {series.length > 0 && (
                <div className="space-y-2">
                  <Label 
                    htmlFor="seriesId"
                    style={{ color: '#0D47A1' }} // Dark Blue text
                  >
                    Sermon Series
                  </Label>
                  <Controller
                    name="seriesId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          style={{
                            borderColor: '#0D47A1', // Dark Blue border
                            color: '#0D47A1', // Dark Blue text
                          }}
                        >
                          <SelectValue placeholder="Select a series" />
                        </SelectTrigger>
                        <SelectContent
                          style={{
                            borderColor: '#0D47A1', // Dark Blue border
                            backgroundColor: '#E3F2FD', // Light Blue background
                          }}
                        >
                          {series.map((item) => (
                            <SelectItem 
                              key={item.id} 
                              value={item.id}
                              style={{ color: '#0D47A1' }} // Dark Blue text
                            >
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Controller
                  name="isPublished"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id="isPublished"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      style={{
                        '--switch-bg': '#BBDEFB', // Light Blue Accent for background
                        '--switch-border': '#0D47A1', // Dark Blue for border
                        '--switch-thumb': '#0D47A1', // Dark Blue for thumb
                      } as React.CSSProperties}
                    />
                  )}
                />
                <Label 
                  htmlFor="isPublished"
                  style={{ color: '#0D47A1' }} // Dark Blue text
                >
                  Publish this sermon
                </Label>
              </div>
            </CardContent>
          </Card>

          <Card
            style={{
              border: '1px solid #0D47A1', // Dark Blue border
            }}
          >
            <CardHeader>
              <CardTitle style={{ color: '#0D47A1' }}> {/* Dark Blue text */}
                Media
              </CardTitle>
              <CardDescription style={{ color: '#0D47A1', opacity: 0.8 }}> {/* Dark Blue text with opacity */}
                Upload or link to sermon media
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label style={{ color: '#0D47A1' }}> {/* Dark Blue text */}
                  Thumbnail Image
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    placeholder="Paste thumbnail URL"
                    {...register('thumbnailUrl')}
                    error={errors.thumbnailUrl?.message}
                    style={{
                      borderColor: '#0D47A1', // Dark Blue border
                      color: '#0D47A1', // Dark Blue text
                    }}
                  />
                  <input
                    type="file"
                    id="thumbnail-upload"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, 'thumbnail')}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => document.getElementById('thumbnail-upload')?.click()}
                    disabled={isUploading}
                    style={{
                      borderColor: '#0D47A1', // Dark Blue border
                      color: '#0D47A1', // Dark Blue text
                      backgroundColor: 'transparent',
                    }}
                    className="hover:bg-[#E3F2FD] hover:opacity-90"
                  >
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label style={{ color: '#0D47A1' }}> {/* Dark Blue text */}
                  Video URL
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    placeholder="Paste video URL"
                    {...register('videoUrl')}
                    error={errors.videoUrl?.message}
                    style={{
                      borderColor: '#0D47A1', // Dark Blue border
                      color: '#0D47A1', // Dark Blue text
                    }}
                  />
                  <input
                    type="file"
                    id="video-upload"
                    accept="video/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, 'video')}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => document.getElementById('video-upload')?.click()}
                    disabled={isUploading}
                    style={{
                      borderColor: '#0D47A1', // Dark Blue border
                      color: '#0D47A1', // Dark Blue text
                      backgroundColor: 'transparent',
                    }}
                    className="hover:bg-[#E3F2FD] hover:opacity-90"
                  >
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label style={{ color: '#0D47A1' }}> {/* Dark Blue text */}
                  Audio URL
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    placeholder="Paste audio URL"
                    {...register('audioUrl')}
                    error={errors.audioUrl?.message}
                    style={{
                      borderColor: '#0D47A1', // Dark Blue border
                      color: '#0D47A1', // Dark Blue text
                    }}
                  />
                  <input
                    type="file"
                    id="audio-upload"
                    accept="audio/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, 'audio')}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => document.getElementById('audio-upload')?.click()}
                    disabled={isUploading}
                    style={{
                      borderColor: '#0D47A1', // Dark Blue border
                      color: '#0D47A1', // Dark Blue text
                      backgroundColor: 'transparent',
                    }}
                    className="hover:bg-[#E3F2FD] hover:opacity-90"
                  >
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <Card
            style={{
              border: '1px solid #0D47A1', // Dark Blue border
            }}
          >
            <CardHeader>
              <CardTitle style={{ color: '#0D47A1' }}> {/* Dark Blue text */}
                Sermon Content
              </CardTitle>
              <CardDescription style={{ color: '#0D47A1', opacity: 0.8 }}> {/* Dark Blue text with opacity */}
                Main content of the sermon
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label 
                    htmlFor="content"
                    style={{ color: '#0D47A1' }} // Dark Blue text
                  >
                    Sermon Content *
                  </Label>
                  <Textarea
                    id="content"
                    placeholder="Enter the sermon content here..."
                    className="min-h-[300px]"
                    {...register('content')}
                    error={errors.content?.message}
                    style={{
                      borderColor: '#0D47A1', // Dark Blue border
                      color: '#0D47A1', // Dark Blue text
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label style={{ color: '#0D47A1' }}> {/* Dark Blue text */}
                    Sermon Notes (Optional)
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="text"
                      placeholder="Paste notes URL"
                      {...register('sermonNotesUrl')}
                      error={errors.sermonNotesUrl?.message}
                      style={{
                        borderColor: '#0D47A1', // Dark Blue border
                        color: '#0D47A1', // Dark Blue text
                      }}
                    />
                    <input
                      type="file"
                      id="notes-upload"
                      accept=".pdf,.doc,.docx,.txt"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, 'notes')}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => document.getElementById('notes-upload')?.click()}
                      disabled={isUploading}
                      style={{
                        borderColor: '#0D47A1', // Dark Blue border
                        color: '#0D47A1', // Dark Blue text
                        backgroundColor: 'transparent',
                      }}
                      className="hover:bg-[#E3F2FD] hover:opacity-90"
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
          style={{
            borderColor: '#0D47A1', // Dark Blue border
            color: '#0D47A1', // Dark Blue text
            backgroundColor: 'transparent',
          }}
          className="hover:bg-[#E3F2FD] hover:opacity-90"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || isUploading || !isInitialized}
          className="min-w-[150px]"
          style={{
            backgroundColor: '#BBDEFB', // Light Blue Accent background
            color: '#0D47A1', // Dark Blue text
            border: '1px solid #0D47A1', // Dark Blue border
          }}
          className="hover:opacity-90 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {sermonId ? 'Saving Changes...' : 'Creating...'}
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {sermonId ? 'Update Sermon' : 'Create Sermon'}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

export default SermonForm;