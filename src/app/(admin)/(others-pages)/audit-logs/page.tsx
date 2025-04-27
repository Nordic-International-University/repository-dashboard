'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { useAuditLogsQuery, useDeleteAuditLogMutation } from '@/hooks/use-audit-log'
import AuditLogTable from '@/components/pages/audit-logs/audit-log-table'
import PageBreadcrumb from '@/components/common/PageBreadCrumb'

export default function AdminAuditLogPage() {
  const [openDialog, setOpenDialog] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { data } = useAuditLogsQuery(1, 100)
  const deleteMutation = useDeleteAuditLogMutation(() => {
    setOpenDialog(false)
  })

  const onDelete = (id: string) => {
    setDeleteId(id)
    setOpenDialog(true)
  }

  console.log(data)
  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="Audit loglar" />
      <AuditLogTable
        logs={data?.data}
        setDeleteId={setDeleteId}
        setOpenDeleteModal={setOpenDialog}
      />

      {/*<AuditLogDeleteDialog*/}
      {/*  open={openDialog}*/}
      {/*  onClose={() => setOpenDialog(false)}*/}
      {/*  onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}*/}
      {/*/>*/}
    </div>
  )
}
