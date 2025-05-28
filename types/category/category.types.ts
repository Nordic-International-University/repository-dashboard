import { z } from 'zod'

export const categorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
})

export type Category = z.infer<typeof categorySchema>

export interface PaginatedResponse<T> {
  count: number
  pageNumber: number
  pageSize: number
  pageCount: number
  data: T[]
}

export interface CategoryResponse extends PaginatedResponse<Category> {}
