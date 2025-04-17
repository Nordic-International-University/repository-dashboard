'use client'

import React from 'react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

// @ts-ignore
interface InputWithIconProps extends React.InputHTMLAttributes<HTMLInputElement> {
  prefix?: React.ReactNode
}

export const InputWithIcon = ({ prefix, className, ...props }: InputWithIconProps) => {
  return (
    <div className="relative">
      {prefix && (
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          {prefix}
        </div>
      )}
      <Input className={cn(prefix && 'pl-10', className)} {...props} />
    </div>
  )
}
