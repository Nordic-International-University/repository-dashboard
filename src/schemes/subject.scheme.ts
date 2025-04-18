import * as z from 'zod'

export const subjectCreateFormScheme = z.object({
  name: z.string().min(1, 'Fan nomi majburiy'),
  categoryId: z.string().uuid('Kategoriya tanlanmagan'),
})
