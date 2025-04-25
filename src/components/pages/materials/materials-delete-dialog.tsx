'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface Props {
  open: boolean
  onClose: () => void
  onConfirm: () => void
}

export const ResourceDeleteDialog = ({ open, onClose, onConfirm }: Props) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Resursni o‘chirish</DialogTitle>
          <DialogDescription>Ushbu resursni o‘chirishni tasdiqlaysizmi?</DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Bekor qilish
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Ha, o‘chirish
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
