'use client'

import React, { useState, useEffect } from 'react'
import Image, { ImageProps } from 'next/image'

interface CustomImageProps extends Omit<ImageProps, 'src'> {
  filePath?: string
  fallbackSrc?: string
}

const CustomImage: React.FC<CustomImageProps> = ({
  filePath,
  fallbackSrc = '/default-image.jpg',
  alt = 'Image',
  ...props
}) => {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || ''
  const [imgSrc, setImgSrc] = useState<string>(fallbackSrc)

  useEffect(() => {
    if (filePath && !filePath.includes('undefined')) {
      setImgSrc(`${baseUrl}${filePath}`)
    } else {
      setImgSrc(fallbackSrc)
      console.warn('Invalid image filePath:', filePath)
    }
  }, [filePath, baseUrl, fallbackSrc])

  return <Image {...props} src={imgSrc} alt={alt} onError={() => setImgSrc(fallbackSrc)} />
}

export default CustomImage
