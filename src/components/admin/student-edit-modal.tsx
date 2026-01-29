'use client';

import { useState, useEffect, useCallback } from 'react';
import { StudentWithStats } from '@/app/actions/admin-students';
import {
  createStudent,
  updateStudent,
  deleteStudent,
} from '@/app/actions/admin-students';
import { useRouter } from 'next/navigation';
import { getImageUrl } from '@/utils/image-utils';

interface StudentEditModalProps {
  student: StudentWithStats | null;
  onClose: () => void;
  isOpen: boolean;
}

export default function StudentEditModal({
  student,
  onClose,
  isOpen,
}: StudentEditModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    photo: null as string | null,
    examResult: '',
    isApproved: false,
  });

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || '',
        photo: student.photo,
        examResult: student.examResult || '',
        isApproved: student.isApproved,
      });
      setImagePreview(student.photo ? getImageUrl(student.photo) : null);
    } else {
      // Reset form for new student
      setFormData({
        name: '',
        photo: null,
        examResult: '',
        isApproved: false,
      });
      setImagePreview(null);
    }
  }, [student]);

  const handleImageFile = useCallback(async (file: File) => {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Միայն նկարներ են թույլատրված (JPG, PNG, GIF, WEBP)');
      return;
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      setError('Ֆայլի չափը չպետք է գերազանցի 50MB');
      return;
    }

    setUploadingImage(true);
    setError('');

    try {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload file
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const response = await fetch('/api/admin/upload-image', {
        method: 'POST',
        body: uploadFormData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Սխալ է տեղի ունեցել');
      }

      // Update form data with uploaded image filename
      const filename = result.filename;
      setFormData((prev) => ({ ...prev, photo: filename }));
      // Update preview with full URL
      setImagePreview(result.url || getImageUrl(filename));
    } catch (err: any) {
      setError(err.message || 'Նկարի բեռնումը ձախողվեց');
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

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, photo: null }));
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (student) {
        // For existing students, validation is optional (admin can edit)
        // Update existing student
        const result = await updateStudent(student.id, {
          name: formData.name,
          photo: formData.photo,
          examResult: formData.examResult,
          isApproved: formData.isApproved,
        });

        if (!result.success) {
          setError(result.error || 'Սխալ է տեղի ունեցել');
        } else {
          router.refresh();
          onClose();
        }
      } else {
        // Create new student (without name, photo, examResult - student will fill them)
        const result = await createStudent();

        if (!result.success) {
          setError(result.error || 'Սխալ է տեղի ունեցել');
        } else {
          router.refresh();
          onClose();
        }
      }
    } catch (err: any) {
      setError(err.message || 'Սխալ է տեղի ունեցել');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!student || !confirm('Վստահ ե՞ք, որ ցանկանում եք ջնջել այս աշակերտին?')) {
      return;
    }

    setLoading(true);
    try {
      const result = await deleteStudent(student.id);
      if (result.success) {
        router.refresh();
        onClose();
      } else {
        setError(result.error || 'Սխալ է տեղի ունեցել');
      }
    } catch (err: any) {
      setError(err.message || 'Սխալ է տեղի ունեցել');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[20px] shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#1A2229]">
              {student ? 'Խմբագրել աշակերտին' : 'Ստեղծել նոր աշակերտ'}
            </h2>
            {!student && (
              <p className="text-sm text-[#8D8D8D] mt-2">
                Ուսանողը կստանա ունիկալ հղում և կկարողանա լրացնել իր տվյալները
              </p>
            )}
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
            {student && (
              <>
                <div>
                  <label className="block text-sm font-medium text-[#1A2229] mb-2">
                    Անուն
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Ուսանողը կլրացնի"
                    className="w-full border border-gray-300 rounded-[10px] px-4 py-2 focus:outline-none focus:border-[#FA8604]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1A2229] mb-2">
                    Նկար
                  </label>
                  {imagePreview ? (
                    <div className="relative inline-block">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-[10px] border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-[10px] p-6 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                        className="hidden"
                        id="photo-upload"
                      />
                      <label
                        htmlFor="photo-upload"
                        className="cursor-pointer flex flex-col items-center gap-2"
                      >
                        <i className="fas fa-cloud-upload-alt text-3xl text-[#8D8D8D]"></i>
                        <span className="text-sm text-[#8D8D8D]">
                          {uploadingImage ? 'Բեռնվում է...' : 'Կտտացրեք նկար ավելացնելու համար'}
                        </span>
                      </label>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1A2229] mb-2">
                    Հանձնած քննական թեստի արդյունք
                  </label>
                  <input
                    type="text"
                    value={formData.examResult}
                    onChange={(e) =>
                      setFormData({ ...formData, examResult: e.target.value })
                    }
                    placeholder="Ուսանողը կլրացնի"
                    className="w-full border border-gray-300 rounded-[10px] px-4 py-2 focus:outline-none focus:border-[#FA8604]"
                  />
                </div>
              </>
            )}

            {student && student.review && (
              <div>
                <label className="block text-sm font-medium text-[#1A2229] mb-2">
                  Աշակերտի կարծիք
                </label>
                <div className="bg-gray-50 border border-gray-200 rounded-[10px] px-4 py-3">
                  <p className="text-sm text-[#1A2229] whitespace-pre-wrap">
                    {student.review || 'Կարծիք դեռ չի գրվել'}
                  </p>
                </div>
              </div>
            )}

            {student && (
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isApproved}
                    onChange={(e) =>
                      setFormData({ ...formData, isApproved: e.target.checked })
                    }
                    className="w-5 h-5 rounded border-gray-300 text-[#FA8604] focus:ring-[#FA8604]"
                  />
                  <span className="text-sm font-medium text-[#1A2229]">
                    Հաստատված
                  </span>
                </label>
                <p className="text-xs text-[#8D8D8D] mt-1 ml-8">
                  Հաստատելու դեպքում աշակերտի review-ն կտեսնվի հանրությանը
                </p>
              </div>
            )}

            {student && (
              <div className="bg-gray-50 p-4 rounded-[10px]">
                <label className="block text-sm font-medium text-[#1A2229] mb-2">
                  Ունիկալ հղում
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={`${typeof window !== 'undefined' ? window.location.origin : ''}/student/${student.uniqueToken}`}
                    readOnly
                    className="flex-1 border border-gray-300 rounded-[10px] px-4 py-2 bg-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/student/${student.uniqueToken}`;
                      navigator.clipboard.writeText(url);
                      alert('Հղումը պատճենվել է');
                    }}
                    className="px-4 py-2 rounded-[10px] bg-gray-200 hover:bg-gray-300 text-[#1A2229] font-medium transition-colors"
                  >
                    <i className="fas fa-copy"></i>
                  </button>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-4 border-t border-gray-200">
              <div>
                {student && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={loading}
                    className="px-6 py-2 rounded-[10px] bg-red-500 hover:bg-red-600 text-white font-medium transition-colors disabled:opacity-50"
                  >
                    Ջնջել
                  </button>
                )}
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="px-6 py-2 rounded-[10px] border border-gray-300 text-[#1A2229] font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Չեղարկել
                </button>
                <button
                  type="submit"
                  disabled={loading || uploadingImage}
                  className="px-6 py-2 rounded-[10px] bg-[#FA8604] hover:bg-[#FA8604]/90 text-white font-medium transition-colors disabled:opacity-50"
                >
                  {loading ? 'Պահպանում...' : 'Պահպանել'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
