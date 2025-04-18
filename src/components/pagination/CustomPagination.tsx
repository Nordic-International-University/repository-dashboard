import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

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

  const alignmentClass =
    {
      left: 'justify-start',
      center: 'justify-center',
      right: 'justify-end',
    }[position] || 'justify-center'

  const handleJump = () => {
    const page = parseInt(jumpPage)
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      onPageChange(page)
    }
    setJumpPage('')
  }

  return (
    <Pagination className={`mt-6 flex flex-wrap items-center gap-4 ${alignmentClass}`}>
      <PaginationContent className="flex flex-wrap items-center gap-x-2">
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
              className={`rounded-full px-3 py-2 text-center ${
                page === currentPage ? 'bg-primary text-white' : ''
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

        {/* >> Oxirgi sahifaga */}
        <PaginationItem>
          <PaginationLink
            href="#"
            className="min-w-[40px] rounded-md px-3 py-2 text-center"
            onClick={() => onPageChange(totalPages)}
          >
            »
          </PaginationLink>
        </PaginationItem>

        {/* Jump to page input */}
        <PaginationItem className="ml-4 flex items-center gap-2">
          <Input
            type="number"
            placeholder="Sahifa..."
            value={jumpPage}
            onChange={(e) => setJumpPage(e.target.value)}
            className="h-9 w-[80px] px-2 py-1 text-sm"
            min={1}
            max={totalPages}
          />
          <button
            onClick={handleJump}
            className="bg-primary hover:bg-primary/90 rounded-md px-3 py-1 text-sm text-white"
          >
            O‘tish
          </button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export default CustomPagination
