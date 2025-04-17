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
import { BiDotsVerticalRounded } from 'react-icons/bi'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Pencil, Trash2 } from 'lucide-react'

interface CollectionsTableProps {
  collections?: Collection[]
  onEdit?: (collection: Collection) => void
  onDelete?: (id: string) => void
}

const CollectionsTable = ({ collections, onEdit, onDelete }: CollectionsTableProps) => {
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
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="hover:bg-muted rounded-md p-1 transition">
                        <BiDotsVerticalRounded size={18} />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="text-green-600" onClick={() => onEdit?.(item)}>
                        <Pencil className="text-green-600" /> Tahrirlash
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete?.(item.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="text-red-600" /> O'chirish
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
