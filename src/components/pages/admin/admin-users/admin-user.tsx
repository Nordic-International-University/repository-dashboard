'use client'

import { useState } from 'react'
import { Search, UserPlus, Edit, Trash2, Clock, DeleteIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import AddUserModal from './add-user-modal'
import EditUserModal from './edit-user-modal'
import RolesManagement from '../admin-roles/admin-roles'
import PermissionsManagement from '../admin-permissions/admin-permissions'
import {
  addUserBody,
  RoleListResponse,
  UsersGetResponse,
  UsersList,
} from '../../../../../types/admin/admin.types'
import { useMutation, useQuery } from 'react-query'
import {
  AddAdminUser,
  DeleteAdminUser,
  fetchRoles,
  getAllAdminUsers,
  updateAdminUser,
} from '@/services/admin.service'
import { toast } from 'sonner'
import { Popconfirm } from 'antd'

export default function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false)
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<UsersList | null>(null)

  const { data: roles } = useQuery<RoleListResponse | null>({
    queryKey: ['roles'],
    queryFn: () => fetchRoles(),
  })

  const { data: users, refetch } = useQuery<UsersGetResponse | null>({
    queryKey: ['adminUsers'],
    queryFn: () => getAllAdminUsers(),
  })

  const AdduserMutation = useMutation(AddAdminUser, {
    onSuccess: () => {
      toast("Admin muvaffaqiyatli qo'shildi!", {
        action: {
          label: 'Undo',
          onClick: () => console.log('Undo'),
        },
      })
      refetch()
    },
    onError: (error) => {
      toast("qo'shishda xatolik yuz berdi!", {
        action: {
          label: 'Undo',
          onClick: () => console.log('Undo'),
        },
      })
    },
  })

  const UpdateUserMutation = useMutation(updateAdminUser, {
    onSuccess: (data) => {
      console.log(data)
      toast('Admin muvaffaqiyatli yangilandi!', {
        action: {
          label: 'Undo',
          onClick: () => console.log('Undo'),
        },
      })
      refetch()
    },
    onError: () => {
      toast('Tahrirlashda xatolik yuz berdi!', {
        action: {
          label: 'Undo',
          onClick: () => console.log('Undo'),
        },
      })
    },
  })

  const DeleteUserMutation = useMutation(DeleteAdminUser, {
    onSuccess: () => {
      toast("Admin muvaffaqiyatli o'chirildi!", {
        action: {
          label: 'Undo',
          onClick: () => console.log('Undo'),
        },
      })
      refetch()
    },
    onError: () => {
      toast("Adminni o'chirishda xatolik yuz berdi!", {
        action: {
          label: 'Undo',
          onClick: () => console.log('Undo'),
        },
      })
    },
  })

  const addUser = (data: addUserBody) => {
    AdduserMutation.mutate({ data })
    setIsAddUserModalOpen(false)
    refetch()
  }

  const updateUser = (id: string, data: addUserBody) => {
    UpdateUserMutation.mutate({ data, id })
    setIsEditUserModalOpen(false)
  }

  const deleteUser = (id: string) => {
    DeleteUserMutation.mutate({ id })
    refetch()
  }

  const openModal = (user: UsersList) => {
    setIsEditUserModalOpen(true)
    setCurrentUser(user)
  }

  const filteredUsers =
    users?.data.filter((user) => {
      return (
        user.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }) || []

  return (
    <div className="mx-auto w-full dark:bg-[#181F2F]">
      <Tabs defaultValue="admin-users" className="w-full">
        <TabsList className="grid w-full grid-cols-3 rounded-md bg-gray-100 p-1 dark:bg-[#181F2F]">
          <TabsTrigger value="admin-users" className="rounded-sm dark:text-white">
            Admin Foydalanuvchilar
          </TabsTrigger>
          <TabsTrigger value="roles" className="rounded-sm dark:text-white">
            Rollar
          </TabsTrigger>
          <TabsTrigger value="permissions" className="rounded-sm dark:text-white">
            Ruxsatlar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="admin-users" className="mt-4">
          <div className="rounded-lg border bg-white p-6 shadow-sm dark:bg-[#181F2F]">
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold dark:text-white">Admin Foydalanuvchilar</h1>
                <p className="text-muted-foreground dark:text-gray-300">
                  Admin foydalanuvchilar va ularning rollarini boshqarish
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="relative w-80">
                  <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                  <Input
                    type="search"
                    placeholder="Admin foydalanuvchilarni qidirish..."
                    className="pl-8 dark:bg-[#181F2F] dark:text-white"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <Button
                  className="bg-black hover:bg-gray-800 dark:bg-[white]"
                  onClick={() => setIsAddUserModalOpen(true)}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Admin Foydalanuvchi Qo'shish
                </Button>
              </div>

              <div className="rounded-md border dark:bg-[#181F2F]">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-50 dark:bg-[#181F2F]">
                      <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-white">
                        Ism
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-white">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-white">
                        Rol
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-white">
                        Holat
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-white">
                        Oxirgi Kirish
                      </th>
                      <th className="px-4 py-3 text-right font-medium text-gray-500 dark:text-white">
                        Amallar
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers?.map((user) => (
                      <tr key={user.id} className="border-b dark:bg-[#181F2F]">
                        <td className="px-4 py-3 dark:text-white">{user.fullname}</td>
                        <td className="px-4 py-3 dark:text-white">{user.username}</td>
                        <td className="px-4 py-3 dark:text-white">
                          <Badge
                            variant="outline"
                            className="bg-gray-100 font-normal dark:bg-[#181F2F]"
                          >
                            {user.role.name}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            variant={user.isActive ? 'default' : 'secondary'}
                            className={
                              user.isActive
                                ? 'bg-green-500 hover:bg-green-500'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-200'
                            }
                          >
                            {user.isActive ? 'Faol' : 'Faol emas'}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 dark:text-white">
                          <div className="text-muted-foreground flex items-center">
                            <Clock className="mr-2 h-3 w-3" />
                            {user?.lastLogin || 'Hali hisobiga kirmagan'}
                          </div>
                        </td>
                        <td className="relative px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => openModal(user)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Popconfirm
                              onConfirm={() => deleteUser(user.id)}
                              title={"O'chirishga rozimisiz?"}
                            >
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Trash2 />
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
        </TabsContent>

        <TabsContent value="roles" className="mt-4">
          <RolesManagement />
        </TabsContent>

        <TabsContent value="permissions" className="mt-4">
          <PermissionsManagement />
        </TabsContent>
      </Tabs>
      <AddUserModal
        isOpen={isAddUserModalOpen}
        onAddUser={addUser}
        onClose={() => setIsAddUserModalOpen(false)}
        availableRoles={roles?.data || null}
      />
      <EditUserModal
        open={isEditUserModalOpen}
        close={setIsEditUserModalOpen}
        roles={roles?.data || null}
        values={currentUser || null}
        onEdit={updateUser}
      />
    </div>
  )
}
