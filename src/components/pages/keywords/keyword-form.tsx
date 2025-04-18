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
import { keywordFormScheme } from '@/schemes/keyword.scheme'
import { KeywordFormProps } from '../../../../types/keyword/keyword.types'

export const KeywordForm = ({ onSubmitFunction, initialData }: KeywordFormProps) => {
  const form = useForm({
    resolver: zodResolver(keywordFormScheme),
    defaultValues: {
      value: '',
    },
  })

  useEffect(() => {
    if (initialData) {
      form.reset({
        value: initialData.value,
      })
    }
  }, [initialData])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitFunction)} className="w-full space-y-6">
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kalit so‘z</FormLabel>
              <FormControl>
                <Input placeholder="Masalan: linear-algebra" className="w-full" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit" className="w-full md:w-auto">
            Saqlash
          </Button>
        </div>
      </form>
    </Form>
  )
}
