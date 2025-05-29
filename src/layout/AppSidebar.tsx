'use client'
import React, { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useSidebar } from '@/context/SidebarContext'
import {
  BoxCubeIcon,
  ChevronDownIcon,
  FileIcon,
  FolderIcon,
  GridIcon,
  HorizontaLDots,
  PieChartIcon,
  PlugInIcon,
  UserCircleIcon,
} from '../icons/index'
import { GrResources } from 'react-icons/gr'
import { FaBook } from 'react-icons/fa'
import { VscSymbolKeyword } from 'react-icons/vsc'
import { useQuery } from 'react-query'
import { authService } from '@/services/auth.service'
import { AuthUser } from '../../types/auth/auth.types'
import useMediaQuery from 'react-query/types/devtools/useMediaQuery'

type NavItem = {
  name: string
  icon: React.ReactNode
  path?: string
  permissionModule?: string
  subItems?: {
    permissionModule: string
    name: string
    path: string
    pro?: boolean
    new?: boolean
  }[]
}

export const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: 'Bosh sahifa',
    path: '/',
  },
  {
    icon: <FolderIcon />,
    name: "Bo'limlar",
    permissionModule: 'collections',
    subItems: [
      {
        name: "Barcha bo'limlar",
        path: '/collections/all-collections',
        pro: false,
        permissionModule: 'collections',
      },
    ],
  },
  {
    icon: <FolderIcon />,
    name: "Yo'nalishlar",
    permissionModule: 'category',
    subItems: [
      {
        name: "Barcha Yo'nalishlar",
        path: '/categories/all-categories',
        pro: false,
        permissionModule: 'category',
      },
    ],
  },
  {
    icon: <GrResources size={20} />,
    name: 'Resurs turi',
    permissionModule: 'resource-type',
    subItems: [
      {
        name: 'Barcha resurslar',
        path: '/resource-type/all-resource-type',
        pro: false,
        permissionModule: 'resource-type',
      },
    ],
  },
  // {
  //   icon: <FaBook size={18} />,
  //   name: 'Fanlar',
  //   permissionModule: 'subjects',
  //   subItems: [
  //     {
  //       name: 'Barcha fanlar',
  //       path: '/subjects/all-subject',
  //       pro: false,
  //       permissionModule: 'subjects',
  //     },
  //   ],
  // },
  {
    icon: <VscSymbolKeyword size={18} />,
    name: `Kalit so'zlar`,
    permissionModule: 'keywords',
    subItems: [
      {
        name: `Barcha kalit so'zlar`,
        path: '/keywords/all-keyword',
        pro: false,
        permissionModule: 'keywords',
      },
    ],
  },
  {
    icon: <VscSymbolKeyword size={18} />,
    name: `Mualliflar`,
    permissionModule: 'author',
    subItems: [
      {
        name: `Barcha Mualliflar`,
        path: '/authors/all-author',
        pro: false,
        permissionModule: 'author',
      },
    ],
  },
  {
    icon: <FileIcon />,
    name: 'Materiallar',
    permissionModule: 'resource',
    subItems: [
      {
        name: 'Barcha materiallar',
        path: '/materials/all-materials',
        pro: false,
        permissionModule: 'resource',
      },
      {
        name: `Yangi matariallar`,
        path: '/materials/new-materials',
        pro: false,
        permissionModule: 'resource',
      },
      {
        name: `O'zgarishlarni tasdiqlash`,
        path: '/materials/change-requests',
        pro: false,
        permissionModule: 'resource',
      },
      // {
      //   name: 'Tasdiqlanishi kerak',
      //   path: '/admin/items/pending',
      //   pro: false,
      //   permissionModule: 'materials',
      // },
      // {
      //   name: 'Arxivdagilar',
      //   path: '/admin/items/archived',
      //   pro: false,
      //   permissionModule: 'materials',
      // },
    ],
  },
  {
    icon: <FileIcon />,
    name: 'Yuklangan hujjatlar',
    permissionModule: 'document',
    subItems: [
      {
        name: 'Barcha hujjatlar',
        path: '/document/all-documents',
        pro: false,
        permissionModule: 'document',
      },
    ],
  },
  {
    icon: <UserCircleIcon />,
    name: 'Foydalanuvchilar',
    permissionModule: 'subjects',
    subItems: [
      {
        name: 'Audit loglar',
        path: '/audit-logs',
        pro: false,
        permissionModule: 'user',
      },
      {
        name: 'Admin huquqlari',
        path: '/admin',
        pro: false,
        permissionModule: 'user',
      },
    ],
  },
  // {
  //   icon: <FiBarChart size={25} />,
  //   name: 'Statistika',
  //   permissionModule: 'statistics',
  //   subItems: [
  //     {
  //       name: 'Umumiy ko‘rsatkichlar',
  //       path: '/admin/statistics',
  //       pro: false,
  //       permissionModule: 'statistics',
  //     },
  //     {
  //       name: 'Yuklab olishlar',
  //       path: '/admin/statistics/downloads',
  //       pro: false,
  //       permissionModule: 'statistics',
  //     },
  //     {
  //       name: 'Ko‘rishlar',
  //       path: '/admin/statistics/views',
  //       pro: false,
  //       permissionModule: 'statistics',
  //     },
  //   ],
  // },
  // {
  //   icon: <CiSettings size={25} />,
  //   name: 'Sozlamalar',
  //   permissionModule: 'settings',
  //   subItems: [
  //     {
  //       name: 'Sayt sozlamalari',
  //       path: '/admin/settings/site',
  //       pro: false,
  //       permissionModule: 'settings',
  //     },
  //     {
  //       name: 'Metadata maydonlari',
  //       path: '/admin/settings/metadata',
  //       pro: false,
  //       permissionModule: 'settings',
  //     },
  //     {
  //       name: 'Litsenziyalar',
  //       path: '/admin/settings/licenses',
  //       pro: false,
  //       permissionModule: 'settings',
  //     },
  //     {
  //       name: 'API va xavfsizlik',
  //       path: '/admin/settings/api',
  //       pro: false,
  //       permissionModule: 'settings',
  //     },
  //   ],
  // },
]

