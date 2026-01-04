'use client';

import { useState, useEffect } from 'react';
import { RuleItem } from '@/app/actions/admin-rules';

interface RuleItemEditModalProps {
  item: RuleItem | null;
  sectionId: number;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}

export default function RuleItemEditModal({
  item,
  sectionId,
  onClose,
  onSave,
}: RuleItemEditModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    number: '',
    title: '',
    content: '',
    type: 'rule',
    important: false,
    order: 0,
  });

  useEffect(() => {
    if (item) {
      setFormData({
        number: item.number,
        title: item.title || '',
        content: item.content,
        type: item.type,
        important: item.important,
        order: item.order,
      });
    } else {
      setFormData({
        number: '',
        title: '',
        content: '',
        type: 'rule',
        important: false,
        order: 0,
      });
    }
  }, [item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await onSave({
        number: formData.number,
        title: formData.title || null,
        content: formData.content,
        type: formData.type,
        important: formData.important,
        order: formData.order,
      });
    } catch (err: any) {
      setError(err.message || 'Սխալ է տեղի ունեցել');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[20px] shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#1A2229]">
              {item ? 'Խմբագրել կանոնը' : 'Նոր կանոն'}
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

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Number */}
            <div>
              <label className="block text-sm font-medium text-[#1A2229] mb-2">
                Համար * (օրինակ: 1, 2.1, 73)
              </label>
              <input
                type="text"
                value={formData.number}
                onChange={(e) =>
                  setFormData({ ...formData, number: e.target.value })
                }
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-[10px] focus:outline-none focus:border-[#FA8604]"
                placeholder="1"
              />
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-[#1A2229] mb-2">
                Վերնագիր (ընտրովի)
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-[10px] focus:outline-none focus:border-[#FA8604]"
                placeholder="Կանոնի վերնագիր"
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
                rows={8}
                className="w-full px-4 py-2 border border-gray-300 rounded-[10px] focus:outline-none focus:border-[#FA8604]"
                placeholder="Կանոնի բովանդակությունը"
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-[#1A2229] mb-2">
                Տեսակ *
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-[10px] focus:outline-none focus:border-[#FA8604]"
              >
                <option value="rule">Կանոն</option>
                <option value="prohibition">Արգելք</option>
                <option value="requirement">Պահանջ</option>
                <option value="definition">Սահմանում</option>
                <option value="subrule">Ենթականոն</option>
              </select>
            </div>

            {/* Important */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="important"
                checked={formData.important}
                onChange={(e) =>
                  setFormData({ ...formData, important: e.target.checked })
                }
                className="w-4 h-4 text-[#FA8604] border-gray-300 rounded focus:ring-[#FA8604]"
              />
              <label
                htmlFor="important"
                className="ml-2 text-sm font-medium text-[#1A2229]"
              >
                Կարևոր կանոն
              </label>
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
        </div>
      </div>
    </div>
  );
}
