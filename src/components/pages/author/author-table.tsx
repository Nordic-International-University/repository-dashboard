import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Edit, Trash2 } from 'lucide-react'
import { Author } from '../../../../types/author/author.types'

interface AuthorTableProps {
  authors?: Author[]
  onEdit?: (author: Author, id: string) => void
  setDeleteId: (id: string) => void
  setOpenDeleteModal: (open: boolean) => void
}

const AuthorTable = ({ authors, onEdit, setDeleteId, setOpenDeleteModal }: AuthorTableProps) => {
  return (
    <div className="overflow-hidden rounded-xl shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40">
            <TableHead>F.I.Sh.</TableHead>
            <TableHead>Institut</TableHead>
            <TableHead>Daraja</TableHead>
            <TableHead>Bo‘lim</TableHead>
            <TableHead className="text-center">Amallar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {authors?.length ? (
            authors.map((author) => (
              <TableRow key={author.id}>
                <TableCell>{author.fullname}</TableCell>
                <TableCell>{author.institution}</TableCell>
                <TableCell>{author.degree}</TableCell>
                <TableCell>{author.department}</TableCell>
                <TableCell className="space-x-1 text-center">
                  <Button variant="ghost" size="icon" onClick={() => onEdit?.(author, author.id)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setDeleteId(author.id)
                      setOpenDeleteModal(true)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-muted-foreground py-4 text-center">
                Mualliflar topilmadi
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default AuthorTable
