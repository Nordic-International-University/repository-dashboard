'use client'

import Link from 'next/link'
import React from 'react'
import { usePathname } from 'next/navigation'

const PageBreadcrumb: React.FC<{ pageTitle: string }> = ({ pageTitle }) => {
  const pathname = usePathname()

  const allSegments = pathname.split('/').filter(Boolean)
  const visibleSegments = allSegments.filter((seg) => seg !== 'materials')

  const buildHref = (index: number) => {
    const path = allSegments.slice(0, allSegments.indexOf(visibleSegments[index]) + 1).join('/')
    return '/' + path
  }

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).replace(/[-_]/g, ' ')

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">{pageTitle}</h2>
      <nav>
        <ol className="flex items-center gap-1.5">
          <li>
            <Link
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
              href="/"
            >
              Home
              <svg
                className="stroke-current"
                width="17"
                height="16"
                viewBox="0 0 17 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                  stroke=""
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </li>

          {visibleSegments.map((seg, i) => (
            <li key={i} className="flex items-center gap-1.5">
              {i < visibleSegments.length - 1 ? (
                <Link href={buildHref(i)} className="text-sm text-gray-500 dark:text-gray-400">
                  {capitalize(seg)}
                  <svg
                    className="ml-1 inline-block stroke-current"
                    width="17"
                    height="16"
                    viewBox="0 0 17 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                      stroke=""
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              ) : (
                <span className="text-sm text-gray-800 dark:text-white/90">{capitalize(seg)}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  )
}

export default PageBreadcrumb
