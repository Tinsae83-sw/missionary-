// frontend/src/app/admin/mission-vision/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../../contexts/AuthContext';
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
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { getMissionVision, createOrUpdateMissionVision } from '../../../lib/api/missionVision';

// Form validation schema
const missionVisionSchema = z.object({
  mission: z
    .string()
    .min(10, 'Mission should be at least 10 characters')
    .max(1000, 'Mission should not exceed 1000 characters'),
  vision: z
    .string()
    .min(10, 'Vision should be at least 10 characters')
    .max(1000, 'Vision should not exceed 1000 characters'),
  coreValues: z
    .string()
    .min(10, 'Core values should be at least 10 characters')
    .max(2000, 'Core values should not exceed 2000 characters'),
  purpose: z
    .string()
    .min(10, 'Purpose should be at least 10 characters')
    .max(1000, 'Purpose should not exceed 1000 characters'),
});

type MissionVisionFormData = z.infer<typeof missionVisionSchema>;

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

export default function MissionVisionPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const [initialData, setInitialData] = useState<MissionVisionFormData | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<MissionVisionFormData>({
    resolver: zodResolver(missionVisionSchema),
    defaultValues: {
      mission: '',
      vision: '',
      coreValues: '',
      purpose: '',
    },
  });

  // Watch form values for character counters
  const formValues = watch();

  // Fetch mission and vision data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getMissionVision();
        if (response.status === 'success' && response.data) {
          setInitialData(response.data);
          reset(response.data);
        }
      } catch (error) {
        console.error('Error fetching mission and vision:', error);
        setSnackbar({
          open: true,
          message: 'Failed to load mission and vision',
          severity: 'error',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [reset]);

  // Handle form submission
  const onSubmit = async (data: MissionVisionFormData) => {
    try {
      console.log('Submitting data:', data); // Debug log
      const response = await createOrUpdateMissionVision(data);
      console.log('API Response:', response); // Debug log

      if (response && response.status === 'success') {
        setSnackbar({
          open: true,
          message: 'Mission and vision saved successfully',
          severity: 'success',
        });
        setInitialData(data); // Update initial data to reflect changes
      } else {
        throw new Error(response?.message || 'Failed to save mission and vision');
      }
    } catch (error) {
      console.error('Error saving mission and vision:', error);
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : 'Failed to save mission and vision',
        severity: 'error',
      });
    }
  };

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
    <Box sx={{ backgroundColor: '#E3F2FD', minHeight: '100vh', p: 3 }}> {/* Light Blue background */}
      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom
        sx={{ color: '#0D47A1' }} // Dark Blue text
      >
        Mission & Vision Management
      </Typography>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          mb: 4,
          backgroundColor: 'white', // White background for the form area
          border: '1px solid #0D47A1' // Dark Blue border
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box mb={4}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Mission"
              variant="outlined"
              error={!!errors.mission}
              helperText={errors.mission?.message}
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
              {...register('mission')}
            />
            <CharacterCounter
              value={formValues.mission || ''}
              min={10}
              max={1000}
            />
          </Box>

          <Box mb={4}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Vision"
              variant="outlined"
              error={!!errors.vision}
              helperText={errors.vision?.message}
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
              {...register('vision')}
            />
            <CharacterCounter
              value={formValues.vision || ''}
              min={10}
              max={1000}
            />
          </Box>

          <Box mb={4}>
            <TextField
              fullWidth
              multiline
              rows={6}
              label="Core Values"
              variant="outlined"
              error={!!errors.coreValues}
              helperText={errors.coreValues?.message}
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
              {...register('coreValues')}
            />
            <CharacterCounter
              value={formValues.coreValues || ''}
              min={10}
              max={2000}
            />
          </Box>

          <Box mb={4}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Purpose"
              variant="outlined"
              error={!!errors.purpose}
              helperText={errors.purpose?.message}
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
              {...register('purpose')}
            />
            <CharacterCounter
              value={formValues.purpose || ''}
              min={10}
              max={1000}
            />
          </Box>

          <Box display="flex" justifyContent="flex-end" mt={4}>
            <Button
              type="submit"
              variant="contained"
              startIcon={<SaveIcon />}
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