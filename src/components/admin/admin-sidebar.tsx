'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logoutAction } from '@/app/actions/auth';
import { Tooltip } from '@heroui/tooltip';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@heroui/react';
import { useSession } from 'next-auth/react';
import { getReportedCommentsCount } from '@/app/actions/admin-comments';

interface MenuItem {
  label: string;
  href?: string;
  icon?: string;
  badgeCount?: number;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    label: 'Գլխավոր',
    href: '/admin',
    icon: 'fa-home',
  },
  {
    label: 'Օգտատերեր',
    href: '/admin/users',
    icon: 'fa-users',
  },
  {
    label: 'Աշակերտներ',
    href: '/admin/students',
    icon: 'fa-graduation-cap',
  },
  {
    label: 'Կատեգորիաներ',
    href: '/admin/categories',
    icon: 'fa-folder',
  },
  {
    label: 'Հարցեր',
    href: '/admin/questions',
    icon: 'fa-question-circle',
  },
  {
    label: 'Հոգեբանական Հարցեր',
    href: '/admin/psychological-questions',
    icon: 'fa-brain',
  },
  {
    label: 'Բլոգ',
    href: '/admin/blogs',
    icon: 'fa-blog',
  },
  {
    label: 'Ճանապարհային',
    icon: 'fa-road',
    children: [
      {
        label: 'Կանոններ',
        href: '/admin/rules',
        icon: 'fa-book',
      },
      {
        label: 'Նշաններ',
        href: '/admin/road-signs',
        icon: 'fa-circle-info',
      },
      {
        label: 'Գծանշումներ',
        href: '/admin/road-markings',
        icon: 'fa-road',
      },
      {
        label: 'Ճանաչման Նշաններ',
        href: '/admin/vehicle-identification-signs',
        icon: 'fa-id-card',
      },
      {
        label: 'Տեխնիկական Անսարքություններ',
        href: '/admin/vehicle-technical-defects',
        icon: 'fa-exclamation-triangle',
      },
      {
        label: 'Օրենք',
        href: '/admin/traffic-law',
        icon: 'fa-gavel',
      },
    ],
  },
  {
    label: 'Մեկնաբանություններ',
    href: '/admin/comments',
    icon: 'fa-comments',
  },
  {
    label: 'Բողոքարկված Մեկնաբանություններ',
    href: '/admin/reported-comments',
    icon: 'fa-flag',
  },
  {
    label: 'Գրանցումներ',
    href: '/admin/registrations',
    icon: 'fa-clipboard-list',
  },
  {
    label: 'Հաղորդագրություններ',
    href: '/admin/contacts',
    icon: 'fa-envelope',
  },
  {
    label: 'Կարգավորումներ',
    href: '/admin/settings',
    icon: 'fa-cog',
  },
];

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

