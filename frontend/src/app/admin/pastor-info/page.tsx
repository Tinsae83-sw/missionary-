'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
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
  Grid,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import { getPastors, createOrUpdatePastor } from '../../../lib/api/pastors';
import { Pastor, PastorResponse } from '../../../types/pastor';

// Form validation schema
const pastorSchema = z.object({
  id: z.string().optional(),
  pastor_name: z
    .string()
    .min(2, 'Name is required')
    .max(100, 'Name should not exceed 100 characters'),
  pastor_title: z
    .string()
    .min(2, 'Title is required')
    .max(100, 'Title should not exceed 100 characters'),
  pastor_message: z
    .string()
    .min(10, 'Message should be at least 10 characters')
    .max(2000, 'Message should not exceed 2000 characters'),
  pastor_bio: z
    .string()
    .min(10, 'Bio should be at least 10 characters')
    .max(5000, 'Bio should not exceed 5000 characters'),
  pastor_photo_url: z.string().url('Please enter a valid URL').or(z.literal('')),
  pastor_email: z.string().email('Please enter a valid email').or(z.literal('')),
  pastor_phone: z.string().max(50, 'Phone number is too long').or(z.literal('')),
  is_active: z.boolean().default(true),
  display_order: z.number().int().min(0).default(0),
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

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function PastorInfoPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const [pastors, setPastors] = useState<Pastor[]>([]);
  const [selectedPastor, setSelectedPastor] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<PastorFormData>({
    resolver: zodResolver(pastorSchema),
    defaultValues: {
      pastor_name: '',
      pastor_title: '',
      pastor_message: '',
      pastor_bio: '',
      pastor_photo_url: '',
      pastor_email: '',
      pastor_phone: '',
      is_active: true,
      display_order: 0,
    },
  });

  const formValues = watch();

  // Fetch pastors data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getPastors();
        if (response.status === 'success' && response.data) {
          const pastorsData = Array.isArray(response.data) ? response.data : [response.data];
          setPastors(pastorsData);
          
          if (pastorsData.length > 0) {
            setSelectedPastor(pastorsData[0].id || null);
            reset(pastorsData[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching pastors:', error);
        setSnackbar({
          open: true,
          message: 'Failed to load pastors',
          severity: 'error',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [reset]);

  // Handle form submission
  const onSubmit = async (data: PastorFormData) => {
    try {
      const response = await createOrUpdatePastor(data);
      
      if (response.status === 'success' && response.data) {
        // Update the pastors list
        const updatedPastor = response.data;
        const updatedPastors = pastors.filter(p => p.id !== updatedPastor.id);
        setPastors([...updatedPastors, updatedPastor]);
        
        setSnackbar({
          open: true,
          message: data.id ? 'Pastor updated successfully' : 'Pastor added successfully',
          severity: 'success',
        });
        
        // Reset form with the new data
        reset(updatedPastor);
      } else {
        throw new Error(response.message || 'Failed to save pastor');
      }
    } catch (error) {
      console.error('Error saving pastor:', error);
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : 'Failed to save pastor information',
        severity: 'error',
      });
    }
  };

  // Handle pastor selection from the list
  const handlePastorSelect = (pastorId: string) => {
    const pastor = pastors.find(p => p.id === pastorId);
    if (pastor) {
      setSelectedPastor(pastorId);
      reset(pastor);
    }
  };

  // Handle adding a new pastor
  const handleAddNew = () => {
    setSelectedPastor(null);
    reset({
      pastor_name: '',
      pastor_title: '',
      pastor_message: '',
      pastor_bio: '',
      pastor_photo_url: '',
      pastor_email: '',
      pastor_phone: '',
      is_active: true,
      display_order: pastors.length > 0 ? Math.max(...pastors.map(p => p.display_order || 0)) + 1 : 0,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
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
        Manage Pastors
      </Typography>
      
      <Box display="flex" gap={3} mt={3}>
        {/* Pastors List */}
        <Paper 
          sx={{ 
            width: 300, 
            p: 2, 
            maxHeight: '70vh', 
            overflow: 'auto',
            backgroundColor: 'white', // White background
            border: '1px solid #0D47A1', // Dark Blue border
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography 
              variant="h6"
              sx={{ color: '#0D47A1' }} // Dark Blue text
            >
              Pastors
            </Typography>
            <Button 
              variant="contained" 
              size="small" 
              onClick={handleAddNew}
              sx={{
                backgroundColor: '#BBDEFB', // Light Blue Accent
                color: '#0D47A1', // Dark Blue text
                '&:hover': {
                  backgroundColor: '#90CAF9', // Slightly darker blue on hover
                },
              }}
            >
              Add New
            </Button>
          </Box>
          
          <Box>
            {pastors.map((pastor) => (
              <Paper 
                key={pastor.id}
                onClick={() => handlePastorSelect(pastor.id || '')}
                sx={{
                  p: 2,
                  mb: 1,
                  cursor: 'pointer',
                  backgroundColor: selectedPastor === pastor.id ? '#E3F2FD' : 'white', // Light Blue when selected
                  border: '1px solid #0D47A1', // Dark Blue border
                  '&:hover': {
                    backgroundColor: '#BBDEFB', // Light Blue Accent on hover
                  },
                }}
              >
                <Typography 
                  variant="subtitle1"
                  sx={{ color: '#0D47A1' }} // Dark Blue text
                >
                  {pastor.pastor_name}
                </Typography>
                <Typography 
                  variant="body2"
                  sx={{ color: '#0D47A1' }} // Dark Blue text
                >
                  {pastor.pastor_title}
                </Typography>
              </Paper>
            ))}
            
            {pastors.length === 0 && (
              <Typography 
                variant="body2" 
                textAlign="center" 
                py={2}
                sx={{ color: '#0D47A1' }} // Dark Blue text
              >
                No pastors found. Click "Add New" to create one.
              </Typography>
            )}
          </Box>
        </Paper>
        
        {/* Pastor Form */}
        <Paper 
          sx={{ 
            flex: 1, 
            p: 3,
            backgroundColor: 'white', // White background
            border: '1px solid #0D47A1', // Dark Blue border
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
                  <Avatar 
                    src={formValues.pastor_photo_url} 
                    sx={{ 
                      width: 200, 
                      height: 200, 
                      mb: 2,
                      border: '2px solid #0D47A1', // Dark Blue border
                    }}
                  />
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<CloudUploadIcon />}
                    sx={{ 
                      mb: 1,
                      color: '#0D47A1', // Dark Blue text
                      borderColor: '#0D47A1', // Dark Blue border
                      '&:hover': {
                        backgroundColor: '#E3F2FD', // Light Blue on hover
                        borderColor: '#0D47A1', // Dark Blue border
                      },
                    }}
                  >
                    Upload Photo
                    <VisuallyHiddenInput 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => {
                        // Handle file upload here
                        const file = e.target.files?.[0];
                        if (file) {
                          // In a real app, you would upload the file to a server
                          // and then set the URL in the form
                          const url = URL.createObjectURL(file);
                          setValue('pastor_photo_url', url, { shouldDirty: true });
                        }
                      }}
                    />
                  </Button>
                  {errors.pastor_photo_url && (
                    <Typography color="error" variant="caption">
                      {errors.pastor_photo_url.message}
                    </Typography>
                  )}
                </Box>
              </Grid>
              
              <Grid item xs={12} md={8}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      variant="outlined"
                      error={!!errors.pastor_name}
                      helperText={errors.pastor_name?.message}
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
                      {...register('pastor_name')}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Title"
                      variant="outlined"
                      error={!!errors.pastor_title}
                      helperText={errors.pastor_title?.message}
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
                      {...register('pastor_title')}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      variant="outlined"
                      type="email"
                      error={!!errors.pastor_email}
                      helperText={errors.pastor_email?.message}
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
                      {...register('pastor_email')}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Phone"
                      variant="outlined"
                      error={!!errors.pastor_phone}
                      helperText={errors.pastor_phone?.message}
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
                      {...register('pastor_phone')}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Brief Message"
                      variant="outlined"
                      error={!!errors.pastor_message}
                      helperText={errors.pastor_message?.message}
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
                      {...register('pastor_message')}
                    />
                    <CharacterCounter
                      value={formValues.pastor_message || ''}
                      min={10}
                      max={2000}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={6}
                      label="Biography"
                      variant="outlined"
                      error={!!errors.pastor_bio}
                      helperText={errors.pastor_bio?.message}
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
                      {...register('pastor_bio')}
                    />
                    <CharacterCounter
                      value={formValues.pastor_bio || ''}
                      min={10}
                      max={5000}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formValues.is_active}
                            onChange={(e) => setValue('is_active', e.target.checked, { shouldDirty: true })}
                            sx={{
                              color: '#0D47A1', // Dark Blue color
                              '&.Mui-checked': {
                                color: '#0D47A1', // Dark Blue when checked
                              },
                            }}
                          />
                        }
                        label="Active"
                        sx={{ color: '#0D47A1' }} // Dark Blue text
                      />
                      
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
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>

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