// CollectionsDeleteDialog.tsx
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'
import { CollectionsDeleteDialogType } from '../../../../types/colecctions/collections.types'

export const CollectionsDeleteDialog = ({
  close,
  onDelete,
  id,
}: Omit<CollectionsDeleteDialogType, 'open'>) => {
  return (
    <AlertDialog open onOpenChange={close}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bo‘limni o‘chirish</AlertDialogTitle>
          <AlertDialogDescription>
            Siz ushbu bo‘limni o‘chirmoqchimisiz? Bu amalni bekor qilib bo‘lmaydi.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={close}>Yo‘q</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 text-white hover:bg-red-700"
            onClick={() => {
              onDelete(id)
            }}
          >
            Ha, o‘chirish
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
