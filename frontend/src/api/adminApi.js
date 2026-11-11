import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './axios';

export const useAdminStats = () => {
  return useQuery({
    queryKey: ['adminStats'],
    queryFn: async () => {
      const { data } = await api.get('/admin/stats');
      return data;
    },
  });
};

export const useAdminBookings = () => {
  return useQuery({
    queryKey: ['adminBookings'],
    queryFn: async () => {
      const { data } = await api.get('/admin/bookings');
      return data;
    },
  });
};

export const useAdminUsers = () => {
  return useQuery({
    queryKey: ['adminUsers'],
    queryFn: async () => {
      const { data } = await api.get('/admin/users');
      return data;
    },
  });
};

export const useAdminVehicles = () => {
  return useQuery({
    queryKey: ['adminVehicles'],
    queryFn: async () => {
      const { data } = await api.get('/admin/vehicles');
      return data;
    },
  });
};

export const useAdminDeleteVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const { data } = await api.delete(`/admin/vehicles/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminVehicles'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
};

export const useAdminOrganizations = () => {
  return useQuery({
    queryKey: ['adminOrganizations'],
    queryFn: async () => {
      const { data } = await api.get('/admin/organizations');
      return data;
    },
  });
};

export const usePendingOrganizations = () => {
  return useQuery({
    queryKey: ['adminPendingOrgs'],
    queryFn: async () => {
      const { data } = await api.get('/admin/organizations/pending');
      return data;
    },
  });
};

export const useVerifyOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const { data } = await api.put(`/admin/organizations/${id}/verify`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPendingOrgs'] });
      queryClient.invalidateQueries({ queryKey: ['adminOrganizations'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
    },
  });
};
