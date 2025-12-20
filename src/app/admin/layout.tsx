import AdminLayoutWrapper from '@/components/admin/admin-layout-wrapper';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Authentication is handled by middleware and individual pages
  // This layout just provides the sidebar structure
  return <AdminLayoutWrapper>{children}</AdminLayoutWrapper>;
}
