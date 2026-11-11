import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './axios';

export const useSupportTickets = () => {
  return useQuery({
    queryKey: ['supportTickets'],
    queryFn: async () => {
      const { data } = await api.get('/support');
      return data;
    },
  });
};

export const useCreateSupportTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.post('/support', payload);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['supportTickets'] }),
  });
};
