'use client'

import React, { FC } from 'react'
import { PermissionItem, RoleCreateRequest } from '../../../../../types/admin/admin.types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

interface AddRoleModalProps {
  permissions: PermissionItem[] | null
  isOpen: boolean
  onCreate: (data: RoleCreateRequest) => void
  onClose: () => void
}

// Add Zod schema validation
const roleSchema = z.object({
  name: z.string().nonempty('Ruxsat nomi kiritilishi kerak'),
  description: z.string().nonempty('Ruxsat tavsifi kiritilishi kerak'),
  permissions: z.array(z.string()).nonempty('Kamida bitta ruxsat tanlanishi kerak'),
})

type RoleSchemaType = z.infer<typeof roleSchema>

const AddRoleModal: FC<AddRoleModalProps> = ({ permissions, isOpen, onCreate, onClose }) => {
  const form = useForm<RoleSchemaType>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: '',
      description: '',
      permissions: [],
    },
  })

  const { setValue, getValues, watch } = form

  const handleCheckboxChange = (id: string, checked: boolean) => {
    const current = getValues('permissions') || []
    if (checked) {
      setValue('permissions', [...current, id])
    } else {
      setValue(
        'permissions',
        // @ts-ignore
        current.filter((item) => item !== id)
      )
    }
  }

  const handleSelectAllModule = (moduleIds: string[], checked: boolean) => {
    const current = getValues('permissions') || []
    const updatedPermissions = checked
      ? Array.from(new Set([...current, ...moduleIds]))
      : current.filter((id) => !moduleIds.includes(id))
    // @ts-ignore
    setValue('permissions', updatedPermissions)
  }

  const handleSelectAllGlobal = (checked: boolean) => {
    const allPermissionIds =
      permissions?.flatMap((module) => module.permissions.map((perm) => perm.id)) || []
    // @ts-ignore
    setValue('permissions', checked ? allPermissionIds : [])
  }

  const selectedPermissions = watch('permissions')

  const onSubmit = (data: RoleSchemaType) => {
    onCreate(data as RoleCreateRequest)
    form.reset()
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-5">
              {/* Role Name */}
              <FormField
                control={form.control}
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
              {/* Role Description */}
              <FormField
                control={form.control}
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
              {/* Select All Permissions */}
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Barchasini tanlash</h3>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="select-all-global"
                    checked={
                      permissions
                        ?.flatMap((module) => module.permissions.map((perm) => perm.id))
                        .every((id) => selectedPermissions.includes(id)) || false
                    }
                    onCheckedChange={(checked) => handleSelectAllGlobal(!!checked)}
                  />
                  <Label htmlFor="select-all-global">Barchasini tanlash</Label>
                </div>
              </div>
              {/* Module and Permissions */}
              <ScrollArea className="max-h-[300px] rounded-md border p-2">
                {permissions?.map((module, index) => (
                  <div key={index}>
                    {/* Module Header */}
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="font-semibold">{module.module} module</h3>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id={`select-all-${module.module}`}
                          checked={module.permissions.every((perm) =>
                            selectedPermissions.includes(perm.id)
                          )}
                          onCheckedChange={(checked) =>
                            handleSelectAllModule(
                              module.permissions.map((perm) => perm.id),
                              !!checked
                            )
                          }
                        />
                        <Label htmlFor={`select-all-${module.module}`}>Hammasini tanlash</Label>
                      </div>
                    </div>
                    {/* Module Permissions */}
                    <div className="mb-4 grid grid-cols-3 gap-2">
                      {module.permissions.map((perm) => (
                        <div className="flex items-center gap-2" key={perm.id}>
                          <Checkbox
                            id={perm.id}
                            checked={selectedPermissions.includes(perm.id)}
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
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default AddRoleModal
