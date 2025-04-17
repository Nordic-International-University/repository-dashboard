export interface AuthRequestBody {
  username: string
  password: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: User
}

export interface User {
  id: string
  username: string
  fullname: string
  bio: string | null
}
