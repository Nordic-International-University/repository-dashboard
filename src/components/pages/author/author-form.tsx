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
import { useEffect } from 'react'
import { authorFormSchema } from '@/schemes/author.scheme'
import { Author, AuthorFormValues } from '../../../../types/author/author.types'

interface AuthorFormProps {
  onSubmitFunction: (values: AuthorFormValues) => void
  initialData?: Author
}

export const AuthorForm = ({ onSubmitFunction, initialData }: AuthorFormProps) => {
  const form = useForm({
    resolver: zodResolver(authorFormSchema),
    defaultValues: {
      fullname: '',
      institution: '',
      degree: '',
      department: '',
    },
  })

  useEffect(() => {
    if (initialData) {
      form.reset({
        fullname: initialData.fullname,
        institution: initialData.institution,
        degree: initialData.degree,
        department: initialData.department,
      })
    }
  }, [initialData])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitFunction)} className="space-y-4">
        {['fullname', 'institution', 'degree', 'department'].map((field) => (
          <FormField
            key={field}
            control={form.control}
            name={field as keyof AuthorFormValues}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{field.name === 'fullname' ? 'F.I.Sh.' : field.name}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <div className="flex justify-end">
          <Button type="submit">Saqlash</Button>
        </div>
      </form>
    </Form>
  )
}
