'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  IconButton, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Chip,
  CircularProgress,
  Alert,
  Snackbar,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Event as EventIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { format, parseISO, isValid } from 'date-fns';
import { eventApi, EventData } from '../../../lib/api/eventApi';

type Event = EventData & {
  id: string;
  status: 'draft' | 'published' | 'cancelled';
  isPublished: boolean;
};

const statusMap = {
  draft: { label: 'Draft', color: 'default' },
  published: { label: 'Published', color: 'success' },
  cancelled: { label: 'Cancelled', color: 'error' },
};

// Helper function to safely format dates
const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return 'No date';
  
  try {
    const date = new Date(dateString);
    return isValid(date) ? format(date, 'PPp') : 'Invalid date';
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

export default function EventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await eventApi.getEvents();
        setEvents(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleDeleteEvent = async (eventId: string) => {
    try {
      setIsSubmitting(true);
      await eventApi.deleteEvent(eventId);
      setEvents(prev => prev.filter(e => e.id !== eventId));
      setSnackbar({ open: true, message: 'Event deleted successfully!', severity: 'success' });
    } catch (err) {
      console.error('Error deleting event:', err);
      setSnackbar({ open: true, message: 'Failed to delete event. Please try again.', severity: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => setSnackbar(prev => ({ ...prev, open: false }));

  const handleEditEvent = (event: Event) => router.push(`/admin/events/edit/${event.id}`);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => router.push('/admin/events/new')}
          sx={{ backgroundColor: '#BBDEFB', color: '#0D47A1', '&:hover': { backgroundColor: '#9fcaf4' } }}
        >
          Add Event
        </Button>
      </Box>
    );
  }

  return (
    <Box p={3} sx={{ color: '#0D47A1' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">Events</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => router.push('/admin/events/new')}
          disabled={loading}
          sx={{ backgroundColor: '#BBDEFB', color: '#0D47A1', '&:hover': { backgroundColor: '#9fcaf4' } }}
        >
          Add Event
        </Button>
      </Box>

      {events.length === 0 ? (
        <Card>
          <CardContent>
            <Box textAlign="center" py={4}>
              <EventIcon sx={{ color: '#0D47A1', fontSize: 60 }} />
              <Typography variant="h6" sx={{ color: '#0D47A1' }} gutterBottom>No events found</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => router.push('/admin/events/new')}
                sx={{ backgroundColor: '#BBDEFB', color: '#0D47A1', '&:hover': { backgroundColor: '#9fcaf4' } }}
              >
                Create your first event
              </Button>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ backgroundColor: '#BBDEFB', color: '#0D47A1', fontWeight: 600 }}>Title</TableCell>
                <TableCell sx={{ backgroundColor: '#BBDEFB', color: '#0D47A1', fontWeight: 600 }}>Date & Time</TableCell>
                <TableCell sx={{ backgroundColor: '#BBDEFB', color: '#0D47A1', fontWeight: 600 }}>Location</TableCell>
                <TableCell sx={{ backgroundColor: '#BBDEFB', color: '#0D47A1', fontWeight: 600 }}>Type</TableCell>
                <TableCell sx={{ backgroundColor: '#BBDEFB', color: '#0D47A1', fontWeight: 600 }}>Status</TableCell>
                <TableCell align="right" sx={{ backgroundColor: '#BBDEFB', color: '#0D47A1', fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>
                    <Typography variant="subtitle1">{event.title}</Typography>
                    <Typography variant="body2" color="textSecondary">{event.description?.substring(0, 60)}...</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{formatDate(event.startDate)}</Typography>
                    {event.endDate && <Typography variant="body2" color="textSecondary">to {formatDate(event.endDate)}</Typography>}
                  </TableCell>
                  <TableCell>{event.location}</TableCell>
                  <TableCell>{event.eventType}</TableCell>
                  <TableCell>
                    <Chip
                      label={statusMap[event.status || 'draft'].label}
                      size="small"
                      sx={event.status === 'draft' ? { backgroundColor: '#BBDEFB', color: '#0D47A1' } : undefined}
                      color={event.status === 'published' ? 'success' : event.status === 'cancelled' ? 'error' : undefined}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="View">
                      <IconButton size="small" onClick={() => router.push(`/events/${event.id}`)} sx={{ color: '#0D47A1' }}>
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton size="small" onClick={() => handleEditEvent(event)} sx={{ color: '#0D47A1' }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" color="error" onClick={() => handleDeleteEvent(event.id)} disabled={isSubmitting}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}