import { axiosInstance } from './base.axios'
import { AuditLog, AuditLogQuery } from '../../types/audit/audit.types'

interface AuditLogResponse {
  data: AuditLog[]
  total: number
}

export const auditLogService = {
  async getLogs(params: AuditLogQuery): Promise<AuditLogResponse> {
    const response = await axiosInstance.get<AuditLogResponse>('/audit-log', {
      params,
    })
    return response.data
  },

  async getById(id: string): Promise<AuditLog> {
    const response = await axiosInstance.get<AuditLog>(`/audit-log/${id}`)
    return response.data
  },

  async delete(id: string): Promise<{ message: string }> {
    const response = await axiosInstance.delete<{ message: string }>(`/audit-log/${id}`)
    return response.data
  },
}
