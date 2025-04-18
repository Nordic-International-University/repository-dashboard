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
import { Keyword } from '../../../../types/keyword/keyword.types'

interface KeywordTableProps {
  keywords?: Keyword[]
  onEdit?: (keyword: Keyword, id: string) => void
  setDeleteId: (id: string) => void
  setOpenDeleteModal: (open: boolean) => void
}

const KeywordTable = ({ keywords, onEdit, setDeleteId, setOpenDeleteModal }: KeywordTableProps) => {
  return (
    <div className="overflow-hidden rounded-xl shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40">
            <TableHead>Kalit so‘z</TableHead>
            <TableHead className="text-center">Amallar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {keywords?.length ? (
            keywords.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.value}</TableCell>
                <TableCell className="text-center">
                  <Button variant="ghost" size="icon" onClick={() => onEdit?.(item, item.id)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setDeleteId(item.id)
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
              <TableCell colSpan={2} className="text-muted-foreground py-4 text-center">
                Kalit so‘zlar topilmadi
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default KeywordTable
