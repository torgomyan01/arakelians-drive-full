'use client';

import { useState, useMemo, useEffect } from 'react';
import { RulesSection } from '@/app/actions/admin-rules';
import RulesEditModal from './rules-edit-modal';
import {
  createRulesSection,
  updateRulesSection,
  deleteRulesSection,
} from '@/app/actions/admin-rules';

interface RulesListProps {
  sections: RulesSection[];
}

const ITEMS_PER_PAGE = 10;

export default function RulesList({
  sections: initialSections,
}: RulesListProps) {
  const [sections, setSections] = useState(initialSections);
  const [selectedSection, setSelectedSection] = useState<RulesSection | null>(
    null
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  const totalPages = Math.ceil(sections.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedSections = sections.slice(startIndex, endIndex);

  const handleEdit = (section: RulesSection) => {
    setSelectedSection(section);
    setIsEditModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedSection(null);
    setIsCreateModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setIsCreateModalOpen(false);
    setSelectedSection(null);
  };

  const handleSave = async (data: any) => {
    if (selectedSection) {
      const result = await updateRulesSection(selectedSection.id, data);
      if (result.success && result.section) {
        // Update local state with fresh data including items
        setSections((prev) =>
          prev.map((s) => (s.id === selectedSection.id ? result.section! : s))
        );
        // Update selectedSection to show fresh data in modal
        setSelectedSection(result.section);
        // Don't close modal - let user continue editing
        // Modal will stay open and show updated data
      } else {
        alert(result.error || 'Սխալ է տեղի ունեցել');
      }
    } else {
      const result = await createRulesSection(data);
      if (result.success && result.section) {
        // Add new section to list
        setSections((prev) => [result.section!, ...prev]);
        // Set the newly created section as selected so modal shows it
        setSelectedSection(result.section);
        // Switch to edit mode (not create mode)
        setIsCreateModalOpen(false);
        setIsEditModalOpen(true);
        // Don't close modal - let user continue editing or add items
        // Modal will stay open and show new section data
      } else {
        alert(result.error || 'Սխալ է տեղի ունեցել');
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Դուք համոզված եք, որ ցանկանում եք ջնջել այս բաժինը?')) {
      return;
    }

    setIsDeleting(id);
    const result = await deleteRulesSection(id);
    setIsDeleting(null);

    if (result.success) {
      setSections((prev) => prev.filter((s) => s.id !== id));
    } else {
      alert(result.error || 'Սխալ է տեղի ունեցել');
    }
  };

  return (
    <>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-[#1A2229]">
            Ճանապարհային Կանոններ
          </h1>
          <button
            onClick={handleCreate}
            className="rounded-[10px] bg-[#FA8604] hover:bg-[#FA8604]/90 text-white px-6 py-2 font-medium transition-colors"
          >
            + Նոր բաժին
          </button>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-[#8D8D8D]">Ընդամենը {sections.length} բաժին</p>
        </div>
      </div>

      {paginatedSections.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-[#8D8D8D] text-lg">Բաժիններ չկան</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-[#1A2229]">
                    Կարգ
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-[#1A2229]">
                    Վերնագիր
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-[#1A2229]">
                    Slug
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-[#1A2229]">
                    Նկարագրություն
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-[#1A2229]">
                    Կանոններ
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-[#1A2229]">
                    Գործողություններ
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedSections.map((section) => (
                  <tr
                    key={section.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="font-medium text-[#1A2229]">
                        {section.order}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-medium text-[#1A2229]">
                        {section.title}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <code className="text-sm text-[#8D8D8D] bg-gray-100 px-2 py-1 rounded">
                        {section.slug}
                      </code>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-[#8D8D8D] line-clamp-2 max-w-md">
                        {section.description}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {section.items?.length || 0} կանոն
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(section)}
                          className="text-[#FA8604] hover:text-[#e67503] transition-colors px-3 py-1 rounded-[10px] hover:bg-[#FA8604]/10"
                        >
                          Խմբագրել
                        </button>
                        <button
                          onClick={() => handleDelete(section.id)}
                          disabled={isDeleting === section.id}
                          className="text-red-500 hover:text-red-700 transition-colors px-3 py-1 rounded-[10px] hover:bg-red-50 disabled:opacity-50"
                        >
                          {isDeleting === section.id ? 'Ջնջվում է...' : 'Ջնջել'}
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
        <RulesEditModal
          section={selectedSection}
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      )}
    </>
  );
}
