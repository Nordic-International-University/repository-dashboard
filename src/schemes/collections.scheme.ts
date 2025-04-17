import * as z from 'zod'

export const collectionsCreateFormScheme = z.object({
  title: z.string().min(3, 'Sarlavha kamida 3 harf bo‘lishi kerak'),
  description: z.string().min(5, 'Tavsif kamida 5 harf bo‘lishi kerak'),
  coverImage: z.string(),
})
