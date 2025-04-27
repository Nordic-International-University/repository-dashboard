'use client'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { subjectCreateFormScheme } from '@/schemes/subject.scheme'
import { useCategoriesQuery } from '@/hooks/use-categories'
import { SubjectFormProps } from '../../../../types/subject-types/subject.types'

export const SubjectForm = ({ onSubmitFunction, initialData }: SubjectFormProps) => {
  const form = useForm({
    resolver: zodResolver(subjectCreateFormScheme),
    defaultValues: {
      name: '',
      categoryId: '',
    },
  })

  const { data: categories } = useCategoriesQuery()

  useEffect(() => {
    if (initialData && categories?.data) {
      form.reset({
        name: initialData.name,
        categoryId: initialData.category?.id ?? '',
      })
    }
  }, [initialData, categories])

  const onSubmit = form.handleSubmit(onSubmitFunction)

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="w-full space-y-6">
        {/* Fan nomi */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fan nomi</FormLabel>
              <FormControl>
                <Input placeholder="Masalan: Algebra" className="w-full" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Yo'nalish</FormLabel>
              <Select
                key={form.watch('categoryId')}
                value={field.value}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Yo'nalishni tanlang" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories?.data.map((category) => (
                    <SelectItem key={category.id} value={category.id ?? ''}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit tugmasi */}
        <div className="flex justify-end">
          <Button type="submit" className="w-full md:w-auto">
            Saqlash
          </Button>
        </div>
      </form>
    </Form>
  )
}
