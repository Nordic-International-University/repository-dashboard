export interface ChangeRequest {
  id: string
  resourceId: string
  requesterId: string
  approverId?: string
  comment: string
  status: ChangeRequestStatus
  changes: Record<string, any>
  createdAt?: string
  updatedAt?: string
}

export enum ChangeRequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface ChangeRequestFormValues {
  resourceId: string
  comment: string
  status: ChangeRequestStatus
  changes: Record<string, any>
  approverId?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  pageNumber: number
  pageCount: number
  pageSize: number
}

export interface ChangeRequestQueryParams {
  pageNumber?: number
  pageSize?: number
  search?: string
  resourceId?: string
  requesterId?: string
  approverId?: string
  status?: ChangeRequestStatus
  fromDate?: string
  toDate?: string
}

export interface ChangeRequestUpdateProps {
  onSubmitFunction: (data: Partial<ChangeRequestFormValues>) => void
  initialData?: ChangeRequest
}

export interface ChangeRequestActionDialogProps {
  close: () => void
  onAction: (id: string, status: ChangeRequestStatus, comment?: string) => void
  id: string
  action: 'approve' | 'reject'
}
