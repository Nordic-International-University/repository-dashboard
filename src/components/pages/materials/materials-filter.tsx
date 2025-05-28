'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AntdMultiSelect } from '@/components/input/custom-multi-select'
import { Collection } from '@/../types/colecctions/collections.types'
import { Keyword } from '@/../types/keyword/keyword.types'
import { Subject } from '../../../../types/subject-types/subject.types'
import { ResourceType } from '../../../../types/resources/rosurce.types'
import DatePicker from '@/components/form/date-picker'

const filterSchema = z.object({
  subjectId: z.string().optional(),
  collectionId: z.string().optional(),
  resourceTypeId: z.array(z.string()).optional(),
  keywords: z.array(z.string()).optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
  withDocuments: z.boolean().optional(),
  status: z.enum(['pending', 'approved', 'rejected']).optional(),
})

export type ResourceFilterValues = z.infer<typeof filterSchema>

interface Props {
  initialValues?: ResourceFilterValues
  onChange: (values: ResourceFilterValues) => void
  collections: Collection[]
  subjects: Subject[]
  resourceTypes: ResourceType[]
  keywords: Keyword[]
}

export const ResourceFilterForm = ({
  initialValues,
  onChange,
  collections,
  subjects,
  resourceTypes,
  keywords,
}: Props) => {
  const form = useForm<ResourceFilterValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: initialValues || {},
  })

  const submit = form.handleSubmit((data) => onChange(data))

  return (
    <Form {...form}>
      <form onSubmit={submit} className="grid items-end gap-4 md:grid-cols-2">
        <FormField
          name="subjectId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fan</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl className="w-full">
                  <SelectTrigger>
                    <SelectValue placeholder="Fan tanlang" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {subjects.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="collectionId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>To‘plam</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl className="w-full">
                  <SelectTrigger>
                    <SelectValue placeholder="To‘plam tanlang" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {collections.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="resourceTypeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resurs turlari</FormLabel>
              <FormControl>
                <AntdMultiSelect
                  value={field.value || []}
                  onChange={field.onChange}
                  options={resourceTypes.map((r) => ({ label: r.name, value: r.id }))}
                  mode="multiple"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="keywords"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kalit so‘zlar</FormLabel>
              <FormControl>
                <AntdMultiSelect
                  value={field.value || []}
                  onChange={field.onChange}
                  options={keywords.map((k) => ({ label: k.value, value: k.id }))}
                  mode="multiple"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="fromDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dan</FormLabel>
              <FormControl>
                <DatePicker
                  mode="single"
                  defaultDate={field.value ? new Date(field.value) : undefined}
                  onChange={(date) =>
                    field.onChange(date instanceof Date ? date.toISOString().slice(0, 10) : '')
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="toDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gacha</FormLabel>
              <FormControl>
                <DatePicker
                  mode="single"
                  defaultDate={field.value ? new Date(field.value) : undefined}
                  onChange={(date) =>
                    field.onChange(date instanceof Date ? date.toISOString().slice(0, 10) : '')
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="col-span-full flex justify-end gap-2">
          <Button type="submit">Filtrlash</Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              form.reset()
              onChange({})
            }}
          >
            Tozalash
          </Button>
        </div>
      </form>
    </Form>
  )
}
