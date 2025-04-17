import React, { FC, useEffect } from 'react'
import { PermissionItem, Role, RoleCreateRequest } from '../../../../../types/admin/admin.types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { FormProvider, useForm } from 'react-hook-form'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

interface AddRoleModalProps {
  permissions: PermissionItem[] | null
  isOpen: boolean
  onUpdate: (data: RoleCreateRequest, id: string) => void
  onClose: (set: boolean) => void
  roles: Role[] | null
  values: any
}

const EditRoleModal: FC<AddRoleModalProps> = ({
  permissions,
  isOpen,
  onUpdate,
  onClose,
  roles,
  values,
}) => {
  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
      permissions: [] as string[],
    },
  })

  const { setValue, getValues, watch } = form

  useEffect(() => {
    if (values) {
      form.reset({
        name: values.name || '',
        description: values.description || '',
        permissions: values.permissions?.map((p: any) => p.id) || [],
      })
    }
  }, [values, form])

  const handleCheckboxChange = (id: string, checked: boolean) => {
    const current = getValues('permissions') || []
    if (checked) {
      setValue('permissions', [...current, id])
    } else {
      setValue(
        'permissions',
        current.filter((item) => item !== id)
      )
    }
  }

  const onSubmit = (data: RoleCreateRequest) => {
    console.log(data)
    onUpdate(data, values.id)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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

              <ScrollArea className="max-h-[300px] rounded-md border p-2">
                {permissions?.map((item, index) => (
                  <div key={index}>
                    <h3 className="mb-2 font-semibold">{item.module} module</h3>
                    <div className="mb-4 grid grid-cols-3 gap-2">
                      {item?.permissions?.map((perm) => (
                        <div className="flex items-center gap-2" key={perm.id}>
                          <Checkbox
                            id={perm.id}
                            checked={watch('permissions').includes(perm.id)}
                            onCheckedChange={(checked) => handleCheckboxChange(perm.id, !!checked)}
                          />
                          <Label htmlFor={perm.id}>{perm.name}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </ScrollArea>
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

export default EditRoleModal
