"use client";
import React, { useEffect, useRef, useState,useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import {
  BoxCubeIcon,
  ChevronDownIcon, FileIcon, FolderIcon,
  GridIcon,
  HorizontaLDots,
  PieChartIcon,
  PlugInIcon,
  UserCircleIcon,
} from "../icons/index";
import {BiPaperclip} from "react-icons/bi";
import {FiBarChart} from "react-icons/fi";
import {CiSettings} from "react-icons/ci";


type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Bosh sahifa",
    path: "/",
  },
  {
    icon: <FolderIcon />,
    name: "Bo'limlar",
    subItems: [
      { name: "Barcha bo'limlar", path: "/collections/all-collections", pro: false },
      { name: "yangi bo'lim qo'shish", path: "/collections/new", pro: false },
      { name: "arxivlangan bo'limlar", path: "/collections/archive", pro: false },
    ],
  },
  {
    icon: <FileIcon />,
    name: "Materiallar",
    subItems: [
      { name: "Barcha materiallar", path: "/admin/items", pro: false },
      { name: "Yangi material qo‘shish", path: "/admin/items/new", pro: false },
      { name: "Tasdiqlanishi kerak", path: "/admin/items/pending", pro: false },
      { name: "Arxivdagilar", path: "/admin/items/archived", pro: false },
    ],
  },
  {
    icon: <BiPaperclip />,
    name: "Fayllar",
    subItems: [
      { name: "Fayllar ro‘yxati", path: "/admin/files", pro: false },
      { name: "Yangi fayl yuklash", path: "/admin/files/upload", pro: false },
    ],
  },
  {
    icon: <UserCircleIcon />,
    name: "Foydalanuvchilar",
    subItems: [
      { name: "Foydalanuvchilar", path: "/admin/users", pro: false },
      { name: "Yangi foydalanuvchi", path: "/admin/users/new", pro: false },
      { name: "Admin huquqlari", path: "/admin", pro: false },
    ],
  },
  {
    icon: <FiBarChart />,
    name: "Statistika",
    subItems: [
      { name: "Umumiy ko‘rsatkichlar", path: "/admin/statistics", pro: false },
      { name: "Yuklab olishlar", path: "/admin/statistics/downloads", pro: false },
      { name: "Ko‘rishlar", path: "/admin/statistics/views", pro: false },
    ],
  },
  {
    icon: <CiSettings />,
    name: "Sozlamalar",
    subItems: [
      { name: "Sayt sozlamalari", path: "/admin/settings/site", pro: false },
      { name: "Metadata maydonlari", path: "/admin/settings/metadata", pro: false },
      { name: "Litsenziyalar", path: "/admin/settings/licenses", pro: false },
      { name: "API va xavfsizlik", path: "/admin/settings/api", pro: false },
    ],
  },
];



const othersItems: NavItem[] = [
  {
    icon: <PieChartIcon />,
    name: "Diagrammalar",
    subItems: [
      { name: "Chiziqli diagramma", path: "/line-chart", pro: false },
      { name: "Ustunli diagramma", path: "/bar-chart", pro: false },
    ],
  },
  {
    icon: <BoxCubeIcon />,
    name: "UI elementlar",
    subItems: [
      { name: "Ogohlantirishlar", path: "/alerts", pro: false },
      { name: "Avatarlar", path: "/avatars", pro: false },
      { name: "Nishonchalar", path: "/badge", pro: false },
      { name: "Tugmalar", path: "/buttons", pro: false },
      { name: "Rasmlar", path: "/images", pro: false },
      { name: "Videolar", path: "/videos", pro: false },
    ],
  },
  {
    icon: <PlugInIcon />,
    name: "Avtorizatsiya",
    subItems: [
      { name: "Kirish", path: "/signin", pro: false },
      { name: "Ro‘yxatdan o‘tish", path: "/signup", pro: false },
    ],
  },
];


const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();

  const renderMenuItems = (
    navItems: NavItem[],
    menuType: "main" | "others"
  ) => (
    <ul className="flex flex-col gap-4">
      {navItems.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group  ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <span
                className={` ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className={`menu-item-text`}>{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200  ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                href={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                <span
                  className={`${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
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
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      href={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge `}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge `}
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
  );

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

   const isActive = useCallback((path: string) => path === pathname, [pathname]);

  useEffect(() => {
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    // If no submenu item matches, close the open submenu
    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [pathname,isActive]);

  useEffect(() => {
    // Set the height of the submenu items when the submenu is opened
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex  ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
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
                src="/images/logo/logo-dark.svg"
                alt="Logo"
                width={150}
                height={40}
              />
            </>
          ) : (
            <Image
              src="/images/logo/logo-icon.svg"
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(navItems, "main")}
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
  );
};

export default AppSidebar;
