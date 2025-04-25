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
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { collectionsCreateFormScheme } from '@/schemes/collections.scheme'
import { CollectionFormProps } from '../../../../types/colecctions/collections.types'
import { useEffect } from 'react'
import FileUpload from '@/components/file.upload'

type CollectionFormValues = z.infer<typeof collectionsCreateFormScheme>

export const CollectionForm = ({ onSubmitFunction, initialData }: CollectionFormProps) => {
  const form = useForm<CollectionFormValues>({
    resolver: zodResolver(collectionsCreateFormScheme),
    defaultValues: {
      title: '',
      description: '',
      coverImage: '',
    },
  })

  useEffect(() => {
    if (initialData) {
      form.reset({
        title: initialData.title,
        description: initialData.description,
        coverImage: initialData.coverImage,
      })
    }
  }, [])

  console.log(form.getValues())

  const onSubmit = (values: CollectionFormValues) => {
    onSubmitFunction(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sarlavha</FormLabel>
              <FormControl>
                <Input placeholder="Masalan: Advanced Mathematics Resources" {...field} />
              </FormControl>
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
                  placeholder="Masalan: A collection of advanced math materials"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="coverImage"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <FileUpload
                  variant="single"
                  onChange={(id) => {
                    form.setValue('coverImage', id[0] as any)
                  }}
                  accept="image/*"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="itmes-center flex justify-end">
          <Button type="submit">Bolim yaratish</Button>
        </div>
      </form>
    </Form>
  )
}
