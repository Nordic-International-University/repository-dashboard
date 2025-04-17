import * as z from 'zod'

export const categorySchema = z.object({
  name: z
    .string()
    .min(2, {
      message: 'Name must be at least 2 characters.',
    })
    .max(50, {
      message: 'Name must not exceed 50 characters.',
    }),
  icon: z.string().min(1, {
    message: 'Icon is required.',
  }),
  description: z
    .string()
    .min(5, {
      message: 'Description must be at least 5 characters.',
    })
    .max(200, {
      message: 'Description must not exceed 200 characters.',
    }),
})

export type CategoryFormSchema = z.infer<typeof categorySchema>
