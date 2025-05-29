import React, { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from '@/components/ui/dialog'
import {ChevronUp,ChevronDown} from 'lucide-react'

interface UniversalDropdownProps<T = any> {
    options: T[]
    value: string[]
    onChange: (selectedIds: string[]) => void
    labelKey: string
    valueKey: string
    placeholder?: string
    searchPlaceholder?: string
    noDataText?: string
    selectedText?: string
    showAddButton?: boolean
    addButtonText?: string
    addModalTitle?: string
    AddFormComponent?: React.ComponentType<{ onSubmitFunction: (data: any) => void }>
    onAdd?: (data: any) => void
    disabled?: boolean
    className?: string
    searchable?: boolean
    maxHeight?: string
}

export function UniversalDropdown<T = any>({
                                               options = [],
                                               value = [],
                                               onChange,
                                               labelKey,
                                               valueKey,
                                               placeholder = "Tanlang...",
                                               searchPlaceholder = "Qidirish...",
                                               noDataText = "Ma'lumot topilmadi",
                                               selectedText = "Tanlangan",
                                               showAddButton = false,
                                               addButtonText = "+ Qo'shish",
                                               addModalTitle = "Yangi qo'shish",
                                               AddFormComponent,
                                               onAdd,
                                               disabled = false,
                                               className = "",
                                               searchable = true,
                                               maxHeight = "240px"
                                           }: UniversalDropdownProps<T>) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Qidiruv funksiyasi
    const filteredOptions = searchable
        ? options.filter((option: any) =>
            option[labelKey]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
        : options

    // Click outside handler
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false)
            }
        }

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isDropdownOpen])

    // Checkbox change handler
    const handleCheckboxChange = (optionId: string, isChecked: boolean) => {
        if (isChecked) {
            onChange([...value, optionId])
        } else {
            onChange(value.filter((id: string) => id !== optionId))
        }
    }

    // Add form submit handler
    const handleAddSubmit = async (data: any) => {
        if (onAdd) {
            await onAdd(data)
        }
        setIsAddModalOpen(false)
    }

    // Selected count text
    const getSelectedText = () => {
        if (value.length === 0) return placeholder
        return `${selectedText}: ${value.length}`
    }

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            {/* Main trigger */}
            <div
                className={`flex cursor-pointer items-center rounded-md border border-gray-300 bg-white px-4 py-2 ${
                    disabled ? 'cursor-not-allowed bg-gray-100 text-gray-500' : ''
                }`}
                onClick={() => !disabled && setIsDropdownOpen(!isDropdownOpen)}
            >
                <span className="flex-1 text-sm text-gray-600">
                    {getSelectedText()}
                </span>
                <span className="text-gray-500">
                    {isDropdownOpen ? <ChevronUp/> : <ChevronDown />}
                </span>
            </div>

            {isDropdownOpen && !disabled && (
                <div
                    className="absolute z-10 mt-2 w-full overflow-hidden rounded-md border border-gray-300 bg-white shadow-lg"
                    style={{ maxHeight }}
                >
                    {searchable && (
                        <div className="p-2">
                            <Input
                                type="text"
                                placeholder={searchPlaceholder}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                value={searchTerm}
                                className="w-full"
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    )}

                    {/* Options list */}
                    <div className="max-h-48 overflow-auto px-2 py-1">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option: any) => (
                                <div
                                    key={option[valueKey]}
                                    className="flex items-center gap-2 py-1"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <input
                                        type="checkbox"
                                        id={`option-${option[valueKey]}`}
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        checked={value.includes(option[valueKey])}
                                        onChange={(e) => {
                                            e.stopPropagation()
                                            handleCheckboxChange(option[valueKey], e.target.checked)
                                        }}
                                    />
                                    <label
                                        htmlFor={`option-${option[valueKey]}`}
                                        className="flex-1 cursor-pointer text-sm"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {option[labelKey]}
                                    </label>
                                </div>
                            ))
                        ) : (
                            <p className="py-2 text-center text-sm text-gray-500">
                                {noDataText}
                            </p>
                        )}
                    </div>

                    {/* Add button */}
                    {showAddButton && (
                        <div className="border-t p-2">
                            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                                <DialogTrigger asChild>
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="outline"
                                        className="w-full"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {addButtonText}
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogTitle>{addModalTitle}</DialogTitle>
                                    {AddFormComponent && (
                                        <AddFormComponent onSubmitFunction={handleAddSubmit} />
                                    )}
                                    <DialogClose asChild>
                                        <Button variant="ghost" className="absolute top-2 right-2">
                                            Yopish
                                        </Button>
                                    </DialogClose>
                                </DialogContent>
                            </Dialog>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

// Single select version ham kerak bo'lsa
interface UniversalSingleDropdownProps<T = any> {
    options: T[]
    value: string
    onChange: (selectedId: string) => void
    labelKey: string
    valueKey: string
    placeholder?: string
    searchPlaceholder?: string
    noDataText?: string
    showAddButton?: boolean
    addButtonText?: string
    addModalTitle?: string
    AddFormComponent?: React.ComponentType<{ onSubmitFunction: (data: any) => void }>
    onAdd?: (data: any) => void
    disabled?: boolean
    className?: string
    searchable?: boolean
}

export function UniversalSingleDropdown<T = any>({
                                                     options = [],
                                                     value,
                                                     onChange,
                                                     labelKey,
                                                     valueKey,
                                                     placeholder = "Tanlang...",
                                                     searchPlaceholder = "Qidirish...",
                                                     noDataText = "Ma'lumot topilmadi",
                                                     showAddButton = false,
                                                     addButtonText = "+ Qo'shish",
                                                     addModalTitle = "Yangi qo'shish",
                                                     AddFormComponent,
                                                     onAdd,
                                                     disabled = false,
                                                     className = "",
                                                     searchable = true
                                                 }: UniversalSingleDropdownProps<T>) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const filteredOptions = searchable
        ? options.filter((option: any) =>
            option[labelKey]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
        : options

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false)
            }
        }

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isDropdownOpen])

    const handleOptionSelect = (optionId: string) => {
        onChange(optionId)
        setIsDropdownOpen(false)
    }

    const handleAddSubmit = async (data: any) => {
        if (onAdd) {
            await onAdd(data)
        }
        setIsAddModalOpen(false)
    }

    const selectedOption = options.find((opt: any) => opt[valueKey] === value)
    // @ts-ignore
    const displayText = selectedOption ? selectedOption[labelKey] : placeholder

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <div
                className={`flex cursor-pointer items-center rounded-md border border-gray-300 bg-white px-4 py-2 ${
                    disabled ? 'cursor-not-allowed bg-gray-100 text-gray-500' : ''
                }`}
                onClick={() => !disabled && setIsDropdownOpen(!isDropdownOpen)}
            >
                <span className="flex-1 text-sm text-gray-600">
                    {displayText}
                </span>
                <span className="text-gray-500">
                      {isDropdownOpen ? <ChevronUp/> : <ChevronDown />}
                </span>
            </div>

            {isDropdownOpen && !disabled && (
                <div className="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-md border border-gray-300 bg-white shadow-lg">
                    {searchable && (
                        <div className="p-2">
                            <Input
                                type="text"
                                placeholder={searchPlaceholder}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                value={searchTerm}
                                className="w-full"
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    )}

                    <div className="px-2 py-1">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option: any) => (
                                <div
                                    key={option[valueKey]}
                                    className={`cursor-pointer rounded px-2 py-1 text-sm hover:bg-gray-100 ${
                                        value === option[valueKey] ? 'bg-blue-50 text-blue-600' : ''
                                    }`}
                                    onClick={() => handleOptionSelect(option[valueKey])}
                                >
                                    {option[labelKey]}
                                </div>
                            ))
                        ) : (
                            <p className="py-2 text-center text-sm text-gray-500">
                                {noDataText}
                            </p>
                        )}
                    </div>

                    {showAddButton && (
                        <div className="border-t p-2">
                            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                                <DialogTrigger asChild>
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="outline"
                                        className="w-full"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {addButtonText}
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogTitle>{addModalTitle}</DialogTitle>
                                    {AddFormComponent && (
                                        <AddFormComponent onSubmitFunction={handleAddSubmit} />
                                    )}
                                    <DialogClose asChild>
                                        <Button variant="ghost" className="absolute top-2 right-2">
                                            Yopish
                                        </Button>
                                    </DialogClose>
                                </DialogContent>
                            </Dialog>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}