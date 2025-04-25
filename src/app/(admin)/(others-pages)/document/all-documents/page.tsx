'use client'

import React, { useState } from 'react'
import { DocumentDeleteDialog } from '@/components/pages/documents/document-delete-dialog'
import { useDeleteDocumentMutation, useDocumentsQuery } from '@/hooks/use-document'
import { DocumentTable } from '@/components/pages/documents/document.table'
import PageBreadcrumb from '@/components/common/PageBreadCrumb'

export default function AdminDocumentPage() {
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<any>(null)
  const { data } = useDocumentsQuery(1, 100)
  const deleteMutation = useDeleteDocumentMutation(() => setOpenDialog(false), 1, 100)

  const onDelete = (doc: any) => {
    setSelectedDocument(doc)
    setOpenDialog(true)
  }

  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="Barcha fayllar" />

      <DocumentTable documents={data?.data} onDelete={onDelete} />

      <DocumentDeleteDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={() => selectedDocument && deleteMutation.mutate(selectedDocument.id)}
      />
    </div>
  )
}