function MenuItemWithTooltip({
  item,
  isActive,
  isCollapsed,
  isMobile,
  onToggle,
}: {
  item: MenuItem;
  isActive: boolean;
  isCollapsed: boolean;
  isMobile: boolean;
  onToggle: () => void;
}) {
  const linkContent = item.href ? (
    <Link
      href={item.href}
      onClick={() => {
        if (isMobile) {
          onToggle();
        }
      }}
      className={`flex items-center gap-3 px-4 py-3 rounded-[10px] transition-colors relative ${
        isActive
          ? 'bg-[#FA8604] text-white font-medium'
          : 'text-[#1A2229] hover:bg-gray-50'
      } ${isCollapsed ? 'justify-center px-2' : ''}`}
    >
      {item.icon && (
        <i
          className={`fas ${item.icon} ${isCollapsed ? 'text-xl' : 'text-lg'}`}
        ></i>
      )}
      {!isCollapsed && <span>{item.label}</span>}
      {isCollapsed && !item.icon && (
        <span className="text-xl font-bold">{item.label.charAt(0)}</span>
      )}
      {item.badgeCount !== undefined && item.badgeCount > 0 && (
        <span
          className={`${
            isActive ? 'bg-white text-[#FA8604]' : 'bg-red-500 text-white'
          } text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 ${
            isCollapsed ? 'absolute -top-1 -right-1' : ''
          }`}
        >
          {item.badgeCount > 99 ? '99+' : item.badgeCount}
        </span>
      )}
    </Link>
  ) : (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-[10px] transition-colors relative ${
        isActive
          ? 'bg-[#FA8604] text-white font-medium'
          : 'text-[#1A2229] hover:bg-gray-50'
      } ${isCollapsed ? 'justify-center px-2' : ''}`}
    >
      {item.icon && (
        <i
          className={`fas ${item.icon} ${isCollapsed ? 'text-xl' : 'text-lg'}`}
        ></i>
      )}
      {!isCollapsed && <span>{item.label}</span>}
      {isCollapsed && !item.icon && (
        <span className="text-xl font-bold">{item.label.charAt(0)}</span>
      )}
    </div>
  );

  if (isCollapsed) {
    return (
      <Tooltip content={item.label} placement="right" showArrow>
        <div className={`relative ${isCollapsed ? 'flex justify-center' : ''}`}>
          {linkContent}
        </div>
      </Tooltip>
    );
  }

  return (
    <div className={`relative ${isCollapsed ? 'flex justify-center' : ''}`}>
      {linkContent}
    </div>
  );
}

function UserProfileSection({ isCollapsed }: { isCollapsed: boolean }) {
  const { data: session } = useSession();

  if (!session?.user) {
    return null;
  }

  const userName = session.user.name || session.user.email || 'Օգտատեր';
  const userInitials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const triggerContent = (
    <div
      className={`relative flex items-center gap-3 px-4 py-3 rounded-[10px] transition-colors cursor-pointer hover:bg-gray-50 ${
        isCollapsed ? 'justify-center px-2' : ''
      }`}
    >
      <div
        className={`flex items-center justify-center rounded-full bg-[#FA8604] text-white font-semibold shrink-0 ${
          isCollapsed ? 'w-10 h-10 text-sm' : 'w-10 h-10 text-sm'
        }`}
      >
        {userInitials}
      </div>
      {!isCollapsed && (
        <>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#1A2229] truncate">
              {userName}
            </p>
            <p className="text-xs text-[#8D8D8D] truncate">
              {(session.user as any)?.role === 'admin' ? 'Ադմին' : 'Օգտատեր'}
            </p>
          </div>
          <i className="fas fa-chevron-down text-[#8D8D8D] transition-transform shrink-0"></i>
        </>
      )}
    </div>
  );

  return (
    <Dropdown placement="top-start" classNames={{ content: 'min-w-[200px]' }}>
      {isCollapsed ? (
        <Tooltip content={userName} placement="right" showArrow>
          <DropdownTrigger>{triggerContent}</DropdownTrigger>
        </Tooltip>
      ) : (
        <DropdownTrigger>{triggerContent}</DropdownTrigger>
      )}
      <DropdownMenu
        aria-label="User menu"
        onAction={async (key) => {
          if (key === 'logout') {
            logoutAction();
          }
        }}
      >
        <DropdownItem
          key="profile"
          textValue={userName}
          className="h-auto py-3"
          isReadOnly
        >
          <div className="px-2">
            <p className="text-sm font-medium text-[#1A2229]">{userName}</p>
            <p className="text-xs text-[#8D8D8D]">
              {session.user?.email || ''}
            </p>
          </div>
        </DropdownItem>
        <DropdownItem
          key="logout"
          className="text-red-600"
          startContent={<i className="fas fa-sign-out"></i>}
        >
          Ելք
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

function MenuItemWithSubmenu({
  item,
  isCollapsed,
  isMobile,
  onToggle,
  reportedCount = 0,
}: {
  item: MenuItem;
  isCollapsed: boolean;
  isMobile: boolean;
  onToggle: () => void;
  reportedCount?: number;
}) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Check if any child is active
  const hasActiveChild =
    item.children?.some((child) => child.href === pathname) || false;

  // Auto-open if child is active
  useEffect(() => {
    if (hasActiveChild) {
      setIsOpen(true);
    }
  }, [hasActiveChild]);

  const toggleSubmenu = () => {
    setIsOpen(!isOpen);
  };

  const parentContent = (
    <div
      onClick={toggleSubmenu}
      className={`flex items-center justify-between gap-3 px-4 py-3 rounded-[10px] transition-colors cursor-pointer ${
        hasActiveChild
          ? 'bg-[#FA8604] text-white font-medium'
          : 'text-[#1A2229] hover:bg-gray-50'
      } ${isCollapsed ? 'justify-center px-2' : ''}`}
    >
      <div className="flex items-center gap-3 flex-1">
        {item.icon && (
          <i
            className={`fas ${item.icon} ${isCollapsed ? 'text-xl' : 'text-lg'}`}
          ></i>
        )}
        {!isCollapsed && <span>{item.label}</span>}
        {isCollapsed && !item.icon && (
          <span className="text-xl font-bold">{item.label.charAt(0)}</span>
        )}
      </div>
      {!isCollapsed && (
        <i
          className={`fas fa-chevron-down text-sm transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        ></i>
      )}
    </div>
  );

  if (isCollapsed) {
    return (
      <Tooltip content={item.label} placement="right" showArrow>
        <div className="relative">{parentContent}</div>
      </Tooltip>
    );
  }

  return (
    <div className="relative">
      {parentContent}
      {isOpen && !isCollapsed && item.children && (
        <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-200 pl-4">
          {item.children.map((child) => {
            const isChildActive = pathname === child.href;
            const childWithBadge =
              child.href === '/admin/reported-comments'
                ? { ...child, badgeCount: reportedCount }
                : child;
            return (
              <MenuItemWithTooltip
                key={child.href}
                item={childWithBadge}
                isActive={isChildActive}
                isCollapsed={false}
                isMobile={isMobile}
                onToggle={onToggle}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function AdminSidebar({
  isCollapsed,
  onToggle,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [reportedCount, setReportedCount] = useState(0);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch reported comments count
  useEffect(() => {
    async function fetchReportedCount() {
      try {
        const count = await getReportedCommentsCount();
        setReportedCount(count);
      } catch (error) {
        console.error('Error fetching reported comments count:', error);
      }
    }

    fetchReportedCount();
    // Refresh count every 30 seconds
    const interval = setInterval(fetchReportedCount, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Overlay for mobile */}
      {isMobile && !isCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full bg-white shadow-[0_0_60px_30px_rgba(0,0,0,0.03)] z-40 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-20' : 'w-80'
        } ${isMobile && isCollapsed ? '-translate-x-full' : 'translate-x-0'} p-6 overflow-y-auto overflow-x-visible flex flex-col`}
      >
        {/* Header with toggle button */}
        <div
          className={`mb-6 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}
        >
          {!isCollapsed && (
            <h2 className="text-xl font-bold text-[#1A2229]">Ադմին</h2>
          )}
          <button
            onClick={onToggle}
            className="text-[#8D8D8D] hover:text-[#1A2229] p-2 rounded-[10px] hover:bg-gray-100 transition-colors shrink-0"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={isCollapsed ? 'Բացել' : 'Փակել'}
          >
            {isCollapsed ? (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
          </button>
        </div>

        <nav className="space-y-2 flex-1">
          {menuItems.map((item) => {
            // Check if item has children (submenu)
            if (item.children && item.children.length > 0) {
              return (
                <MenuItemWithSubmenu
                  key={item.label}
                  item={item}
                  isCollapsed={isCollapsed}
                  isMobile={isMobile}
                  onToggle={onToggle}
                  reportedCount={reportedCount}
                />
              );
            }

            // Regular menu item
            const isActive = pathname === item.href;
            // Add badge count for reported comments menu item
            const menuItemWithBadge =
              item.href === '/admin/reported-comments'
                ? { ...item, badgeCount: reportedCount }
                : item;
            return (
              <MenuItemWithTooltip
                key={item.href || item.label}
                item={menuItemWithBadge}
                isActive={isActive}
                isCollapsed={isCollapsed}
                isMobile={isMobile}
                onToggle={onToggle}
              />
            );
          })}
        </nav>

        <div className="mt-auto pt-8 border-t border-gray-200">
          <UserProfileSection isCollapsed={isCollapsed} />
        </div>
      </div>
    </>
  );
}
