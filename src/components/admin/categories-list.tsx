'use client';

import { useState } from 'react';
import {
  LessonCategoryWithCount,
  createLessonCategory,
  updateLessonCategory,
  deleteLessonCategory,
} from '@/app/actions/admin-categories';
import { useRouter } from 'next/navigation';

interface CategoriesListProps {
  categories: LessonCategoryWithCount[];
}

export default function CategoriesList({ categories }: CategoriesListProps) {
  const router = useRouter();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<LessonCategoryWithCount | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ name: '' });

  const handleCreate = () => {
    setEditingCategory(null);
    setFormData({ name: '' });
    setError('');
    setIsCreateModalOpen(true);
  };

  const handleEdit = (category: LessonCategoryWithCount) => {
    setEditingCategory(category);
    setFormData({ name: category.name });
    setError('');
    setIsCreateModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    setEditingCategory(null);
    setFormData({ name: '' });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.name.trim()) {
        setError('Անվանումը պարտադիր է');
        setLoading(false);
        return;
      }

      if (editingCategory) {
        const result = await updateLessonCategory(editingCategory.id, {
          name: formData.name,
        });

        if (!result.success) {
          setError(result.error || 'Սխալ է տեղի ունեցել');
        } else {
          router.refresh();
          handleCloseModal();
        }
      } else {
        const result = await createLessonCategory({
          name: formData.name,
        });

        if (!result.success) {
          setError(result.error || 'Սխալ է տեղի ունեցել');
        } else {
          router.refresh();
          handleCloseModal();
        }
      }
    } catch (err: any) {
      setError(err.message || 'Սխալ է տեղի ունեցել');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (
      !confirm(
        'Վստահ ե՞ք, որ ցանկանում եք ջնջել այս կատեգորիան? (Նշում: կատեգորիան կարող է ջնջվել միայն եթե այն չի պարունակում հարցեր)'
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      const result = await deleteLessonCategory(id);
      if (result.success) {
        router.refresh();
      } else {
        alert(result.error || 'Սխալ է տեղի ունեցել');
      }
    } catch (err: any) {
      alert(err.message || 'Սխալ է տեղի ունեցել');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-[#1A2229]">
            Հարցաշարերի կատեգորիաներ
          </h1>
          <button
            onClick={handleCreate}
            className="rounded-[10px] bg-[#FA8604] hover:bg-[#FA8604]/90 text-white px-6 py-2 font-medium transition-colors"
          >
            + Նոր կատեգորիա
          </button>
        </div>
        <p className="text-[#8D8D8D]">Ընդամենը {categories.length} կատեգորիա</p>
      </div>

      <div className="space-y-4">
        {categories.length === 0 ? (
          <div className="text-center py-12 text-[#8D8D8D]">
            Կատեգորիաներ չեն գտնվել
          </div>
        ) : (
          categories.map((category) => (
            <div
              key={category.id}
              className="border border-gray-200 rounded-[10px] p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="text-xl font-semibold text-[#1A2229]">
                      {category.name}
                    </h3>
                    <span className="text-sm text-[#8D8D8D]">
                      ID: {category.id}
                    </span>
                  </div>
                  <p className="text-[#8D8D8D]">
                    {category.questionCount} հարց
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(category)}
                    disabled={loading}
                    className="px-4 py-2 rounded-[10px] bg-[#FA8604] hover:bg-[#FA8604]/90 text-white font-medium transition-colors disabled:opacity-50"
                  >
                    Խմբագրել
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    disabled={loading || category.questionCount > 0}
                    className="px-4 py-2 rounded-[10px] bg-red-500 hover:bg-red-600 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title={
                      category.questionCount > 0
                        ? 'Չի կարելի ջնջել, քանի որ պարունակում է հարցեր'
                        : 'Ջնջել'
                    }
                  >
                    Ջնջել
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create/Edit Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[20px] shadow-xl max-w-md w-full">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#1A2229]">
                  {editingCategory ? 'Խմբագրել կատեգորիան' : 'Նոր կատեգորիա'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-[#8D8D8D] hover:text-[#1A2229] text-2xl"
                >
                  ×
                </button>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#1A2229] mb-2">
                    Անվանում *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    placeholder="Օրինակ: Հարցաշար 1, Բազային հարցեր..."
                    className="w-full border border-gray-300 rounded-[10px] px-4 py-2 focus:outline-none focus:border-[#FA8604]"
                  />
                </div>

                <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    disabled={loading}
                    className="px-6 py-2 rounded-[10px] border border-gray-300 text-[#1A2229] font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Չեղարկել
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 rounded-[10px] bg-[#FA8604] hover:bg-[#FA8604]/90 text-white font-medium transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Պահպանում...' : 'Պահպանել'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
