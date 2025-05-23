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
  onCreate: (data: RoleCreateRequest) => void
  onClose: (set: boolean) => void
}

const AddRoleModal: FC<AddRoleModalProps> = ({ permissions, isOpen, onCreate, onClose }) => {
  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
      permissions: [] as string[],
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
          current.filter((item) => item !== id)
      )
    }
  }

  const handleSelectAllModule = (moduleId: string[], checked: boolean) => {
    const current = getValues('permissions') || []
    const updatedPermissions = checked
        ? Array.from(new Set([...current, ...moduleId]))
        : current.filter((id) => !moduleId.includes(id))
    setValue('permissions', updatedPermissions)
  }

  const handleSelectAllGlobal = (checked: boolean) => {
    const allPermissionIds = permissions?.flatMap((module) =>
        module.permissions.map((perm) => perm.id)
    ) || []

    setValue('permissions', checked ? allPermissionIds : [])
  }

  const onSubmit = (data: RoleCreateRequest) => {
    onCreate(data)
    form.reset()
  }

  const selectedPermissions = watch('permissions')

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
                <ScrollArea className="max-h-[300px] rounded-md border p-2">
                  {permissions?.map((module, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-2">
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
                        <div className="mb-4 grid grid-cols-3 gap-2">
                          {module.permissions.map((perm) => (
                              <div className="flex items-center gap-2" key={perm.id}>
                                <Checkbox
                                    id={perm.id}
                                    checked={selectedPermissions.includes(perm.id)}
                                    onCheckedChange={(checked) =>
                                        handleCheckboxChange(perm.id, !!checked)
                                    }
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

export default AddRoleModal