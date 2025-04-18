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

export interface AuthCredentials {
  username: string
  password: string
}

export interface AuthTokenResponse {
  accessToken: string
  refreshToken: string
  user: AuthUser
}

export interface RefreshTokenPayload {
  refreshToken: string
}

export interface AuthUser {
  id: string
  username: string
  fullname: string
  bio: string | null
  createdAt?: string
  updatedAt?: string
  role: {
    id: string
    name: string
  }
}
