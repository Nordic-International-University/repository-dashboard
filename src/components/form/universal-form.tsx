'use client'

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { UseFormReturn } from 'react-hook-form'
import clsx from 'clsx'

type FilterType = 'input' | 'select' | 'checkbox'

type FilterField = {
  key: string
  label: string
  type: FilterType
  data?: { label: string; value: string }[]
  wrapperClassName?: string
  placeholder?: string
  inputProps?: Record<string, any>
}

interface UniversalFilterProps {
  fields: FilterField[]
  form: UseFormReturn<any>
  className?: string
}

export const UniversalFilter = ({
  fields,
  form,
  className = 'grid gap-4 md:grid-cols-2 lg:grid-cols-3',
}: UniversalFilterProps) => {
  return (
    <div className={clsx(className)}>
      {fields.map((field) => (
        <div key={field.key} className={clsx(field.wrapperClassName)}>
          <FormField
            control={form.control}
            name={field.key}
            render={({ field: rhfField }) => {
              if (field.type === 'checkbox') {
                return (
                  <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        id={field.key}
                        checked={rhfField.value}
                        onCheckedChange={rhfField.onChange}
                        aria-label={field.label}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel htmlFor={field.key}>{field.label}</FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )
              }

              if (field.type === 'input') {
                return (
                  <FormItem>
                    <FormLabel>{field.label}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={field.placeholder || field.label}
                        {...rhfField}
                        {...field.inputProps}
                        aria-label={field.label}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              }

              if (field.type === 'select' && field.data) {
                return (
                  <FormItem>
                    <FormLabel>{field.label}</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={rhfField.onChange}
                        value={rhfField.value || ''}
                        defaultValue={rhfField.value}
                      >
                        <SelectTrigger aria-label={field.label}>
                          <SelectValue placeholder={field.placeholder || 'Select an option'} />
                        </SelectTrigger>
                        <SelectContent>
                          {field.data.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              }

              // Fallback for any unhandled field types
              return (
                <FormItem>
                  <FormLabel>{field.label}</FormLabel>
                  <FormControl>
                    <Input {...rhfField} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }}
          />
        </div>
      ))}
    </div>
  )
}
