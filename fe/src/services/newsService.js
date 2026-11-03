import api from './api';

export const newsService = {
  // Public endpoints
  getPublicNews: async (keyword = '', categoryId = '') => {
    const params = {};
    if (keyword) params.keyword = keyword;
    if (categoryId) params.categoryId = categoryId;
    const response = await api.get('/public/news', { params });
    return response.data;
  },

  getPublicById: async (id) => {
    const response = await api.get(`/public/news/${id}`);
    return response.data;
  },

  getPublicCategories: async () => {
    const response = await api.get('/public/categories');
    return response.data;
  },

  // Management endpoints
  getAll: async (keyword = '', categoryId = '', status = '') => {
    const params = {};
    if (keyword) params.keyword = keyword;
    if (categoryId) params.categoryId = categoryId;
    if (status !== '' && status !== null) params.status = status;
    const response = await api.get('/news-articles', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/news-articles/${id}`);
    return response.data;
  },

  getMyHistory: async (staffId) => {
    const response = await api.get(`/news-articles/history/${staffId}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/news-articles', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/news-articles/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/news-articles/${id}`);
    return response.data;
  },
};

