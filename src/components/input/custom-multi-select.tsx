'use client'

import { Select, Spin } from 'antd'
import { useEffect, useState } from 'react'

export interface Option {
  label: string
  value: string
}

interface AntdMultiSelectProps {
  options: Option[]
  value: string[] | string
  onChange: (val: string[] | string) => void
  onCreate?: (input: string) => Promise<Option>
  placeholder?: string
  mode?: 'multiple' | 'tags' | 'single'
  loading?: boolean
}

export const AntdMultiSelect = ({
  options,
  value,
  onChange,
  onCreate,
  placeholder = 'Yozing yoki tanlang',
  mode = 'multiple',
  loading = false,
}: AntdMultiSelectProps) => {
  const [internalOptions, setInternalOptions] = useState<Option[]>(options)

  useEffect(() => {
    setInternalOptions(options)
  }, [options])

  const handleChange = async (val: string[] | string) => {
    if (mode === 'single') {
      const v = val as string
      const exists = internalOptions.find((o) => o.value === v)
      if (!exists && onCreate) {
        const created = await onCreate(v)
        setInternalOptions((prev) => [...prev, created])
        onChange(created.value)
      } else {
        onChange(v)
      }
    } else {
      const valArr = val as string[]
      const newOptions = [...internalOptions]
      const updatedValues: string[] = []

      for (const v of valArr) {
        const exists = newOptions.find((o) => o.value === v)
        if (!exists && onCreate) {
          const created = await onCreate(v)
          newOptions.push(created)
          updatedValues.push(created.value)
        } else {
          updatedValues.push(v)
        }
      }

      setInternalOptions(newOptions)
      onChange(updatedValues)
    }
  }

  return (
    <Select
      mode={mode === 'single' ? undefined : 'tags'}
      showSearch
      value={value}
      placeholder={placeholder}
      onChange={handleChange}
      filterOption={(input, option) =>
          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
      }
      options={internalOptions.sort((a,b) => a.label.localeCompare(b.label))}
      loading={loading}
      style={{ width: '100%' }}
      notFoundContent={loading ? <Spin size="small" /> : null}
    />
  )
}
