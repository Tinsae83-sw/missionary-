'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Paper,
  Typography,
  Grid,
  Box,
  FormControlLabel,
  Checkbox,
  FormGroup,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import { eventApi } from '@/lib/api/eventApi';

// Define validation schema
const eventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  startDate: z.date({ required_error: 'Start date is required' }),
  endDate: z.date().optional().nullable(),
  startTime: z.string().min(1, 'Start time is required')
    .refine((time) => /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time), {
      message: 'Invalid time format. Use HH:mm format',
    }),
  endTime: z.string()
    .refine((time) => !time || /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time), {
      message: 'Invalid time format. Use HH:mm format',
    })
    .optional()
    .nullable(),
  location: z.string().min(1, 'Location is required'),
  eventType: z.string().min(1, 'Event type is required'),
  isRecurring: z.boolean().default(false),
  recurringPattern: z.string().optional(),
  isPublic: z.boolean().default(true),
  maxAttendees: z.number().min(0).optional().nullable(),
  featuredImage: z.string().optional().nullable(),
  status: z.enum(['draft', 'published', 'cancelled']).default('draft'),
  imageFile: z.instanceof(File).optional().nullable(),
});

type EventFormValues = z.infer<typeof eventSchema>;

const eventTypes = [
  'Worship Service',
  'Bible Study',
  'Prayer Meeting',
  'Fellowship',
  'Outreach',
  'Conference',
  'Other',
];

const recurringPatterns = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Bi-weekly' },
  { value: 'monthly', label: 'Monthly' },
];

