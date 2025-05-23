'use client'

import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import CustomPagination from '@/components/pagination/CustomPagination'
import ChangeRequestTable from '@/components/pages/change-requests/change-request-table'
import React, { useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import {
  ChangeRequest,
  ChangeRequestStatus,
} from '../../../../../../types/change-request/change-request.types'
import {
  useChangeRequestsQuery,
  useUpdateChangeRequestMutation,
} from '@/hooks/use-change-requests'
import { ChangeRequestActionDialog } from '@/components/pages/change-requests/change-request-action-dialog'
import { useResponsivePageSize } from '@/hooks/use-responsive-pagesize'
import { Input } from '@/components/ui/input'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { Select } from 'antd'
import ResourceChanges from "@/components/pages/change-requests/resource-details";
import ResourceDetails from "@/components/pages/change-requests/resource-changes";

const Page = () => {
  const [pageNumber, setPageNumber] = useState<number>(1)
  const pageSize = useResponsivePageSize({ reservedHeight: 400, rowHeight: 50 })
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState<string>('')
  const [selectedStatus, setSelectedStatus] = useState<string>('')
  const [viewModalOpen, setViewModalOpen] = useState<boolean>(false)
  const [approveModalOpen, setApproveModalOpen] = useState<boolean>(false)
  const [rejectModalOpen, setRejectModalOpen] = useState<boolean>(false)
  const [selectedId, setSelectedId] = useState<string>('')
  const [selectedRequest, setSelectedRequest] = useState<ChangeRequest | null>(null)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    setTimeout(() => {
      setDebouncedSearch(e.target.value)
      setPageNumber(1)
    }, 500)
  }

  const { data: changeRequests, refetch } = useChangeRequestsQuery({
    pageNumber,
    pageSize,
    search: debouncedSearch,
    status: selectedStatus as ChangeRequestStatus || undefined,
  })

  const updateChangeRequestMutation = useUpdateChangeRequestMutation(refetch)

  const handleViewRequest = (request: ChangeRequest) => {
    setSelectedRequest(request)
    setViewModalOpen(true)
  }


  const handleApproveRequest = (id: string) => {
    setSelectedId(id)
    setApproveModalOpen(true)
  }

  const handleRejectRequest = (id: string) => {
    setSelectedId(id)
    setRejectModalOpen(true)
  }

  const handleAction = (id: string, status: ChangeRequestStatus, comment?: string) => {
    updateChangeRequestMutation.mutate({
      id,
      payload: {
        status,
        comment: comment || undefined,
      },
    })
  }



  return (
      <div>
        <PageBreadcrumb pageTitle="O'zgartirish so'rovlari" />
        <div className="mb-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Input
                placeholder="Qidirish..."
                value={search}
                onChange={handleSearchChange}
                className="w-full sm:w-64"
            />
            <Select
                value={selectedStatus}
                onChange={(value) => {
                  setSelectedStatus(value)
                  setPageNumber(1)
                }}
                placeholder="Barcha statuslar"
                style={{ width: '100%' }}
                className="w-full sm:w-48"
            >
              <Select.Option value="">Barcha statuslar</Select.Option>
              <Select.Option value={ChangeRequestStatus.PENDING}>Kutilmoqda</Select.Option>
              <Select.Option value={ChangeRequestStatus.APPROVED}>Tasdiqlangan</Select.Option>
              <Select.Option value={ChangeRequestStatus.REJECTED}>Rad etilgan</Select.Option>
            </Select>
          </div>
        </div>
        <div className="rounded-md border-1 px-2 py-2">
          <ChangeRequestTable
              changeRequests={changeRequests?.data}
              onView={handleViewRequest}
              onApprove={handleApproveRequest}
              onReject={handleRejectRequest}
          />
        </div>
        <CustomPagination
            onPageChange={setPageNumber}
            totalPages={changeRequests?.pageCount || 1}
            currentPage={pageNumber}
            position="right"
        />
        <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
          <DialogContent className="min-w-[1000px]">
            <ResizablePanelGroup direction="horizontal">
              <ResizablePanel defaultSize={50}>
                <div className="p-4 h-full">
                  <h2 className="text-lg font-semibold">Eski Holat</h2>
                  <div className="space-y-4 h-full">
                    <p className="text-sm text-gray-600">
                      Ushbu qismda resursning hozirgi holati ko'rsatiladi.
                    </p>
                    {selectedRequest?.resource ? (
                        <ResourceDetails resource={selectedRequest.resource} />
                    ) : (
                        <p>Hozirgi resurs ma'lumotlari mavjud emas</p>
                    )}
                  </div>
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={50}>
                <div className="p-4 h-full">
                  <h2 className="text-lg font-semibold">O'zgartiriladigan Ma'lumotlar</h2>
                  <div className="space-y-4 h-full">
                    <p className="text-sm text-gray-600">
                      Quyidagi ma'lumotlarga kiritilgan o'zgarishlarni ta'kidlab ko'rishingiz mumkin.
                    </p>
                    {selectedRequest?.changes ? (
                        <ResourceChanges
                            resource={selectedRequest.resource}
                            changes={selectedRequest.changes}
                        />
                    ) : (
                        <p>O'zgarishlar mavjud emas</p>
                    )}
                  </div>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </DialogContent>
        </Dialog>
        {approveModalOpen && (
            <ChangeRequestActionDialog
                close={() => setApproveModalOpen(false)}
                onAction={handleAction}
                id={selectedId}
                action="approve"
            />
        )}
        {rejectModalOpen && (
            <ChangeRequestActionDialog
                close={() => setRejectModalOpen(false)}
                onAction={handleAction}
                id={selectedId}
                action="reject"
            />
        )}
      </div>
  )
}

export default Page