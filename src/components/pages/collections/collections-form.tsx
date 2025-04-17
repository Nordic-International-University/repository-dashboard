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

type CollectionFormValues = z.infer<typeof collectionsCreateFormScheme>

export const CollectionForm = ({ onSubmitFunction }: CollectionFormProps) => {
  const form = useForm<CollectionFormValues>({
    resolver: zodResolver(collectionsCreateFormScheme),
    defaultValues: {
      title: '',
      description: '',
      coverImage: '',
    },
  })

  const onSubmit = (values: CollectionFormValues) => {
    onSubmitFunction(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
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
                <Input {...field} placeholder="rasm uchun" />
                {/*<FileUpload onChange={(url) => form.setValue('coverImage', url)} accept="image/*" />*/}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Kolleksiyani yaratish</Button>
      </form>
    </Form>
  )
}
