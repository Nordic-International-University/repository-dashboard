import * as z from 'zod'

export const formSchema = z.object({
  username: z.string().min(1, 'Username majburiy'),
  password: z.string().min(6, "Parol kamida 6 ta belgidan iborat bo'lishi kerak"),
})
