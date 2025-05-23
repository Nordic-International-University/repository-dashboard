import { z } from 'zod'

export const editAdminUserSchema = z.object({
  username: z.string().min(3, "Foydalanuvchi nomi kamida 3ta belgidan iborat bo'lishi kerak"),
  fullname: z.string().min(3, "Ism kamida 3ta belgidan iborat bo'lishi kerak"),
  roleId: z.string().nonempty('Roli tanlanishi shart'),
  isActive: z.boolean({
    required_error: 'Holat tanlanishi kerak',
  }),
  password: z.string().optional(),
})

export const permissionSchema = z.object({
  name: z.string().min(2, "Ruxsat nomi kamida 2 ta belgidan iborat bo'lishi kerak"),
  description: z.string().min(5, "Tavsif kamida 5 ta belgidan iborat bo'lishi kerak"),
  key: z
    .string()
    .regex(
      /^[a-zA-Z]+:(read|create|delete|update|change-request)$/,
      "Kalit faqat 'soz:read|create|delete|update|change-request' formatida bo'lishi kerak (masalan: document:delete)"
    ),
  module: z.string().min(2, "Modul nomi kamida 2 ta belgidan iborat bo'lishi kerak"),
})