export default function NewEventPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  const defaultValues: EventFormValues = {
    title: '',
    description: '',
    startDate: new Date(),
    endDate: null,
    startTime: format(new Date(), 'HH:mm'),
    endTime: '',
    location: '',
    eventType: eventTypes[0],
    isRecurring: false,
    recurringPattern: '',
    isPublic: true,
    maxAttendees: null,
    featuredImage: null,
    status: 'draft',
    imageFile: null,
  };

  const { control, handleSubmit, formState: { errors }, watch, setValue } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues,
  });

  const isRecurring = watch('isRecurring');
  const imageFile = watch('imageFile');
  const featuredImage = watch('featuredImage');

  // Handle image upload
  const handleImageUpload = async (file: File) => {
    try {
      setIsUploading(true);
      setError(null);
      
      console.log('Uploading image:', file.name, file.type, file.size);
      
      const imageUrl = await eventApi.uploadImage(file);
      
      setValue('featuredImage', imageUrl);
      setSnackbar({
        open: true,
        message: 'Image uploaded successfully!',
        severity: 'success'
      });
      
      return imageUrl;
    } catch (error: any) {
      console.error('Error uploading image:', error);
      setError('Failed to upload image. Please try again.');
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleFormSubmit = async (formData: EventFormValues) => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Upload image if file is selected
      let finalImageUrl = formData.featuredImage;
      if (formData.imageFile) {
        try {
          finalImageUrl = await handleImageUpload(formData.imageFile);
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError);
          // Continue without image if upload fails
        }
      }

      // Combine date and time for start date
      const startDate = new Date(formData.startDate);
      const [startHours, startMinutes] = formData.startTime.split(':').map(Number);
      startDate.setHours(startHours, startMinutes, 0, 0);

      // Combine date and time for end date if provided
      let endDate = null;
      if (formData.endDate && formData.endTime) {
        endDate = new Date(formData.endDate);
        const [endHours, endMinutes] = formData.endTime.split(':').map(Number);
        endDate.setHours(endHours, endMinutes, 0, 0);
      }

      // Prepare the event data for submission
      const eventType = formData.eventType || eventTypes[0];
      
      const eventData = {
        title: formData.title,
        description: formData.description,
        startDate: startDate.toISOString(),
        endDate: endDate ? endDate.toISOString() : null,
        location: formData.location,
        eventType: eventType,
        isRecurring: formData.isRecurring,
        recurringPattern: formData.isRecurring ? formData.recurringPattern : null,
        isPublic: formData.isPublic,
        maxAttendees: formData.maxAttendees || null,
        featuredImage: finalImageUrl || null,
        status: formData.status || 'draft' as const
      };
      
      console.log('Prepared event data:', eventData);

      await eventApi.createEvent(eventData);
      
      setSnackbar({
        open: true,
        message: 'Event created successfully!',
        severity: 'success'
      });
      
      // Redirect to events list after a short delay
      setTimeout(() => {
        router.push('/admin/events');
      }, 1500);
      
    } catch (error: any) {
      console.error('Error creating event:', error);
      setError(error.message || 'Failed to create event. Please try again.');
      setSnackbar({
        open: true,
        message: error.message || 'Failed to create event. Please try again.',
        severity: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Paper className="p-6 max-w-4xl mx-auto">
        <Typography variant="h5" className="mb-6">
          Create New Event
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="bg-white shadow-md rounded-lg p-6">
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Event Title"
                      fullWidth
                      error={!!errors.title}
                      helperText={errors.title?.message}
                      className="mb-4"
                    />
                  )}
                />

                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Description"
                      multiline
                      rows={4}
                      fullWidth
                      error={!!errors.description}
                      helperText={errors.description?.message}
                      className="mb-4"
                    />
                  )}
                />

                <Controller
                  name="location"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Location"
                      fullWidth
                      error={!!errors.location}
                      helperText={errors.location?.message}
                      className="mb-4"
                    />
                  )}
                />

                <Controller
                  name="eventType"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.eventType} className="mb-4">
                      <InputLabel>Event Type</InputLabel>
                      <Select {...field} label="Event Type">
                        {eventTypes.map((type) => (
                          <MenuItem key={type} value={type}>
                            {type}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.eventType && (
                        <FormHelperText>{errors.eventType.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />

                <Grid container spacing={2} className="mb-4">
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="startDate"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          label="Start Date"
                          value={field.value}
                          onChange={(date) => field.onChange(date)}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              error: !!errors.startDate,
                              helperText: errors.startDate?.message,
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="startTime"
                      control={control}
                      render={({ field }) => (
                        <TimePicker
                          label="Start Time"
                          value={field.value ? new Date(`1970-01-01T${field.value}`) : null}
                          onChange={(time) => {
                            const formattedTime = time ? format(time, 'HH:mm') : '';
                            field.onChange(formattedTime);
                          }}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              error: !!errors.startTime,
                              helperText: errors.startTime?.message,
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={2} className="mb-4">
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="endDate"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          label="End Date (Optional)"
                          value={field.value}
                          onChange={(date) => field.onChange(date)}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              error: !!errors.endDate,
                              helperText: errors.endDate?.message,
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="endTime"
                      control={control}
                      render={({ field }) => (
                        <TimePicker
                          label="End Time (Optional)"
                          value={field.value ? new Date(`1970-01-01T${field.value}`) : null}
                          onChange={(time) => {
                            const formattedTime = time ? format(time, 'HH:mm') : '';
                            field.onChange(formattedTime);
                          }}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              error: !!errors.endTime,
                              helperText: errors.endTime?.message,
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>
                </Grid>

                <FormGroup className="mb-4">
                  <Controller
                    name="isRecurring"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
                        }
                        label="This is a recurring event"
                      />
                    )}
                  />
                </FormGroup>

                {isRecurring && (
                  <Controller
                    name="recurringPattern"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth className="mb-4">
                        <InputLabel>Recurring Pattern</InputLabel>
                        <Select {...field} label="Recurring Pattern">
                          {recurringPatterns.map((pattern) => (
                            <MenuItem key={pattern.value} value={pattern.value}>
                              {pattern.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  />
                )}

                <FormGroup className="mb-4">
                  <Controller
                    name="isPublic"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
                        }
                        label="Public Event (visible to everyone)"
                      />
                    )}
                  />
                </FormGroup>

                <Controller
                  name="maxAttendees"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Maximum Attendees (Optional)"
                      type="number"
                      fullWidth
                      className="mb-4"
                      value={field.value || ''}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : '')}
                    />
                  )}
                />

                {/* Image Upload Section */}
                <div className="mb-6 p-4 border rounded bg-gray-50">
                  <Typography variant="subtitle1" className="mb-3 font-semibold">
                    Event Image
                  </Typography>
                  
                  <div className="mb-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setValue('imageFile', file);
                          
                          // Create preview
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            setValue('featuredImage', event.target?.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                    />
                    {isUploading && (
                      <div className="mt-2 flex items-center">
                        <CircularProgress size={16} className="mr-2" />
                        <span className="text-sm text-gray-600">Uploading image...</span>
                      </div>
                    )}
                  </div>
                  
                  {(featuredImage || imageFile) && (
                    <div className="mt-4">
                      <Typography variant="subtitle2" className="mb-2">
                        Image Preview:
                      </Typography>
                      <div className="relative">
                        <img
                          src={featuredImage || URL.createObjectURL(imageFile!)}
                          alt="Event preview"
                          className="max-w-full h-auto max-h-60 rounded-lg shadow-md"
                        />
                        {imageFile && (
                          <div className="mt-2 text-sm text-gray-600">
                            Selected file: {imageFile.name} ({(imageFile.size / 1024 / 1024).toFixed(2)} MB)
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-4 text-sm text-gray-500">
                    <p>• Supported formats: JPG, PNG, GIF, WebP</p>
                    <p>• Maximum file size: 10MB</p>
                    <p>• Recommended dimensions: 1200×800 pixels</p>
                  </div>
                </div>
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
              <Button
                type="button"
                onClick={handleCancel}
                variant="outlined"
                disabled={isSubmitting || isUploading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting || isUploading}
                startIcon={isSubmitting || isUploading ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {isSubmitting ? 'Creating Event...' : 'Create Event'}
              </Button>
            </Box>
          </div>
        </form>
        
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Paper>
    </LocalizationProvider>
  );
}