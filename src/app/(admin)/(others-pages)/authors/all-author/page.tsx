'use client'

import React, { useState } from 'react'
import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import { Button } from '@/components/ui/button'
import { DialogModal } from '@/components/modal/custom.modal'
import CustomPagination from '@/components/pagination/CustomPagination'
import {
  useAuthorsQuery,
  useCreateAuthorMutation,
  useDeleteAuthorMutation,
  useUpdateAuthorMutation,
} from '@/hooks/use-authors'
import { Author, AuthorFormValues } from '../../../../../../types/author/author.types'
import AuthorTable from '@/components/pages/author/author-table'
import { AuthorForm } from '@/components/pages/author/author-form'
import { AuthorDeleteDialog } from '@/components/pages/author/author-delete-dialog'

const Page = () => {
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize] = useState(10)
  const [openCreateModal, setOpenCreateModal] = useState(false)
  const [openUpdateModal, setOpenUpdateModal] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [editData, setEditData] = useState<Author | null>(null)
  const [deleteId, setDeleteId] = useState('')

  const { data: authors, refetch } = useAuthorsQuery(pageNumber, pageSize)

  const createMutation = useCreateAuthorMutation(refetch)
  const updateMutation = useUpdateAuthorMutation(refetch)
  const deleteMutation = useDeleteAuthorMutation(refetch)

  const addAuthor = (values: AuthorFormValues) => {
    createMutation.mutate(values)
    setOpenCreateModal(false)
  }

  const updateAuthor = (values: AuthorFormValues) => {
    if (!editData) return
    updateMutation.mutate({ id: editData.id, payload: values })
    setOpenUpdateModal(false)
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Mualliflar" />
      <div className="mb-4 flex justify-end">
        <Button onClick={() => setOpenCreateModal(true)}>Muallif qo‘shish</Button>
      </div>
      <AuthorTable
        authors={authors?.data}
        onEdit={(item) => {
          setEditData(item)
          setOpenUpdateModal(true)
        }}
        setDeleteId={setDeleteId}
        setOpenDeleteModal={setOpenDeleteModal}
      />
      <CustomPagination
        onPageChange={setPageNumber}
        totalPages={authors?.pageCount || 1}
        currentPage={pageNumber}
        position="right"
      />
      <DialogModal
        title="Yangi muallif"
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
      >
        <AuthorForm onSubmitFunction={addAuthor} />
      </DialogModal>
      <DialogModal
        title="Muallifni tahrirlash"
        open={openUpdateModal}
        onClose={() => setOpenUpdateModal(false)}
      >
        <AuthorForm onSubmitFunction={updateAuthor} initialData={editData ?? undefined} />
      </DialogModal>
      {openDeleteModal && (
        <AuthorDeleteDialog
          close={() => setOpenDeleteModal(false)}
          onDelete={deleteMutation.mutate}
          id={deleteId}
        />
      )}
    </div>
  )
}

export default Page
