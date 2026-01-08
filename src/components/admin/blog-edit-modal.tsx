'use client';

import { useState, useEffect, useCallback } from 'react';
import { BlogPost } from '@/app/actions/admin-blogs';
import { useRouter } from 'next/navigation';

interface BlogEditModalProps {
  post: BlogPost | null;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}

export default function BlogEditModal({
  post,
  onClose,
  onSave,
}: BlogEditModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    metaTitle: '',
    metaDescription: '',
    keywords: '',
    isPublished: false,
    publishedAt: '',
  });

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        featuredImage: post.featuredImage || '',
        metaTitle: post.metaTitle || '',
        metaDescription: post.metaDescription || '',
        keywords: post.keywords || '',
        isPublished: post.isPublished,
        publishedAt: post.publishedAt
          ? new Date(post.publishedAt).toISOString().slice(0, 16)
          : '',
      });
      if (post.featuredImage) {
        setImagePreview(
          post.featuredImage.startsWith('/')
            ? post.featuredImage
            : `/${post.featuredImage}`
        );
      } else {
        setImagePreview(null);
      }
    } else {
      setFormData({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        featuredImage: '',
        metaTitle: '',
        metaDescription: '',
        keywords: '',
        isPublished: false,
        publishedAt: '',
      });
      setImagePreview(null);
    }
  }, [post]);

  // Auto-generate slug from title
  useEffect(() => {
    if (!post && formData.title) {
      const generatedSlug = formData.title
        .toLowerCase()
        .trim()
        .replace(/[^\u0561-\u0587\u0531-\u0556a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
      setFormData((prev) => ({ ...prev, slug: generatedSlug }));
    }
  }, [formData.title, post]);

  const handleRemoveImage = () => {
    setImagePreview(null);
    setFormData((prev) => ({ ...prev, featuredImage: '' }));
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
      formDataToUpload.append('type', 'blog');

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
        featuredImage: data.url,
      }));
    } catch (err: any) {
      setError(err.message || 'Նկարի վերբեռնումը ձախողվեց');
    } finally {
      setUploadingImage(false);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const dataToSave: any = {
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        excerpt: formData.excerpt.trim(),
        content: formData.content.trim(),
        featuredImage: formData.featuredImage || null,
        metaTitle: formData.metaTitle.trim() || null,
        metaDescription: formData.metaDescription.trim() || null,
        keywords: formData.keywords.trim() || null,
        isPublished: formData.isPublished,
      };

      if (formData.isPublished && formData.publishedAt) {
        dataToSave.publishedAt = new Date(formData.publishedAt);
      }

      await onSave(dataToSave);
    } catch (err: any) {
      setError(err.message || 'Սխալ է տեղի ունեցել');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-[20px] p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#1A2229]">
            {post ? 'Խմբագրել հոդված' : 'Նոր հոդված'}
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
              placeholder="Մուտքագրեք հոդվածի վերնագիրը"
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
              placeholder="հոդվածի-url-հասցե"
            />
            <p className="text-xs text-[#8D8D8D] mt-1">
              URL-ը պետք է լինի անգլերեն կամ հայերեն տառերով, թվերով և գծիկներով
            </p>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium text-[#1A2229] mb-2">
              Կարճ նկարագրություն *
            </label>
            <textarea
              value={formData.excerpt}
              onChange={(e) =>
                setFormData({ ...formData, excerpt: e.target.value })
              }
              required
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-[10px] focus:outline-none focus:border-[#FA8604]"
              placeholder="Հոդվածի կարճ նկարագրությունը (ցուցադրվում է քարտերում)"
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
              placeholder="HTML բովանդակություն"
            />
            <p className="text-xs text-[#8D8D8D] mt-1">
              Մուտքագրեք HTML բովանդակություն
            </p>
          </div>

          {/* Featured Image */}
          <div>
            <label className="block text-sm font-medium text-[#1A2229] mb-2">
              Հիմնական նկար
            </label>
            {imagePreview && (
              <div className="mb-4 relative inline-block">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-w-full h-48 object-cover rounded-[10px] border border-gray-200"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 active:scale-95"
                  title="Ջնջել նկարը"
                >
                  <i className="fas fa-xmark text-sm"></i>
                </button>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleImageFile(file);
                }
              }}
              disabled={uploadingImage}
              className="w-full px-4 py-2 border border-gray-300 rounded-[10px] focus:outline-none focus:border-[#FA8604]"
            />
            {uploadingImage && (
              <p className="text-sm text-[#8D8D8D] mt-1">Վերբեռնվում է...</p>
            )}
            {formData.featuredImage && (
              <input
                type="text"
                value={formData.featuredImage}
                onChange={(e) =>
                  setFormData({ ...formData, featuredImage: e.target.value })
                }
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-[10px] focus:outline-none focus:border-[#FA8604] text-sm"
                placeholder="/images/blog/example.jpg"
              />
            )}
          </div>

          {/* SEO Fields */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-[#1A2229] mb-4">
              SEO Կարգավորումներ
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1A2229] mb-2">
                  Meta Title
                </label>
                <input
                  type="text"
                  value={formData.metaTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, metaTitle: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-[10px] focus:outline-none focus:border-[#FA8604]"
                  placeholder="Եթե դատարկ է, կօգտագործվի վերնագիրը"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1A2229] mb-2">
                  Meta Description
                </label>
                <textarea
                  value={formData.metaDescription}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      metaDescription: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-[10px] focus:outline-none focus:border-[#FA8604]"
                  placeholder="Եթե դատարկ է, կօգտագործվի կարճ նկարագրությունը"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1A2229] mb-2">
                  Keywords (բաժանված ստորակետով)
                </label>
                <input
                  type="text"
                  value={formData.keywords}
                  onChange={(e) =>
                    setFormData({ ...formData, keywords: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-[10px] focus:outline-none focus:border-[#FA8604]"
                  placeholder="ավտոդպրոց, վարորդական իրավունք, սիսիան"
                />
              </div>
            </div>
          </div>

          {/* Publish Settings */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isPublished}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isPublished: e.target.checked,
                    })
                  }
                  className="w-4 h-4 text-[#FA8604] border-gray-300 rounded focus:ring-[#FA8604]"
                />
                <span className="text-sm font-medium text-[#1A2229]">
                  Հրապարակել
                </span>
              </label>
            </div>

            {formData.isPublished && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-[#1A2229] mb-2">
                  Հրապարակման ամսաթիվ
                </label>
                <input
                  type="datetime-local"
                  value={formData.publishedAt}
                  onChange={(e) =>
                    setFormData({ ...formData, publishedAt: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-[10px] focus:outline-none focus:border-[#FA8604]"
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
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
              className="px-6 py-2 bg-[#FA8604] hover:bg-[#e67503] text-white rounded-[10px] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Պահպանվում է...' : 'Պահպանել'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
