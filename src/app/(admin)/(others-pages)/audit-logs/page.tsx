'use client'

import { useState } from 'react'
import { useAuditLogsQuery } from '@/hooks/use-audit-log'
import AuditLogTable from '@/components/pages/audit-logs/audit-log-table'
import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import CustomPagination from '@/components/pagination/CustomPagination'
import { useResponsivePageSize } from '@/hooks/use-responsive-pagesize'
import AuditLogsFilter from '@/components/pages/audit-logs/Audit-logs-filter'

export default function AdminAuditLogPage() {
  const [pageNumber, setPageNumber] = useState(1)
  const pageSize = useResponsivePageSize({ reservedHeight: 300, rowHeight: 39 })
  const [filter, setFilter] = useState({})

  const { data } = useAuditLogsQuery(pageNumber, pageSize, filter)

  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="Audit loglar" />
      <AuditLogsFilter onChange={setFilter} />
      <AuditLogTable logs={data?.data} />
      <CustomPagination
        currentPage={pageNumber}
        totalPages={data?.pageCount || 1}
        onPageChange={setPageNumber}
        position="right"
      />
    </div>
  )
}
