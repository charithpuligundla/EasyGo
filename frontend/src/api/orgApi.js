import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './axios';

export const useMyOrganizations = () => {
  return useQuery({
    queryKey: ['myOrganizations'],
    queryFn: async () => {
      const { data } = await api.get('/organizations/my');
      return data;
    },
  });
};

export const useCreateOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orgData) => {
      const { data } = await api.post('/organizations', orgData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myOrganizations'] });
    },
  });
};
