
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://34.151.224.213:4000/api'


export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  firstName: string
  lastName: string
  email: string
  phone?: string
  password: string
}

export interface User {
  id: string
  email: string
  name?: string
  phone?: string
}

export interface AuthResponse {
  access_token: string
  user: User
  expires_in?: string
  token_type?: string
}

export interface LoginResponse {
  message: string
  access_token: string
  user: User
  expires_in: string
  token_type: string
}

export interface RegisterResponse {
  message: string
  user: User
}

class AuthService {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE}/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || errorData.error?.message || 'Login failed')
    }

    const result: LoginResponse = await response.json()
    
    // Store token in localStorage
    if (result.access_token) {
      localStorage.setItem('access_token', result.access_token)
    }

    return {
      access_token: result.access_token,
      user: result.user,
      expires_in: result.expires_in,
      token_type: result.token_type,
    }
  }

  async register(data: RegisterRequest): Promise<RegisterResponse> {
    // Backend expects "name" field, combine firstName and lastName
    const response = await fetch(`${API_BASE}/v1/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        name: `${data.firstName} ${data.lastName}`.trim(),
        phone: data.phone,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || errorData.error?.message || 'Registration failed')
    }

    return response.json()
  }

  async getCurrentUser(): Promise<User> {
    const token = this.getToken()
    if (!token) {
      throw new Error('No authentication token found')
    }

    const response = await fetch(`${API_BASE}/v1/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || errorData.error?.message || 'Failed to get user profile')
    }

    const result = await response.json()
    return result.user
  }

  async logout(): Promise<void> {
    try {
      await fetch(`${API_BASE}/v1/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.getToken()}`,
        },
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('access_token')
    }
  }

  getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('access_token')
  }

  isAuthenticated(): boolean {
    return !!this.getToken()
  }
}

export const authService = new AuthService()
