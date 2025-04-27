import { z } from 'zod'

export const auditLogQuerySchema = z.object({
  pageNumber: z.number().optional(),
  pageSize: z.number().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  action: z.string().optional(),
  module: z.string().optional(),
  userId: z.string().optional(),
  search: z.string().optional(),
})
