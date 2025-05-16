'use client'

import { Button } from '@/components/ui/button'
import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import CustomPagination from '@/components/pagination/CustomPagination'
import CollectionsTable from '@/components/pages/collections/collections-table'
import React, { useState } from 'react'
import { DialogModal } from '@/components/modal/custom.modal'
import { CollectionForm } from '@/components/pages/collections/collections-form'
import {
  CollectionFormValues,
  Collection,
} from '../../../../../../types/colecctions/collections.types'
import {
  useCollectionsQuery,
  useCreateCollectionMutation,
  useDeleteCollectionMutation,
  useUpdateCollectionMutation,
} from '@/hooks/use-collections'
import { CollectionsDeleteDialog } from '@/components/pages/collections/collections-delete-dialog'
import { useResponsivePageSize } from '@/hooks/use-responsive-pagesize'
import { Input } from '@/components/ui/input'

const Page = () => {
  const [pageNumber, setPageNumber] = useState<number>(1)
  const pageSize = useResponsivePageSize({ reservedHeight: 400, rowHeight: 65 })
  const [openCreateModal, setOpenCreateModal] = useState<boolean>(false)
  const [openUpdateModal, setOpenUpdateModal] = useState<boolean>(false)
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false)
  const [deleteId, setDeleteId] = useState('')
  const [editData, setEditData] = useState<Collection | null>(null)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState<string>('')

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    setTimeout(() => {
      setDebouncedSearch(e.target.value)
      setPageNumber(1)
    }, 500)
  }
  const { data: collections, refetch } = useCollectionsQuery(pageNumber, pageSize, debouncedSearch)
  const CollectionsCreateMutation = useCreateCollectionMutation(refetch)
  const CollectionDeleteMutation = useDeleteCollectionMutation(refetch)
  const CollectionUpdateMutation = useUpdateCollectionMutation(refetch)

  const addCollection = (values: CollectionFormValues) => {
    CollectionsCreateMutation.mutate(values, {
      onSuccess: () => {
        setOpenCreateModal(false)
      },
    })
  }

  const updateCollection = (values: CollectionFormValues) => {
    if (!editData) return
    CollectionUpdateMutation.mutate({ payload: values, id: editData.id }, {})
    setOpenUpdateModal(false)
  }

  const deleteCollection = (id: string) => {
    CollectionDeleteMutation.mutate(id)
  }

  const openEditModal = (collection: Collection) => {
    setEditData(collection)
    setOpenUpdateModal(true)
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Barcha bo'limlar" />
      <div className="mb-4 flex items-center justify-between max-sm:gap-5">
        <Input
          placeholder="Bo'lim bo'yicha qidirish..."
          value={search}
          onChange={handleSearchChange}
          className="max-w-sm"
        />
        <Button onClick={() => setOpenCreateModal(true)}>Bo'lim qo'shish</Button>
      </div>
      <div className="rounded-md border-1 px-2 py-2">
        <CollectionsTable
          onEdit={openEditModal}
          setOpenDeleteModal={setOpenDeleteModal}
          setDeleteId={setDeleteId}
          collections={collections?.data}
        />
      </div>
      <CustomPagination
        onPageChange={setPageNumber}
        totalPages={collections?.pageCount || 1}
        currentPage={pageNumber}
        position="right"
      />

      <DialogModal
        title="Bo'lim qo'shish"
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
      >
        <CollectionForm onSubmitFunction={addCollection} />
      </DialogModal>
      <DialogModal
        title="Bo'limni tahrirlash"
        open={openUpdateModal}
        onClose={() => setOpenUpdateModal(false)}
      >
        <CollectionForm onSubmitFunction={updateCollection} initialData={editData ?? undefined} />
      </DialogModal>
      {openDeleteModal && (
        <CollectionsDeleteDialog
          close={() => setOpenDeleteModal(false)}
          onDelete={deleteCollection}
          id={deleteId}
        />
      )}
    </div>
  )
}

export default Page
