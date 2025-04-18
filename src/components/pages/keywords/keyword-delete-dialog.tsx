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
import { KeywordDeleteDialogType } from '../../../../types/keyword/keyword.types'

export const KeywordDeleteDialog = ({
  close,
  onDelete,
  id,
}: Omit<KeywordDeleteDialogType, 'open'>) => {
  return (
    <AlertDialog open onOpenChange={close}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Kalit so‘zni o‘chirish</AlertDialogTitle>
          <AlertDialogDescription>
            Ushbu kalit so‘zni o‘chirmoqchimisiz? Bu amalni bekor qilib bo‘lmaydi.
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
