'use client'

import { useState } from 'react'
import { Search, PlusCircle, Edit, Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import AddPermissionModal from './add-permissions-modal'
import { useMutation, useQuery } from 'react-query'
import {
  addPermissions,
  DeletePermission,
  fetchAllPermission,
  UpdatePermission,
} from '@/services/admin.service'
import { PermissionCreateBody } from '../../../../../types/admin/admin.types'
import { Popconfirm } from 'antd'
import EditPermissionModal, {
  PermissionUpdateBody,
} from '@/components/pages/admin/admin-permissions/edit-permissions-modal'

export default function PermissionsManagement() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddPermissionModalOpen, setIsAddPermissionModalOpen] = useState(false)
  const [isEditPermissionModalOpen, setIsEditPermissionModalOpen] = useState(false)
  const [currentPermission, setCurrentPermission] = useState<any>(null)

  const { data: permissions, refetch } = useQuery({
    queryKey: ['permissions'],
    queryFn: () => fetchAllPermission(),
  })

  console.log(permissions)

  const CreatePermissionMutation = useMutation(addPermissions, {
    onSuccess: (data) => {
      refetch()
    },
    onError: (error) => {
      console.log(error)
    },
  })

  const updatePermissionMutation = useMutation(UpdatePermission, {
    onSuccess: () => {
      refetch()
    },
    onError: (error) => {
      console.log(error)
    },
  })

  const DeletePermissionMutation = useMutation(DeletePermission, {
    onSuccess: () => {
      refetch()
    },
    onError: (error) => {
      console.log(error)
    },
  })

  const addPermission = (data: PermissionCreateBody) => {
    CreatePermissionMutation.mutate({ data })
    setIsAddPermissionModalOpen(false)
  }

  const deletePermission = (id: string) => {
    DeletePermissionMutation.mutate({ id })
  }

  const editPermission = (data: PermissionUpdateBody, id: string) => {
    updatePermissionMutation.mutate({ data, id })
    setIsEditPermissionModalOpen(false)
  }

  return (
    <div className="w-full">
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-bold">Ruxsatlar</h1>
            <p className="text-muted-foreground">Tizim ruxsatlarini boshqarish</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="relative w-80">
              <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
              <Input
                type="search"
                placeholder="Ruxsatlarni qidirish..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Button
              className="bg-black hover:bg-gray-800"
              onClick={() => setIsAddPermissionModalOpen(true)}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Ruxsat Qo'shish
            </Button>
          </div>
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Nomi</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Kalit</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Tavsif</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Modul</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">Amallar</th>
                </tr>
              </thead>
              <tbody>
                {permissions?.data?.flatMap((permissionGroup) =>
                  permissionGroup?.permissions?.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="px-4 py-3 font-medium">{item.name}</td>
                      <td className="px-4 py-3 font-mono text-sm">{item.key}</td>
                      <td className="px-4 py-3">{item.description}</td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="bg-gray-100 font-normal">
                          {permissionGroup.module}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => {
                              setCurrentPermission({ ...item, module: permissionGroup.module })
                              setIsEditPermissionModalOpen(true)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Popconfirm
                            onConfirm={() => deletePermission(item.id)}
                            title={"O'chirishga rozimisiz?"}
                          >
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </Popconfirm>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <AddPermissionModal
        open={isAddPermissionModalOpen}
        close={() => setIsAddPermissionModalOpen(false)}
        handleCreatePermission={addPermission}
      />
      <EditPermissionModal
        open={isEditPermissionModalOpen}
        close={() => setIsEditPermissionModalOpen(false)}
        initialData={currentPermission}
        // @ts-ignore
        handleUpdatePermission={editPermission}
      />
    </div>
  )
}
