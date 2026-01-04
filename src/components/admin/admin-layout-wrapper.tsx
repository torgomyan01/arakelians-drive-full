'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import AdminSidebar from './admin-sidebar';

const SIDEBAR_STORAGE_KEY = 'admin-sidebar-collapsed';

export default function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem(SIDEBAR_STORAGE_KEY);
    if (savedState !== null) {
      setIsCollapsed(JSON.parse(savedState));
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      // On mobile, always collapse sidebar
      if (mobile) {
        setIsCollapsed(true);
      } else {
        // On desktop, restore saved state
        const savedState = localStorage.getItem(SIDEBAR_STORAGE_KEY);
        if (savedState !== null) {
          setIsCollapsed(JSON.parse(savedState));
        }
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Save state to localStorage whenever it changes (only on desktop)
  useEffect(() => {
    if (isHydrated && !isMobile) {
      localStorage.setItem(SIDEBAR_STORAGE_KEY, JSON.stringify(isCollapsed));
    }
  }, [isCollapsed, isMobile, isHydrated]);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  // Don't show sidebar on login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar isCollapsed={isCollapsed} onToggle={toggleSidebar} />

        {/* Main Content */}
        <div
          className={`flex-1 transition-all duration-300 ease-in-out mt-8 ${
            isCollapsed ? 'lg:ml-20' : 'lg:ml-64'
          } ${isMobile ? 'ml-0' : ''}`}
        >
          <div className="container mx-auto px-4 py-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
