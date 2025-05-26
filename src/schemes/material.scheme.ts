import { z } from 'zod'

export const resourceFormScheme = z.object({
  title: z.string().min(1, { message: 'Sarlavha majburiy' }),
  description: z.string().min(1, { message: 'Tavsif majburiy' }),
  doi: z.string().optional(),
  language: z.string().min(1, { message: 'Til tanlanishi kerak' }),
  license: z.string().optional(),
  collectionId: z.string().min(1, { message: 'To‘plam tanlanishi kerak' }),
  subjectId: z.string().min(1, { message: 'Fan tanlanishi kerak' }),
  resourceTypeId: z.string().min(1, { message: 'Resurs turi tanlanishi kerak' }),
  publisherId: z.string().optional(),
  documents: z.array(z.string()).optional().default([]),
  keywords: z.array(z.string()).optional().default([]),
  authors: z.array(z.string()).optional().default([]),
  isPublic: z.boolean().optional().default(false),
})
