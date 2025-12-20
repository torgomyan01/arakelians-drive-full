'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import AdminSidebar from './admin-sidebar';

export default function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setIsCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
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