const othersItems: NavItem[] = [
  {
    icon: <PieChartIcon />,
    name: 'Diagrammalar',
    permissionModule: '',
    subItems: [
      { permissionModule: '', name: 'Chiziqli diagramma', path: '/line-chart', pro: false },
      { permissionModule: '', name: 'Ustunli diagramma', path: '/bar-chart', pro: false },
    ],
  },
  {
    icon: <BoxCubeIcon />,
    name: 'UI elementlar',
    permissionModule: '',
    subItems: [
      { permissionModule: '', name: 'Ogohlantirishlar', path: '/alerts', pro: false },
      { permissionModule: '', name: 'Avatarlar', path: '/avatars', pro: false },
      { permissionModule: '', name: 'Nishonchalar', path: '/badge', pro: false },
      { permissionModule: '', name: 'Tugmalar', path: '/buttons', pro: false },
      { permissionModule: '', name: 'Rasmlar', path: '/images', pro: false },
      { permissionModule: '', name: 'Videolar', path: '/videos', pro: false },
    ],
  },
  {
    icon: <PlugInIcon />,
    name: 'Avtorizatsiya',
    permissionModule: '',
    subItems: [
      { permissionModule: '', name: 'Kirish', path: '/signin', pro: false },
      { permissionModule: '', name: 'Ro‘yxatdan o‘tish', path: '/signup', pro: false },
    ],
  },
  {
    icon: <FileIcon />,
    name: 'Biz haqimizda',
    path: '/about',
  },
]

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered, toggleMobileSidebar } = useSidebar()
  const handleSubmenuLinkClick = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      toggleMobileSidebar()
    }
  }

  const pathname = usePathname()
  const { data: user, isLoading } = useQuery<AuthUser>({
    queryKey: ['getPermissions'],
    queryFn: () => authService.getProfile(),
    staleTime: 1000 * 60 * 5,
  })

  const hasPermission = (module?: string): boolean | undefined => {
    if (!module) return true
    if (user?.permissions?.some((perm) => perm.module === 'admin')) return true
    return user?.permissions?.some((perm) => perm.module === module)
  }

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: 'main' | 'others'
    index: number
  } | null>(null)
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({})
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const isActive = useCallback((path: string) => path === pathname, [pathname])

  useEffect(() => {
    let submenuMatched = false
    ;['main', 'others'].forEach((menuType) => {
      const items = menuType === 'main' ? navItems : othersItems
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as 'main' | 'others',
                index,
              })
              submenuMatched = true
            }
          })
        }
      })
    })
    if (!submenuMatched) {
      setOpenSubmenu(null)
    }
  }, [pathname, isActive])

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }))
      }
    }
  }, [openSubmenu])

  const handleSubmenuToggle = (index: number, menuType: 'main' | 'others') => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (prevOpenSubmenu && prevOpenSubmenu.type === menuType && prevOpenSubmenu.index === index) {
        return null
      }
      return { type: menuType, index }
    })
  }

  if (isLoading || !user) {
    return null
  }
  const renderMenuItems = (navItems: NavItem[], menuType: 'main' | 'others') => (
    <ul className="flex flex-col gap-4">
      {navItems
        .filter(
          (nav) =>
            hasPermission(nav.permissionModule) ||
            nav.subItems?.some((sub) => hasPermission(sub.permissionModule))
        )
        .map((nav, index) => (
          <li key={nav.name}>
            {nav.subItems ? (
              <button
                onClick={() => handleSubmenuToggle(index, menuType)}
                className={`menu-item group ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? 'menu-item-active'
                    : 'menu-item-inactive'
                } cursor-pointer ${
                  !isExpanded && !isHovered ? 'lg:justify-center' : 'lg:justify-start'
                }`}
              >
                <span
                  className={` ${
                    openSubmenu?.type === menuType && openSubmenu?.index === index
                      ? 'menu-item-icon-active'
                      : 'menu-item-icon-inactive'
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className={`menu-item-text`}>{nav.name}</span>
                )}
                {(isExpanded || isHovered || isMobileOpen) && (
                  <ChevronDownIcon
                    className={`ml-auto h-5 w-5 transition-transform duration-200 ${
                      openSubmenu?.type === menuType && openSubmenu?.index === index
                        ? 'text-brand-500 rotate-180'
                        : ''
                    }`}
                  />
                )}
              </button>
            ) : (
              nav.path &&
              hasPermission(nav.permissionModule) && (
                <Link
                  href={nav.path}
                  className={`menu-item group ${
                    isActive(nav.path) ? 'menu-item-active' : 'menu-item-inactive'
                  }`}
                >
                  <span
                    className={`${
                      isActive(nav.path) ? 'menu-item-icon-active' : 'menu-item-icon-inactive'
                    }`}
                  >
                    {nav.icon}
                  </span>
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span className={`menu-item-text`}>{nav.name}</span>
                  )}
                </Link>
              )
            )}
            {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
              <div
                ref={(el) => {
                  subMenuRefs.current[`${menuType}-${index}`] = el
                }}
                className="overflow-hidden transition-all duration-300"
                style={{
                  height:
                    openSubmenu?.type === menuType && openSubmenu?.index === index
                      ? `${subMenuHeight[`${menuType}-${index}`]}px`
                      : '0px',
                }}
              >
                <ul className="mt-2 ml-9 space-y-1">
                  {nav.subItems
                    .filter((sub) => hasPermission(sub.permissionModule))
                    .map((subItem) => (
                      <li onClick={handleSubmenuLinkClick} key={subItem.name}>
                        <Link
                          href={subItem.path}
                          className={`menu-dropdown-item ${
                            isActive(subItem.path)
                              ? 'menu-dropdown-item-active'
                              : 'menu-dropdown-item-inactive'
                          }`}
                        >
                          {subItem.name}
                          <span className="ml-auto flex items-center gap-1">
                            {subItem.new && (
                              <span
                                className={`ml-auto ${
                                  isActive(subItem.path)
                                    ? 'menu-dropdown-badge-active'
                                    : 'menu-dropdown-badge-inactive'
                                } menu-dropdown-badge`}
                              >
                                new
                              </span>
                            )}
                            {subItem.pro && (
                              <span
                                className={`ml-auto ${
                                  isActive(subItem.path)
                                    ? 'menu-dropdown-badge-active'
                                    : 'menu-dropdown-badge-inactive'
                                } menu-dropdown-badge`}
                              >
                                pro
                              </span>
                            )}
                          </span>
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </li>
        ))}
    </ul>
  )

  return (
    <aside
      className={`fixed top-0 left-0 z-50 mt-16 flex h-screen flex-col border-r border-gray-200 bg-white px-5 text-gray-900 transition-all duration-300 ease-in-out lg:mt-0 dark:border-gray-800 dark:bg-gray-900 ${
        isExpanded || isMobileOpen ? 'w-[290px]' : isHovered ? 'w-[290px]' : 'w-[90px]'
      } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`flex py-8 ${!isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start'}`}
      >
        <Link href="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <Image
                className="dark:hidden"
                src="/images/logo/logo.svg"
                alt="Logo"
                width={150}
                height={40}
              />
              <Image
                className="hidden dark:block"
                src="/images/logo/logo.svg"
                alt="Logo"
                width={150}
                height={40}
              />
            </>
          ) : (
            <Image src="/images/logo/logo-icon.svg" alt="Logo" width={32} height={32} />
          )}
        </Link>
      </div>
      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 flex text-xs leading-[20px] text-gray-400 uppercase ${
                  !isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start'
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? 'Menu' : <HorizontaLDots />}
              </h2>
              {renderMenuItems(navItems, 'main')}
            </div>

            {/*<div className="">*/}
            {/*  <h2*/}
            {/*    className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${*/}
            {/*      !isExpanded && !isHovered*/}
            {/*        ? "lg:justify-center"*/}
            {/*        : "justify-start"*/}
            {/*    }`}*/}
            {/*  >*/}
            {/*    {isExpanded || isHovered || isMobileOpen ? (*/}
            {/*      "Others"*/}
            {/*    ) : (*/}
            {/*      <HorizontaLDots />*/}
            {/*    )}*/}
            {/*  </h2>*/}
            {/*  {renderMenuItems(othersItems, "others")}*/}
            {/*</div>*/}
          </div>
        </nav>
        {/*{isExpanded || isHovered || isMobileOpen ? <SidebarWidget /> : null}*/}
      </div>
    </aside>
  )
}

export default AppSidebar
