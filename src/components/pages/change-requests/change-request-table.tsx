import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { ChangeRequest } from '@/../types/change-request/change-request.types'
import { ChangeRequestStatus } from '@/../types/change-request/change-request.types'
import dayjs from 'dayjs'
import { Eye, ThumbsUp, ThumbsDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface ChangeRequestTableProps {
  changeRequests?: ChangeRequest[]
  onView: (changeRequest: ChangeRequest) => void
  onApprove: (id: string) => void
  onReject: (id: string) => void
}

const getStatusBadge = (status: ChangeRequestStatus) => {
  switch (status) {
    case ChangeRequestStatus.PENDING:
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Kutilmoqda</Badge>
    case ChangeRequestStatus.APPROVED:
      return <Badge variant="outline" className="bg-green-100 text-green-800">Tasdiqlangan</Badge>
    case ChangeRequestStatus.REJECTED:
      return <Badge variant="outline" className="bg-red-100 text-red-800">Rad etilgan</Badge>
    default:
      return null
  }
}

const ChangeRequestTable = ({
  changeRequests,
  onView,
  onApprove,
  onReject,
}: ChangeRequestTableProps) => {
  return (
    <div className="w-full">
      {/* TABLE VIEW for desktop */}
      <div className="hidden overflow-hidden rounded-xl shadow-sm sm:block">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/50 transition-colors">
              <TableHead>ID</TableHead>
              <TableHead>Resurs ID</TableHead>
              <TableHead>Izoh</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Yaratilgan sana</TableHead>
              <TableHead className="text-center">Amallar</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {changeRequests?.length ? (
              changeRequests.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/20 transition-colors">
                  <TableCell>{item.id.substring(0, 8)}...</TableCell>
                  <TableCell>{item.resourceId.substring(0, 8)}...</TableCell>
                  <TableCell className="text-muted-foreground max-w-[200px] truncate">
                    {item.comment}
                  </TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell>{dayjs(item.createdAt).format('DD-MM-YYYY')}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onView(item)}
                        title="Ko'rish"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {item.status === ChangeRequestStatus.PENDING && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onApprove(item.id)}
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            title="Tasdiqlash"
                          >
                            <ThumbsUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onReject(item.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            title="Rad etish"
                          >
                            <ThumbsDown className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-muted-foreground py-6 text-center">
                  O'zgartirish so'rovlari mavjud emas
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* CARD VIEW for mobile */}
      <div className="space-y-4 sm:hidden">
        {changeRequests?.length ? (
          changeRequests.map((item) => (
            <div key={item.id} className="dark:bg-muted rounded-xl border bg-white p-4 shadow-sm">
              <div className="mb-2 flex justify-between">
                <div className="font-semibold">ID: {item.id.substring(0, 8)}...</div>
                <div>{getStatusBadge(item.status)}</div>
              </div>
              <div className="text-muted-foreground mb-1 text-sm">
                <strong>Resurs ID:</strong> {item.resourceId.substring(0, 8)}...
              </div>
              <div className="text-muted-foreground mb-1 text-sm">
                <strong>Izoh:</strong> {item.comment}
              </div>
              <div className="text-muted-foreground mb-3 text-xs">
                <strong>Yaratilgan:</strong> {dayjs(item.createdAt).format('DD-MM-YYYY')}
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => onView(item)}>
                  <Eye className="mr-1 h-4 w-4" />
                  Ko'rish
                </Button>
                {item.status === ChangeRequestStatus.PENDING && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onApprove(item.id)}
                      className="text-green-600 hover:bg-green-50 border-green-200"
                    >
                      <ThumbsUp className="mr-1 h-4 w-4" />
                      Tasdiqlash
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onReject(item.id)}
                      className="text-red-600 hover:bg-red-50 border-red-200"
                    >
                      <ThumbsDown className="mr-1 h-4 w-4" />
                      Rad etish
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-muted-foreground py-6 text-center">
            O'zgartirish so'rovlari mavjud emas
          </div>
        )}
      </div>
    </div>
  )
}

export default ChangeRequestTable
