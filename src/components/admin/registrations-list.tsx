'use client';

import { useState, useMemo, useEffect } from 'react';
import { RegistrationData } from '@/app/actions/registrations';
import { deleteRegistration } from '@/app/actions/registrations';
import { useRouter } from 'next/navigation';

interface RegistrationsListProps {
  registrations: RegistrationData[];
}

const ITEMS_PER_PAGE = 20;

export default function RegistrationsList({
  registrations,
}: RegistrationsListProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [filterDiscount, setFilterDiscount] = useState<boolean | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRegistrations = useMemo(() => {
    let filtered = registrations;

    // Filter by discount
    if (filterDiscount !== null) {
      filtered = filtered.filter((r) => r.hasDiscount === filterDiscount);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(query) ||
          r.phone.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [registrations, filterDiscount, searchQuery]);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filterDiscount, searchQuery]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredRegistrations.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedRegistrations = filteredRegistrations.slice(
    startIndex,
    endIndex
  );

  const handleDelete = async (id: number) => {
    if (!confirm('Վստահ ե՞ք, որ ցանկանում եք ջնջել այս գրանցումը?')) {
      return;
    }

    setDeletingId(id);
    try {
      const result = await deleteRegistration(id);
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

  const discountCount = useMemo(
    () => registrations.filter((r) => r.hasDiscount).length,
    [registrations]
  );

  return (
    <>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-[#1A2229]">Գրանցումներ</h1>
        </div>
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <p className="text-[#8D8D8D]">
              Ընդամենը {filteredRegistrations.length} գրանցում
              {filteredRegistrations.length !== registrations.length &&
                ` (${registrations.length} ընդամենը)`}
            </p>
            {discountCount > 0 && (
              <p className="text-sm text-[#FA8604] font-medium mt-1">
                {discountCount} գրանցում զեղչով
              </p>
            )}
          </div>
          <div className="flex gap-4 items-center flex-wrap">
            <input
              type="text"
              placeholder="Փնտրել անուն/հեռախոս..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-300 rounded-[10px] px-4 py-2 focus:outline-none focus:border-[#FA8604]"
            />
            <select
              value={
                filterDiscount === null
                  ? ''
                  : filterDiscount
                    ? 'discount'
                    : 'no-discount'
              }
              onChange={(e) => {
                const value = e.target.value;
                if (value === '') {
                  setFilterDiscount(null);
                } else {
                  setFilterDiscount(value === 'discount');
                }
              }}
              className="border border-gray-300 rounded-[10px] px-4 py-2 focus:outline-none focus:border-[#FA8604]"
            >
              <option value="">Բոլորը</option>
              <option value="discount">Զեղչով</option>
              <option value="no-discount">Առանց զեղչի</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {paginatedRegistrations.length === 0 ? (
          <div className="text-center py-12 text-[#8D8D8D]">
            Գրանցումներ չեն գտնվել
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#1A2229]">
                    ID
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#1A2229]">
                    Անուն
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#1A2229]">
                    Հեռախոս
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#1A2229]">
                    Զեղչ
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#1A2229]">
                    Գրանցվել է
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-[#1A2229]">
                    Գործողություններ
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedRegistrations.map((registration) => (
                  <tr
                    key={registration.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4 text-sm text-[#8D8D8D]">
                      {registration.id}
                    </td>
                    <td className="py-3 px-4 text-sm text-[#1A2229] font-medium">
                      {registration.name}
                    </td>
                    <td className="py-3 px-4 text-sm text-[#1A2229]">
                      {registration.phone}
                    </td>
                    <td className="py-3 px-4">
                      {registration.hasDiscount ? (
                        <span className="px-3 py-1 rounded-[10px] text-xs font-medium bg-green-100 text-green-700">
                          ✓ Զեղչով
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-[10px] text-xs font-medium bg-gray-100 text-gray-600">
                          -
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm text-[#8D8D8D]">
                      {formatDate(registration.createdAt)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleDelete(registration.id)}
                          disabled={deletingId === registration.id}
                          className="px-4 py-2 rounded-[10px] bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors disabled:opacity-50"
                        >
                          {deletingId === registration.id
                            ? 'Ջնջվում է...'
                            : 'Ջնջել'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

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
