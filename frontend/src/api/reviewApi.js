import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from './axios';

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reviewData) => {
      const { data } = await api.post('/reviews', reviewData);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['vehicle', variables.vehicleId] });
    },
  });
};
