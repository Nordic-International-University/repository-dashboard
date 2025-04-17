export type AdminUser = {
  id: string
  name: string
  email: string
  role: string
  status: 'Active' | 'Inactive'
  lastLogin: string
}

export interface RawPermission {
  id: string
  name: string
  key: string
  description: string
}

export interface RawPermissionModule {
  module: string
  permissions: RawPermission[]
}

export interface UsersList {
  id: string
  fullname: string
  username: string
  role: {
    id: string
    name: string
  }
  isActive: boolean
  lastLogin: string | null
}

export interface UsersGetResponse {
  count: number
  pageCount: number | null
  data: UsersList[]
}

export interface addUserBody {
  username: string
  fullname: string
  password: string
  isActive: boolean
  roleId: string
}

export interface Role {
  id: string
  name: string
  description: string
  permissions: {
    id: string
    name: string
  }[]
  user: number
}

export interface RoleListResponse {
  pageCount: number
  pageSize: number
  data: Role[]
}

export interface PermissionSubItem {
  id: string
  name: string
  key: string
  description: string
}

export interface PermissionItem {
  module: string
  permissions: PermissionSubItem[]
}

export interface PermissionResponse {
  total: number
  pageNumber: number
  pageSize: number
  pageCount: number
  data: PermissionItem[]
}

export interface RoleCreateRequest {
  name: string
  description: string
  permissions: string[]
}

export interface PermissionCreateBody {
  name: string
  key: string
  description: string
  module: string
}
