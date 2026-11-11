import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './axios';

// Fetch all vehicles (with optional filters)
export const useVehicles = (filters = {}) => {
  return useQuery({
    queryKey: ['vehicles', filters],
    queryFn: async () => {
      const params = new URLSearchParams(filters).toString();
      const { data } = await api.get(`/vehicles${params ? `?${params}` : ''}`);
      return data;
    },
  });
};

// Fetch single vehicle by ID
export const useVehicle = (id) => {
  return useQuery({
    queryKey: ['vehicle', id],
    queryFn: async () => {
      const { data } = await api.get(`/vehicles/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

// Create a new vehicle (for Owners/Orgs)
export const useCreateVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vehicleData) => {
      const { data } = await api.post('/vehicles', vehicleData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
};

export const useUpdateVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, vehicleData }) => {
      const { data } = await api.put(`/vehicles/${id}`, vehicleData);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['vehicles'] }),
  });
};

export const useDeleteVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const { data } = await api.delete(`/vehicles/${id}`);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['vehicles'] }),
  });
};
