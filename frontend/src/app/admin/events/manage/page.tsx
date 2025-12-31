'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Toaster, toast } from 'react-hot-toast';
import { format } from 'date-fns';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Snackbar,
  Alert,
  Paper,
  CircularProgress,
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Event as EventIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
} from '@mui/icons-material';
import EventForm, { EventFormValues } from '../../../../components/admin/event/EventForm';

type Event = {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  location: string;
  eventType: string;
  isRecurring: boolean;
  recurringPattern?: string;
  isPublic: boolean;
  status: 'draft' | 'published' | 'cancelled';
  featuredImage?: string;
  maxAttendees?: number;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
};
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
};

export default function ManageEvents() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openForm, setOpenForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch events from API
  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events', {
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${session?.accessToken}`
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      
      const data: Event[] = await response.json();
      setEvents(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load events',
        severity: 'error',
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenForm = (event?: Event) => {
    if (event) {
      setEditingEvent(event);
    } else {
      setEditingEvent(null);
    }
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setEditingEvent(null);
  };

  const handleSaveEvent = async (eventData: any) => {
    setIsSubmitting(true);
    try {
      const method = editingEvent ? 'PUT' : 'POST';
      const url = editingEvent 
        ? `/api/events/${editingEvent.id}` 
        : '/api/events';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save event');
      }

      const result = await response.json();
      toast.success(`Event ${editingEvent ? 'updated' : 'created'} successfully!`);
      
      // Refresh the events list
      await fetchEvents();
      handleCloseForm();
      
    } catch (error: any) {
      console.error('Error saving event:', error);
      toast.error(error.message || 'An error occurred while saving the event');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (eventId: string) => {
    setEventToDelete(eventId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!eventToDelete) return;
    
    try {
      const response = await fetch(`/api/events/${eventToDelete}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete event');
      }

      // Update local state
      setEvents(events.filter(event => event.id !== eventToDelete));
      toast.success('Event deleted successfully');
    } catch (error: any) {
      console.error('Error deleting event:', error);
      toast.error(error.message || 'Failed to delete event');
    } finally {
      setDeleteDialogOpen(false);
      setEventToDelete(null);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'success';
      case 'draft':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <Box className="flex justify-center items-center h-64">
        <CircularProgress />
        <Typography className="ml-4">Loading events...</Typography>
      </Box>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Toaster position="top-right" />
      <Box className="flex justify-between items-center mb-6">
        <Typography variant="h4" component="h1" className="font-bold">
          Manage Events
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenForm()}
        >
          Add Event
        </Button>
      </Box>

      <Card className="mb-6">
        <CardContent>
          <Box className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
            <div className="relative w-full md:w-1/3">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search events..."
              />
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outlined"
                startIcon={<FilterListIcon />}
                className="whitespace-nowrap"
              >
                Filters
              </Button>
              <Button
                variant="outlined"
                className="whitespace-nowrap"
              >
                Export
              </Button>
            </div>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Date & Time</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {events.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" className="py-8">
                      <EventIcon className="text-gray-400 text-4xl mb-2" />
                      <Typography variant="body1" color="textSecondary">
                        No events found
                      </Typography>
                      <Button
                        variant="text"
                        color="primary"
                        className="mt-2"
                        onClick={() => handleOpenForm()}
                      >
                        Create your first event
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : (
                  events
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((event) => (
                      <TableRow key={event.id} hover>
                        <TableCell>
                          <Typography variant="subtitle2" className="font-medium">
                            {event.title}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {event.description.substring(0, 50)}...
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <div>{formatDate(event.startDate)}</div>
                          {event.endDate && (
                            <div className="text-sm text-gray-500">
                              to {formatDate(event.endDate)}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>{event.location}</TableCell>
                        <TableCell>
                          <Chip 
                            label={event.eventType} 
                            size="small" 
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                            color={getStatusColor(event.status) as any}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenForm(event)}
                            className="text-blue-500"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteClick(event.id)}
                            className="text-red-500"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          {events.length > 0 && (
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={events.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              className="mt-4"
            />
          )}
        </CardContent>
      </Card>

      {/* Event Form Dialog */}
      <Dialog 
        open={openForm} 
        onClose={handleCloseForm}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingEvent ? 'Edit Event' : 'Create New Event'}
        </DialogTitle>
        <DialogContent dividers>
          <EventForm 
            initialData={editingEvent || undefined}
            onSubmit={handleSaveEvent}
            isSubmitting={false}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this event? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
