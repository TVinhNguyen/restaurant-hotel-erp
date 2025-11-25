import { AuthProvider } from '@refinedev/core';

const API_URL = 'http://localhost:4000/api'; // Backend URL

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const data = await response.json();
        // SSR-safe: only access localStorage in browser
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', data.access_token);
          localStorage.setItem('user', JSON.stringify(data.user));
        }

        return {
          success: true,
          redirectTo: '/'
        };
      } else {
        const error = await response.json();
        return {
          success: false,
          error: {
            message: error.message || 'Login failed',
            name: 'Invalid credentials'
          }
        };
      }
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Network error',
          name: 'Connection failed'
        }
      };
    }
  },

  logout: async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return {
      success: true,
      redirectTo: '/login'
    };
  },

  check: async () => {
    if (typeof window === 'undefined') {
      return { authenticated: false };
    }
    
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    console.log('[Auth Check] Token exists:', !!token, 'User exists:', !!user);
    
    if (!token) {
      console.log('[Auth Check] No token - redirecting to login');
      return {
        authenticated: false,
        redirectTo: '/login'
      };
    }
    
    console.log('[Auth Check] Token found - user authenticated');
    return { authenticated: true };

    // Kiểm tra token còn hợp lệ không
    // try {
    //   const response = await fetch(`${API_URL}/auth/login`, {
    //     headers: {
    //       Authorization: `Bearer ${token}`
    //     }
    //   });

    //   if (response.ok) {
    //     return { authenticated: true };
    //   } else {
    //     localStorage.removeItem('token');
    //     localStorage.removeItem('user');
    //     return {
    //       authenticated: false,
    //       redirectTo: '/login'
    //     };
    //   }
    // } catch {
    //   return {
    //     authenticated: false,
    //     redirectTo: '/login'
    //   };
    // }
  },

  getIdentity: async () => {
    if (typeof window === 'undefined') {
      return null;
    }
    
    const user = localStorage.getItem('user');
    if (user) {
      return JSON.parse(user);
    }
    return null;
  },

  onError: async error => {
    console.log('Auth onError:', error);
    if (error?.status === 401 || error?.response?.status === 401) {
      console.log('401 error - logging out');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return { logout: true };
    }
    return {};
  }
};
