'use client';

import { useState, useMemo, useEffect } from 'react';
import { TrafficLawItem } from '@/app/actions/admin-traffic-law';
import { categoryLabels } from '@/utils/trafficLaw';
import TrafficLawEditModal from './traffic-law-edit-modal';
import {
  createTrafficLawItem,
  updateTrafficLawItem,
  deleteTrafficLawItem,
} from '@/app/actions/admin-traffic-law';

interface TrafficLawListProps {
  items: TrafficLawItem[];
}

const ITEMS_PER_PAGE = 20;

export default function TrafficLawList({
  items: initialItems,
}: TrafficLawListProps) {
  const [items, setItems] = useState(initialItems);
  const [selectedItem, setSelectedItem] = useState<TrafficLawItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  // Get unique categories
  const uniqueCategories = useMemo(() => {
    const cats = new Set<string>();
    items.forEach((item) => {
      cats.add(item.category);
    });
    return Array.from(cats).sort();
  }, [items]);

  const filteredItems = useMemo(() => {
    let filtered = items;

    // Filter by category
    if (filterCategory !== 'all') {
      filtered = filtered.filter((i) => i.category === filterCategory);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (i) =>
          i.name.toLowerCase().includes(term) ||
          i.description.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [items, filterCategory, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterCategory, searchTerm]);

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedItems = filteredItems.slice(startIndex, endIndex);

  const handleEdit = (item: TrafficLawItem) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedItem(null);
    setIsCreateModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setIsCreateModalOpen(false);
    setSelectedItem(null);
  };

  const handleSave = async (data: any) => {
    if (selectedItem) {
      const result = await updateTrafficLawItem(selectedItem.id, data);
      if (result.success && result.item) {
        setItems((prev) =>
          prev.map((i) => (i.id === selectedItem.id ? result.item! : i))
        );
        handleCloseModal();
      } else {
        alert(result.error || 'Սխալ է տեղի ունեցել');
      }
    } else {
      const result = await createTrafficLawItem(data);
      if (result.success && result.item) {
        setItems((prev) => [result.item!, ...prev]);
        handleCloseModal();
      } else {
        alert(result.error || 'Սխալ է տեղի ունեցել');
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Դուք համոզված եք, որ ցանկանում եք ջնջել այս նյութը?')) {
      return;
    }

    setIsDeleting(id);
    const result = await deleteTrafficLawItem(id);
    setIsDeleting(null);

    if (result.success) {
      setItems((prev) => prev.filter((i) => i.id !== id));
    } else {
      alert(result.error || 'Սխալ է տեղի ունեցել');
    }
  };

  const getCategoryColor = (category: string) => {
    if (category === 'concepts') {
      return 'bg-blue-100 text-blue-800 border-blue-300';
    }
    if (category.startsWith('article-')) {
      return 'bg-green-100 text-green-800 border-green-300';
    }
    return 'bg-gray-100 text-gray-800 border-gray-300';
  };

  return (
    <>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-[#1A2229]">
            Օրենք Ճանապարհային Երթևեկության Անվտանգության Ապահովման Մասին
          </h1>
          <button
            onClick={handleCreate}
            className="rounded-[10px] bg-[#FA8604] hover:bg-[#FA8604]/90 text-white px-6 py-2 font-medium transition-colors"
          >
            + Նոր նյութ
          </button>
        </div>
        <div className="flex justify-between items-center gap-4 flex-wrap">
          <p className="text-[#8D8D8D]">
            Ընդամենը {filteredItems.length} նյութ
            {filteredItems.length !== items.length &&
              ` (${items.length} ընդամենը)`}
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
              {uniqueCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {categoryLabels[cat] || cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {paginatedItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-[#8D8D8D] text-lg">
            {filteredItems.length === 0
              ? 'Նյութեր չկան'
              : 'Այս էջում նյութեր չկան'}
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-[#1A2229]">
                    Անվանում
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-[#1A2229]">
                    Կատեգորիա
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-[#1A2229]">
                    Գործողություններ
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedItems.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="font-medium text-[#1A2229]">
                        {item.name}
                      </div>
                      {item.description && (
                        <div className="text-sm text-[#8D8D8D] mt-1 line-clamp-2">
                          {item.description}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(
                          item.category
                        )}`}
                      >
                        {categoryLabels[item.category] || item.category}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-[#FA8604] hover:text-[#e67503] transition-colors px-3 py-1 rounded-[10px] hover:bg-[#FA8604]/10"
                        >
                          Խմբագրել
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={isDeleting === item.id}
                          className="text-red-500 hover:text-red-700 transition-colors px-3 py-1 rounded-[10px] hover:bg-red-50 disabled:opacity-50"
                        >
                          {isDeleting === item.id ? 'Ջնջվում է...' : 'Ջնջել'}
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
        <TrafficLawEditModal
          item={selectedItem}
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      )}
    </>
  );
}
