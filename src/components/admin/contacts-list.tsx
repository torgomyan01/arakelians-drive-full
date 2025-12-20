'use client';

import { useState, useMemo, useEffect } from 'react';
import { ContactData } from '@/app/actions/contacts';
import { deleteContact } from '@/app/actions/contacts';
import { useRouter } from 'next/navigation';

interface ContactsListProps {
  contacts: ContactData[];
}

const ITEMS_PER_PAGE = 20;

export default function ContactsList({ contacts }: ContactsListProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState<ContactData | null>(
    null
  );

  const filteredContacts = useMemo(() => {
    if (!searchQuery.trim()) {
      return contacts;
    }

    const query = searchQuery.toLowerCase();
    return contacts.filter(
      (c) =>
        c.firstName.toLowerCase().includes(query) ||
        c.lastName.toLowerCase().includes(query) ||
        c.phone.toLowerCase().includes(query) ||
        c.message.toLowerCase().includes(query)
    );
  }, [contacts, searchQuery]);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredContacts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedContacts = filteredContacts.slice(startIndex, endIndex);

  const handleDelete = async (id: number) => {
    if (!confirm('Վստահ ե՞ք, որ ցանկանում եք ջնջել այս հաղորդագրությունը?')) {
      return;
    }

    setDeletingId(id);
    try {
      const result = await deleteContact(id);
      if (result.success) {
        router.refresh();
      } else {
        alert(result.error || 'Սխալ է տեղի ունեցել');
      }
    } catch (error: any) {
      alert(error.message || 'Սխալ է տեղի ունեցել');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('hy-AM', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-[#1A2229]">
            Հաղորդագրություններ
          </h1>
        </div>
        <div className="flex justify-between items-center flex-wrap gap-4">
          <p className="text-[#8D8D8D]">
            Ընդամենը {filteredContacts.length} հաղորդագրություն
            {filteredContacts.length !== contacts.length &&
              ` (${contacts.length} ընդամենը)`}
          </p>
          <div className="flex gap-4 items-center flex-wrap">
            <input
              type="text"
              placeholder="Փնտրել..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-300 rounded-[10px] px-4 py-2 focus:outline-none focus:border-[#FA8604]"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {paginatedContacts.length === 0 ? (
          <div className="text-center py-12 text-[#8D8D8D]">
            Հաղորդագրություններ չեն գտնվել
          </div>
        ) : (
          paginatedContacts.map((contact) => (
            <div
              key={contact.id}
              className="border border-gray-200 rounded-[10px] p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-[#1A2229]">
                        {contact.firstName} {contact.lastName}
                      </h3>
                      <p className="text-sm text-[#8D8D8D] mt-1">
                        {contact.phone}
                      </p>
                    </div>
                    <span className="text-xs text-[#8D8D8D]">
                      {formatDate(contact.createdAt)}
                    </span>
                  </div>
                  <p className="text-[#1A2229] whitespace-pre-wrap">
                    {contact.message}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => setSelectedContact(contact)}
                    className="px-4 py-2 rounded-[10px] bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition-colors"
                  >
                    Դիտել
                  </button>
                  <button
                    onClick={() => handleDelete(contact.id)}
                    disabled={deletingId === contact.id}
                    className="px-4 py-2 rounded-[10px] bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    {deletingId === contact.id ? 'Ջնջվում է...' : 'Ջնջել'}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Contact Detail Modal */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[20px] shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#1A2229]">
                  Հաղորդագրության մանրամասներ
                </h2>
                <button
                  onClick={() => setSelectedContact(null)}
                  className="text-[#8D8D8D] hover:text-[#1A2229] text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#8D8D8D] mb-1">
                    Անուն
                  </label>
                  <p className="text-lg text-[#1A2229]">
                    {selectedContact.firstName}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#8D8D8D] mb-1">
                    Ազգանուն
                  </label>
                  <p className="text-lg text-[#1A2229]">
                    {selectedContact.lastName}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#8D8D8D] mb-1">
                    Հեռախոսահամար
                  </label>
                  <p className="text-lg text-[#1A2229]">
                    <a
                      href={`tel:${selectedContact.phone}`}
                      className="text-[#FA8604] hover:underline"
                    >
                      {selectedContact.phone}
                    </a>
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#8D8D8D] mb-1">
                    Հաղորդագրություն
                  </label>
                  <p className="text-[#1A2229] whitespace-pre-wrap">
                    {selectedContact.message}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#8D8D8D] mb-1">
                    Գրանցվել է
                  </label>
                  <p className="text-sm text-[#8D8D8D]">
                    {formatDate(selectedContact.createdAt)}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end gap-4">
                <button
                  onClick={() => setSelectedContact(null)}
                  className="px-6 py-2 rounded-[10px] border border-gray-300 text-[#1A2229] font-medium hover:bg-gray-50 transition-colors"
                >
                  Փակել
                </button>
                <button
                  onClick={() => {
                    handleDelete(selectedContact.id);
                    setSelectedContact(null);
                  }}
                  className="px-6 py-2 rounded-[10px] bg-red-500 hover:bg-red-600 text-white font-medium transition-colors"
                >
                  Ջնջել
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-[10px] border border-gray-300 text-[#1A2229] font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Նախորդ
          </button>

          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-[10px] font-medium transition-colors ${
                      currentPage === page
                        ? 'bg-[#FA8604] text-white'
                        : 'border border-gray-300 text-[#1A2229] hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              } else if (page === currentPage - 2 || page === currentPage + 2) {
                return (
                  <span key={page} className="px-2 text-[#8D8D8D]">
                    ...
                  </span>
                );
              }
              return null;
            })}
          </div>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-[10px] border border-gray-300 text-[#1A2229] font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Հաջորդ
          </button>
        </div>
      )}
    </>
  );
}
