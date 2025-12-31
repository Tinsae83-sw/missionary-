'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Divider,
  Alert,
  TextareaAutosize,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Chip,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import ImageUpload from '../../../components/common/ImageUpload';

const historyItemSchema = z.object({
  id: z.string().optional(),
  year: z.number().min(1000, 'Please enter a valid year').max(2100, 'Please enter a valid year'),
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  image_url: z.string().optional(),
  display_order: z.number().min(0, 'Display order must be 0 or greater').default(0),
});

type HistoryItem = z.infer<typeof historyItemSchema>;

type FormData = {
  year: number;
  title: string;
  content: string;
  image_url: string;
  display_order: number;
};

export default function ChurchHistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<HistoryItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(historyItemSchema),
    defaultValues: {
      year: new Date().getFullYear(),
      title: '',
      content: '',
      image_url: '',
      display_order: 0,
    },
  });

  useEffect(() => {
    fetchHistoryItems();
  }, []);

  const fetchHistoryItems = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/church-history`);

      if (response.ok) {
        const data = await response.json();
        // Ensure we have an array of items
        const itemsArray = Array.isArray(data) ? data : [];
        setItems(itemsArray);
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch history items');
      }
    } catch (err) {
      console.error('Error fetching history items:', err);
      setError(err.message || 'Failed to load church history');
    }
  };

  const handleOpen = (item: HistoryItem | null = null) => {
    if (item) {
      setEditingItem(item);
      setValue('year', item.year);
      setValue('title', item.title);
      setValue('content', item.content);
      setValue('image_url', item.image_url || '');
      setValue('display_order', item.display_order || 0);
      setPreviewUrl(item.image_url || '');
    } else {
      reset({
        year: new Date().getFullYear(),
        title: '',
        content: '',
        image_url: '',
        display_order: 0,
      });
      setPreviewUrl('');
      setEditingItem(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingItem(null);
    setImageFile(null);
    setPreviewUrl('');
  };

  const handleImageUpload = (file: File) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
    // Set the image URL in the form
    setValue('image_url', URL.createObjectURL(file), { shouldValidate: true });
  };

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      setError('');

      let imageUrl = data.image_url;
      
      // Upload new image if selected
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        
        // Get token from localStorage if available
        const token = localStorage.getItem('token');
        const headers: Record<string, string> = {};
        
        // Only add Authorization header if token exists
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        try {
          const uploadResponse = await fetch('http://localhost:5000/api/upload', {
            method: 'POST',
            headers,
            credentials: 'include',
            body: formData,
          });
          
          if (!uploadResponse.ok) {
            const errorData = await uploadResponse.json().catch(() => ({}));
            throw new Error(errorData.message || 'Failed to upload image');
          }
          
          const responseData = await uploadResponse.json();
          imageUrl = responseData.url || responseData.path || responseData.location;
          
          if (!imageUrl) {
            throw new Error('No image URL returned from server');
          }
          
          // Use the full URL if the server returns a relative path
          if (!imageUrl.startsWith('http')) {
            imageUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
          }
        } catch (error) {
          console.error('Error uploading file:', error);
          throw new Error(`File upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      const historyItem: Partial<HistoryItem> = {
        year: data.year,
        title: data.title,
        content: data.content,
        display_order: data.display_order,
        ...(imageUrl && { image_url: imageUrl }), // Only include image_url if it exists
      };

      const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/church-history`;
      const method = editingItem ? 'PUT' : 'POST';
      const requestUrl = editingItem ? `${url}/${editingItem.id}` : url;

      const response = await fetch(requestUrl, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editingItem ? { ...data, id: editingItem.id } : data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to save history item');
      }

      setSuccess(editingItem ? 'History item updated successfully' : 'History item added successfully');
      setTimeout(() => setSuccess(null), 5000);
      
      fetchHistoryItems();
      handleClose();
    } catch (err) {
      console.error('Error saving history item:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this history item?')) {
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/church-history/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete history item');
      }

      setSuccess('History item deleted successfully');
      setTimeout(() => setSuccess(null), 5000);
      
      fetchHistoryItems();
    } catch (err) {
      console.error('Error deleting history item:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ color: '#0D47A1' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Church History</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
          sx={{ backgroundColor: '#BBDEFB', color: '#0D47A1', '&:hover': { backgroundColor: '#9fcaf4' } }}
        >
          Add History Item
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Year</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Content Preview</TableCell>
              <TableCell>Order</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No history items found. Add your first one!
                </TableCell>
              </TableRow>
            ) : (
              items
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.year}</TableCell>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>
                      {item.content.length > 100
                        ? `${item.content.substring(0, 100)}...`
                        : item.content}
                    </TableCell>
                    <TableCell>
                      <Chip label={item.display_order || 0} size="small" />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => handleOpen(item)}
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => item.id && handleDelete(item.id)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={items.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingItem ? 'Edit History Item' : 'Add New History Item'}
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Controller
                  name="year"
                  control={control}
                  render={({ field: { onChange, ...field } }) => (
                    <TextField
                      {...field}
                      label="Year"
                      type="number"
                      fullWidth
                      required
                      error={!!errors.year}
                      helperText={errors.year?.message}
                      sx={{ mb: 2, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#0D47A1' }, '&:hover fieldset': { borderColor: '#0D47A1' }, '&.Mui-focused fieldset': { borderColor: '#0D47A1' } } }}
                      onChange={(e) => onChange(parseInt(e.target.value) || 0)}
                      inputProps={{ min: 1000, max: 2100 }}
                    />
                  )}
                />

                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Title"
                      fullWidth
                      required
                      error={!!errors.title}
                      helperText={errors.title?.message}
                      sx={{ mb: 2, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#0D47A1' }, '&:hover fieldset': { borderColor: '#0D47A1' }, '&.Mui-focused fieldset': { borderColor: '#0D47A1' } } }}
                    />
                  )}
                />

                <Controller
                  name="display_order"
                  control={control}
                  render={({ field: { onChange, ...field } }) => (
                    <TextField
                      {...field}
                      label="Display Order"
                      type="number"
                      fullWidth
                      error={!!errors.display_order}
                      helperText={errors.display_order?.message}
                      sx={{ mb: 2, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#0D47A1' }, '&:hover fieldset': { borderColor: '#0D47A1' }, '&.Mui-focused fieldset': { borderColor: '#0D47A1' } } }}
                      onChange={(e) => onChange(parseInt(e.target.value) || 0)}
                      inputProps={{ min: 0 }}
                    />
                  )}
                />

                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Image
                  </Typography>
                  <ImageUpload
                    label="Upload History Image"
                    previewUrl={previewUrl}
                    onFileSelect={handleImageUpload}
                    aspectRatio={16/9}
                  />
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="content"
                  control={control}
                  render={({ field }) => (
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Content *
                      </Typography>
                      <TextareaAutosize
                        {...field}
                        minRows={12}
                        style={{
                          width: '100%',
                          padding: '8px',
                          border: `1px solid ${errors.content ? '#d32f2f' : '#0D47A1'}`,
                          borderRadius: '4px',
                          fontFamily: 'inherit',
                          fontSize: '0.875rem',
                          lineHeight: 1.5,
                        }}
                        className="textarea-brand"
                      />
                      {errors.content && (
                        <Typography color="error" variant="caption">
                          {errors.content.message}
                        </Typography>
                      )}
                    </Box>
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
