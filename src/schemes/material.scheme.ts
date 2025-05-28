import { z } from 'zod'


const urlValidation = z.string()
    .min(1, { message: 'URL majburiy' })
    .refine((url) => {
      // URL formatini tekshirish
      const urlRegex = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}(\/.*)?$/

      // Agar URL https:// yoki http:// bilan boshlanmasa, qo'shib ko'rish
      const formattedUrl = url.startsWith('http') ? url : `https://${url}`

      return urlRegex.test(formattedUrl)
    }, {
      message: 'Yaroqli URL kiriting (masalan: https://example.com, www.example.com, example.com)'
    })
    .transform((url) => {
      // URL ni avtomatik format qilish
      if (!url.startsWith('http')) {
        return `https://${url}`
      }
      return url
    })

export const resourceFormScheme = z.object({
  title: z.string().min(1, { message: 'Sarlavha majburiy' }),
  description: z.string().min(1, { message: 'Tavsif majburiy' }),
  doi: z.string().optional(),
  language: z.string().min(1, { message: 'Til tanlanishi kerak' }),
  license: z.string().default('https://creativecommons.org/licenses/by-nc-nd/4.0/'),
  collectionId: z.string().min(1, { message: `Bo'lim tanlanishi kerak` }),
  categoryId: z.string().min(1, { message: `Yo'nalish tanlanishi kerak` }),
  resourceTypeId: z.string().min(1, { message: 'Resurs turi tanlanishi kerak' }),
  publisherId: z.string().optional(),
  documents: z.array(z.string()).optional().default([]),
  keywords: z.array(z.string()).optional().default([]),
  authors: z.array(z.string()).optional().default([]),
  isPublic: z.boolean().optional().default(false),
  youtubeVideos: z.array(z.object({
    url: urlValidation,
    title: z.string().min(1, { message: 'Video sarlavhasi majburiy' })
  })).optional().default([]),
})

