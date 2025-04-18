'use client'

import React, { JSX } from 'react'

import { useState } from 'react'
import { useQuery } from 'react-query'
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from '@tanstack/react-table'
import { Edit, Trash2 } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { categoryService } from '@/services/category.service'
import type { Category } from '@/../types/category/category.types'
import CustomPagination from '@/components/pagination/CustomPagination'
interface CategoryTableProps {
  onEdit: (category: Category) => void
  onDelete: (category: Category) => void
  AddCategoryButton: any
}

export function CategoryTable({ onEdit, onDelete, AddCategoryButton }: CategoryTableProps) {
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(9)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState<string>('')

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    setTimeout(() => {
      setDebouncedSearch(e.target.value)
      setPageNumber(1)
    }, 500)
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ['categories', pageNumber, pageSize, debouncedSearch],
    queryFn: () => categoryService.getCategories(pageNumber, pageSize, debouncedSearch),
  })

  const columns: ColumnDef<Category>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'icon',
      header: 'Icon',
      cell: ({ row }) => (
        <div className="flex items-center">
          <span className="text-sm">{row.original.icon}</span>
        </div>
      ),
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => (
        <div className="max-w-[300px] truncate" title={row.original.description}>
          {row.original.description}
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => onEdit(row.original)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(row.original)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  const table = useReactTable({
    data: data?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: data?.pageCount || 0,
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search categories..."
          value={search}
          onChange={handleSearchChange}
          className="max-w-sm"
        />
        <AddCategoryButton />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Error loading data. Please try again.
                </TableCell>
              </TableRow>
            ) : data?.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No categories found.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <CustomPagination
        onPageChange={setPageNumber}
        totalPages={data?.pageCount || 1}
        currentPage={pageNumber}
        position="right"
      />
    </div>
  )
}
