'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { Document } from '../../../../types/documents/document.types'

interface Props {
  documents?: Document[]
  onDelete: (document: Document) => void
}

export const DocumentTable = ({ documents, onDelete }: Props) => {
  return (
    <div className="overflow-x-auto rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nomi</TableHead>
            <TableHead>Turi</TableHead>
            <TableHead>Hajmi</TableHead>
            <TableHead>URL</TableHead>
            <TableHead className="text-center">Amal</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents?.map((doc) => (
            <TableRow key={doc.id}>
              <TableCell>{doc.filename}</TableCell>
              <TableCell>{doc.mimetype}</TableCell>
              <TableCell>{(doc.size / 1024).toFixed(2)} KB</TableCell>
              <TableCell>
                <a href={doc.url} target="_blank" className="text-blue-500 underline">
                  Ko‘rish
                </a>
              </TableCell>
              <TableCell className="text-center">
                <Button variant="ghost" size="icon" onClick={() => onDelete(doc)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {!documents?.length && (
            <TableRow>
              <TableCell colSpan={5} className="text-muted-foreground py-6 text-center">
                Fayl topilmadi
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
