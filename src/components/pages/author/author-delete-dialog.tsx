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

interface AuthorDeleteDialogProps {
  close: () => void
  onDelete: (id: string) => void
  id: string
}

export const AuthorDeleteDialog = ({ close, onDelete, id }: AuthorDeleteDialogProps) => {
  return (
    <AlertDialog open onOpenChange={close}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Muallifni o‘chirish</AlertDialogTitle>
          <AlertDialogDescription>
            Ushbu muallifni o‘chirmoqchimisiz? Bu amalni bekor qilib bo‘lmaydi.
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
