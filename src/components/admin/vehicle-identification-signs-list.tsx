'use client';

import { useState, useMemo, useEffect } from 'react';
import { VehicleIdentificationSign } from '@/app/actions/admin-vehicle-identification-signs';
import { getImageUrl } from '@/utils/image-utils';
import VehicleIdentificationSignEditModal from './vehicle-identification-sign-edit-modal';
import {
  createVehicleIdentificationSign,
  updateVehicleIdentificationSign,
  deleteVehicleIdentificationSign,
} from '@/app/actions/admin-vehicle-identification-signs';

interface VehicleIdentificationSignsListProps {
  signs: VehicleIdentificationSign[];
}

const ITEMS_PER_PAGE = 20;

export default function VehicleIdentificationSignsList({
  signs: initialSigns,
}: VehicleIdentificationSignsListProps) {
  const [signs, setSigns] = useState(initialSigns);
  const [selectedSign, setSelectedSign] =
    useState<VehicleIdentificationSign | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  const filteredSigns = useMemo(() => {
    let filtered = signs;

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(term) ||
          s.number.toLowerCase().includes(term) ||
          s.description.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [signs, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const totalPages = Math.ceil(filteredSigns.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedSigns = filteredSigns.slice(startIndex, endIndex);

  const handleEdit = (sign: VehicleIdentificationSign) => {
    setSelectedSign(sign);
    setIsEditModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedSign(null);
    setIsCreateModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setIsCreateModalOpen(false);
    setSelectedSign(null);
  };

  const handleSave = async (data: any) => {
    if (selectedSign) {
      const result = await updateVehicleIdentificationSign(
        selectedSign.id,
        data
      );
      if (result.success && result.sign) {
        setSigns((prev) =>
          prev.map((s) => (s.id === selectedSign.id ? result.sign! : s))
        );
        handleCloseModal();
      } else {
        alert(result.error || 'Սխալ է տեղի ունեցել');
      }
    } else {
      const result = await createVehicleIdentificationSign(data);
      if (result.success && result.sign) {
        setSigns((prev) => [result.sign!, ...prev]);
        handleCloseModal();
      } else {
        alert(result.error || 'Սխալ է տեղի ունեցել');
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Դուք համոզված եք, որ ցանկանում եք ջնջել այս նշանը?')) {
      return;
    }

    setIsDeleting(id);
    const result = await deleteVehicleIdentificationSign(id);
    setIsDeleting(null);

    if (result.success) {
      setSigns((prev) => prev.filter((s) => s.id !== id));
    } else {
      alert(result.error || 'Սխալ է տեղի ունեցել');
    }
  };

  return (
    <>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-[#1A2229]">
            Տրանսպորտային Միջոցի Ճանաչման Նշաններ
          </h1>
          <button
            onClick={handleCreate}
            className="rounded-[10px] bg-[#FA8604] hover:bg-[#FA8604]/90 text-white px-6 py-2 font-medium transition-colors"
          >
            + Նոր նշան
          </button>
        </div>
        <div className="flex justify-between items-center gap-4 flex-wrap">
          <p className="text-[#8D8D8D]">
            Ընդամենը {filteredSigns.length} նշան
            {filteredSigns.length !== signs.length &&
              ` (${signs.length} ընդամենը)`}
          </p>
          <div className="flex gap-4 items-center flex-wrap">
            <input
              type="text"
              placeholder="Որոնել..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-[10px] px-4 py-2 focus:outline-none focus:border-[#FA8604]"
            />
          </div>
        </div>
      </div>

      {paginatedSigns.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-[#8D8D8D] text-lg">
            {filteredSigns.length === 0
              ? 'Նշաններ չկան'
              : 'Այս էջում նշաններ չկան'}
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
                    Նկար
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-[#1A2229]">
                    Գործողություններ
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedSigns.map((sign) => (
                  <tr
                    key={sign.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="font-medium text-[#1A2229]">
                        {sign.number}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-medium text-[#1A2229]">
                        {sign.name}
                      </div>
                      {sign.description && (
                        <div className="text-sm text-[#8D8D8D] mt-1 line-clamp-1">
                          {sign.description}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      {sign.image ? (
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={
                              sign.image.startsWith('/')
                                ? sign.image
                                : getImageUrl(sign.image)
                            }
                            alt={sign.name}
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
                          onClick={() => handleEdit(sign)}
                          className="text-[#FA8604] hover:text-[#e67503] transition-colors px-3 py-1 rounded-[10px] hover:bg-[#FA8604]/10"
                        >
                          Խմբագրել
                        </button>
                        <button
                          onClick={() => handleDelete(sign.id)}
                          disabled={isDeleting === sign.id}
                          className="text-red-500 hover:text-red-700 transition-colors px-3 py-1 rounded-[10px] hover:bg-red-50 disabled:opacity-50"
                        >
                          {isDeleting === sign.id ? 'Ջնջվում է...' : 'Ջնջել'}
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
        <VehicleIdentificationSignEditModal
          sign={selectedSign}
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      )}
    </>
  );
}
