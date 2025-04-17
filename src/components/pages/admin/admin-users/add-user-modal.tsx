'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { addUserBody, Role } from '../../../../../types/admin/admin.types'

interface AddUserModalProps {
  isOpen: boolean
  onClose: () => void
  onAddUser: (user: addUserBody) => void
  availableRoles: Role[] | null
}

export default function AddUserModal({
  isOpen,
  onClose,
  onAddUser,
  availableRoles,
}: AddUserModalProps) {
  const [formData, setFormData] = useState<addUserBody & { confirmPassword: string }>({
    username: '',
    fullname: '',
    roleId: '',
    isActive: true,
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.username.trim()) {
      newErrors.username = 'Foydalanuvchi nomi kiritilishi kerak'
    }

    if (!formData.fullname.trim()) {
      newErrors.fullname = 'Ism va familiya kiritilishi kerak'
    }

    if (!formData.roleId) {
      newErrors.roleId = 'Roli tanlanishi kerak'
    }

    if (!formData.password) {
      newErrors.password = 'Parol kiritilishi kerak'
    } else if (formData.password.length < 8) {
      newErrors.password = "Parol kamida 8 belgidan iborat bo'lishi kerak"
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Parollar bir xil emas'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      const { confirmPassword, ...userData } = formData
      onAddUser(userData)
      resetForm()
    }
  }

  const resetForm = () => {
    setFormData({
      username: '',
      fullname: '',
      roleId: '',
      isActive: true,
      password: '',
      confirmPassword: '',
    })
    setErrors({})
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Yangi Admin Foydalanuvchisini Qo'shish</DialogTitle>
          <DialogDescription>Yangi admin foydalanuvchi hisobini yarating</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username" className={errors.username ? 'text-destructive' : ''}>
                Foydalanuvchi nomi
              </Label>
              <Input
                id="username"
                placeholder="Admin foydalanuvchisi nomini kiriting"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className={errors.username ? 'border-destructive' : ''}
              />
              {errors.username && <p className="text-destructive text-xs">{errors.username}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="fullname" className={errors.fullname ? 'text-destructive' : ''}>
                Ism va Familiya
              </Label>
              <Input
                id="fullname"
                placeholder="Admin foydalanuvchisi ism va familiyasini kiriting"
                value={formData.fullname}
                onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                className={errors.fullname ? 'border-destructive' : ''}
              />
              {errors.fullname && <p className="text-destructive text-xs">{errors.fullname}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role" className={errors.roleId ? 'text-destructive' : ''}>
                Rol
              </Label>
              <Select
                value={formData.roleId}
                onValueChange={(value) => setFormData({ ...formData, roleId: value })}
              >
                <SelectTrigger className={`${errors.roleId ? 'border-destructive' : ''} w-full`}>
                  <SelectValue placeholder="Rolni tanlang" />
                </SelectTrigger>
                <SelectContent>
                  {availableRoles?.map((role) => (
                    <SelectItem key={role.name} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.roleId ? (
                <p className="text-destructive text-xs">{errors.roleId}</p>
              ) : (
                <p className="text-muted-foreground mt-1 text-xs">
                  Rol foydalanuvchining huquqlarini belgilaydi.
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <RadioGroup
                value={formData.isActive ? 'Active' : 'Inactive'}
                onValueChange={(value) =>
                  setFormData({ ...formData, isActive: value === 'Active' })
                }
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Active" id="active" />
                  <Label htmlFor="active">Faol</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Inactive" id="inactive" />
                  <Label htmlFor="inactive">Faol emas</Label>
                </div>
              </RadioGroup>
              <p className="text-muted-foreground mt-1 text-xs">
                Faol emas foydalanuvchilar tizimga kira olmaydi.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password" className={errors.password ? 'text-destructive' : ''}>
                Parol
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Parolni kiriting"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={errors.password ? 'border-destructive' : ''}
              />
              {errors.password ? (
                <p className="text-destructive text-xs">{errors.password}</p>
              ) : (
                <p className="text-muted-foreground text-xs">
                  Parol kamida 8 belgidan iborat bo'lishi kerak.
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="confirm-password"
                className={errors.confirmPassword ? 'text-destructive' : ''}
              >
                Parolni tasdiqlash
              </Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Parolni tasdiqlang"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className={errors.confirmPassword ? 'border-destructive' : ''}
              />
              {errors.confirmPassword && (
                <p className="text-destructive text-xs">{errors.confirmPassword}</p>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Bekor qilish
          </Button>
          <Button className="bg-black hover:bg-gray-800" onClick={handleSubmit}>
            Foydalanuvchini yaratish
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
