export interface AuditLog {
  user: {
    id: string
    fullname: string
    username: string
  }
  id: string
  action: string
  module: string
  userId: string
  createdAt: string
  updatedAt: string
}

export interface AuditLogQuery {
  pageNumber?: number
  pageSize?: number
  startDate?: string
  endDate?: string
  action?: string
  module?: string
  userId?: string
  search?: string
}
