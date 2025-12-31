'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Snackbar,
  Avatar,
  IconButton,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { getPastors, createOrUpdatePastor } from '@/lib/api/pastors';

// Form validation schema
const pastorSchema = z.object({
  name: z
    .string()
    .min(2, 'Name should be at least 2 characters')
    .max(100, 'Name should not exceed 100 characters'),
  title: z
    .string()
    .min(2, 'Title should be at least 2 characters')
    .max(100, 'Title should not exceed 100 characters'),
  bio: z
    .string()
    .min(10, 'Bio should be at least 10 characters')
    .max(2000, 'Bio should not exceed 2000 characters'),
  email: z
    .string()
    .email('Please enter a valid email address')
    .max(100, 'Email should not exceed 100 characters'),
  phone: z
    .string()
    .max(20, 'Phone number should not exceed 20 characters')
    .optional(),
  imageUrl: z.string().optional(),
});

type PastorFormData = z.infer<typeof pastorSchema>;

// Character counter component
const CharacterCounter = ({ value, max, min = 0 }: { value: string; max: number; min?: number }) => {
  const length = value?.length || 0;
  const isError = length > max || length < min;
  const color = isError ? 'error' : 'textSecondary';

  return (
    <Typography variant="caption" color={color} sx={{ mt: 0.5, display: 'block', textAlign: 'right' }}>
      {length}/{max} characters
    </Typography>
  );
};

