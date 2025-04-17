import { z } from 'zod'

export const categorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  icon: z.string().min(1, 'Icon is required'),
  description: z.string().min(5, 'Description must be at least 5 characters'),
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
