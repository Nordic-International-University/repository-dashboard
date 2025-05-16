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
import { Image } from 'antd'

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
    <div className="w-full">
      {/* TABLE VIEW for desktop */}
      <div className="hidden overflow-hidden rounded-xl shadow-sm sm:block">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/50 transition-colors">
              <TableHead>Rasm</TableHead>
              <TableHead>Sarlavha</TableHead>
              <TableHead>Tavsif</TableHead>
              <TableHead className="text-center">Material</TableHead>
              <TableHead>Yaratilgan sana</TableHead>
              <TableHead>Tahrirlangan sana</TableHead>
              <TableHead className="text-center">Amallar</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {collections?.length ? (
              collections.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/20 transition-colors">
                  <TableCell>
                    <Image
                      width={50}
                      height={50}
                      src={item?.coverImage?.url}
                      alt={item.title}
                      className="h-12 w-12 rounded-full border object-cover"
                    />
                  </TableCell>
                  <TableCell>{item.title}</TableCell>
                  <TableCell className="text-muted-foreground">{item.description}</TableCell>
                  <TableCell className="text-muted-foreground">{item.resourceCount}</TableCell>
                  <TableCell>{dayjs(item.createdAt).format('DD-MM-YYYY')}</TableCell>
                  <TableCell>{dayjs(item.updatedAt).format('DD-MM-YYYY')}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-1">
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
                <TableCell colSpan={6} className="text-muted-foreground py-6 text-center">
                  Bo'lim mavjud emas
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* CARD VIEW for mobile */}
      <div className="space-y-4 sm:hidden">
        {collections?.length ? (
          collections.map((item) => (
            <div key={item.id} className="dark:bg-muted rounded-xl border bg-white p-4 shadow-sm">
              <div className="mb-2 flex items-center gap-4">
                <Image
                  width={50}
                  height={50}
                  src={item?.coverImage?.url}
                  alt={item.title}
                  className="h-12 w-12 rounded-full border object-cover"
                />
                <div className="font-semibold">{item.title}</div>
              </div>
              <div className="text-muted-foreground mb-1 text-sm">{item.description}</div>
              <div className="text-muted-foreground mb-1 text-xs">
                <strong>Yaratilgan:</strong> {dayjs(item.createdAt).format('DD-MM-YYYY')}
              </div>
              <div className="text-muted-foreground mb-3 text-xs">
                <strong>O‘zgartirilgan:</strong> {dayjs(item.updatedAt).format('DD-MM-YYYY')}
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => onEdit && onEdit(item, item.id)}>
                  <Edit className="mr-1 h-4 w-4" />
                  Tahrirlash
                </Button>
                <Button variant="destructive" size="sm" onClick={() => deleteCollection(item.id)}>
                  <Trash2 className="mr-1 h-4 w-4" />
                  O‘chirish
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-muted-foreground py-6 text-center">Bo‘lim mavjud emas</div>
        )}
      </div>
    </div>
  )
}

export default CollectionsTable
