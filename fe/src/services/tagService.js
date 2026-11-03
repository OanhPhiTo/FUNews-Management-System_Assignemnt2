import api from './api';

export const tagService = {
  getAll: async () => {
    const response = await api.get('/tags');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/tags/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/tags', data);
    return response.data;
  },
};

