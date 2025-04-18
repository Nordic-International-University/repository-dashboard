'use client'

import React, { useState } from 'react'
import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import { Button } from '@/components/ui/button'
import { DialogModal } from '@/components/modal/custom.modal'
import CustomPagination from '@/components/pagination/CustomPagination'
import { Keyword, KeywordFormValues } from '../../../../../../types/keyword/keyword.types'
import {
  useCreateKeywordMutation,
  useDeleteKeywordMutation,
  useKeywordsQuery,
  useUpdateKeywordMutation,
} from '@/hooks/use-keywords'
import KeywordTable from '@/components/pages/keywords/keyword-table'
import { KeywordForm } from '@/components/pages/keywords/keyword-form'
import { KeywordDeleteDialog } from '@/components/pages/keywords/keyword-delete-dialog'

const Page = () => {
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize] = useState(9)
  const [openCreateModal, setOpenCreateModal] = useState(false)
  const [openUpdateModal, setOpenUpdateModal] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [editData, setEditData] = useState<Keyword | null>(null)
  const [deleteId, setDeleteId] = useState('')

  const { data: keywords, refetch } = useKeywordsQuery(pageNumber, pageSize)

  const createMutation = useCreateKeywordMutation(refetch)
  const updateMutation = useUpdateKeywordMutation(refetch)
  const deleteMutation = useDeleteKeywordMutation(refetch)

  const addKeyword = (values: KeywordFormValues) => {
    createMutation.mutate(values)
    setOpenCreateModal(false)
  }

  const updateKeyword = (values: KeywordFormValues) => {
    if (!editData) return
    updateMutation.mutate({ id: editData.id, payload: values })
    setOpenUpdateModal(false)
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Kalit so‘zlar" />
      <div className="mb-4 flex justify-end">
        <Button onClick={() => setOpenCreateModal(true)}>Kalit so‘z qo‘shish</Button>
      </div>
      <KeywordTable
        keywords={keywords?.data}
        onEdit={(item) => {
          setEditData(item)
          setOpenUpdateModal(true)
        }}
        setDeleteId={setDeleteId}
        setOpenDeleteModal={setOpenDeleteModal}
      />
      <CustomPagination
        onPageChange={setPageNumber}
        totalPages={keywords?.pageCount || 1}
        currentPage={pageNumber}
        position="right"
      />
      <DialogModal
        title="Yangi kalit so‘z"
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
      >
        <KeywordForm onSubmitFunction={addKeyword} />
      </DialogModal>
      <DialogModal
        title="Kalit so‘zni tahrirlash"
        open={openUpdateModal}
        onClose={() => setOpenUpdateModal(false)}
      >
        <KeywordForm onSubmitFunction={updateKeyword} initialData={editData ?? undefined} />
      </DialogModal>
      {openDeleteModal && (
        <KeywordDeleteDialog
          close={() => setOpenDeleteModal(false)}
          onDelete={deleteMutation.mutate}
          id={deleteId}
        />
      )}
    </div>
  )
}

export default Page
