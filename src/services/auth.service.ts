import { axiosInstance } from '@/services/base.axios'
import { AuthRequestBody, AuthResponse } from '../../types/auth/auth.types'

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
