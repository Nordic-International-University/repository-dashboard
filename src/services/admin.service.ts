import { axiosInstance } from './base.axios'
import {
  addUserBody,
  PermissionCreateBody,
  PermissionResponse,
  RoleCreateRequest,
  RoleListResponse,
  UsersGetResponse,
} from '../../types/admin/admin.types'
import { AxiosError } from 'axios'
import { PermissionUpdateBody } from '@/components/pages/admin/admin-permissions/edit-permissions-modal'

export const getAllAdminUsers = async (): Promise<UsersGetResponse | null> => {
  try {
    const response = await axiosInstance.get<UsersGetResponse>('/user')
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('API xatosi yuz berdi:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      })
    } else {
      console.error("Noma'lum xato yuz berdi:", error)
    }
    return null
  }
}

export const AddAdminUser = async ({
  data,
}: {
  data: addUserBody
}): Promise<UsersGetResponse | null> => {
  try {
    console.log(data)
    const response = await axiosInstance.post<UsersGetResponse>('/user', data)
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('API xatosi yuz berdi:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      })
    } else {
      console.error("Noma'lum xato yuz berdi:", error)
    }
    return null
  }
}

export const updateAdminUser = async ({
  data,
  id,
}: {
  data: addUserBody
  id: string
}): Promise<void> => {
  try {
    await axiosInstance.patch(`/user/${id}`, data)
  } catch (error) {
    console.log(error)
    if (error instanceof AxiosError) {
      console.error('API xatosi yuz berdi:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      })
    } else {
      console.error("Noma'lum xato yuz berdi:", error)
    }
  }
}

export const DeleteAdminUser = async ({ id }: { id: string }): Promise<void> => {
  try {
    await axiosInstance.delete(`/user/${id}`)
  } catch (error) {
    console.log(error)
    if (error instanceof AxiosError) {
      console.error('API xatosi yuz berdi:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      })
    } else {
      console.error("Noma'lum xato yuz berdi:", error)
    }
  }
}

export const fetchRoles = async (): Promise<RoleListResponse | null> => {
  try {
    const response = await axiosInstance.get<RoleListResponse | null>('/role')
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('API error occurred while fetching roles:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      })
    } else {
      console.error('Unknown error occurred while fetching roles:', error)
    }
    return null
  }
}

export const addRoles = async ({
  data,
}: {
  data: RoleCreateRequest
}): Promise<PermissionResponse | null> => {
  console.log(data)
  try {
    const response = await axiosInstance.post<PermissionResponse | null>('/role', {
      ...data,
    })
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('API error occurred while fetching roles:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      })
    } else {
      console.error('Unknown error occurred while fetching roles:', error)
    }
    return null
  }
}

export const DeleteRoles = async ({ id }: { id: string }): Promise<void> => {
  try {
    await axiosInstance.delete(`/role/${id}`)
  } catch (error) {
    console.log(error)
    if (error instanceof AxiosError) {
      console.error('API xatosi yuz berdi:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      })
    } else {
      console.error("Noma'lum xato yuz berdi:", error)
    }
  }
}

//permission

export const fetchAllPermission = async (): Promise<PermissionResponse | null> => {
  try {
    const response = await axiosInstance.get<PermissionResponse | null>('/permission')
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('API error occurred while fetching roles:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      })
    } else {
      console.error('Unknown error occurred while fetching roles:', error)
    }
    return null
  }
}

export const addPermissions = async ({ data }: { data: PermissionCreateBody }): Promise<void> => {
  try {
    await axiosInstance.post<PermissionResponse | null>('/permission', {
      ...data,
    })
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('API error occurred while fetching roles:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      })
    } else {
      console.error('Unknown error occurred while fetching roles:', error)
    }
  }
}

export const DeletePermission = async ({ id }: { id: string }): Promise<void> => {
  try {
    await axiosInstance.delete(`/permission/${id}`)
  } catch (error) {
    console.log(error)
    if (error instanceof AxiosError) {
      console.error('API xatosi yuz berdi:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      })
    } else {
      console.error("Noma'lum xato yuz berdi:", error)
    }
  }
}

export const UpdatePermission = async ({
  data,
  id,
}: {
  data: PermissionUpdateBody
  id: string
}): Promise<void> => {
  try {
    const res = await axiosInstance.patch(`/permission/${id}`, data)
    console.log(res)
  } catch (error) {
    console.log(error)
    if (error instanceof AxiosError) {
      console.error('API xatosi yuz berdi:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      })
      
      if (error.response?.data?.message === 'Insufficient permissions') {
        const customError = new Error('Bu amal uchun sizda ruxsat yo\'q')
        customError.name = 'PermissionError'
        throw customError
      }
    } else {
      console.error("Noma'lum xato yuz berdi:", error)
    }
    throw error
  }
}

export const UpdateRole = async ({
  data,
  id,
}: {
  data: RoleCreateRequest
  id: string
}): Promise<void> => {
  try {
    await axiosInstance.patch(`/role/${id}`, data)
  } catch (error) {
    console.log(error)
    if (error instanceof AxiosError) {
      console.error('API xatosi yuz berdi:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      })
    } else {
      console.error("Noma'lum xato yuz berdi:", error)
    }
    throw error
  }
}

export const DeleteRoleById = async ({ id }: { id: string }): Promise<void> => {
  try {
    await axiosInstance.delete(`/role/${id}`)
  } catch (error) {
    console.log(error)
    if (error instanceof AxiosError) {
      console.error('API xatosi yuz berdi:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      })
    } else {
      console.error("Noma'lum xato yuz berdi:", error)
    }
  }
}
