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
import { AuditLog } from '../../../../types/audit/audit.types'

interface AuditLogTableProps {
  logs?: AuditLog[]
}

const AuditLogTable = ({ logs }: AuditLogTableProps) => {
  return (
    <div className="overflow-hidden rounded-xl shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40">
            <TableHead>Foydalanuvchi</TableHead>
            <TableHead>Harakat</TableHead>
            <TableHead>Modul</TableHead>
            <TableHead>Vaqti</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs?.length ? (
            logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>{log.user?.fullname ?? 'Nomaʼlum'}</TableCell>
                <TableCell>{log.action}</TableCell>
                <TableCell>{log.module}</TableCell>
                <TableCell>{new Date(log.createdAt).toLocaleString()}</TableCell>
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
