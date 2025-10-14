import dataProviderSimpleRest from '@refinedev/simple-rest';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_ENDPOINT || 'http://localhost:4000/api';

const httpClient = axios.create();

httpClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const dataProvider = dataProviderSimpleRest(API_URL, httpClient);
