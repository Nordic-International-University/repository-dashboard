'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Edit, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'

import CustomPagination from '@/components/pagination/CustomPagination'
import { Resource } from '../../../../types/material/material.types'
import { useResourcesQuery } from '@/hooks/use-materials'
import { Badge } from '@/components/ui/badge'
import { getStatusBadge } from '@/lib/getStatusIcons'

interface ResourceTableProps {
  onEdit: (resource: Resource) => void
  onDelete: (resource: Resource) => void
  setDebouncedSearch: (search: string) => void
  debouncedSearch: string
  filters: any
  setSearch: (search: string) => void
  search: string
}
import { useRouter } from 'next/navigation'
import dayjs from 'dayjs'

export const ResourceTable = ({
  onEdit,
  onDelete,
  filters,
  debouncedSearch,
  setDebouncedSearch,
  search,
}: ResourceTableProps) => {
  const router = useRouter()
  const [pageNumber, setPageNumber] = useState(1)
  const pageSize = 10

  useEffect(() => {
    const delay = setTimeout(() => {
      setDebouncedSearch(search)
      setPageNumber(1)
    }, 500)
    return () => clearTimeout(delay)
  }, [search])

  const { data, isLoading, isError } = useResourcesQuery(
    pageNumber,
    pageSize,
    debouncedSearch,
    filters
  )

  return (
    <div className="space-y-4">
      <div className="max-w-full overflow-x-auto rounded-md border">
        <Table className="min-w-[900px]">
          <TableHeader>
            <TableRow>
              <TableHead>Sarlavha</TableHead>
              <TableHead>Til</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Muallif</TableHead>
              <TableHead>Kim yukladi</TableHead>
              <TableHead>Qo'shilgan vaqti</TableHead>
              <TableHead className="text-center">Amallar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading || !data ? (
              <TableRow>
                <TableCell colSpan={6} className="py-6 text-center">
                  Yuklanmoqda...
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={6} className="py-6 text-center">
                  Xatolik yuz berdi
                </TableCell>
              </TableRow>
            ) : data.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-6 text-center">
                  Hech nima topilmadi
                </TableCell>
              </TableRow>
            ) : (
              data.data.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/40 cursor-pointer transition">
                  <TableCell onClick={() => router.push(`/materials/all-materials/${item.id}`)}>
                    {item.title.slice(0,30)}...
                  </TableCell>
                  <TableCell onClick={() => router.push(`/materials/all-materials/${item.id}`)}>
                    {item.language}
                  </TableCell>
                  <TableCell onClick={() => router.push(`/materials/all-materials/${item.id}`)}>
                    {(() => {
                      const badge = getStatusBadge(item.status)
                      return (
                        <Badge className={`inline-flex items-center ${badge.color}`}>
                          {badge.icon}
                          {badge.label}
                        </Badge>
                      )
                    })()}
                  </TableCell>
                  <TableCell onClick={() => router.push(`/materials/all-materials/${item.id}`)}>
                    {item?.authors[0]?.username}
                  </TableCell>
                  <TableCell onClick={() => router.push(`/materials/all-materials/${item.id}`)}>
                    {item.publisher}
                  </TableCell>
                  <TableCell onClick={() => router.push(`/materials/all-materials/${item.id}`)}>
                    {dayjs(item.publishedAt).format('DD-MM-YYYY:HH:MM')}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => onEdit(item)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onDelete(item)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <CustomPagination
        currentPage={pageNumber}
        totalPages={data?.pageCount || 1}
        onPageChange={setPageNumber}
        position="right"
      />
    </div>
  )
}
