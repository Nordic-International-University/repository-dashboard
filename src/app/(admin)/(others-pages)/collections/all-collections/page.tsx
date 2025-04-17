'use client'

import { Button } from '@/components/ui/button'
import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import CustomPagination from '@/components/pagination/CustomPagination'
import CollectionsTable from '@/components/pages/collections/collections-table'
import React, { useState } from 'react'
import { DialogModal } from '@/components/modal/custom.modal'
import { CollectionForm } from '@/components/pages/collections/collections-form'
import { CollectionFormValues } from '../../../../../../types/colecctions/collections.types'
import {
  useCollectionsQuery,
  useCreateCollectionMutation,
  useDeleteCollectionMutation,
} from '@/hooks/use-collections'

const Page = () => {
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(9)
  const [openCreateModal, setOpenCreateModal] = useState<boolean>(false)
  const [search, setSearch] = useState('')

  //api calls
  const { data: collections, refetch } = useCollectionsQuery(pageNumber, pageSize)
  const CollectionsCreateMutation = useCreateCollectionMutation(refetch)
  const CollectionDeleteMutation = useDeleteCollectionMutation(refetch)

  //api call functions
  const addCollection = (values: CollectionFormValues) => {
    CollectionsCreateMutation.mutate(values)
    setOpenCreateModal(false)
  }

  const deleteCollection = (id: string) => {
    console.log(id)
    CollectionDeleteMutation.mutate(id)
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Barcha bo'limlar" />
      <div className="flex items-center justify-end">
        <Button onClick={() => setOpenCreateModal(true)} className="mb-4">
          Bo'lim qo'shish
        </Button>
      </div>
      <div className="rounded-md border-1 px-2 py-2">
        <CollectionsTable onDelete={deleteCollection} collections={collections?.data} />
      </div>
      <div className="mt-4">
        <CustomPagination
          onPageChange={setPageNumber}
          totalPages={collections?.pageCount || 1}
          currentPage={pageNumber}
          position="right"
        />
      </div>
      <DialogModal
        title="Bo'lim qo'shish"
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
      >
        <CollectionForm onSubmitFunction={addCollection} />
      </DialogModal>
    </div>
  )
}

export default Page
