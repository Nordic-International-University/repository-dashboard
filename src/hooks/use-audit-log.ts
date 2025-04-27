import { useMutation, useQuery, useQueryClient } from 'react-query'
import { auditLogService } from '@/services/audit-log.service'
import { AuditLogQuery } from '../../types/audit/audit.types'

export const useAuditLogsQuery = (
  pageNumber = 1,
  pageSize = 100,
  filters: Partial<AuditLogQuery> = {}
) => {
  return useQuery(['audit-logs', pageNumber, pageSize, filters], () =>
    auditLogService.getLogs({ pageNumber, pageSize, ...filters })
  )
}

export const useDeleteAuditLogMutation = (onSuccess?: () => void) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => auditLogService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['audit-logs'])
      onSuccess?.()
    },
  })
}
