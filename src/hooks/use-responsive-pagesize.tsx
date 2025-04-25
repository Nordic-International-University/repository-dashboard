import { useEffect, useState } from 'react'

export const useResponsivePageSize = ({
  reservedHeight = 408,
  rowHeight = 60,
}: {
  reservedHeight?: number
  rowHeight?: number
} = {}) => {
  const [pageSize, setPageSize] = useState(10)

  useEffect(() => {
    const updatePageSize = () => {
      const height = window.innerHeight
      const available = height - reservedHeight
      const calculated = Math.floor(available / rowHeight)
      const clamped = Math.max(3, Math.min(calculated, 50))
      setPageSize(clamped)
    }

    updatePageSize()
    window.addEventListener('resize', updatePageSize)
    return () => window.removeEventListener('resize', updatePageSize)
  }, [reservedHeight, rowHeight])

  return pageSize
}
