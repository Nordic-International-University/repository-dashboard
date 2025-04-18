import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Category } from '../../../../types/category/category.types'
import { CategoryForm } from '@/components/pages/categories/categories-form'

interface CategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: Category
  mode: 'create' | 'edit'
}

export function CategoryDialog({ open, onOpenChange, category, mode }: CategoryDialogProps) {
  const title = mode === 'create' ? 'Create Category' : 'Edit Category'
  const description =
      mode === 'create'
          ? 'Add a new category to your collection.'
          : 'Update the details of this category.'

  return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <CategoryForm initialData={category} onSuccess={() => onOpenChange(false)} />
        </DialogContent>
      </Dialog>
  )
}
