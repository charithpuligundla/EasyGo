import { useQuery } from '@tanstack/react-query';
import api from './axios';

export const useWalletHistory = () => {
  return useQuery({
    queryKey: ['wallet'],
    queryFn: async () => {
      const { data } = await api.get('/wallet');
      return data;
    },
  });
};
