import api from './api';

export const accountService = {
  getAll: async (keyword = '', role = '') => {
    const params = {};
    if (keyword) params.keyword = keyword;
    if (role !== '' && role !== null) params.role = role;
    const response = await api.get('/accounts', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/accounts/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/accounts', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/accounts/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/accounts/${id}`);
    return response.data;
  },

  updateProfile: async (id, data) => {
    const response = await api.put(`/accounts/${id}/profile`, data);
    return response.data;
  },
};