export default function PastorsPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const [initialData, setInitialData] = useState<PastorFormData | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<PastorFormData>({
    resolver: zodResolver(pastorSchema),
    defaultValues: {
      name: '',
      title: '',
      bio: '',
      email: '',
      phone: '',
      imageUrl: '',
    },
  });

  // Watch form values for character counters
  const formValues = watch();

  // Fetch pastor data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getPastors();
        if (response.status === 'success' && response.data && response.data.length > 0) {
          // For now, we'll just take the first pastor
          setInitialData(response.data[0]);
          reset(response.data[0]);
          if (response.data[0].imageUrl) {
            setImagePreview(response.data[0].imageUrl);
          }
        }
      } catch (error) {
        console.error('Error fetching pastor information:', error);
        setSnackbar({
          open: true,
          message: 'Failed to load pastor information',
          severity: 'error',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [reset]);

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setValue('imageUrl', result, { shouldDirty: true });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const onSubmit = async (data: PastorFormData) => {
    try {
      const response = await createOrUpdatePastor(data);
      if (response.status === 'success') {
        setSnackbar({
          open: true,
          message: 'Pastor information saved successfully',
          severity: 'success',
        });
        setInitialData(data);
      } else {
        throw new Error(response.message || 'Failed to save pastor information');
      }
    } catch (error) {
      console.error('Error saving pastor information:', error);
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : 'Failed to save pastor information',
        severity: 'error',
      });
    }
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  if (isLoading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="60vh"
        sx={{ backgroundColor: '#E3F2FD' }} // Light Blue background
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      maxWidth: 800, 
      mx: 'auto', 
      p: 3,
      backgroundColor: '#E3F2FD', // Light Blue background
      minHeight: '100vh'
    }}>
      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom
        sx={{ color: '#0D47A1' }} // Dark Blue text
      >
        Pastor Information
      </Typography>
      
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          mb: 3,
          backgroundColor: 'white', // White background for form
          border: '1px solid #0D47A1' // Dark Blue border
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Image Upload */}
          <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
            <Avatar
              src={imagePreview}
              alt="Pastor"
              sx={{ 
                width: 150, 
                height: 150, 
                mb: 2,
                border: '2px solid #0D47A1' // Dark Blue border
              }}
            />
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="pastor-image-upload"
              type="file"
              onChange={handleImageChange}
            />
            <label htmlFor="pastor-image-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<CloudUploadIcon />}
                sx={{
                  color: '#0D47A1', // Dark Blue text
                  borderColor: '#0D47A1', // Dark Blue border
                  '&:hover': {
                    backgroundColor: '#E3F2FD', // Light Blue on hover
                    borderColor: '#0D47A1', // Dark Blue border
                  },
                }}
              >
                Upload Photo
              </Button>
            </label>
          </Box>

          {/* Name */}
          <Box mb={3}>
            <TextField
              {...register('name')}
              label="Name"
              variant="outlined"
              fullWidth
              error={!!errors.name}
              helperText={errors.name?.message}
              disabled={isSubmitting}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#0D47A1', // Dark Blue border
                  },
                  '&:hover fieldset': {
                    borderColor: '#0D47A1', // Dark Blue border on hover
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#0D47A1', // Dark Blue border when focused
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#0D47A1', // Dark Blue label
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#0D47A1', // Dark Blue label when focused
                },
              }}
            />
            <CharacterCounter value={formValues.name} max={100} min={2} />
          </Box>

          {/* Title */}
          <Box mb={3}>
            <TextField
              {...register('title')}
              label="Title"
              variant="outlined"
              fullWidth
              error={!!errors.title}
              helperText={errors.title?.message}
              disabled={isSubmitting}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#0D47A1', // Dark Blue border
                  },
                  '&:hover fieldset': {
                    borderColor: '#0D47A1', // Dark Blue border on hover
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#0D47A1', // Dark Blue border when focused
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#0D47A1', // Dark Blue label
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#0D47A1', // Dark Blue label when focused
                },
              }}
            />
            <CharacterCounter value={formValues.title} max={100} min={2} />
          </Box>

          {/* Email */}
          <Box mb={3}>
            <TextField
              {...register('email')}
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              error={!!errors.email}
              helperText={errors.email?.message}
              disabled={isSubmitting}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#0D47A1', // Dark Blue border
                  },
                  '&:hover fieldset': {
                    borderColor: '#0D47A1', // Dark Blue border on hover
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#0D47A1', // Dark Blue border when focused
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#0D47A1', // Dark Blue label
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#0D47A1', // Dark Blue label when focused
                },
              }}
            />
            <CharacterCounter value={formValues.email} max={100} />
          </Box>

          {/* Phone */}
          <Box mb={3}>
            <TextField
              {...register('phone')}
              label="Phone Number"
              variant="outlined"
              fullWidth
              error={!!errors.phone}
              helperText={errors.phone?.message}
              disabled={isSubmitting}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#0D47A1', // Dark Blue border
                  },
                  '&:hover fieldset': {
                    borderColor: '#0D47A1', // Dark Blue border on hover
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#0D47A1', // Dark Blue border when focused
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#0D47A1', // Dark Blue label
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#0D47A1', // Dark Blue label when focused
                },
              }}
            />
            <CharacterCounter value={formValues.phone || ''} max={20} />
          </Box>

          {/* Bio */}
          <Box mb={3}>
            <TextField
              {...register('bio')}
              label="Biography"
              variant="outlined"
              fullWidth
              multiline
              rows={6}
              error={!!errors.bio}
              helperText={errors.bio?.message}
              disabled={isSubmitting}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#0D47A1', // Dark Blue border
                  },
                  '&:hover fieldset': {
                    borderColor: '#0D47A1', // Dark Blue border on hover
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#0D47A1', // Dark Blue border when focused
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#0D47A1', // Dark Blue label
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#0D47A1', // Dark Blue label when focused
                },
              }}
            />
            <CharacterCounter value={formValues.bio} max={2000} min={10} />
          </Box>

          <Box display="flex" justifyContent="flex-end" mt={4}>
            <Button
              type="submit"
              variant="contained"
              startIcon={isSubmitting ? <CircularProgress size={20} /> : <SaveIcon />}
              disabled={!isDirty || isSubmitting}
              sx={{
                backgroundColor: '#BBDEFB', // Light Blue Accent background
                color: '#0D47A1', // Dark Blue text
                '&:hover': {
                  backgroundColor: '#90CAF9', // Slightly darker blue on hover
                },
                '&.Mui-disabled': {
                  backgroundColor: '#E3F2FD', // Light Blue when disabled
                  color: '#90CAF9', // Lighter blue text when disabled
                },
              }}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
        </form>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ 
            width: '100%',
            '& .MuiAlert-icon': {
              color: '#0D47A1', // Dark Blue icon
            },
            backgroundColor: snackbar.severity === 'success' ? '#E3F2FD' : '#FFEBEE', // Light Blue for success, Light Red for error
            color: '#0D47A1', // Dark Blue text
            border: '1px solid #0D47A1', // Dark Blue border
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}