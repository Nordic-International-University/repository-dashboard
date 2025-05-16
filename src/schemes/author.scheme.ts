import * as z from 'zod'

export const authorFormSchema = z.object({
  fullname: z.string().min(2, 'Ism to‘liq bo‘lishi kerak'),
  institution: z.string(),
  degree: z.string(),
  department: z.string(),
})

export type AuthorFormValues = z.infer<typeof authorFormSchema>
