'use client'

import { useForm } from 'react-hook-form'
import { useQuery } from 'react-query'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { DatePicker, Select } from 'antd'
import dayjs from 'dayjs'
import locale from 'antd/es/date-picker/locale/en_US'
import { getAllAdminUsers } from '@/services/admin.service'

type AuditLogFilterValues = {
  search?: string
  action?: string
  module?: string
  userId?: string
  startDate?: Date
  endDate?: Date
}

const actions = [
  { label: 'Yaratilgan', value: 'CATEGORY_CREATED' },
  { label: 'Yangilangan', value: 'CATEGORY_UPDATED' },
  { label: "O'chirilgan", value: 'CATEGORY_DELETED' },
]

const modules = [
  { label: 'Kategoriya', value: 'CATEGORY' },
  { label: 'Muallif', value: 'AUTHOR' },
  { label: 'Resurs', value: 'RESOURCE' },
  { label: 'Foydalanuvchi', value: 'USER' },
  { label: 'Hujjat', value: 'DOCUMENT' },
  { label: "Kalit so'z", value: 'KEYWORD' },
  { label: 'Ruxsatnoma', value: 'PERMISSION' },
  { label: 'Rol', value: 'ROLE' },
  { label: 'Mavzu', value: 'SUBJECT' },
  { label: 'To‘plam', value: 'COLLECTION' },
  { label: 'Resurs turi', value: 'RESOURCE_TYPE' },
]

const AuditLogsFilter = ({ onChange }: { onChange: (values: any) => void }) => {
  const form = useForm<AuditLogFilterValues>()

  const [popoverOpen, setPopoverOpen] = useState(false)

  const onSubmit = (values: AuditLogFilterValues) => {
    onChange(values)
    console.log(values)
    setPopoverOpen(false)
  }

  const { data: usersResponse } = useQuery({
    queryKey: ['users'],
    queryFn: () => getAllAdminUsers(),
  })

  const userOptions =
    usersResponse?.data.map((u) => ({
      label: `${u.fullname} (${u.username})`,
      value: u.id,
    })) || []

  return (
    <Form {...form}>
      <div className="flex items-center gap-2">
        {/* SEARCH */}
        <FormField
          control={form.control}
          name="search"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input placeholder="Qidiruv..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* FILTER POPOVER */}
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <Button type="button" variant="outline">
              Filter
            </Button>
          </PopoverTrigger>

          {/* 👉 FORMNI POPOVERCONTENT ICHIDA BOSHLAYMIZ */}
          <PopoverContent align="center" className="w-[380px] p-4">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* ACTION SELECT */}
              <FormField
                control={form.control}
                name="action"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Action</FormLabel>
                    <FormControl>
                      <Select
                        options={actions}
                        allowClear
                        value={field.value}
                        onChange={field.onChange}
                        className="w-full"
                        placeholder="Select Action"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* MODULE SELECT */}
              <FormField
                control={form.control}
                name="module"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Module</FormLabel>
                    <FormControl>
                      <Select
                        options={modules}
                        allowClear
                        value={field.value}
                        onChange={field.onChange}
                        className="w-full"
                        placeholder="Select Module"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* USER SELECT */}
              <FormField
                control={form.control}
                name="userId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User</FormLabel>
                    <FormControl>
                      <Select
                        showSearch
                        allowClear
                        options={userOptions}
                        value={field.value}
                        onChange={field.onChange}
                        className="w-full"
                        placeholder="Tanlang"
                        optionFilterProp="label"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* DATES */}
              <div className="grid grid-cols-2 gap-2">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <DatePicker
                          locale={locale}
                          format="YYYY-MM-DD"
                          className="w-full"
                          value={field.value ? dayjs(field.value) : null}
                          onChange={(date) => field.onChange(date?.toDate())}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <DatePicker
                          locale={locale}
                          format="YYYY-MM-DD"
                          className="w-full"
                          value={field.value ? dayjs(field.value) : null}
                          onChange={(date) => field.onChange(date?.toDate())}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* SUBMIT BUTTON ✅ */}
              <Button type="submit" className="w-full">
                Apply Filters
              </Button>
            </form>
          </PopoverContent>
        </Popover>
      </div>
    </Form>
  )
}

export default AuditLogsFilter
