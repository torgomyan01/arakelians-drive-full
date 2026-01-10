'use client';

import { useState, useEffect } from 'react';
import { TrafficLawItem } from '@/app/actions/admin-traffic-law';
import { categoryLabels } from '@/utils/trafficLaw';

interface TrafficLawEditModalProps {
  item: TrafficLawItem | null;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}

export default function TrafficLawEditModal({
  item,
  onClose,
  onSave,
}: TrafficLawEditModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'concepts',
    order: 0,
  });

  // Get unique categories for dropdown
  const availableCategories = Object.keys(categoryLabels);

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        description: item.description,
        category: item.category,
        order: item.order,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        category: 'concepts',
        order: 0,
      });
    }
  }, [item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const dataToSave: any = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category,
        order: formData.order,
      };

      await onSave(dataToSave);
    } catch (err: any) {
      setError(err.message || 'Սխալ է տեղի ունեցել');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-[20px] p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#1A2229]">
            {item ? 'Խմբագրել նյութ' : 'Նոր նյութ'}
          </h2>
          <button
            onClick={onClose}
            className="text-[#8D8D8D] hover:text-[#1A2229] text-2xl"
          >
            ×
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-[10px] text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
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
              className="w-full px-4 py-2 border border-gray-300 rounded-[10px] focus:outline-none focus:border-[#FA8604]"
              placeholder="Մուտքագրեք նյութի անվանումը"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-[#1A2229] mb-2">
              Կատեգորիա *
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-[10px] focus:outline-none focus:border-[#FA8604]"
            >
              {availableCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {categoryLabels[cat]}
                </option>
              ))}
            </select>
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
              rows={8}
              className="w-full px-4 py-2 border border-gray-300 rounded-[10px] focus:outline-none focus:border-[#FA8604] resize-none"
              placeholder="Մուտքագրեք նյութի նկարագրությունը"
            />
          </div>

          {/* Order */}
          <div>
            <label className="block text-sm font-medium text-[#1A2229] mb-2">
              Կարգ
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
              className="w-full px-4 py-2 border border-gray-300 rounded-[10px] focus:outline-none focus:border-[#FA8604]"
              placeholder="0"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-[10px] text-[#1A2229] hover:bg-gray-50 transition-colors"
            >
              Չեղարկել
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-[#FA8604] hover:bg-[#FA8604]/90 text-white rounded-[10px] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Պահպանվում է...' : 'Պահպանել'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
