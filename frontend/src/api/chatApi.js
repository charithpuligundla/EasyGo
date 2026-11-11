import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './axios';

export const useBookingChat = (bookingId) => {
  return useQuery({
    queryKey: ['chat', bookingId],
    queryFn: async () => {
      const { data } = await api.get(`/chats/booking/${bookingId}`);
      return data;
    },
    enabled: !!bookingId,
    refetchInterval: 5000,
  });
};

export const useSendChatMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bookingId, content }) => {
      const { data } = await api.post(`/chats/booking/${bookingId}/messages`, { content });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['chat', variables.bookingId] });
    },
  });
};
