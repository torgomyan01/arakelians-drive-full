'use client';

import { useState, useEffect } from 'react';
import { VehicleTechnicalDefect } from '@/app/actions/admin-vehicle-technical-defects';
import type { VehicleTechnicalDefectCategory } from '@/utils/vehicle-technical-defects-utils';

interface VehicleTechnicalDefectEditModalProps {
  defect: VehicleTechnicalDefect | null;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}

const categoryOptions: {
  value: VehicleTechnicalDefectCategory;
  label: string;
}[] = [
  { value: 'braking', label: 'Արգելակային համակարգ' },
  { value: 'steering', label: 'Ղեկային կառավարման համակարգ' },
  { value: 'lighting', label: 'Արտաքին լուսային սարքեր' },
  { value: 'wheels', label: 'Անիվներ և դողեր' },
  { value: 'engine', label: 'Շարժիչ' },
  { value: 'other', label: 'Այլ' },
];

export default function VehicleTechnicalDefectEditModal({
  defect,
  onClose,
  onSave,
}: VehicleTechnicalDefectEditModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    number: '',
    description: '',
    category: 'braking' as VehicleTechnicalDefectCategory,
    order: 0,
  });

  useEffect(() => {
    if (defect) {
      setFormData({
        number: defect.number,
        description: defect.description,
        category: defect.category,
        order: defect.order,
      });
    } else {
      setFormData({
        number: '',
        description: '',
        category: 'braking',
        order: 0,
      });
    }
  }, [defect]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const dataToSave: any = {
        number: formData.number.trim(),
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
            {defect ? 'Խմբագրել անսարքություն' : 'Նոր անսարքություն'}
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
          {/* Number */}
          <div>
            <label className="block text-sm font-medium text-[#1A2229] mb-2">
              Համար *
            </label>
            <input
              type="text"
              value={formData.number}
              onChange={(e) =>
                setFormData({ ...formData, number: e.target.value })
              }
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-[10px] focus:outline-none focus:border-[#FA8604]"
              placeholder="Օր. 1, 2, 3"
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
                setFormData({
                  ...formData,
                  category: e.target.value as VehicleTechnicalDefectCategory,
                })
              }
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-[10px] focus:outline-none focus:border-[#FA8604]"
            >
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
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
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-[10px] focus:outline-none focus:border-[#FA8604] resize-none"
              placeholder="Մուտքագրեք անսարքության նկարագրությունը"
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
