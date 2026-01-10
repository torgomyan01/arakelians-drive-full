'use client';

import { useState, useMemo, useEffect } from 'react';
import { VehicleTechnicalDefect } from '@/app/actions/admin-vehicle-technical-defects';
import { categoryLabels } from '@/utils/vehicle-technical-defects-utils';
import VehicleTechnicalDefectEditModal from './vehicle-technical-defect-edit-modal';
import {
  createVehicleTechnicalDefect,
  updateVehicleTechnicalDefect,
  deleteVehicleTechnicalDefect,
} from '@/app/actions/admin-vehicle-technical-defects';

interface VehicleTechnicalDefectsListProps {
  defects: VehicleTechnicalDefect[];
}

const ITEMS_PER_PAGE = 20;

export default function VehicleTechnicalDefectsList({
  defects: initialDefects,
}: VehicleTechnicalDefectsListProps) {
  const [defects, setDefects] = useState(initialDefects);
  const [selectedDefect, setSelectedDefect] =
    useState<VehicleTechnicalDefect | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  const filteredDefects = useMemo(() => {
    let filtered = defects;

    // Filter by category
    if (filterCategory !== 'all') {
      filtered = filtered.filter((d) => d.category === filterCategory);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (d) =>
          d.description.toLowerCase().includes(term) ||
          d.number.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [defects, filterCategory, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterCategory, searchTerm]);

  const totalPages = Math.ceil(filteredDefects.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedDefects = filteredDefects.slice(startIndex, endIndex);

  const handleEdit = (defect: VehicleTechnicalDefect) => {
    setSelectedDefect(defect);
    setIsEditModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedDefect(null);
    setIsCreateModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setIsCreateModalOpen(false);
    setSelectedDefect(null);
  };

  const handleSave = async (data: any) => {
    if (selectedDefect) {
      const result = await updateVehicleTechnicalDefect(
        selectedDefect.id,
        data
      );
      if (result.success && result.defect) {
        setDefects((prev) =>
          prev.map((d) => (d.id === selectedDefect.id ? result.defect! : d))
        );
        handleCloseModal();
      } else {
        alert(result.error || 'Սխալ է տեղի ունեցել');
      }
    } else {
      const result = await createVehicleTechnicalDefect(data);
      if (result.success && result.defect) {
        setDefects((prev) => [result.defect!, ...prev]);
        handleCloseModal();
      } else {
        alert(result.error || 'Սխալ է տեղի ունեցել');
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (
      !confirm('Դուք համոզված եք, որ ցանկանում եք ջնջել այս անսարքությունը?')
    ) {
      return;
    }

    setIsDeleting(id);
    const result = await deleteVehicleTechnicalDefect(id);
    setIsDeleting(null);

    if (result.success) {
      setDefects((prev) => prev.filter((d) => d.id !== id));
    } else {
      alert(result.error || 'Սխալ է տեղի ունեցել');
    }
  };

  const getCategoryColor = (category: VehicleTechnicalDefect['category']) => {
    switch (category) {
      case 'braking':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'steering':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'lighting':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'wheels':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'engine':
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
            Տրանսպորտային Միջոցի Տեխնիկական Անսարքություններ
          </h1>
          <button
            onClick={handleCreate}
            className="rounded-[10px] bg-[#FA8604] hover:bg-[#FA8604]/90 text-white px-6 py-2 font-medium transition-colors"
          >
            + Նոր անսարքություն
          </button>
        </div>
        <div className="flex justify-between items-center gap-4 flex-wrap">
          <p className="text-[#8D8D8D]">
            Ընդամենը {filteredDefects.length} անսարքություն
            {filteredDefects.length !== defects.length &&
              ` (${defects.length} ընդամենը)`}
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

      {paginatedDefects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-[#8D8D8D] text-lg">
            {filteredDefects.length === 0
              ? 'Անսարքություններ չկան'
              : 'Այս էջում անսարքություններ չկան'}
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
                    Նկարագրություն
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
                {paginatedDefects.map((defect) => (
                  <tr
                    key={defect.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="font-medium text-[#1A2229]">
                        {defect.number}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-[#1A2229] max-w-2xl line-clamp-2">
                        {defect.description}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(
                          defect.category
                        )}`}
                      >
                        {categoryLabels[defect.category]}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(defect)}
                          className="text-[#FA8604] hover:text-[#e67503] transition-colors px-3 py-1 rounded-[10px] hover:bg-[#FA8604]/10"
                        >
                          Խմբագրել
                        </button>
                        <button
                          onClick={() => handleDelete(defect.id)}
                          disabled={isDeleting === defect.id}
                          className="text-red-500 hover:text-red-700 transition-colors px-3 py-1 rounded-[10px] hover:bg-red-50 disabled:opacity-50"
                        >
                          {isDeleting === defect.id ? 'Ջնջվում է...' : 'Ջնջել'}
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
        <VehicleTechnicalDefectEditModal
          defect={selectedDefect}
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      )}
    </>
  );
}
