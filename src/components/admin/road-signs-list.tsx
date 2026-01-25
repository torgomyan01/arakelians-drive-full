'use client';

import { useState, useMemo, useEffect } from 'react';
import { RoadSign } from '@/app/actions/admin-road-signs';
import { categoryLabels } from '@/utils/road-signs-utils';
import RoadSignEditModal from './road-sign-edit-modal';
import {
  createRoadSign,
  updateRoadSign,
  deleteRoadSign,
  updateRoadSignsOrder,
} from '@/app/actions/admin-road-signs';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

interface RoadSignsListProps {
  signs: RoadSign[];
}

const ITEMS_PER_PAGE = 20;

interface SortableRowProps {
  sign: RoadSign;
  onEdit: (sign: RoadSign) => void;
  onDelete: (id: number) => void;
  isDeleting: number | null;
  getCategoryColor: (category: RoadSign['category']) => string;
}

function SortableRow({
  sign,
  onEdit,
  onDelete,
  isDeleting,
  getCategoryColor,
}: SortableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: sign.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
        isDragging ? 'bg-blue-50 shadow-lg' : ''
      }`}
    >
      <td className="py-4 px-4">
        <div className="flex items-center gap-2">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 transition-colors p-1"
            aria-label="Տեղափոխել"
          >
            <GripVertical size={18} />
          </button>
          <div className="font-medium text-[#1A2229]">{sign.number}</div>
        </div>
      </td>
      <td className="py-4 px-4">
        <div className="font-medium text-[#1A2229]">{sign.name}</div>
        {sign.description && (
          <div className="text-sm text-[#8D8D8D] mt-1 line-clamp-1">
            {sign.description}
          </div>
        )}
      </td>
      <td className="py-4 px-4">
        <span
          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(
            sign.category
          )}`}
        >
          {categoryLabels[sign.category]}
        </span>
      </td>
      <td className="py-4 px-4">
        {sign.image ? (
          <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={sign.image}
              alt={sign.name}
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
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
            onClick={() => onEdit(sign)}
            className="text-[#FA8604] hover:text-[#e67503] transition-colors px-3 py-1 rounded-[10px] hover:bg-[#FA8604]/10"
          >
            Խմբագրել
          </button>
          <button
            onClick={() => onDelete(sign.id)}
            disabled={isDeleting === sign.id}
            className="text-red-500 hover:text-red-700 transition-colors px-3 py-1 rounded-[10px] hover:bg-red-50 disabled:opacity-50"
          >
            {isDeleting === sign.id ? 'Ջնջվում է...' : 'Ջնջել'}
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function RoadSignsList({
  signs: initialSigns,
}: RoadSignsListProps) {
  const [signs, setSigns] = useState(initialSigns);
  const [selectedSign, setSelectedSign] = useState<RoadSign | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [draggingCategory, setDraggingCategory] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const filteredSigns = useMemo(() => {
    let filtered = signs;

    // Filter by category
    if (filterCategory !== 'all') {
      filtered = filtered.filter((s) => s.category === filterCategory);
    }

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

    // Sort by order within filtered results
    return [...filtered].sort((a, b) => {
      // If same category, sort by order
      if (a.category === b.category) {
        return a.order - b.order;
      }
      // Otherwise maintain category order
      return 0;
    });
  }, [signs, filterCategory, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterCategory, searchTerm]);

  const totalPages = Math.ceil(filteredSigns.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  
  // If dragging, show all signs from the same category (for cross-page dragging)
  // Otherwise, show paginated signs
  const displaySigns = isDragging && draggingCategory
    ? filteredSigns.filter((s) => s.category === draggingCategory)
    : filteredSigns.slice(startIndex, endIndex);

  const handleEdit = (sign: RoadSign) => {
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
      const result = await updateRoadSign(selectedSign.id, data);
      if (result.success && result.sign) {
        setSigns((prev) =>
          prev.map((s) => (s.id === selectedSign.id ? result.sign! : s))
        );
        handleCloseModal();
      } else {
        alert(result.error || 'Սխալ է տեղի ունեցել');
      }
    } else {
      const result = await createRoadSign(data);
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
    const result = await deleteRoadSign(id);
    setIsDeleting(null);

    if (result.success) {
      setSigns((prev) => prev.filter((s) => s.id !== id));
    } else {
      alert(result.error || 'Սխալ է տեղի ունեցել');
    }
  };

  const handleDragStart = (event: any) => {
    const draggedSign = signs.find((s) => s.id === event.active.id);
    if (draggedSign) {
      setIsDragging(true);
      setDraggingCategory(draggedSign.category);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setIsDragging(false);
    setDraggingCategory(null);

    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    // Find the dragged sign and target sign
    const draggedSign = signs.find((s) => s.id === active.id);
    const targetSign = signs.find((s) => s.id === over.id);

    if (!draggedSign || !targetSign) {
      return;
    }

    // Only allow reordering within the same category
    if (draggedSign.category !== targetSign.category) {
      return;
    }

    // Get all signs in the same category, sorted by current order
    const categorySigns = signs
      .filter((s) => s.category === draggedSign.category)
      .sort((a, b) => a.order - b.order);

    // Find the indices in the category
    const categoryOldIndex = categorySigns.findIndex((s) => s.id === active.id);
    const categoryNewIndex = categorySigns.findIndex((s) => s.id === over.id);

    if (categoryOldIndex === -1 || categoryNewIndex === -1) {
      return;
    }

    // Reorder within the category
    const reorderedCategory = arrayMove(
      categorySigns,
      categoryOldIndex,
      categoryNewIndex
    );

    // Create updates with new order values
    const updates = reorderedCategory.map((sign, index) => ({
      id: sign.id,
      order: index,
    }));

    // Optimistically update the UI
    setSigns((prev) => {
      const updated = [...prev];
      updates.forEach(({ id, order }) => {
        const signIndex = updated.findIndex((s) => s.id === id);
        if (signIndex !== -1) {
          updated[signIndex] = { ...updated[signIndex], order };
        }
      });
      return updated;
    });

    // Save to database
    setIsSavingOrder(true);
    const result = await updateRoadSignsOrder(updates);
    setIsSavingOrder(false);

    if (!result.success) {
      // Revert on error
      setSigns(initialSigns);
      alert(result.error || 'Սխալ է տեղի ունեցել հերթականությունը թարմացնելիս');
    } else {
      // After successful reorder, navigate to the page containing the dragged item
      const newIndex = reorderedCategory.findIndex((s) => s.id === active.id);
      const newPage = Math.floor(newIndex / ITEMS_PER_PAGE) + 1;
      if (newPage !== currentPage && newPage <= totalPages) {
        setCurrentPage(newPage);
      }
    }
  };

  const handleDragCancel = () => {
    setIsDragging(false);
    setDraggingCategory(null);
  };

  const getCategoryColor = (category: RoadSign['category']) => {
    switch (category) {
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'priority':
        return 'bg-blue-100 text-blue-800';
      case 'prohibitory':
        return 'bg-red-100 text-red-800';
      case 'mandatory':
        return 'bg-blue-100 text-blue-800';
      case 'special':
        return 'bg-green-100 text-green-800';
      case 'information':
        return 'bg-indigo-100 text-indigo-800';
      case 'service':
        return 'bg-teal-100 text-teal-800';
      case 'additional':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-[#1A2229]">
            Ճանապարհային Նշաններ
          </h1>
          <button
            onClick={handleCreate}
            className="rounded-[10px] bg-[#FA8604] hover:bg-[#FA8604]/90 text-white px-6 py-2 font-medium transition-colors"
          >
            + Նոր նշան
          </button>
        </div>
        <div className="flex justify-between items-center gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <p className="text-[#8D8D8D]">
              Ընդամենը {filteredSigns.length} նշան
              {filteredSigns.length !== signs.length &&
                ` (${signs.length} ընդամենը)`}
            </p>
            {isSavingOrder && (
              <span className="text-sm text-[#FA8604]">Պահպանվում է...</span>
            )}
          </div>
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

      {displaySigns.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-[#8D8D8D] text-lg">
            {filteredSigns.length === 0
              ? 'Նշաններ չկան'
              : isDragging
                ? 'Այս կատեգորիայում նշաններ չկան'
                : 'Այս էջում նշաններ չկան'}
          </p>
        </div>
      ) : (
        <>
          {isDragging && draggingCategory && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-[10px]">
              <p className="text-sm text-blue-800">
                <strong>Տեղափոխման ռեժիմ:</strong> Բոլոր նշանները{' '}
                <strong>{categoryLabels[draggingCategory as keyof typeof categoryLabels]}</strong>{' '}
                կատեգորիայից ցուցադրվում են: Կարող եք տեղափոխել նշանները ցանկացած դիրք:
              </p>
            </div>
          )}
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
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragCancel={handleDragCancel}
              >
                <SortableContext
                  items={displaySigns.map((s) => s.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <tbody>
                    {displaySigns.map((sign) => (
                      <SortableRow
                        key={sign.id}
                        sign={sign}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        isDeleting={isDeleting}
                        getCategoryColor={getCategoryColor}
                      />
                    ))}
                  </tbody>
                </SortableContext>
              </DndContext>
            </table>
          </div>

          {totalPages > 1 && !isDragging && (
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
        <RoadSignEditModal
          sign={selectedSign}
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      )}
    </>
  );
}
