import React from 'react'
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ChangeRequest } from '@/../types/change-request/change-request.types'
import { ChangeRequestStatus } from '@/../types/change-request/change-request.types'
import { Badge } from '@/components/ui/badge'
import dayjs from 'dayjs'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'

interface ChangeRequestViewProps {
  changeRequest: ChangeRequest
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

export const ChangeRequestViewModal = ({ changeRequest }: ChangeRequestViewProps) => {
  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center justify-between">
          <span>O'zgartirish so'rovi tafsilotlari</span>
          {getStatusBadge(changeRequest.status)}
        </DialogTitle>
      </DialogHeader>
      
      <ScrollArea className="h-[50vh] pr-4">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium">Asosiy ma'lumotlar</h4>
            <div className="mt-2 grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-muted-foreground">Identifikator</p>
                <p className="text-sm">{changeRequest.id}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Resurs ID</p>
                <p className="text-xs text-muted-foreground">Resurs ID</p>
                <p className="text-sm">{changeRequest.resourceId}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">So'rovchi ID</p>
                <p className="text-sm">{changeRequest.requesterId}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Yaratilgan sana</p>
                <p className="text-sm">{dayjs(changeRequest.createdAt).format('DD-MM-YYYY HH:mm')}</p>
              </div>
              {changeRequest.approverId && (
                <div>
                  <p className="text-xs text-muted-foreground">Tasdiqlovchi ID</p>
                  <p className="text-sm">{changeRequest.approverId}</p>
                </div>
              )}
              {changeRequest.updatedAt && (
                <div>
                  <p className="text-xs text-muted-foreground">O'zgartirilgan sana</p>
                  <p className="text-sm">{dayjs(changeRequest.updatedAt).format('DD-MM-YYYY HH:mm')}</p>
                </div>
              )}
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h4 className="text-sm font-medium">Izoh</h4>
            <p className="mt-1 text-sm whitespace-pre-wrap">{changeRequest.comment}</p>
          </div>
          
          <Separator />
          
          <div>
            <h4 className="text-sm font-medium">So'ralgan o'zgarishlar</h4>
            <div className="mt-2 rounded-md border p-3">
              <pre className="text-xs whitespace-pre-wrap overflow-auto">
                {JSON.stringify(changeRequest.changes, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </ScrollArea>
    </>
  )
}
