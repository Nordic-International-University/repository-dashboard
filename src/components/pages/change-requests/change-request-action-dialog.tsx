import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog'
import { Textarea } from '@/components/ui/textarea'
import { ChangeRequestActionDialogProps } from '@/../types/change-request/change-request.types'
import { ChangeRequestStatus } from '@/../types/change-request/change-request.types'
import { useState } from 'react'

export const ChangeRequestActionDialog = ({
  close,
  onAction,
  id,
  action,
}: ChangeRequestActionDialogProps) => {
  const [comment, setComment] = useState('')
  
  const handleAction = () => {
    const status = action === 'approve' 
      ? ChangeRequestStatus.APPROVED 
      : ChangeRequestStatus.REJECTED
    
    onAction(id, status, comment)
    close()
  }
  
  const title = action === 'approve' ? 'So\'rovni tasdiqlash' : 'So\'rovni rad etish'
  const description = action === 'approve' 
    ? 'Siz ushbu o\'zgartirish so\'rovini tasdiqlamoqchimisiz?'
    : 'Siz ushbu o\'zgartirish so\'rovini rad etmoqchimisiz?'
  
  const actionButtonClass = action === 'approve'
    ? 'bg-green-600 text-white hover:bg-green-700'
    : 'bg-red-600 text-white hover:bg-red-700'
  
  const actionButtonText = action === 'approve' ? 'Tasdiqlash' : 'Rad etish'

  return (
    <AlertDialog open onOpenChange={close}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="py-2">
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Izoh qoldiring (ixtiyoriy)"
            className="w-full"
          />
        </div>
        
        <AlertDialogFooter>
          <AlertDialogCancel onClick={close}>Bekor qilish</AlertDialogCancel>
          <AlertDialogAction
            className={actionButtonClass}
            onClick={handleAction}
          >
            {actionButtonText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
