import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getAllContacts } from '@/app/actions/contacts';
import ContactsList from '@/components/admin/contacts-list';

export default async function AdminContactsPage() {
  const session = await auth();

  if (!session || (session.user as any)?.role !== 'admin') {
    redirect('/admin/login');
  }

  const contacts = await getAllContacts();

  return (
    <div className="bg-white rounded-[20px] shadow-[0_0_60px_30px_rgba(0,0,0,0.03)] p-8">
      <ContactsList contacts={contacts} />
    </div>
  );
}
