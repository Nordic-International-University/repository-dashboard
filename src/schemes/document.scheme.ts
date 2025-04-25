import { z } from 'zod'

export const documentUploadScheme = z.object({
  file: z.any(),
})
