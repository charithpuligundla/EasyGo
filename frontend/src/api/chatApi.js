import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './axios';

// Fetch all conversations for the user
export const useUserChats = () => {
  return useQuery({
    queryKey: ['userChats'],
    queryFn: async () => {
      const { data } = await api.get('/chats');
      return data;
    },
    refetchInterval: 6000,
  });
};

// Fetch specific chat by booking ID
export const useBookingChat = (bookingId) => {
  return useQuery({
    queryKey: ['chat', bookingId],
    queryFn: async () => {
      const { data } = await api.get(`/chats/booking/${bookingId}`);
      return data;
    },
    enabled: !!bookingId,
    refetchInterval: 3000,
  });
};

// Send message within booking chat
export const useSendChatMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bookingId, content }) => {
      const { data } = await api.post(`/chats/booking/${bookingId}/messages`, { content });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['chat', variables.bookingId] });
      queryClient.invalidateQueries({ queryKey: ['userChats'] });
    },
  });
};
