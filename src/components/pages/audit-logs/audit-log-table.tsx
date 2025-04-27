'use client'

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
import { AuditLog } from '../../../../types/audit/audit.types'

interface AuditLogTableProps {
  logs?: AuditLog[]
  onEdit?: (log: AuditLog, id: string) => void
  setDeleteId: (id: string) => void
  setOpenDeleteModal: (open: boolean) => void
}

const AuditLogTable = ({ logs, onEdit, setDeleteId, setOpenDeleteModal }: AuditLogTableProps) => {
  return (
    <div className="overflow-hidden rounded-xl shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40">
            <TableHead>Foydalanuvchi</TableHead>
            <TableHead>Harakat</TableHead>
            <TableHead>Modul</TableHead>
            <TableHead>Vaqti</TableHead>
            <TableHead className="text-center">Amallar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs?.length ? (
            logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>{log.user?.name ?? 'Nomaʼlum'}</TableCell>
                <TableCell>{log.action}</TableCell>
                <TableCell>{log.module}</TableCell>
                <TableCell>{new Date(log.createdAt).toLocaleString()}</TableCell>
                <TableCell className="text-center">
                  <Button variant="ghost" size="icon" onClick={() => onEdit?.(log, log.id)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setDeleteId(log.id)
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
                Log yozuvlari topilmadi
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default AuditLogTable
