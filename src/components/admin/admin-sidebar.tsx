'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logoutAction } from '@/app/actions/auth';

interface MenuItem {
  label: string;
  href: string;
  icon?: string;
}

const menuItems: MenuItem[] = [
  {
    label: 'Գլխավոր',
    href: '/admin',
  },
  {
    label: 'Օգտատերեր',
    href: '/admin/users',
  },
  {
    label: 'Կատեգորիաներ',
    href: '/admin/categories',
  },
  {
    label: 'Հարցեր',
    href: '/admin/questions',
  },
  {
    label: 'Բլոգ',
    href: '/admin/blogs',
  },
  {
    label: 'Մեկնաբանություններ',
    href: '/admin/comments',
  },
  {
    label: 'Գրանցումներ',
    href: '/admin/registrations',
  },
  {
    label: 'Հաղորդագրություններ',
    href: '/admin/contacts',
  },
  {
    label: 'Կարգավորումներ',
    href: '/admin/settings',
  },
];

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export default function AdminSidebar({
  isCollapsed,
  onToggle,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
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
          isCollapsed ? 'w-20' : 'w-64'
        } ${isMobile && isCollapsed ? '-translate-x-full' : 'translate-x-0'} p-6 overflow-y-auto`}
      >
        {/* Header with toggle button */}
        <div className="mb-6 flex items-center justify-between">
          {!isCollapsed && (
            <h2 className="text-xl font-bold text-[#1A2229]">Ադմին</h2>
          )}
          <button
            onClick={onToggle}
            className="text-[#8D8D8D] hover:text-[#1A2229] p-2 rounded-[10px] hover:bg-gray-100 transition-colors"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
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

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  if (isMobile) {
                    onToggle();
                  }
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-[10px] transition-colors ${
                  isActive
                    ? 'bg-[#FA8604] text-white font-medium'
                    : 'text-[#1A2229] hover:bg-gray-50'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                {isCollapsed ? (
                  <span className="text-xl font-bold">
                    {item.label.charAt(0)}
                  </span>
                ) : (
                  <span>{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <form action={logoutAction}>
            <button
              type="submit"
              className={`w-full px-4 py-3 rounded-[10px] bg-red-500 hover:bg-red-600 text-white font-medium transition-colors ${
                isCollapsed ? 'px-2' : ''
              }`}
              title={isCollapsed ? 'Ելք' : undefined}
            >
              {isCollapsed ? '×' : 'Ելք'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
