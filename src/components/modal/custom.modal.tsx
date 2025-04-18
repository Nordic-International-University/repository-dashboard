'use client'

import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

interface DialogModalProps {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  children?: React.ReactNode
  footer?: React.ReactNode
  width?: string
  className?: string
  hideHeader?: boolean
}

export const DialogModal: React.FC<DialogModalProps> = ({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  width = 'max-w-xl',
  className,
  hideHeader = false,
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent forceMount={true} className={cn(width, className)}>
        {!hideHeader && (title || description) && (
          <DialogHeader>
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
        )}
        <div className="py-2">{children}</div>
        {footer && <div className="pt-4">{footer}</div>}
      </DialogContent>
    </Dialog>
  )
}
