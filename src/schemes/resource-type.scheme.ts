import * as z from 'zod'

export const resourceTypeCreateFormScheme = z.object({
  name: z.string().min(1, 'Nom kiritilishi shart'),
})
