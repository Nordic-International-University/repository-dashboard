import React, { FC } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { PermissionCreateBody } from '../../../../../types/admin/admin.types'
import { z } from 'zod'
import { permissionSchema } from '@/schemes/admin.scheme'
import { zodResolver } from '@hookform/resolvers/zod'

interface AddPermissionModalProps {
  open: boolean
  close: () => void
  handleCreatePermission: (data: PermissionCreateBody) => void
}

type CreatePermissionScheme = z.infer<typeof permissionSchema>

const AddPermissionsModal: FC<AddPermissionModalProps> = ({
  open,
  close,
  handleCreatePermission,
}) => {
  const form = useForm<CreatePermissionScheme>({
    resolver: zodResolver(permissionSchema),
    defaultValues: {
      name: '',
      description: '',
      key: '',
      module: '',
    },
  })

  const onSubmit = (data: PermissionCreateBody) => {
    handleCreatePermission(data)
    form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Ruxsat qo'shish</DialogTitle>
          <DialogDescription>
            Ruxsat qo'shish uchun so'ralgan maydonlarni to'ldiring!
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 gap-5">
              <FormField
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ruxsat nomi</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ruxsat nomini kiriting!" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ruxsat tavsifi</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Ruxsat tavsifini kiriting!" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-start gap-4">
                <FormField
                  name="key"
                  render={({ field }) => (
                    <FormItem className="w-1/2 space-y-1.5">
                      <FormLabel>Ruxsat kaliti</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Ruxsat kaliti kiriting!" />
                      </FormControl>
                      <FormMessage className="min-h-[20px]" />
                    </FormItem>
                  )}
                />
                <FormField
                  name="module"
                  render={({ field }) => (
                    <FormItem className="w-1/2 space-y-1.5">
                      <FormLabel>Module nomi</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Module nomini kiriting!" />
                      </FormControl>
                      <FormMessage className="min-h-[20px]" />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter className="mt-5">
              <Button type="submit">Saqlash</Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}

export default AddPermissionsModal
