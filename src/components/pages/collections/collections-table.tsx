import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Collection } from '@/../types/colecctions/collections.types'
import dayjs from 'dayjs'
import { Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CollectionsTableProps {
  collections?: Collection[]
  onEdit?: (collection: Collection, id: string) => void
  setDeleteId: (id: string) => void
  setOpenDeleteModal: (open: boolean) => void
}

const CollectionsTable = ({
  collections,
  onEdit,
  setDeleteId,
  setOpenDeleteModal,
}: CollectionsTableProps) => {
  const deleteCollection = (id: string) => {
    setDeleteId(id)
    setOpenDeleteModal(true)
  }

  return (
    <div className="overflow-hidden rounded-xl shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/50 transition-colors">
            <TableHead>Sarlavha</TableHead>
            <TableHead>Tavsif</TableHead>
            <TableHead>Yaratilgan sana</TableHead>
            <TableHead>Tahrirlangan sana</TableHead>
            <TableHead className="text-center">Amallar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {collections?.length ? (
            collections.map((item) => (
              <TableRow key={item.id} className="hover:bg-muted/20 transition-colors">
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell className="text-muted-foreground line-clamp-2">
                  {item.description}
                </TableCell>
                <TableCell>{dayjs(item.createdAt).format('DD-MM-YYYY')}</TableCell>
                <TableCell>{dayjs(item.updatedAt).format('DD-MM-YYYY')}</TableCell>
                <TableCell className="text-center">
                  <div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit && onEdit(item, item.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteCollection(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-muted-foreground py-6 text-center">
                Bo'lim mavjud emas
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default CollectionsTable
