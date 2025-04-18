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
import { SubjectDeleteDialogType } from '../../../../types/subject-types/subject.types'

export const SubjectDeleteDialog = ({
  close,
  onDelete,
  id,
}: Omit<SubjectDeleteDialogType, 'open'>) => {
  return (
    <AlertDialog open onOpenChange={close}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Fan o‘chirish</AlertDialogTitle>
          <AlertDialogDescription>
            Ushbu fan o‘chiriladi. Bu amalni bekor qilib bo‘lmaydi. Davom etasizmi?
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
