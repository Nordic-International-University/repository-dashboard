'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from '@/components/auth/auth-context'

export const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()
  const { isAuthenticated, loading } = useAuth()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/signin')
    }
  }, [isAuthenticated, loading, router])

  if (loading) return null

  return <>{children}</>
}
