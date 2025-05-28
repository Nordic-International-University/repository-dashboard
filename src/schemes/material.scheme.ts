import { z } from 'zod'

export const resourceFormScheme = z.object({
  title: z.string().min(1, { message: 'Sarlavha majburiy' }),
  description: z.string().min(1, { message: 'Tavsif majburiy' }),
  doi: z.string().optional(),
  language: z.string().min(1, { message: 'Til tanlanishi kerak' }),
  license: z.string().optional().default('https://creativecommons.org/licenses/by-nc-nd/4.0/'),
  collectionId: z.string().min(1, { message: `Bo'lim tanlanishi kerak` }),
  categoryId: z.string().min(1, { message: `Yo'nalish tanlanishi kerak` }),
  resourceTypeId: z.string().min(1, { message: 'Resurs turi tanlanishi kerak' }),
  publisherId: z.string().optional(),
  documents: z.array(z.string()).optional().default([]),
  keywords: z.array(z.string()).optional().default([]),
  authors: z.array(z.string()).optional().default([]),
  isPublic: z.boolean().optional().default(false),
  youtubeVideos: z.array(z.string()).optional().default([]),
})
