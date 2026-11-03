import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor to add user ID header from localStorage if available
api.interceptors.request.use(
  (config) => {
    const userJson = localStorage.getItem('funews_user');
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        if (user && user.accountID) {
          config.headers['X-User-Id'] = user.accountID;
        }
      } catch (e) {
        // ignore parse error
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

