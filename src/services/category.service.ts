import { axiosInstance } from '@/services/base.axios'
import { Category, CategoryResponse } from '../../types/category/category.types'

export const categoryService = {
  async getCategories(pageNumber = 1, pageSize = 5, search = ''): Promise<CategoryResponse> {
    try {
      const params: Record<string, string | number> = {
        pageNumber,
        pageSize,
      }
      if (search) {
        params.search = search
      }

      const response = await axiosInstance.get<CategoryResponse>('/category', {
        params,
      })
      console.log(params)
      return response.data
    } catch (error) {
      console.error('Error fetching categories:', error)
      throw error
    }
  },

  async getCategoryById(id: string): Promise<Category> {
    try {
      const response = await axiosInstance.get<Category>(`/category/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching category with ID ${id}:`, error)
      throw error
    }
  },

  async createCategory(category: Omit<Category, 'id'>): Promise<Category> {
    try {
      const response = await axiosInstance.post<Category>('/category', category)
      return response.data
    } catch (error) {
      console.error('Error creating category:', error)
      throw error
    }
  },

  async updateCategory(
    categoryId: string,
    category: undefined | CategoryResponse
  ): Promise<Category> {
    console.log(categoryId)
    try {
      const response = await axiosInstance.patch<Category>(`/category/${categoryId}`, category)
      return response.data
    } catch (error) {
      console.error(`Error updating category with ID ${categoryId}:`, error)
      throw error
    }
  },

  async deleteCategory({ id }: { id: string }): Promise<void> {
    console.log(id)
    try {
      await axiosInstance.delete(`/category/${id}`)
    } catch (error) {
      console.error(`Error deleting category with ID ${id}:`, error)
      throw error
    }
  },
}
