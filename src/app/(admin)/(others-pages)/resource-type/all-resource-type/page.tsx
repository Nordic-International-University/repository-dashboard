'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import CustomPagination from '@/components/pagination/CustomPagination'
import { DialogModal } from '@/components/modal/custom.modal'
import {
  ResourceType,
  ResourceTypeFormValues,
} from '../../../../../../types/resources/rosurce.types'
import {
  useCreateResourceTypeMutation,
  useDeleteResourceTypeMutation,
  useResourceTypesQuery,
  useUpdateResourceTypeMutation,
} from '@/hooks/use-resources'
import ResourceTypeTable from '@/components/pages/resources/resources-table'
import { ResourceTypeForm } from '@/components/pages/resources/resources-form'
import { ResourceTypeDeleteDialog } from '@/components/pages/resources/resources-delete-dialog'
import { useResponsivePageSize } from '@/hooks/use-responsive-pagesize'

const Page = () => {
  const [pageNumber, setPageNumber] = useState(1)
  const pageSize = useResponsivePageSize({ reservedHeight: 280, rowHeight: 60 })
  const [openCreateModal, setOpenCreateModal] = useState(false)
  const [openUpdateModal, setOpenUpdateModal] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [deleteId, setDeleteId] = useState('')
  const [editData, setEditData] = useState<ResourceType | null>(null)

  const { data: resourceTypes, refetch } = useResourceTypesQuery(pageNumber, pageSize)
  const createMutation = useCreateResourceTypeMutation(refetch)
  const updateMutation = useUpdateResourceTypeMutation(refetch)
  const deleteMutation = useDeleteResourceTypeMutation(refetch)

  const addResourceType = (values: ResourceTypeFormValues) => {
    createMutation.mutate(values)
    setOpenCreateModal(false)
  }

  const updateResourceType = (values: ResourceTypeFormValues) => {
    if (!editData) return
    updateMutation.mutate({ id: editData.id, payload: values })
    setOpenUpdateModal(false)
  }

  const deleteResourceType = (id: string) => {
    deleteMutation.mutate(id)
  }

  const openEditModal = (type: ResourceType) => {
    setEditData(type)
    setOpenUpdateModal(true)
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Resurs turlari" />
      <div className="mb-4 flex justify-end">
        <Button onClick={() => setOpenCreateModal(true)}>Resurs turi qo‘shish</Button>
      </div>
      <ResourceTypeTable
        resourceTypes={resourceTypes?.data}
        onEdit={openEditModal}
        setDeleteId={setDeleteId}
        setOpenDeleteModal={setOpenDeleteModal}
      />
      <div className="mt-4">
        <CustomPagination
          onPageChange={setPageNumber}
          totalPages={resourceTypes?.pageCount || 1}
          currentPage={pageNumber}
          position="right"
        />
      </div>
      <DialogModal
        title="Resurs turi yaratish"
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
      >
        <ResourceTypeForm onSubmitFunction={addResourceType} />
      </DialogModal>
      <DialogModal
        title="Resurs turini tahrirlash"
        open={openUpdateModal}
        onClose={() => setOpenUpdateModal(false)}
      >
        <ResourceTypeForm
          onSubmitFunction={updateResourceType}
          initialData={editData ?? undefined}
        />
      </DialogModal>
      {openDeleteModal && (
        <ResourceTypeDeleteDialog
          close={() => setOpenDeleteModal(false)}
          onDelete={deleteResourceType}
          id={deleteId}
        />
      )}
    </div>
  )
}

export default Page
