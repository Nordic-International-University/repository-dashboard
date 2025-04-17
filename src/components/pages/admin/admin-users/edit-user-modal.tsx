'use client'

import React, { FC, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { FormProvider, useForm } from 'react-hook-form'
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Select,
} from '@/components/ui/select'
import { addUserBody, Role, UsersList } from '../../../../../types/admin/admin.types'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { z } from 'zod'
import { editAdminUserSchema } from '@/schemes/admin.scheme'
import { zodResolver } from '@hookform/resolvers/zod'

interface EditUserModalProps {
  open: boolean
  close: (open: boolean) => void
  roles: Role[] | null
  values: UsersList | null
  onEdit: (id: string, data: addUserBody) => void
}

type EditUserFormValues = z.infer<typeof editAdminUserSchema>

const EditUserModal: FC<EditUserModalProps> = ({ open, close, roles, values, onEdit }) => {
  const form = useForm<EditUserFormValues>({
    resolver: zodResolver(editAdminUserSchema),
    defaultValues: {
      username: '',
      fullname: '',
      roleId: '',
      isActive: true,
      password: '',
    },
  })

  useEffect(() => {
    if (values) {
      form.reset({
        username: values.username || '',
        fullname: values.fullname || '',
        roleId: values?.role?.id || '',
        isActive: values.isActive,
        password: '',
      })
    }
  }, [values, form])

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Adminni yangilash</DialogTitle>
          <DialogDescription>Kerakli joyni o'zgartiring va tahrirlang!</DialogDescription>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit((data) => onEdit(values?.id as string, data as any))}>
            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Foydalanuvchi nomi</FormLabel>
                    <FormControl>
                      <Input placeholder="Foydalanuvchi nomini kiriting!" {...field} />
                    </FormControl>
                    <FormMessage></FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fullname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ism</FormLabel>
                    <FormControl>
                      <Input placeholder="Ismni kiriting!" {...field} />
                    </FormControl>
                    <FormMessage></FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="roleId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Roli</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          {roles?.map((option) => (
                            <SelectItem key={option.id} value={option.id}>
                              {option.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage></FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Holati</FormLabel>
                    <FormControl>
                      <RadioGroup
                        defaultValue={field.value === true ? 'active' : 'inActive'}
                        onValueChange={(value) => field.onChange(value === 'active')}
                      >
                        <div className="flex items-center gap-5">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="active" id="r1" />
                            <Label htmlFor="r1">faol</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="inActive" id="r2" />
                            <Label htmlFor="r2">faol emas</Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage></FormMessage>
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
                      <Input placeholder="Parol kiriting" {...field} type="password" />
                    </FormControl>
                    <FormDescription>
                      Agar parolni o'zgartirmoqchi bo'lmasangiz shunchaki kiritmang!
                    </FormDescription>
                    <FormMessage></FormMessage>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit">Tahrirlash</Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}

export default EditUserModal
