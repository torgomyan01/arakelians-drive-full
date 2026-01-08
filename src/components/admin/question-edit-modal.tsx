'use client';

import { useState, useEffect, useCallback } from 'react';
import { QuestionWithOptions } from '@/app/actions/admin-questions';
import {
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from '@/app/actions/admin-questions';
import { useRouter } from 'next/navigation';
import { getImageUrl } from '@/utils/image-utils';

interface QuestionEditModalProps {
  question: QuestionWithOptions | null;
  categories: { id: number; name: string; questionCount: number }[];
  onClose: () => void;
  isOpen: boolean;
}

export default function QuestionEditModal({
  question,
  categories,
  onClose,
  isOpen,
}: QuestionEditModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    jsonId: '',
    title: '',
    img: '',
    correctAnswerIndex: 0,
    lessonCategoryId: categories[0]?.id || 1,
    options: [
      { text: '', order: 0 },
      { text: '', order: 1 },
      { text: '', order: 2 },
      { text: '', order: 3 },
    ],
  });

  useEffect(() => {
    if (question) {
      setFormData({
        jsonId: question.jsonId,
        title: question.title,
        img: question.img || '',
        correctAnswerIndex: question.correctAnswerIndex,
        lessonCategoryId: question.lessonCategoryId,
        options: question.options.map((opt) => ({
          text: opt.text,
          order: opt.order,
        })),
      });
      if (question.img) {
        setImagePreview(getImageUrl(question.img));
      } else {
        setImagePreview(null);
      }
    } else {
      // Reset form for new question
      setFormData({
        jsonId: '',
        title: '',
        img: '',
        correctAnswerIndex: 0,
        lessonCategoryId: categories[0]?.id || 1,
        options: [
          { text: '', order: 0 },
          { text: '', order: 1 },
          { text: '', order: 2 },
          { text: '', order: 3 },
        ],
      });
      setImagePreview(null);
    }
  }, [question, categories]);

  const handleOptionChange = (index: number, text: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = { ...newOptions[index], text };
    setFormData({ ...formData, options: newOptions });
  };

  const handleAddOption = () => {
    const newOrder = formData.options.length;
    setFormData({
      ...formData,
      options: [...formData.options, { text: '', order: newOrder }],
    });
  };

  const handleRemoveOption = (index: number) => {
    if (formData.options.length <= 2) {
      setError('Պետք է լինի առնվազն 2 տարբերակ');
      return;
    }

    const newOptions = formData.options.filter((_, i) => i !== index);
    // Reorder options
    const reorderedOptions = newOptions.map((opt, i) => ({
      ...opt,
      order: i,
    }));

    // Adjust correctAnswerIndex if needed
    let newCorrectIndex = formData.correctAnswerIndex;
    if (index === formData.correctAnswerIndex) {
      // If we're removing the correct answer, set to first option
      newCorrectIndex = 0;
    } else if (index < formData.correctAnswerIndex) {
      // If we're removing an option before the correct one, decrease index
      newCorrectIndex = formData.correctAnswerIndex - 1;
    }

    setFormData({
      ...formData,
      options: reorderedOptions,
      correctAnswerIndex: newCorrectIndex,
    });
  };

  const handleImageFile = useCallback(async (file: File) => {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setError('Միայն նկարներ են թույլատրված (JPG, PNG, GIF)');
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setError('Ֆայլի չափը չպետք է գերազանցի 10MB');
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
      // Store only filename, the full URL will be generated when needed
      const filename = result.filename;
      setFormData((prev) => ({ ...prev, img: filename }));
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
    setFormData({ ...formData, img: '' });
    setImagePreview(null);
  };

  // Handle paste event for image upload
  useEffect(() => {
    if (!isOpen) return;

    const handlePaste = async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      // Find image in clipboard
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.indexOf('image') !== -1) {
          e.preventDefault();
          const blob = item.getAsFile();
          if (blob) {
            // Convert blob to File object
            const file = new File([blob], `pasted-image-${Date.now()}.png`, {
              type: blob.type || 'image/png',
            });
            await handleImageFile(file);
          }
          break;
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, [isOpen, handleImageFile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate
      if (!formData.title.trim()) {
        setError('Հարցի տեքստը պարտադիր է');
        setLoading(false);
        return;
      }

      if (formData.options.some((opt) => !opt.text.trim())) {
        setError('Բոլոր տարբերակները պարտադիր են');
        setLoading(false);
        return;
      }

      if (
        formData.correctAnswerIndex < 0 ||
        formData.correctAnswerIndex >= formData.options.length
      ) {
        setError('Ընտրեք ճիշտ պատասխան');
        setLoading(false);
        return;
      }

      if (question) {
        // Update existing question
        const result = await updateQuestion(question.id, {
          jsonId: formData.jsonId,
          title: formData.title,
          img: formData.img || null,
          correctAnswerIndex: formData.correctAnswerIndex,
          lessonCategoryId: formData.lessonCategoryId,
          options: formData.options,
        });

        if (!result.success) {
          setError(result.error || 'Սխալ է տեղի ունեցել');
        } else {
          router.refresh();
          onClose();
        }
      } else {
        // Create new question
        // jsonId is optional - will be auto-generated if empty
        const result = await createQuestion({
          jsonId: formData.jsonId.trim() || undefined,
          title: formData.title,
          img: formData.img || undefined,
          correctAnswerIndex: formData.correctAnswerIndex,
          lessonCategoryId: formData.lessonCategoryId,
          options: formData.options,
        });

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
    if (!question || !confirm('Վստահ ե՞ք, որ ցանկանում եք ջնջել այս հարցը?')) {
      return;
    }

    setLoading(true);
    try {
      const result = await deleteQuestion(question.id);
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
      <div className="bg-white rounded-[20px] shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#1A2229]">
              {question ? 'Խմբագրել հարցը' : 'Նոր հարց'}
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#1A2229] mb-2">
                  JSON ID {question ? '' : '(ընտրովի - ավտոմատ կգեներացվի)'}
                </label>
                <input
                  type="text"
                  value={formData.jsonId}
                  onChange={(e) =>
                    setFormData({ ...formData, jsonId: e.target.value })
                  }
                  disabled={!!question}
                  placeholder={
                    question ? '' : 'Թողեք դատարկ ավտոմատ գեներացման համար'
                  }
                  className="w-full border border-gray-300 rounded-[10px] px-4 py-2 focus:outline-none focus:border-[#FA8604] disabled:bg-gray-100"
                />
                {!question && (
                  <p className="text-xs text-[#8D8D8D] mt-1">
                    Եթե թողնեք դատարկ, ավտոմատ կգեներացվի (օրինակ: q1_1,
                    q1_2...)
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1A2229] mb-2">
                  Հարցաշար *
                </label>
                <select
                  value={formData.lessonCategoryId}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      lessonCategoryId: Number(e.target.value),
                    })
                  }
                  required
                  className="w-full border border-gray-300 rounded-[10px] px-4 py-2 focus:outline-none focus:border-[#FA8604]"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A2229] mb-2">
                Հարցի տեքստ *
              </label>
              <textarea
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
                rows={3}
                className="w-full border border-gray-300 rounded-[10px] px-4 py-2 focus:outline-none focus:border-[#FA8604]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A2229] mb-2">
                Նկար (ընտրովի)
              </label>
              <div className="space-y-3">
                <div className="flex gap-4">
                  <label className="flex-1 cursor-pointer">
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/gif"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                    <div className="border-2 border-dashed border-gray-300 rounded-[10px] p-6 text-center hover:border-[#FA8604] transition-colors">
                      {uploadingImage ? (
                        <div className="text-[#8D8D8D]">Բեռնվում է...</div>
                      ) : (
                        <div>
                          <div className="text-[#1A2229] font-medium mb-1">
                            Կտտացրեք նկար բեռնելու համար
                          </div>
                          <div className="text-sm text-[#8D8D8D]">
                            JPG, PNG, GIF (առավելագույն 5MB)
                          </div>
                        </div>
                      )}
                    </div>
                  </label>
                </div>

                {imagePreview && (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-w-md rounded-[10px] border border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-[#1A2229] mb-2">
                    Կամ մուտքագրեք URL
                  </label>
                  <input
                    type="text"
                    value={formData.img}
                    onChange={(e) =>
                      setFormData({ ...formData, img: e.target.value })
                    }
                    placeholder="կամ մուտքագրեք նկարի URL"
                    className="w-full border border-gray-300 rounded-[10px] px-4 py-2 focus:outline-none focus:border-[#FA8604]"
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium text-[#1A2229]">
                  Պատասխանների տարբերակներ *
                </label>
                <button
                  type="button"
                  onClick={handleAddOption}
                  className="px-4 py-2 rounded-[10px] bg-[#FA8604] hover:bg-[#FA8604]/90 text-white text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <span>+</span>
                  <span>Ավելացնել տարբերակ</span>
                </button>
              </div>
              <div className="space-y-3">
                {formData.options.map((option, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-[#1A2229]">
                          {String.fromCharCode(65 + index)}:
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              correctAnswerIndex: index,
                            })
                          }
                          className={`px-3 py-1 rounded-[10px] text-sm font-medium transition-colors ${
                            formData.correctAnswerIndex === index
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-200 text-[#1A2229] hover:bg-gray-300'
                          }`}
                        >
                          {formData.correctAnswerIndex === index
                            ? '✓ Ճիշտ'
                            : 'Նշել որպես ճիշտ'}
                        </button>
                      </div>
                      <textarea
                        value={option.text}
                        onChange={(e) =>
                          handleOptionChange(index, e.target.value)
                        }
                        required
                        rows={2}
                        className="w-full border border-gray-300 rounded-[10px] px-4 py-2 focus:outline-none focus:border-[#FA8604]"
                        placeholder={`Տարբերակ ${index + 1}`}
                      />
                    </div>
                    {formData.options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(index)}
                        className="mt-8 px-3 py-2 rounded-[10px] bg-red-500 hover:bg-red-600 text-white font-medium transition-colors flex-shrink-0"
                        title="Հեռացնել տարբերակ"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-gray-200">
              <div>
                {question && (
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
                  disabled={loading}
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
