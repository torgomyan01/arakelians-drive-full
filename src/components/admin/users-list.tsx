'use client';

import { useState, useMemo, useEffect } from 'react';
import { UserWithStats } from '@/app/actions/admin-users';
import UserEditModal from './user-edit-modal';

interface UsersListProps {
  users: UserWithStats[];
}

const ITEMS_PER_PAGE = 10;

export default function UsersList({ users }: UsersListProps) {
  const [selectedUser, setSelectedUser] = useState<UserWithStats | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterRole, setFilterRole] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = useMemo(() => {
    let filtered = users;

    // Filter by role
    if (filterRole) {
      filtered = filtered.filter((u) => u.role === filterRole);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.email.toLowerCase().includes(query) ||
          (u.name && u.name.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [users, filterRole, searchQuery]);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filterRole, searchQuery]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  const handleEdit = (user: UserWithStats) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedUser(null);
    setIsCreateModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setIsCreateModalOpen(false);
    setSelectedUser(null);
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

  const getRoleBadgeColor = (role: string) => {
    if (role === 'admin') {
      return 'bg-red-100 text-red-700';
    }
    return 'bg-blue-100 text-blue-700';
  };

  return (
    <>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-[#1A2229]">Օգտատերեր</h1>
          <button
            onClick={handleCreate}
            className="rounded-[10px] bg-[#FA8604] hover:bg-[#FA8604]/90 text-white px-6 py-2 font-medium transition-colors"
          >
            + Նոր օգտատեր
          </button>
        </div>
        <div className="flex justify-between items-center flex-wrap gap-4">
          <p className="text-[#8D8D8D]">
            Ընդամենը {filteredUsers.length} օգտատեր
            {filteredUsers.length !== users.length &&
              ` (${users.length} ընդամենը)`}
          </p>
          <div className="flex gap-4 items-center flex-wrap">
            <input
              type="text"
              placeholder="Փնտրել..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-300 rounded-[10px] px-4 py-2 focus:outline-none focus:border-[#FA8604]"
            />
            <select
              value={filterRole || ''}
              onChange={(e) =>
                setFilterRole(e.target.value ? e.target.value : null)
              }
              className="border border-gray-300 rounded-[10px] px-4 py-2 focus:outline-none focus:border-[#FA8604]"
            >
              <option value="">Բոլոր դերերը</option>
              <option value="admin">Ադմին</option>
              <option value="user">Օգտատեր</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {paginatedUsers.length === 0 ? (
          <div className="text-center py-12 text-[#8D8D8D]">
            Օգտատերեր չեն գտնվել
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
                    Email
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#1A2229]">
                    Անուն
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#1A2229]">
                    Դեր
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#1A2229]">
                    Ստեղծվել է
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-[#1A2229]">
                    Գործողություններ
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4 text-sm text-[#8D8D8D]">
                      {user.id}
                    </td>
                    <td className="py-3 px-4 text-sm text-[#1A2229]">
                      {user.email}
                    </td>
                    <td className="py-3 px-4 text-sm text-[#1A2229]">
                      {user.name || '-'}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-[10px] text-xs font-medium ${getRoleBadgeColor(
                          user.role
                        )}`}
                      >
                        {user.role === 'admin' ? 'Ադմին' : 'Օգտատեր'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-[#8D8D8D]">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="px-4 py-2 rounded-[10px] bg-[#FA8604] hover:bg-[#FA8604]/90 text-white text-sm font-medium transition-colors"
                        >
                          Խմբագրել
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

      {(isEditModalOpen || isCreateModalOpen) && (
        <UserEditModal
          user={selectedUser}
          onClose={handleCloseModal}
          isOpen={isEditModalOpen || isCreateModalOpen}
        />
      )}
    </>
  );
}
