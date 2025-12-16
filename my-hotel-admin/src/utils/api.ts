import { TOKEN_KEY } from '../authProvider';

export const API_BASE_URL = import.meta.env.VITE_API_URL;

export interface ApiError {
  message: string;
  statusCode?: number;
  error?: string;
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem(TOKEN_KEY);
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error: ApiError = await response.json().catch(() => ({
      message: 'An error occurred',
      statusCode: response.status,
    }));
    throw error;
  }

  return response.json();
}

export async function loginApi(email: string, password: string) {
  console
  return apiRequest<{ access_token: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function getCurrentUser() {
  return apiRequest<any>('/auth/me');
}

export async function refreshTokenApi() {
  return apiRequest<{ access_token: string }>('/auth/refresh', {
    method: 'POST',
  });
}
