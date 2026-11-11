import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './axios';

// Fetch user's bookings
export const useMyBookings = () => {
  return useQuery({
    queryKey: ['myBookings'],
    queryFn: async () => {
      const { data } = await api.get('/bookings');
      return data;
    },
  });
};

export const useOwnerBookings = () => {
  return useQuery({
    queryKey: ['ownerBookings'],
    queryFn: async () => {
      const { data } = await api.get('/bookings/owner');
      return data;
    },
  });
};

// Create a new booking
export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingData) => {
      const { data } = await api.post('/bookings', bookingData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myBookings'] });
    },
  });
};

// Update a booking (For Owners/Admins to mark offline payment received)
export const useUpdateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updateData }) => {
      const { data } = await api.put(`/bookings/${id}`, updateData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myBookings'] });
      queryClient.invalidateQueries({ queryKey: ['ownerBookings'] });
    },
  });
};
