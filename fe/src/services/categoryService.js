import api from './api';

export const categoryService = {
  getAll: async (keyword = '', isActive = null) => {
    const params = {};
    if (keyword) params.keyword = keyword;
    if (isActive !== null && isActive !== '') params.isActive = isActive;
    const response = await api.get('/categories', { params });
    return response.data;
  },

  getActive: async () => {
    const response = await api.get('/categories/active');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/categories', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/categories/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
};

