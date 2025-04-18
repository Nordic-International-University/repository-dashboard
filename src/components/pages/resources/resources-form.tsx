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
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { resourceTypeCreateFormScheme } from '@/schemes/resource-type.scheme'
import { useEffect } from 'react'
import { ResourceTypeFormProps } from '../../../../types/resources/rosurce.types'

type ResourceTypeFormValues = z.infer<typeof resourceTypeCreateFormScheme>

export const ResourceTypeForm = ({ onSubmitFunction, initialData }: ResourceTypeFormProps) => {
  const form = useForm<ResourceTypeFormValues>({
    resolver: zodResolver(resourceTypeCreateFormScheme),
    defaultValues: {
      name: '',
    },
  })

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
      })
    }
  }, [initialData])

  const onSubmit = (values: ResourceTypeFormValues) => {
    onSubmitFunction(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nomi</FormLabel>
              <FormControl>
                <Input placeholder="Masalan: Kitob" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit">Saqlash</Button>
        </div>
      </form>
    </Form>
  )
}
