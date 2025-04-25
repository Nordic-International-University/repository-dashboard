'use client'

import { useEffect, useRef, useState } from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Option {
  label: string
  value: string
}

interface CustomMultiSelectProps {
  options: Option[]
  value: string[]
  onChange: (val: string | string[]) => void
  onCreate?: (input: string) => Promise<Option>
  placeholder?: string
  className?: string
  variant?: 'single' | 'multiple'
}

export const CustomMultiSelectInput: React.FC<CustomMultiSelectProps> = ({
  options,
  value,
  onChange,
  onCreate,
  placeholder = 'Yozing yoki tanlang',
  className,
  variant = 'single',
}) => {
  const [inputValue, setInputValue] = useState('')
  const [filteredOptions, setFilteredOptions] = useState<Option[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Normalize value to array
  const currentValue = Array.isArray(value) ? value : value ? [value] : []

  useEffect(() => {
    const handler = setTimeout(() => {
      const filtered = options.filter(
        (opt) =>
          opt.label.toLowerCase().includes(inputValue.toLowerCase()) &&
          !currentValue.includes(opt.value)
      )
      setFilteredOptions(filtered)
    }, 200)

    return () => clearTimeout(handler)
  }, [inputValue, options, value])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleAdd = async (val: string) => {
    const existing = options.find((opt) => opt.label.toLowerCase() === val.toLowerCase())
    let selectedValue = existing?.value

    if (!selectedValue && onCreate) {
      const created = await onCreate(val)

      if (created && !currentValue.includes(created.value)) {
        onChange([...currentValue, created.label])
      }
    } else if (!currentValue.includes(selectedValue as string)) {
      onChange([...currentValue, selectedValue as string])
    }

    console.log(existing)
    setInputValue('')
    inputRef.current?.focus()
    setIsOpen(false)
  }

  const handleRemove = (val: string) => {
    if (variant === 'single') {
      onChange('')
    } else {
      onChange(currentValue.filter((v) => v !== val))
    }
  }

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      <div className="bg-background focus-within:ring-ring focus-within:border-ring flex flex-wrap items-center rounded-md border px-3 py-2 focus-within:ring-1">
        {currentValue.map((val) => {
          const label = options.find((o) => o.value === val)?.label || val
          return (
            <div
              key={val}
              className="bg-muted mr-2 mb-1 flex items-center rounded-full px-2 py-1 text-sm"
            >
              {label}
              <button
                type="button"
                className="ml-1 hover:text-red-500"
                onClick={() => handleRemove(val)}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )
        })}

        <div className="flex flex-1 items-center">
          <Search className="text-muted-foreground mr-1 h-4 w-4 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            className="w-full bg-transparent text-sm outline-none"
            placeholder={currentValue.length === 0 ? placeholder : ''}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value)
              setIsOpen(true)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ',') {
                e.preventDefault()
                if (inputValue.trim()) {
                  handleAdd(inputValue.trim())
                }
              }
            }}
          />
        </div>
      </div>

      {isOpen && (filteredOptions.length > 0 || inputValue) && (
        <div className="bg-background absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border shadow-md">
          <ul className="py-1">
            {filteredOptions.map((opt) => (
              <li
                key={opt.value}
                onClick={() => handleAdd(opt.label)}
                className="hover:bg-accent cursor-pointer px-3 py-2 text-sm"
              >
                {opt.label}
              </li>
            ))}
            {onCreate &&
              inputValue &&
              !options.some((opt) => opt.label.toLowerCase() === inputValue.toLowerCase()) && (
                <li
                  onClick={() => handleAdd(inputValue)}
                  className="hover:bg-accent mt-1 cursor-pointer border-t px-3 py-2 text-sm"
                >
                  Add "{inputValue}"
                </li>
              )}
          </ul>
        </div>
      )}
    </div>
  )
}
