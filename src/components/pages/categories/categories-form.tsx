'use client'

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from 'react-query'
import { toast } from 'sonner'

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
import { categorySchema, type CategoryFormSchema } from '@/schemes/categories.scheme'
import { categoryService } from '@/services/category.service'
import type { Category } from '@/../types/category/category.types'

interface CategoryFormProps {
  initialData?: Category
  onSuccess?: () => void
}

export function CategoryForm({ initialData, onSuccess }: CategoryFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const queryClient = useQueryClient()

  const isEditMode = !!initialData

  const form = useForm<CategoryFormSchema>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: initialData?.name || '',
    },
  })

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name || '',
      })
    }
  }, [initialData, form])

  const createMutation = useMutation({
    mutationFn: categoryService.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast.success('Yo‘nalish muvaffaqiyatli yaratildi')
      form.reset()
      if (onSuccess) onSuccess()
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Yo‘nalishni yaratishda xatolik yuz berdi')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CategoryFormSchema }) =>
      categoryService.updateCategory(id, data as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast.success('Yo‘nalish muvaffaqiyatli yangilandi')
      if (onSuccess) onSuccess()
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Yo‘nalishni yangilashda xatolik yuz berdi')
    },
  })

  const onSubmit = async (data: CategoryFormSchema) => {
    setIsLoading(true)
    try {
      if (isEditMode && initialData?.id) {
        await updateMutation.mutateAsync({ id: initialData.id, data })
      } else {
        await createMutation.mutateAsync(data)
      }
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Yo‘nalish nomi</FormLabel>
              <FormControl>
                <Input placeholder="Masalan: Fizika, Matematika..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading
            ? 'Saqlanmoqda...'
            : isEditMode
              ? 'Yo‘nalishni yangilash'
              : 'Yangi yo‘nalish yaratish'}
        </Button>
      </form>
    </Form>
  )
}
