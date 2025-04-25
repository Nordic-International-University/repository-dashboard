import { CheckCircle2, Hourglass, Ban, Pencil, Archive, Trash2, CircleAlert } from 'lucide-react'

export const getStatusBadge = (status: string) => {
  switch (status.toUpperCase()) {
    case 'APPROVED':
      return {
        color: 'bg-green-100 text-green-800',
        icon: <CheckCircle2 className="mr-1 h-4 w-4" />,
        label: 'Tasdiqlangan',
      }
    case 'PENDING':
      return {
        color: 'bg-yellow-100 text-yellow-800',
        icon: <Hourglass className="mr-1 h-4 w-4" />,
        label: 'Kutilmoqda',
      }
    case 'REJECTED':
      return {
        color: 'bg-red-100 text-red-800',
        icon: <Ban className="mr-1 h-4 w-4" />,
        label: 'Rad etilgan',
      }
    case 'REVISION':
      return {
        color: 'bg-blue-100 text-blue-800',
        icon: <Pencil className="mr-1 h-4 w-4" />,
        label: 'Tahrir talab etiladi',
      }
    case 'ARCHIVED':
      return {
        color: 'bg-gray-100 text-gray-800',
        icon: <Archive className="mr-1 h-4 w-4" />,
        label: 'Arxivlangan',
      }
    case 'DELETED':
      return {
        color: 'bg-muted text-muted-foreground',
        icon: <Trash2 className="mr-1 h-4 w-4" />,
        label: 'O‘chirilgan',
      }
    default:
      return {
        color: 'bg-gray-200 text-gray-800',
        icon: <CircleAlert className="mr-1 h-4 w-4" />,
        label: status,
      }
  }
}
