import { useQuery, useMutation, useQueryClient } from 'react-query'
import { categoryService } from '@/services/category.service'

import { toast } from 'sonner'
import { Category } from '../../types/category/category.types'

export const useCategoriesQuery = () =>
  useQuery({
    queryKey: ['categories-all'],
    queryFn: () => categoryService.getCategories(1, 1000),
  })

export function useCategories(pageNumber = 1, pageSize = 10, search = '') {
  const queryClient = useQueryClient()

  const { data, isLoading, error, refetch } = useQuery(
    ['categories', pageNumber, pageSize, search],
    () => categoryService.getCategories(pageNumber, pageSize, search)
  )

  const createMutation = useMutation(
    (newCategory: Omit<Category, 'id'>) => categoryService.createCategory(newCategory),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['categories'])
        toast('Category created successfully', {
          description: 'The new category has been added to the database',
        })
      },
      onError: (error: any) => {
        toast('Failed to create category', {
          description:
            error.response?.data?.message || 'An error occurred while creating the category',
        })
      },
    }
  )

  const updateMutation = useMutation(
    // @ts-ignore
    (category: Category) => categoryService.updateCategory(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['categories'])
        toast('Category updated successfully', {
          description: 'The category has been updated in the database',
        })
      },
      onError: (error: any) => {
        toast('Failed to update category', {
          description:
            error.response?.data?.message || 'An error occurred while updating the category',
        })
      },
    }
  )

  // @ts-ignore
  const deleteMutation = useMutation((id: string) => categoryService.deleteCategory(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(['categories'])
      toast('Category deleted successfully', {
        description: 'The category has been removed from the database',
      })
    },
    onError: (error: any) => {
      toast('Failed to delete category', {
        description:
          error.response?.data?.message || 'An error occurred while deleting the category',
      })
    },
  })

  return {
    categories: data?.data || [],
    pagination: data
      ? {
          count: data.count,
          pageNumber: data.pageNumber,
          pageSize: data.pageSize,
          pageCount: data.pageCount,
        }
      : null,
    isLoading,
    error,
    refetch,
    createCategory: createMutation.mutate,
    updateCategory: updateMutation.mutate,
    deleteCategory: deleteMutation.mutate,
    isCreating: createMutation.isLoading,
    isUpdating: updateMutation.isLoading,
    isDeleting: deleteMutation.isLoading,
  }
}

export function useCategoryById(id?: string) {
  return useQuery(['category', id], () => categoryService.getCategoryById(id!), {
    enabled: !!id,
  })
}
