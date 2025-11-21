import dataProviderSimpleRest from '@refinedev/simple-rest';
import axios from 'axios';

const API_URL = 'http://localhost:4000/api'; // Sửa port

const httpClient = axios.create();

httpClient.interceptors.request.use(config => {
  // SSR-safe: only access localStorage in browser
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const dataProvider = dataProviderSimpleRest(API_URL, httpClient);
