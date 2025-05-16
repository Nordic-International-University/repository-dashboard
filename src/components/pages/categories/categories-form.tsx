// components/pages/categories/categories-form.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from 'react-query'
import { toast } from 'sonner'
import * as LucideIcons from 'lucide-react'

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
import { Textarea } from '@/components/ui/textarea'
import { categorySchema, type CategoryFormSchema } from '@/schemes/categories.scheme'
import { categoryService } from '@/services/category.service'
import type { Category } from '@/../types/category/category.types'
import {Select} from "antd";

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
            icon: initialData?.icon || '',
            description: initialData?.description || '',
        },
    })

    // Update form values if the `initialData` changes
    useEffect(() => {
        if (initialData) {
            form.reset({
                name: initialData.name || '',
                icon: initialData.icon || '',
                description: initialData.description || '',
            })
        }
    }, [initialData, form])

    // Define the mutation for creating a new category
    const createMutation = useMutation({
        mutationFn: categoryService.createCategory,
        onSuccess: () => {
            // Invalidate queries to refresh the list of categories
            queryClient.invalidateQueries({ queryKey: ['categories'] })
            toast.success('Yo‘nalish muvaffaqiyatli yaratildi')
            form.reset()
            if (onSuccess) onSuccess()
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Yo‘nalishni yaratishda xatolik yuz berdi')
        },
    })

    // Define the mutation for updating an existing category
    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: CategoryFormSchema }) =>
            categoryService.updateCategory(id, data as any),
        onSuccess: () => {
            // Invalidate queries to refresh the list of categories
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

    const selectedIcon = form.watch('icon')
    const IconComponent = selectedIcon ? (LucideIcons as any)[selectedIcon] : null

    const iconOptions = React.useMemo(() => {
        return Object.keys(LucideIcons)
            .filter((key) => /^[A-Z]/.test(key))
            .sort()
            .map((iconName) => ({
                label: iconName,
                value: iconName,
                icon: (LucideIcons as any)[iconName],
            }));
    }, []);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Category Name Field */}
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

                {/* Icon Selection Field */}
                <FormField
                    control={form.control}
                    name="icon"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Ikonka</FormLabel>
                            <FormControl>
                                <Select
                                    showSearch
                                    placeholder="Ikonka tanlang"
                                    value={field.value}
                                    onChange={(value) => field.onChange(value)} // Update the value
                                    filterOption={(input, option) =>
                                        (option?.label?.toString().toLowerCase() || '').includes(input.toLowerCase())
                                    }
                                    optionLabelProp="label"
                                    className="w-full"
                                >
                                    {iconOptions.map((option) => (
                                        <Select.Option key={option.value} value={option.value} label={option.label}>
                                            <div className="flex items-center gap-2">
                                                <option.icon className="h-5 w-5" />
                                                <span>{option.label}</span>
                                            </div>
                                        </Select.Option>
                                    ))}
                                </Select>
                            </FormControl>
                            {IconComponent && (
                                <div className="mt-2 flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                                    <IconComponent className="h-5 w-5" />
                                    <span className="text-sm text-gray-700">Tanlangan ikonka: {field.value}</span>
                                </div>
                            )}
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tavsif</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Yo‘nalish haqida qisqacha ma’lumot..."
                                    className="resize-none"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Submit Button */}
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full"
                >
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