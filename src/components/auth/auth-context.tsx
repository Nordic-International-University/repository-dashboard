'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import Cookie from 'js-cookie'

type AuthContextType = {
  isAuthenticated: boolean
  setAuthenticated: (val: boolean) => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  setAuthenticated: () => {},
  loading: true,
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = Cookie.get('access_token')
    setIsAuthenticated(!!token)
    setLoading(false)
  }, [])

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setAuthenticated: setIsAuthenticated, loading }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
