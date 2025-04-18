import * as z from 'zod'

export const keywordFormScheme = z.object({
  value: z.string().min(1, "Kalit so'z majburiy"),
})
