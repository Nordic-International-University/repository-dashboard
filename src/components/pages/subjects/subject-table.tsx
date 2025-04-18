import React from 'react'
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
import dayjs from 'dayjs'
import { Subject } from '../../../../types/subject-types/subject.types'

interface SubjectTableProps {
  subjects?: Subject[]
  onEdit?: (subject: Subject, id: string) => void
  setDeleteId: (id: string) => void
  setOpenDeleteModal: (open: boolean) => void
}

const SubjectTable = ({ subjects, onEdit, setDeleteId, setOpenDeleteModal }: SubjectTableProps) => {
  const handleDelete = (id: string) => {
    setDeleteId(id)
    setOpenDeleteModal(true)
  }

  console.log(subjects)
  return (
    <div className="overflow-hidden rounded-xl shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/50 transition-colors">
            <TableHead>Nomi</TableHead>
            <TableHead>Kategoriya ID</TableHead>
            <TableHead>Yaratilgan sana</TableHead>
            <TableHead>Tahrirlangan sana</TableHead>
            <TableHead className="text-center">Amallar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subjects?.length ? (
            subjects.map((item) => (
              <TableRow key={item.id} className="hover:bg-muted/20 transition-colors">
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.categoryId}</TableCell>
                <TableCell>{dayjs(item.createdAt).format('DD-MM-YYYY')}</TableCell>
                <TableCell>{dayjs(item.updatedAt).format('DD-MM-YYYY')}</TableCell>
                <TableCell className="text-center">
                  <Button variant="ghost" size="icon" onClick={() => onEdit?.(item, item.id)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-muted-foreground py-6 text-center">
                Fanlar topilmadi
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default SubjectTable
