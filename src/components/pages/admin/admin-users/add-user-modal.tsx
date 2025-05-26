'use client'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { addUserBody, Role } from '../../../../../types/admin/admin.types'

interface AddUserModalProps {
  isOpen: boolean
  onClose: () => void
  onAddUser: (user: addUserBody) => void
  availableRoles: Role[] | null
}

const addUserSchema = z
  .object({
    username: z.string().min(1, 'Foydalanuvchi nomi kiritilishi kerak'),
    fullname: z.string().min(1, 'Ism va familiya kiritilishi kerak'),
    roleId: z.string().min(1, 'Roli tanlanishi kerak'),
    isActive: z.boolean(),
    password: z.string().min(8, "Parol kamida 8 belgidan iborat bo'lishi kerak"),
    confirmPassword: z.string().min(8, "Parol kamida 8 belgidan iborat bo'lishi kerak"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Parollar bir xil emas',
  })

type AddUserFormValues = z.infer<typeof addUserSchema>

export default function AddUserModal({
  isOpen,
  onClose,
  onAddUser,
  availableRoles,
}: AddUserModalProps) {
  const form = useForm<AddUserFormValues>({
    resolver: zodResolver(addUserSchema),
    defaultValues: {
      username: '',
      fullname: '',
      roleId: '',
      isActive: true,
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = (data: AddUserFormValues) => {
    const { confirmPassword, ...userData } = data
    onAddUser(userData)
    form.reset()
  }

  const handleClose = () => {
    form.reset()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Yangi Admin Foydalanuvchisini Qo'shish</DialogTitle>
          <DialogDescription>Yangi admin foydalanuvchi hisobini yarating</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Foydalanuvchi nomi</FormLabel>
                    <FormControl>
                      <Input placeholder="Admin foydalanuvchisi nomini kiriting" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fullname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ism va Familiya</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Admin foydalanuvchisi ism va familiyasini kiriting"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="roleId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rol</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value || ''}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Rolni tanlang" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableRoles?.map((role) => (
                            <SelectItem key={role.id} value={role.id}>
                              {role.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <RadioGroup
                        value={field.value ? 'Active' : 'Inactive'}
                        onValueChange={(value) => field.onChange(value === 'Active')}
                        className="flex space-y-1"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Active" id="active" />
                          <FormLabel htmlFor="active">Faol</FormLabel>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Inactive" id="inactive" />
                          <FormLabel htmlFor="inactive">Faol emas</FormLabel>
                        </div>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parol</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Parolni kiriting" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parolni tasdiqlash</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Parolni tasdiqlang" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Bekor qilish
              </Button>
              <Button className="bg-black hover:bg-gray-800" type="submit">
                Foydalanuvchini yaratish
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
