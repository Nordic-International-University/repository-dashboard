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
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from '@/icons'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import React, { useState } from 'react'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { formSchema } from '@/schemes/auth.scheme'
import { useMutation } from 'react-query'
import { authLogin } from '@/services/auth.service'
import { toast } from '@/components/toast/toast'
import { useRouter } from 'next/navigation'
import Cookie from 'js-cookie'
import { AuthResponse } from '../../../types/auth/auth.types'
import { useAuth } from '@/components/auth/auth-context'

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const { setAuthenticated } = useAuth()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  const AuthMutation = useMutation(authLogin, {
    onSuccess: (data: AuthResponse) => {
      Cookie.set('access_token', data.accessToken)
      setAuthenticated(true)
      toast('Muvaffaqiyatli kirildi!', '', () => console.log('success'))
      router.push('/')
    },
    onError: (error: Error) => {
      console.log(error)
      toast('parol yoki login xato!', '', () => console.log('success'))
    },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    AuthMutation.mutate(values)
  }

  return (
    <div className="flex w-full flex-1 flex-col lg:w-1/2">
      <div className="mx-auto mb-5 w-full max-w-md sm:pt-10">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon />
          Nordic Repository Dashboard ga qaytish
        </Link>
      </div>

      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
        <div className="mb-5 sm:mb-8">
          <h1 className="text-title-sm sm:text-title-md mb-2 font-semibold text-gray-800 dark:text-white/90">
            Tizimga kirish
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Kirish uchun username va parolingizni kiriting!
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Foydalanuvchi nomi <span className="text-error-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="username kiriting" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Parol <span className="text-error-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Parolingizni kiriting"
                        {...field}
                      />
                      <span
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute top-1/2 right-4 z-30 -translate-y-1/2 cursor-pointer"
                      >
                        {showPassword ? (
                          <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                        ) : (
                          <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                        )}
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" size="sm">
              Kirish
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
