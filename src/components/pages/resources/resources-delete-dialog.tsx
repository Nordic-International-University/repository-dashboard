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
import { ResourceTypeDeleteDialogType } from '../../../../types/resources/rosurce.types'

export const ResourceTypeDeleteDialog = ({
  close,
  onDelete,
  id,
}: Omit<ResourceTypeDeleteDialogType, 'open'>) => {
  return (
    <AlertDialog open onOpenChange={close}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Resurs turini o‘chirish</AlertDialogTitle>
          <AlertDialogDescription>
            Ushbu resurs turini o‘chirmoqchimisiz? Bu amalni bekor qilib bo‘lmaydi.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={close}>Bekor qilish</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 text-white hover:bg-red-700"
            onClick={() => onDelete(id)}
          >
            Ha, o‘chirish
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
