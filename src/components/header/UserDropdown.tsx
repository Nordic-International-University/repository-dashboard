'use client'

import React, { useState } from 'react'
import Cookie from 'js-cookie'
import { useQuery } from 'react-query'
import { authService } from '@/services/auth.service'
import { Dropdown } from '../ui/dropdown/Dropdown'
import { DropdownItem } from '../ui/dropdown/DropdownItem'
import { cn } from '@/lib/utils'

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false)

  const { data: user } = useQuery({
    queryKey: ['getProfile'],
    queryFn: () => authService.getProfile(),
  })

  const toggleDropdown = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setIsOpen((prev) => !prev)
  }

  const closeDropdown = () => setIsOpen(false)

  const getInitial = (name: string | null | undefined) => {
    return name?.charAt(0).toUpperCase() || 'U'
  }

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="dropdown-toggle flex items-center text-gray-700 dark:text-gray-400"
      >
        <span className="bg-primary mr-3 flex h-11 w-11 items-center justify-center rounded-full text-lg font-semibold text-white uppercase">
          {getInitial(user?.fullname)}
        </span>

        <span className="text-theme-sm mr-1 block font-medium"></span>

        <svg
          className={cn(
            'stroke-gray-500 transition-transform duration-200 dark:stroke-gray-400',
            isOpen && 'rotate-180'
          )}
          width="18"
          height="20"
          viewBox="0 0 18 20"
          fill="none"
        >
          <path
            d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="shadow-theme-lg dark:bg-gray-dark absolute right-0 mt-[17px] w-[260px] rounded-2xl border border-gray-200 bg-white p-3 dark:border-gray-800"
      >
        <div>
          <span className="text-theme-sm block font-medium text-gray-700 dark:text-gray-400">
            {user?.fullname || 'Foydalanuvchi'}
          </span>
          <span className="text-theme-xs mt-0.5 block text-gray-500 dark:text-gray-400">
            @{user?.username || 'username'}
          </span>
        </div>

        {/*<ul className="flex flex-col gap-1 border-b border-gray-200 pt-4 pb-3 dark:border-gray-800">*/}
        {/*  <li>*/}
        {/*    <DropdownItem*/}
        {/*      onItemClick={closeDropdown}*/}
        {/*      tag="a"*/}
        {/*      href="/profile"*/}
        {/*      className="group text-theme-sm flex items-center gap-3 rounded-lg px-3 py-2 font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5"*/}
        {/*    >*/}
        {/*      Edit profile*/}
        {/*    </DropdownItem>*/}
        {/*  </li>*/}
        {/*  <li>*/}
        {/*    <DropdownItem*/}
        {/*      onItemClick={closeDropdown}*/}
        {/*      tag="a"*/}
        {/*      href="/settings"*/}
        {/*      className="group text-theme-sm flex items-center gap-3 rounded-lg px-3 py-2 font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5"*/}
        {/*    >*/}
        {/*      Account settings*/}
        {/*    </DropdownItem>*/}
        {/*  </li>*/}
        {/*  <li>*/}
        {/*    <DropdownItem*/}
        {/*      onItemClick={closeDropdown}*/}
        {/*      tag="a"*/}
        {/*      href="/support"*/}
        {/*      className="group text-theme-sm flex items-center gap-3 rounded-lg px-3 py-2 font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5"*/}
        {/*    >*/}
        {/*      Support*/}
        {/*    </DropdownItem>*/}
        {/*  </li>*/}
        {/*</ul>*/}

        <div
          onClick={() => {
            Cookie.remove('access_token')
            window.location.href = '/signin'
          }}
          className="group text-theme-sm mt-3 flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5"
        >
          Log out
        </div>
      </Dropdown>
    </div>
  )
}
