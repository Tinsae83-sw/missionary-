'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { toast } from 'sonner';
import { Loader2, Save } from 'lucide-react';
import { ChurchInfo } from '../../../types';
import { getChurchInfo, updateChurchInfo } from '../../../lib/api/churchApi';

const churchInfoSchema = z.object({
  name: z.string().min(1, 'Church name is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(1, 'ZIP code is required'),
  country: z.string().min(1, 'Country is required'),
  phone: z.string().min(1, 'Phone number is required'),
  email: z.string().email('Invalid email address'),
  website: z.string().url('Invalid URL').or(z.literal('')),
  logoUrl: z.string().url('Invalid URL').or(z.literal('')),
  facebookUrl: z.string().url('Invalid URL').or(z.literal('')),
  youtubeUrl: z.string().url('Invalid URL').or(z.literal('')),
  instagramUrl: z.string().url('Invalid URL').or(z.literal('')),
  twitterUrl: z.string().url('Invalid URL').or(z.literal('')),
  googleMapsEmbed: z.string().url('Invalid URL').or(z.literal('')),
});

type ChurchInfoFormValues = z.infer<typeof churchInfoSchema>;

export function ChurchInfoForm() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChurchInfoFormValues>({
    resolver: zodResolver(churchInfoSchema),
    defaultValues: {
      name: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA',
      phone: '',
      email: '',
      website: '',
      logoUrl: '',
      facebookUrl: '',
      youtubeUrl: '',
      instagramUrl: '',
      twitterUrl: '',
      googleMapsEmbed: '',
    },
  });

  useEffect(() => {
    const fetchChurchInfo = async () => {
      try {
        const data = await getChurchInfo();
        if (data) {
          reset(data);
        }
      } catch (error) {
        console.error('Error fetching church info:', error);
        toast.error('Failed to load church information');
      } finally {
        setIsLoading(false);
      }
    };

    fetchChurchInfo();
  }, [reset]);

  const onSubmit = async (data: ChurchInfoFormValues) => {
    try {
      setIsSaving(true);
      console.log('Submitting form data:', data);
      
      const response = await updateChurchInfo(data);
      console.log('Update response:', response);
      
      // Update the form with the returned data to ensure consistency
      if (response) {
        reset(response);
      }
      
      toast.success('Church information updated successfully');
    } catch (error) {
      console.error('Error updating church info:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update church information';
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl mx-auto about-theme">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6">Church Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Church Name *</label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Church Name" error={!!errors.name} className="input-brand" />
              )}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Phone *</label>
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Phone Number" error={!!errors.phone} className="input-brand" />
              )}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email *</label>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input type="email" {...field} placeholder="Email" error={!!errors.email} className="input-brand" />
              )}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Website</label>
            <Controller
              name="website"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="https://" error={!!errors.website} className="input-brand" />
              )}
            />
            {errors.website && (
              <p className="text-red-500 text-sm mt-1">{errors.website.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6">Address</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Street Address *</label>
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Street Address" error={!!errors.address} className="input-brand" />
              )}
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">City *</label>
            <Controller
              name="city"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="City" error={!!errors.city} className="input-brand" />
              )}
            />
            {errors.city && (
              <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">State/Province *</label>
            <Controller
              name="state"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="State/Province" error={!!errors.state} className="input-brand" />
              )}
            />
            {errors.state && (
              <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">ZIP/Postal Code *</label>
            <Controller
              name="zipCode"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="ZIP/Postal Code" error={!!errors.zipCode} className="input-brand" />
              )}
            />
            {errors.zipCode && (
              <p className="text-red-500 text-sm mt-1">{errors.zipCode.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Country *</label>
            <Controller
              name="country"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full px-3 py-2 rounded-md shadow-sm focus:outline-none input-brand"
                  style={{ borderColor: 'var(--brand-border)' }}
                >
                  <option value="USA">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="UK">United Kingdom</option>
                  <option value="Australia">Australia</option>
                  <option value="Other">Other</option>
                </select>
              )}
            />
            {errors.country && (
              <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6">Social Media</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Facebook URL</label>
            <Controller
              name="facebookUrl"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="https://facebook.com/yourchurch" error={!!errors.facebookUrl} className="input-brand" />
              )}
            />
            {errors.facebookUrl && (
              <p className="text-red-500 text-sm mt-1">{errors.facebookUrl.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Twitter URL</label>
            <Controller
              name="twitterUrl"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="https://twitter.com/yourchurch" error={!!errors.twitterUrl} className="input-brand" />
              )}
            />
            {errors.twitterUrl && (
              <p className="text-red-500 text-sm mt-1">{errors.twitterUrl.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Instagram URL</label>
            <Controller
              name="instagramUrl"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="https://instagram.com/yourchurch" error={!!errors.instagramUrl} className="input-brand" />
              )}
            />
            {errors.instagramUrl && (
              <p className="text-red-500 text-sm mt-1">{errors.instagramUrl.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">YouTube URL</label>
            <Controller
              name="youtubeUrl"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="https://youtube.com/yourchurch" error={!!errors.youtubeUrl} className="input-brand" />
              )}
            />
            {errors.youtubeUrl && (
              <p className="text-red-500 text-sm mt-1">{errors.youtubeUrl.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6">Other Settings</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Logo URL</label>
            <Controller
              name="logoUrl"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="https://example.com/logo.png" error={!!errors.logoUrl} className="input-brand" />
              )}
            />
            {errors.logoUrl && (
              <p className="text-red-500 text-sm mt-1">{errors.logoUrl.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Google Maps Embed URL</label>
            <Controller
              name="googleMapsEmbed"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  placeholder="Paste Google Maps embed URL here"
                  className="min-h-[100px] textarea-brand"
                  error={!!errors.googleMapsEmbed}
                />
              )}
            />
            {errors.googleMapsEmbed && (
              <p className="text-red-500 text-sm mt-1">{errors.googleMapsEmbed.message}</p>
            )}
            <p className="text-sm text-gray-500 mt-1">
              Get the embed URL from Google Maps by clicking "Share" and then "Embed a map"
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => reset()} className="button-brand">
          Reset
        </Button>
        <Button type="submit" disabled={isSaving} className="button-brand">
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
