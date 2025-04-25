'use client'

import React, { useState } from 'react'
import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import { Button } from '@/components/ui/button'
import CustomPagination from '@/components/pagination/CustomPagination'
import { Subject, SubjectFormValues } from '../../../../../../types/subject-types/subject.types'
import {
  useCreateSubjectMutation,
  useDeleteSubjectMutation,
  useSubjectsQuery,
  useUpdateSubjectMutation,
} from '@/hooks/use-subject'
import SubjectTable from '@/components/pages/subjects/subject-table'
import { DialogModal } from '@/components/modal/custom.modal'
import { SubjectForm } from '@/components/pages/subjects/subject-form'
import { SubjectDeleteDialog } from '@/components/pages/subjects/subject-delete-dialog'
import { useResponsivePageSize } from '@/hooks/use-responsive-pagesize'

const Page = () => {
  const [pageNumber, setPageNumber] = useState(1)
  const pageSize = useResponsivePageSize({ reservedHeight: 280, rowHeight: 60 })
  const [openCreateModal, setOpenCreateModal] = useState(false)
  const [openUpdateModal, setOpenUpdateModal] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [deleteId, setDeleteId] = useState('')
  const [editData, setEditData] = useState<Subject | null>(null)

  const { data: subjects, refetch } = useSubjectsQuery(pageNumber, pageSize)
  const createMutation = useCreateSubjectMutation(refetch)
  const updateMutation = useUpdateSubjectMutation(refetch)
  const deleteMutation = useDeleteSubjectMutation(refetch)

  const addSubject = (values: SubjectFormValues) => {
    createMutation.mutate(values)
    setOpenCreateModal(false)
  }

  const updateSubject = (values: SubjectFormValues) => {
    if (!editData) return
    updateMutation.mutate({ id: editData.id, payload: values })
    setOpenUpdateModal(false)
  }

  const deleteSubject = (id: string) => {
    deleteMutation.mutate(id)
  }

  const openEditModal = (subject: Subject) => {
    setEditData(subject)
    setOpenUpdateModal(true)
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Fanlar ro‘yxati" />
      <div className="mb-4 flex justify-end">
        <Button onClick={() => setOpenCreateModal(true)}>Fan qo‘shish</Button>
      </div>
      <SubjectTable
        subjects={subjects?.data}
        onEdit={openEditModal}
        setDeleteId={setDeleteId}
        setOpenDeleteModal={setOpenDeleteModal}
      />
      <div className="mt-4">
        <CustomPagination
          onPageChange={setPageNumber}
          totalPages={subjects?.pageCount || 1}
          currentPage={pageNumber}
          position="right"
        />
      </div>
      <DialogModal
        title="Yangi fan qo‘shish"
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
      >
        <SubjectForm onSubmitFunction={addSubject} />
      </DialogModal>
      <DialogModal
        title="Fan tahrirlash"
        open={openUpdateModal}
        onClose={() => setOpenUpdateModal(false)}
      >
        <SubjectForm onSubmitFunction={updateSubject} initialData={editData ?? undefined} />
      </DialogModal>
      {openDeleteModal && (
        <SubjectDeleteDialog
          close={() => setOpenDeleteModal(false)}
          onDelete={deleteSubject}
          id={deleteId}
        />
      )}
    </div>
  )
}

export default Page
