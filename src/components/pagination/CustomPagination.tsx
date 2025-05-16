import {
  Pagination,
  PaginationContent,
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

const CustomPagination = ({
  currentPage,
  totalPages,
  onPageChange,
  position = 'center',
}: PaginationProps) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  const [jumpPage, setJumpPage] = useState<string>('')

  // Mobilda har doim center, katta ekranlarda esa propsdan kelgan pozitsiya
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
        {pages.map((page) => (
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
        ))}

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
