'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Belief,
  getBeliefs,
  createBelief,
  updateBelief,
  deleteBelief,
  CoreValue,
  getCoreValues,
  createCoreValue,
  updateCoreValue,
  deleteCoreValue
} from '@/lib/api/churchApi';
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
  Tabs,
  Tab,
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
  Switch,
  FormControlLabel,
  Chip,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

// Types
const beliefSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  icon_class: z.string().optional(),
  display_order: z.number().min(0, 'Must be 0 or greater').default(0),
  is_published: z.boolean().default(true),
});

type TabPanelProps = {
  children?: React.ReactNode;
  index: number;
  value: number;
};

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function BeliefsCoreValuesPage() {
  const [tabValue, setTabValue] = useState(0);
  const [beliefs, setBeliefs] = useState<Belief[]>([]);
  const [coreValues, setCoreValues] = useState<CoreValue[]>([]);
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Belief | CoreValue | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const isBeliefsTab = tabValue === 0;
  const currentItems = isBeliefsTab ? beliefs : coreValues;
  const setCurrentItems = isBeliefsTab ? setBeliefs : setCoreValues;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Belief>({
    resolver: zodResolver(beliefSchema),
    defaultValues: {
      title: '',
      description: '',
      icon_class: 'fas fa-cross',
      display_order: 0,
      is_published: true,
    },
  });

  useEffect(() => {
    fetchBeliefs();
    fetchCoreValues();
  }, []);

  const fetchBeliefs = async () => {
    try {
      const data = await getBeliefs();
      setBeliefs(data);
    } catch (err) {
      console.error('Error fetching beliefs:', err);
      setError('Failed to load beliefs');
    }
  };

  const fetchCoreValues = async () => {
    try {
      const data = await getCoreValues();
      setCoreValues(data);
    } catch (err) {
      console.error('Error fetching core values:', err);
      setError('Failed to load core values');
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleOpen = (item: Belief | CoreValue | null = null) => {
    if (item) {
      setEditingItem(item);
      reset({
        ...item,
        display_order: item.display_order || 0,
      });
    } else {
      reset({
        title: '',
        description: '',
        icon_class: isBeliefsTab ? 'fas fa-cross' : 'fas fa-heart',
        display_order: 0,
        is_published: true,
      });
      setEditingItem(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingItem(null);
  };

  const onSubmit = async (data: Belief) => {
    try {
      setIsSubmitting(true);
      setError(null);

      if (isBeliefsTab) {
        if (editingItem?.id) {
          await updateBelief(editingItem.id, data);
          setSuccess('Belief updated successfully');
        } else {
          await createBelief(data);
          setSuccess('Belief added successfully');
        }
        fetchBeliefs();
      } else {
        if (editingItem?.id) {
          await updateCoreValue(editingItem.id, data);
          setSuccess('Core value updated successfully');
        } else {
          await createCoreValue(data);
          setSuccess('Core value added successfully');
        }
        fetchCoreValues();
      }

      setTimeout(() => setSuccess(null), 5000);
      handleClose();
    } catch (err) {
      console.error('Error saving item:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(`Are you sure you want to delete this ${isBeliefsTab ? 'belief' : 'core value'}?`)) {
      return;
    }

    try {
      if (isBeliefsTab) {
        await deleteBelief(id);
        fetchBeliefs();
      } else {
        await deleteCoreValue(id);
        fetchCoreValues();
      }

      setSuccess(`${isBeliefsTab ? 'Belief' : 'Core value'} deleted successfully`);
      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      console.error('Error deleting item:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      if (isBeliefsTab) {
        // For now, we'll update the local state directly since we don't have a toggle endpoint
        // In a real app, you would call an API endpoint here
        setBeliefs(prevItems =>
          prevItems.map(item =>
            item.id === id ? { ...item, is_published: !currentStatus } : item
          )
        );
        
        // Show success message
        setSuccess(
          `Belief ${!currentStatus ? 'published' : 'unpublished'} successfully`
        );
      } else {
        // TODO: Implement core values toggle publish when the API is ready
        setCoreValues(prevItems =>
          prevItems.map(item =>
            item.id === id ? { ...item, is_published: !currentStatus } : item
          )
        );
        
        // Show success message
        setSuccess(
          `Core value ${!currentStatus ? 'published' : 'unpublished'} successfully`
        );
      }
      
      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      console.error('Error toggling publish status:', err);
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
    <Box sx={{ backgroundColor: '#E3F2FD', color: '#0D47A1', minHeight: '100vh', p: 3 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="Beliefs and Core Values">
          <Tab label="Beliefs" />
          <Tab label="Core Values" />
        </Tabs>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">
          {isBeliefsTab ? 'Our Beliefs' : 'Core Values'}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
          sx={{ backgroundColor: '#BBDEFB', color: '#0D47A1', '&:hover': { backgroundColor: '#A6CFF6' } }}
        >
          Add {isBeliefsTab ? 'Belief' : 'Core Value'}
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

      <TabPanel value={tabValue} index={0}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Order</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {beliefs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No beliefs found. Add your first one!
                  </TableCell>
                </TableRow>
              ) : (
                beliefs
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.title}</TableCell>
                      <TableCell>
                        {item.description.length > 100
                          ? `${item.description.substring(0, 100)}...`
                          : item.description}
                      </TableCell>
                      <TableCell>
                        <Chip label={item.display_order || 0} size="small" />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={item.is_published ? 'Published' : 'Draft'}
                          color={item.is_published ? 'success' : 'default'}
                          size="small"
                        />
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
                        <FormControlLabel
                          control={
                            <Switch
                              checked={!!item.is_published}
                              onChange={() =>
                                item.id &&
                                handleTogglePublish(item.id, !!item.is_published)
                              }
                              color="primary"
                              size="small"
                            />
                          }
                          label=""
                          labelPlacement="start"
                        />
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={beliefs.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Order</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {coreValues.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No core values found. Add your first one!
                  </TableCell>
                </TableRow>
              ) : (
                coreValues
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.title}</TableCell>
                      <TableCell>
                        {item.description.length > 100
                          ? `${item.description.substring(0, 100)}...`
                          : item.description}
                      </TableCell>
                      <TableCell>
                        <Chip label={item.display_order || 0} size="small" />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={item.is_published ? 'Published' : 'Draft'}
                          color={item.is_published ? 'success' : 'default'}
                          size="small"
                        />
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
                        <FormControlLabel
                          control={
                            <Switch
                              checked={!!item.is_published}
                              onChange={() =>
                                item.id &&
                                handleTogglePublish(item.id, !!item.is_published)
                              }
                              color="primary"
                              size="small"
                            />
                          }
                          label=""
                          labelPlacement="start"
                        />
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={coreValues.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </TabPanel>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingItem
            ? `Edit ${isBeliefsTab ? 'Belief' : 'Core Value'}`
            : `Add New ${isBeliefsTab ? 'Belief' : 'Core Value'}`}
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
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
                      sx={{ mb: 2 }}
                    />
                  )}
                />

                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Description *
                      </Typography>
                      <TextareaAutosize
                        {...field}
                        minRows={4}
                        style={{
                          width: '100%',
                          padding: '8px',
                          border: `1px solid ${errors.description ? '#d32f2f' : '#0D47A1'}`,
                          borderRadius: '4px',
                          fontFamily: 'inherit',
                          fontSize: '0.875rem',
                          lineHeight: 1.5,
                        }}
                      />
                      {errors.description && (
                        <Typography color="error" variant="caption">
                          {errors.description.message}
                        </Typography>
                      )}
                    </Box>
                  )}
                />

                <Controller
                  name="icon_class"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Icon Class (e.g., fas fa-cross)"
                      fullWidth
                      sx={{ mt: 2 }}
                      helperText="Use Font Awesome or other icon library classes"
                    />
                  )}
                />

                <Controller
                  name="display_order"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Display Order"
                      type="number"
                      fullWidth
                      sx={{ mt: 2 }}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      error={!!errors.display_order}
                      helperText={errors.display_order?.message}
                    />
                  )}
                />

                <Controller
                  name="is_published"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Switch
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                          color="primary"
                        />
                      }
                      label="Published"
                      labelPlacement="start"
                      sx={{ mt: 2, display: 'block' }}
                    />
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
              disabled={isSubmitting}
              sx={{ backgroundColor: '#BBDEFB', color: '#0D47A1', '&:hover': { backgroundColor: '#A6CFF6' } }}
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
