import { axiosInstance } from '@/services/base.axios'
import { AuthResponse, AuthUser, RefreshTokenPayload } from '../../types/auth/auth.types'

interface LoginPayload {
  username: string
  password: string
}

export const authLogin = async (data: LoginPayload): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.post<AuthResponse>('/auth/login', data)
    return response.data
  } catch (e) {
    console.error('Login xatoligi:', e)
    throw e
  }
}

export const authService = {
  refreshToken: async (payload: RefreshTokenPayload): Promise<{ accessToken: string }> => {
    const { data } = await axiosInstance.post('/api/v1/auth/refresh-token', payload)
    return data
  },

  getProfile: async (): Promise<AuthUser> => {
    const { data } = await axiosInstance.get('/auth/profile')
    return data
  },

  updateProfile: async (payload: Partial<AuthUser>): Promise<void> => {
    await axiosInstance.put('/api/v1/auth/profile', payload)
  },
}
