'use client';

import { useState, useMemo, useEffect } from 'react';
import { RoadMarking } from '@/app/actions/admin-road-markings';
import { categoryLabels } from '@/utils/road-markings-utils';
import { getImageUrl } from '@/utils/image-utils';
import RoadMarkingEditModal from './road-marking-edit-modal';
import {
  createRoadMarking,
  updateRoadMarking,
  deleteRoadMarking,
} from '@/app/actions/admin-road-markings';

interface RoadMarkingsListProps {
  markings: RoadMarking[];
}

const ITEMS_PER_PAGE = 20;

export default function RoadMarkingsList({
  markings: initialMarkings,
}: RoadMarkingsListProps) {
  const [markings, setMarkings] = useState(initialMarkings);
  const [selectedMarking, setSelectedMarking] = useState<RoadMarking | null>(
    null
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  const filteredMarkings = useMemo(() => {
    let filtered = markings;

    // Filter by category
    if (filterCategory !== 'all') {
      filtered = filtered.filter((m) => m.category === filterCategory);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.name.toLowerCase().includes(term) ||
          m.number.toLowerCase().includes(term) ||
          m.description.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [markings, filterCategory, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterCategory, searchTerm]);

  const totalPages = Math.ceil(filteredMarkings.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedMarkings = filteredMarkings.slice(startIndex, endIndex);

  const handleEdit = (marking: RoadMarking) => {
    setSelectedMarking(marking);
    setIsEditModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedMarking(null);
    setIsCreateModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setIsCreateModalOpen(false);
    setSelectedMarking(null);
  };

  const handleSave = async (data: any) => {
    if (selectedMarking) {
      const result = await updateRoadMarking(selectedMarking.id, data);
      if (result.success && result.marking) {
        setMarkings((prev) =>
          prev.map((m) => (m.id === selectedMarking.id ? result.marking! : m))
        );
        handleCloseModal();
      } else {
        alert(result.error || 'Սխալ է տեղի ունեցել');
      }
    } else {
      const result = await createRoadMarking(data);
      if (result.success && result.marking) {
        setMarkings((prev) => [result.marking!, ...prev]);
        handleCloseModal();
      } else {
        alert(result.error || 'Սխալ է տեղի ունեցել');
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Դուք համոզված եք, որ ցանկանում եք ջնջել այս գծանշումը?')) {
      return;
    }

    setIsDeleting(id);
    const result = await deleteRoadMarking(id);
    setIsDeleting(null);

    if (result.success) {
      setMarkings((prev) => prev.filter((m) => m.id !== id));
    } else {
      alert(result.error || 'Սխալ է տեղի ունեցել');
    }
  };

  const getCategoryColor = (category: RoadMarking['category']) => {
    switch (category) {
      case 'horizontal':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'vertical':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'other':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-[#1A2229]">
            Ճանապարհային Գծանշումներ
          </h1>
          <button
            onClick={handleCreate}
            className="rounded-[10px] bg-[#FA8604] hover:bg-[#FA8604]/90 text-white px-6 py-2 font-medium transition-colors"
          >
            + Նոր գծանշում
          </button>
        </div>
        <div className="flex justify-between items-center gap-4 flex-wrap">
          <p className="text-[#8D8D8D]">
            Ընդամենը {filteredMarkings.length} գծանշում
            {filteredMarkings.length !== markings.length &&
              ` (${markings.length} ընդամենը)`}
          </p>
          <div className="flex gap-4 items-center flex-wrap">
            <input
              type="text"
              placeholder="Որոնել..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-[10px] px-4 py-2 focus:outline-none focus:border-[#FA8604]"
            />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="border border-gray-300 rounded-[10px] px-4 py-2 focus:outline-none focus:border-[#FA8604]"
            >
              <option value="all">Բոլոր կատեգորիաները</option>
              {Object.entries(categoryLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {paginatedMarkings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-[#8D8D8D] text-lg">
            {filteredMarkings.length === 0
              ? 'Գծանշումներ չկան'
              : 'Այս էջում գծանշումներ չկան'}
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-[#1A2229]">
                    Համար
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-[#1A2229]">
                    Անվանում
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-[#1A2229]">
                    Կատեգորիա
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-[#1A2229]">
                    Նկար
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-[#1A2229]">
                    Գործողություններ
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedMarkings.map((marking) => (
                  <tr
                    key={marking.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="font-medium text-[#1A2229]">
                        {marking.number}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-medium text-[#1A2229]">
                        {marking.name}
                      </div>
                      {marking.description && (
                        <div className="text-sm text-[#8D8D8D] mt-1 line-clamp-1">
                          {marking.description}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(
                          marking.category
                        )}`}
                      >
                        {categoryLabels[marking.category]}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      {marking.image ? (
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={
                              marking.image.startsWith('/')
                                ? marking.image
                                : getImageUrl(marking.image)
                            }
                            alt={marking.name}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display =
                                'none';
                            }}
                          />
                        </div>
                      ) : (
                        <span className="text-sm text-[#8D8D8D]">-</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(marking)}
                          className="text-[#FA8604] hover:text-[#e67503] transition-colors px-3 py-1 rounded-[10px] hover:bg-[#FA8604]/10"
                        >
                          Խմբագրել
                        </button>
                        <button
                          onClick={() => handleDelete(marking.id)}
                          disabled={isDeleting === marking.id}
                          className="text-red-500 hover:text-red-700 transition-colors px-3 py-1 rounded-[10px] hover:bg-red-50 disabled:opacity-50"
                        >
                          {isDeleting === marking.id ? 'Ջնջվում է...' : 'Ջնջել'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex justify-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-[10px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                Նախորդ
              </button>
              <span className="px-4 py-2 text-[#8D8D8D]">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-[10px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                Հաջորդ
              </button>
            </div>
          )}
        </>
      )}

      {(isEditModalOpen || isCreateModalOpen) && (
        <RoadMarkingEditModal
          marking={selectedMarking}
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      )}
    </>
  );
}
