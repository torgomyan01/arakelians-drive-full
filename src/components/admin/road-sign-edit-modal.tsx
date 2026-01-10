'use client';

import { useState, useEffect, useCallback } from 'react';
import { RoadSign } from '@/app/actions/admin-road-signs';
import type { RoadSignCategory } from '@/utils/road-signs-utils';
import { getImageUrl } from '@/utils/image-utils';

interface RoadSignEditModalProps {
  sign: RoadSign | null;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}

const categoryOptions: { value: RoadSignCategory; label: string }[] = [
  { value: 'warning', label: 'Նախազգուշացնող' },
  { value: 'priority', label: 'Առավելության' },
  { value: 'prohibitory', label: 'Արգելող' },
  { value: 'mandatory', label: 'Թելադրող' },
  { value: 'special', label: 'Հատուկ թելադրանքի' },
  { value: 'information', label: 'Տեղեկատվության' },
  { value: 'service', label: 'Սպասարկման' },
  { value: 'additional', label: 'Լրացուցիչ տեղեկատվության' },
];

export default function RoadSignEditModal({
  sign,
  onClose,
  onSave,
}: RoadSignEditModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    number: '',
    name: '',
    description: '',
    category: 'warning' as RoadSignCategory,
    image: '',
    placement: '',
    order: 0,
  });

  useEffect(() => {
    if (sign) {
      setFormData({
        number: sign.number,
        name: sign.name,
        description: sign.description,
        category: sign.category,
        image: sign.image || '',
        placement: sign.placement || '',
        order: sign.order,
      });
      if (sign.image) {
        setImagePreview(
          sign.image.startsWith('/') ? sign.image : getImageUrl(sign.image)
        );
      } else {
        setImagePreview(null);
      }
    } else {
      setFormData({
        number: '',
        name: '',
        description: '',
        category: 'warning',
        image: '',
        placement: '',
        order: 0,
      });
      setImagePreview(null);
    }
  }, [sign]);

  const handleRemoveImage = () => {
    setImagePreview(null);
    setFormData((prev) => ({ ...prev, image: '' }));
  };

  const handleImageFile = useCallback(async (file: File) => {
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
    ];
    if (!allowedTypes.includes(file.type)) {
      setError('Միայն նկարներ են թույլատրված (JPG, PNG, GIF, WEBP)');
      return;
    }

    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      setError('Ֆայլի չափը չպետք է գերազանցի 50MB');
      return;
    }

    setUploadingImage(true);
    setError('');

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      const formDataToUpload = new FormData();
      formDataToUpload.append('file', file);
      formDataToUpload.append('type', 'road-sign');

      const response = await fetch('/api/admin/upload-image', {
        method: 'POST',
        body: formDataToUpload,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Նկարի վերբեռնումը ձախողվեց');
      }

      const data = await response.json();
      setFormData((prev) => ({
        ...prev,
        image: data.url || data.filename || '',
      }));
    } catch (err: any) {
      setError(err.message || 'Նկարի վերբեռնումը ձախողվեց');
      setImagePreview(null);
    } finally {
      setUploadingImage(false);
    }
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await handleImageFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const dataToSave: any = {
        number: formData.number.trim(),
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category,
        image: formData.image || null,
        placement: formData.placement.trim() || null,
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
            {sign ? 'Խմբագրել նշան' : 'Նոր նշան'}
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
              placeholder="Օր. 1.1, 2.3.1"
            />
          </div>

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
              placeholder="Մուտքագրեք նշանի անվանումը"
            />
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
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-[10px] focus:outline-none focus:border-[#FA8604] resize-none"
              placeholder="Մուտքագրեք նշանի նկարագրությունը"
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
                  category: e.target.value as RoadSignCategory,
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

          {/* Placement */}
          <div>
            <label className="block text-sm font-medium text-[#1A2229] mb-2">
              Տեղադրման հրահանգներ
            </label>
            <textarea
              value={formData.placement}
              onChange={(e) =>
                setFormData({ ...formData, placement: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-[10px] focus:outline-none focus:border-[#FA8604] resize-none"
              placeholder="Մուտքագրեք տեղադրման հրահանգները (ընտրովի)"
            />
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-[#1A2229] mb-2">
              Նկար
            </label>
            {imagePreview ? (
              <div className="mb-4">
                <div className="relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-w-full max-h-64 rounded-[10px] border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    ×
                  </button>
                </div>
              </div>
            ) : null}
            <div className="flex items-center gap-4">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploadingImage}
                />
                <span className="inline-block px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-[10px] text-[#1A2229] font-medium transition-colors">
                  {uploadingImage ? 'Բեռնվում է...' : 'Ընտրել նկար'}
                </span>
              </label>
              {imagePreview && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="px-4 py-2 text-red-500 hover:text-red-700 transition-colors"
                >
                  Հեռացնել նկարը
                </button>
              )}
            </div>
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
