'use client';

import { useState, useEffect } from 'react';
import {
  RulesSection,
  RuleItem,
  getRulesSectionById,
} from '@/app/actions/admin-rules';
import RuleItemEditModal from './rule-item-edit-modal';
import {
  createRuleItem,
  updateRuleItem,
  deleteRuleItem,
} from '@/app/actions/admin-rules';

interface RulesEditModalProps {
  section: RulesSection | null;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}

export default function RulesEditModal({
  section,
  onClose,
  onSave,
}: RulesEditModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    content: '',
    order: 0,
    icon: '',
    color: '',
  });
  const [ruleItems, setRuleItems] = useState<RuleItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<RuleItem | null>(null);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isDeletingItem, setIsDeletingItem] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'section' | 'items'>('section');

  useEffect(() => {
    if (section) {
      setFormData({
        title: section.title,
        slug: section.slug,
        description: section.description,
        content: section.content,
        order: section.order,
        icon: section.icon || '',
        color: section.color || '',
      });
      setRuleItems(section.items || []);
    } else {
      setFormData({
        title: '',
        slug: '',
        description: '',
        content: '',
        order: 0,
        icon: '',
        color: '',
      });
      setRuleItems([]);
    }
  }, [section]);

  // Auto-generate slug from title
  useEffect(() => {
    if (!section && formData.title) {
      const generatedSlug = formData.title
        .toLowerCase()
        .trim()
        .replace(/[^\u0561-\u0587\u0531-\u0556a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
      setFormData((prev) => ({ ...prev, slug: generatedSlug }));
    }
  }, [formData.title, section]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await onSave({
        title: formData.title,
        slug: formData.slug,
        description: formData.description,
        content: formData.content,
        order: formData.order,
        icon: formData.icon || null,
        color: formData.color || null,
      });

      // Refresh section data after save if section exists
      if (section) {
        await refreshSectionData();
      }
    } catch (err: any) {
      setError(err.message || 'Սխալ է տեղի ունեցել');
    } finally {
      setLoading(false);
    }
  };

  const handleItemEdit = (item: RuleItem) => {
    setSelectedItem(item);
    setIsItemModalOpen(true);
  };

  const handleItemCreate = () => {
    setSelectedItem(null);
    setIsItemModalOpen(true);
  };

  const handleItemClose = () => {
    setIsItemModalOpen(false);
    setSelectedItem(null);
  };

  const refreshSectionData = async () => {
    if (!section) return;

    try {
      const refreshedSection = await getRulesSectionById(section.id);
      if (refreshedSection) {
        setRuleItems(refreshedSection.items || []);
        // Update form data if section data changed
        setFormData((prev) => ({
          ...prev,
          title: refreshedSection.title,
          slug: refreshedSection.slug,
          description: refreshedSection.description,
          content: refreshedSection.content,
          order: refreshedSection.order,
          icon: refreshedSection.icon || '',
          color: refreshedSection.color || '',
        }));
      }
    } catch (error) {
      console.error('Error refreshing section data:', error);
    }
  };

  const handleItemSave = async (data: any) => {
    if (!section) return;

    if (selectedItem) {
      const result = await updateRuleItem(selectedItem.id, data);
      if (result.success && result.item) {
        // Update local state immediately
        setRuleItems((prev) =>
          prev.map((item) =>
            item.id === selectedItem.id ? result.item! : item
          )
        );
        handleItemClose();
        // Refresh section data to get latest from database
        await refreshSectionData();
      } else {
        alert(result.error || 'Սխալ է տեղի ունեցել');
      }
    } else {
      const result = await createRuleItem(section.id, data);
      if (result.success && result.item) {
        // Update local state immediately
        setRuleItems((prev) => [...prev, result.item!]);
        handleItemClose();
        // Refresh section data to get latest from database
        await refreshSectionData();
      } else {
        alert(result.error || 'Սխալ է տեղի ունեցել');
      }
    }
  };

  const handleItemDelete = async (id: number) => {
    if (!confirm('Դուք համոզված եք, որ ցանկանում եք ջնջել այս կանոնը?')) {
      return;
    }

    setIsDeletingItem(id);
    const result = await deleteRuleItem(id);
    setIsDeletingItem(null);

    if (result.success) {
      setRuleItems((prev) => prev.filter((item) => item.id !== id));
    } else {
      alert(result.error || 'Սխալ է տեղի ունեցել');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[20px] shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#1A2229]">
              {section ? 'Խմբագրել բաժինը' : 'Նոր բաժին'}
            </h2>
            <button
              onClick={onClose}
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

          {/* Tabs */}
          {section && (
            <div className="flex gap-2 mb-6 border-b border-gray-200">
              <button
                type="button"
                onClick={() => setActiveTab('section')}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === 'section'
                    ? 'text-[#FA8604] border-b-2 border-[#FA8604]'
                    : 'text-[#8D8D8D] hover:text-[#1A2229]'
                }`}
              >
                Բաժին
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('items')}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === 'items'
                    ? 'text-[#FA8604] border-b-2 border-[#FA8604]'
                    : 'text-[#8D8D8D] hover:text-[#1A2229]'
                }`}
              >
                Կանոններ ({ruleItems.length})
              </button>
            </div>
          )}

          {activeTab === 'section' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-[#1A2229] mb-2">
                  Վերնագիր *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-[10px] focus:outline-none focus:border-[#FA8604]"
                  placeholder="Մուտքագրեք բաժնի վերնագիրը"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-[#1A2229] mb-2">
                  Slug (URL) *
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-[10px] focus:outline-none focus:border-[#FA8604] font-mono text-sm"
                  placeholder="բաժնի-url-հասցե"
                />
                <p className="text-xs text-[#8D8D8D] mt-1">
                  URL-ը պետք է լինի անգլերեն կամ հայերեն տառերով, թվերով և
                  գծիկներով
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-[#1A2229] mb-2">
                  Նկարագրություն *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-[10px] focus:outline-none focus:border-[#FA8604]"
                  placeholder="Մուտքագրեք բաժնի նկարագրությունը"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-[#1A2229] mb-2">
                  Բովանդակություն *
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  required
                  rows={15}
                  className="w-full px-4 py-2 border border-gray-300 rounded-[10px] focus:outline-none focus:border-[#FA8604] font-mono text-sm"
                  placeholder="Մուտքագրեք բաժնի բովանդակությունը"
                />
                <p className="text-xs text-[#8D8D8D] mt-1">
                  Կարող եք օգտագործել նոր տողեր և հատուկ նշաններ
                </p>
              </div>

              {/* Order */}
              <div>
                <label className="block text-sm font-medium text-[#1A2229] mb-2">
                  Կարգ (Order) *
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      order: parseInt(e.target.value) || 0,
                    })
                  }
                  required
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-[10px] focus:outline-none focus:border-[#FA8604]"
                  placeholder="0"
                />
                <p className="text-xs text-[#8D8D8D] mt-1">
                  Ցուցադրման հերթականությունը (փոքր թվերը ցուցադրվում են առաջին)
                </p>
              </div>

              {/* Icon */}
              <div>
                <label className="block text-sm font-medium text-[#1A2229] mb-2">
                  Icon (ընտրովի)
                </label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) =>
                    setFormData({ ...formData, icon: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-[10px] focus:outline-none focus:border-[#FA8604]"
                  placeholder="icon-name"
                />
              </div>

              {/* Color */}
              <div>
                <label className="block text-sm font-medium text-[#1A2229] mb-2">
                  Գույն (ընտրովի)
                </label>
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) =>
                    setFormData({ ...formData, color: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-[10px] focus:outline-none focus:border-[#FA8604]"
                  placeholder="#FA8604"
                />
                <p className="text-xs text-[#8D8D8D] mt-1">
                  Hex գույնի կոդ (օրինակ: #FA8604)
                </p>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-4 pt-6">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="px-6 py-3 border border-gray-300 text-[#1A2229] rounded-[10px] font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Չեղարկել
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-[#FA8604] text-white rounded-[10px] font-medium hover:bg-[#E67504] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Պահպանվում է...' : 'Պահպանել'}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'items' && section && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-[#1A2229]">
                  Կանոններ
                </h3>
                <button
                  type="button"
                  onClick={handleItemCreate}
                  className="px-4 py-2 bg-[#FA8604] text-white rounded-[10px] font-medium hover:bg-[#E67504] transition-colors text-sm"
                >
                  + Նոր կանոն
                </button>
              </div>

              {ruleItems.length === 0 ? (
                <div className="text-center py-8 text-[#8D8D8D]">
                  Կանոններ չկան: Կտտացրեք "+ Նոր կանոն" ավելացնելու համար
                </div>
              ) : (
                <div className="space-y-2">
                  {ruleItems
                    .sort((a, b) => a.order - b.order)
                    .map((item) => (
                      <div
                        key={item.id}
                        className="border border-gray-200 rounded-[10px] p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-semibold text-[#1A2229]">
                                {item.number}
                              </span>
                              {item.title && (
                                <span className="text-[#8D8D8D] text-sm">
                                  - {item.title}
                                </span>
                              )}
                              <span
                                className={`px-2 py-1 rounded text-xs font-medium ${
                                  item.type === 'prohibition'
                                    ? 'bg-red-100 text-red-800'
                                    : item.type === 'requirement'
                                      ? 'bg-blue-100 text-blue-800'
                                      : item.type === 'definition'
                                        ? 'bg-purple-100 text-purple-800'
                                        : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {item.type}
                              </span>
                              {item.important && (
                                <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                  Կարևոր
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-[#8D8D8D] line-clamp-2">
                              {item.content}
                            </p>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <button
                              type="button"
                              onClick={() => handleItemEdit(item)}
                              className="text-[#FA8604] hover:text-[#e67503] transition-colors px-3 py-1 rounded-[10px] hover:bg-[#FA8604]/10 text-sm"
                            >
                              Խմբագրել
                            </button>
                            <button
                              type="button"
                              onClick={() => handleItemDelete(item.id)}
                              disabled={isDeletingItem === item.id}
                              className="text-red-500 hover:text-red-700 transition-colors px-3 py-1 rounded-[10px] hover:bg-red-50 disabled:opacity-50 text-sm"
                            >
                              {isDeletingItem === item.id
                                ? 'Ջնջվում է...'
                                : 'Ջնջել'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'section' && (
            <div className="flex justify-end gap-4 pt-6">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-6 py-3 border border-gray-300 text-[#1A2229] rounded-[10px] font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Չեղարկել
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-[#FA8604] text-white rounded-[10px] font-medium hover:bg-[#E67504] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Պահպանվում է...' : 'Պահպանել'}
              </button>
            </div>
          )}
        </div>
      </div>

      {isItemModalOpen && section && (
        <RuleItemEditModal
          item={selectedItem}
          sectionId={section.id}
          onClose={handleItemClose}
          onSave={handleItemSave}
        />
      )}
    </div>
  );
}
