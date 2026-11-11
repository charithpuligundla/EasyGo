import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './axios';

export const useFavorites = () => {
  const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('token');

  return useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      const { data } = await api.get('/favorites');
      return data;
    },
    enabled: hasToken,
  });
};

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ vehicleId, isFavorite }) => {
      if (isFavorite) {
        await api.delete(`/favorites/${vehicleId}`);
      } else {
        await api.post(`/favorites/${vehicleId}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
};
