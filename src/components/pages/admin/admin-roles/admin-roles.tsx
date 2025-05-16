'use client'
import { useState } from 'react'
import { Search, PlusCircle, Edit, Trash2, Users } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import AddRoleModal from './add-role-modal'
import { Role, RoleCreateRequest } from '../../../../../types/admin/admin.types'
import { useMutation, useQuery } from 'react-query'
import {
  addRoles,
  DeleteRoles,
  fetchAllPermission,
  fetchRoles,
  UpdateRole,
} from '@/services/admin.service'
import EditRoleModal from '@/components/pages/admin/admin-roles/edit-role-modal'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { clsx } from 'clsx'
import { Popconfirm } from 'antd'
import { toast } from 'sonner'

export default function RolesManagement() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddRoleModalOpen, setIsAddRoleModalOpen] = useState(false)
  const [isEditRoleModalOpen, setIsEditRoleModalOpen] = useState(false)
  const [currentRole, setCurrentRole] = useState<Role | null>(null)

  const { data: roles, refetch } = useQuery({
    queryKey: ['roles'],
    queryFn: () => fetchRoles(),
  })

  const { data: permissions } = useQuery({
    queryKey: ['permissions'],
    queryFn: () => fetchAllPermission(),
  })

  const createRoleMutation = useMutation(addRoles, {
    onSuccess: () => {
      refetch()
      setIsAddRoleModalOpen(false)
    },
    onError: (error) => {
      console.log(error)
    },
  })

  const UpdateRoleMutation = useMutation(UpdateRole, {
    onSuccess: () => {
      refetch()
      setIsEditRoleModalOpen(false)
    },
    onError: (error) => {
      console.log(error)
    },
  })

  const deleteRoleMutation = useMutation(DeleteRoles, {
    onSuccess: () => {
      toast("Rol muvaffaqiyatli o'chirildi!", {
        action: {
          label: 'Undo',
          onClick: () => console.log('Undo'),
        },
      })
      refetch()
    },
    onError: (error) => {
      console.log(error)
    },
  })

  const addRole = (data: RoleCreateRequest) => {
    createRoleMutation.mutate({ data })
  }

  const updateRole = (data: RoleCreateRequest, id: string) => {
    UpdateRoleMutation.mutate({ data, id })
  }

  const getPermissionColor = (action: string) => {
    switch (action) {
      case 'view':
        return 'bg-green-500 text-white'
      case 'delete':
        return 'bg-red-500 text-white'
      case 'post':
        return 'bg-orange-500 text-white'
      case 'update':
        return 'bg-blue-500 text-white'
      default:
        return 'bg-gray-300 text-black'
    }
  }

  const getPermissionCount = (role: Role) => {
    if (!role.permissions.length) {
      return (
        <Badge variant="outline" className="bg-gray-100 dark:bg-gray-800 dark:text-white">
          Ruxsat yo‘q
        </Badge>
      )
    }

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge
              variant="outline"
              className="cursor-pointer bg-gray-100 dark:bg-gray-800 dark:text-white"
            >
              {role?.permissions?.length} Ruxsatlar
            </Badge>
          </TooltipTrigger>
          <TooltipContent className="flex max-w-[250px] flex-col flex-wrap gap-1">
            {role?.permissions?.map((perm) => {
              const [resource, action] = perm.name.split(':')
              return (
                <div key={perm.id} className="flex items-center gap-1">
                  <span className="text-xs text-black dark:text-white">{resource}:</span>
                  <Badge className={clsx('text-xs', getPermissionColor(action))}>{action}</Badge>
                </div>
              )
            })}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  const editRole = (role: Role) => {
    setCurrentRole(role)
    setIsEditRoleModalOpen(true)
  }

  const removeRole = (id: string) => {
    deleteRoleMutation.mutate({ id })
  }

  return (
    <div className="w-full">
      <div className="rounded-lg border bg-white p-6 shadow-sm dark:bg-[#181F2F]">
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-bold text-black dark:text-white">Rollar</h1>
            <p className="text-muted-foreground dark:text-gray-300">
              Rollar va ularning ruxsatlarini boshqarish
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="relative w-80">
              <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4 dark:text-gray-400" />
              <Input
                type="search"
                placeholder="Rollarni qidirish..."
                className="pl-8 dark:bg-[#1F2937] dark:text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Button onClick={() => setIsAddRoleModalOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Rol Qo'shish
            </Button>
          </div>

          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50 dark:bg-[#1f2937]">
                  <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-300">
                    Rol Nomi
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-300">
                    Tavsif
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-300">
                    Ruxsatlar
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-300">
                    Foydalanuvchilar
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500 dark:text-gray-300">
                    Amallar
                  </th>
                </tr>
              </thead>
              <tbody>
                {roles?.data?.map((role) => (
                  <tr key={role.id} className="border-b hover:bg-gray-100 dark:hover:bg-[#1F2937]">
                    <td className="px-4 py-3 font-medium text-black dark:text-white">
                      {role.name}
                    </td>
                    <td className="px-4 py-3 text-black dark:text-white">{role.description}</td>
                    <td className="px-4 py-3">{getPermissionCount(role)}</td>
                    <td className="px-4 py-3">
                      <div className="text-muted-foreground flex items-center text-sm dark:text-gray-300">
                        <Users className="mr-2 h-3 w-3" />
                        {role.user || 0}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          onClick={() => editRole(role)}
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 dark:text-white"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Popconfirm
                          onConfirm={() => removeRole(role.id)}
                          title={"O'chirishga rozimisiz?"}
                        >
                          <Button variant="ghost" size="icon" className="h-8 w-8 dark:text-white">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </Popconfirm>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AddRoleModal
        permissions={permissions?.data || null}
        isOpen={isAddRoleModalOpen}
        onCreate={addRole}
        onClose={setIsAddRoleModalOpen}
      />

      <EditRoleModal
        roles={roles?.data || null}
        values={currentRole}
        permissions={permissions?.data || null}
        isOpen={isEditRoleModalOpen}
        onUpdate={updateRole}
        onClose={setIsEditRoleModalOpen}
      />
    </div>
  )
}
