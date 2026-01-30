import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/";

const axiosInstance = axios.create({
    baseURL: API_URL,
    timeout:5000,
    withCredentials: true,
    headers:{
        'Content-Type': "application/json",
        'Accept': "application/json",

    }
});

// Add request interceptor to include tokens
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If 401 error and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/'}/token/refresh/`,
          { refresh: refreshToken }
        );
        
        localStorage.setItem('access_token', response.data.access);
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
        originalRequest.headers['Authorization'] = `Bearer ${response.data.access}`;
        
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Token refresh failed, redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;