'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, CircularProgress, Button } from '@mui/material';
import EventForm from '@/components/admin/event/EventForm';
import { eventApi, EventData } from '@/lib/api/eventApi';

export default function ManageEventPage({ params }: { params: { id: string[] } }) {
  const router = useRouter();
  const eventId = params?.id?.[0];
  const isEditMode = !!eventId && eventId !== 'new';
  
  const [event, setEvent] = useState<Partial<EventData> | null>(null);
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState<string | null>(null);

  // Fetch event data if in edit mode
  useEffect(() => {
    if (!isEditMode) {
      setEvent({
        title: '',
        description: '',
        startDate: new Date(),
        endDate: undefined,
        location: '',
        eventType: '',
        isRecurring: false,
        recurringPattern: undefined,
        isPublic: true,
        status: 'draft',
        startTime: format(new Date(), 'HH:mm'),
        endTime: ''
      });
      setLoading(false);
      return;
    }

    const fetchEvent = async () => {
      try {
        const eventData = await eventApi.getEventById(eventId);
        // Transform the event data to match the form's expected format
        setEvent({
          ...eventData,
          startDate: new Date(eventData.startDate),
          endDate: eventData.endDate ? new Date(eventData.endDate) : undefined,
          startTime: eventData.startDate ? format(new Date(eventData.startDate), 'HH:mm') : '',
          endTime: eventData.endDate ? format(new Date(eventData.endDate), 'HH:mm') : '',
        });
      } catch (err) {
        console.error('Error fetching event:', err);
        setError('Failed to load event data');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId, isEditMode]);

  const handleSubmit = async (formData: any) => {
    try {
      setLoading(true);
      
      if (isEditMode && eventId) {
        await eventApi.updateEvent(eventId, formData);
      } else {
        await eventApi.createEvent(formData);
      }
      
      // Redirect to events list after successful submission
      router.push('/admin/events');
    } catch (err) {
      console.error('Error saving event:', err);
      setError('Failed to save event. Please try again.');
      setLoading(false);
    }
  };

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
        <Typography color="error" gutterBottom>{error}</Typography>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        {isEditMode ? 'Edit Event' : 'Create New Event'}
      </Typography>
      
      {event && (
        <EventForm
          initialData={event}
          onSubmit={handleSubmit}
          isSubmitting={loading}
          onCancel={() => router.push('/admin/events')}
          eventId={eventId}
        />
      )}
    </Box>
  );
}
