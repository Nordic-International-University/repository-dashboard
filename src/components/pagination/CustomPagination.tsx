import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  position?: 'left' | 'center' | 'right'
}

const getVisiblePages = (currentPage: number, totalPages: number): (number | 'ellipsis')[] => {
  const delta = 1 // Joriy sahifa atrofida ko'rsatiladigan sahifalar soni
  const range: (number | 'ellipsis')[] = []

  // Har doim 1-sahifani ko'rsat
  range.push(1)

  // Agar joriy sahifa 1 dan uzoqroq bo'lsa
  if (currentPage > delta + 2) {
    range.push('ellipsis')
  }

  // Joriy sahifa atrofidagi sahifalar
  for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
    if (!range.includes(i)) {
      range.push(i)
    }
  }

  // Agar oxirgi sahifadan uzoqroq bo'lsa
  if (currentPage < totalPages - delta - 1) {
    range.push('ellipsis')
  }

  // Har doim oxirgi sahifani ko'rsat (agar 1 dan katta bo'lsa)
  if (totalPages > 1 && !range.includes(totalPages)) {
    range.push(totalPages)
  }

  return range
}

const CustomPagination = ({
  currentPage,
  totalPages,
  onPageChange,
  position = 'center',
}: PaginationProps) => {
  const visiblePages = getVisiblePages(currentPage, totalPages)
  const [jumpPage, setJumpPage] = useState<string>('')

  const alignmentClass = `
    sm:${
      {
        left: 'justify-start',
        center: 'justify-center',
        right: 'justify-end',
      }[position] || 'justify-center'
    } justify-center
  `

  const handleJump = () => {
    const page = parseInt(jumpPage)
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      onPageChange(page)
    }
    setJumpPage('')
  }

  return (
    <Pagination className={`mt-6 flex flex-wrap items-center gap-4 ${alignmentClass}`}>
      <PaginationContent className="flex items-center gap-x-2 overflow-x-auto">
        {/* << Birinchi sahifa */}
        <PaginationItem>
          <PaginationLink
            href="#"
            className="min-w-[40px] rounded-md px-3 py-2 text-center"
            onClick={() => onPageChange(1)}
          >
            «
          </PaginationLink>
        </PaginationItem>

        {/* Oldingi */}
        <PaginationItem>
          <PaginationLink
            href="#"
            className="min-w-[80px] rounded-md px-3 py-2 text-center"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          >
            Oldingi
          </PaginationLink>
        </PaginationItem>

        {/* Sahifalar */}
        {visiblePages.map((page, index) =>
          page === 'ellipsis' ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <PaginationLink
                href="#"
                isActive={page === currentPage}
                onClick={() => onPageChange(page)}
                className={`rounded-full px-3 py-2 text-center text-white ${
                  page === currentPage ? 'bg-primary' : 'bg-gray-300'
                }`}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        {/* Keyingi */}
        <PaginationItem>
          <PaginationLink
            href="#"
            className="min-w-[80px] rounded-md px-3 py-2 text-center"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          >
            Keyingi
          </PaginationLink>
        </PaginationItem>

        {/* >> Oxirgi sahifa */}
        <PaginationItem>
          <PaginationLink
            href="#"
            className="min-w-[40px] rounded-md px-3 py-2 text-center"
            onClick={() => onPageChange(totalPages)}
          >
            »
          </PaginationLink>
        </PaginationItem>

        {/* Jump to page input (hide on mobile) */}
        <PaginationItem className="ml-4 hidden items-center gap-2 sm:flex">
          <Input
            type="number"
            placeholder="Sahifa..."
            value={jumpPage}
            onChange={(e) => setJumpPage(e.target.value)}
            className="h-9 w-[80px] px-2 py-1 text-sm"
            min={1}
            max={totalPages}
          />
          <Button onClick={handleJump}>O‘tish</Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export default CustomPagination
