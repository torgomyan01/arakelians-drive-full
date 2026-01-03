'use client';

import { useState, useMemo, useEffect } from 'react';
import { BlogPost } from '@/app/actions/admin-blogs';
import BlogEditModal from './blog-edit-modal';
import {
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} from '@/app/actions/admin-blogs';

interface BlogsListProps {
  posts: BlogPost[];
}

const ITEMS_PER_PAGE = 10;

export default function BlogsList({ posts: initialPosts }: BlogsListProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filterPublished, setFilterPublished] = useState<boolean | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  const filteredPosts = useMemo(
    () =>
      filterPublished !== null
        ? posts.filter((p) => p.isPublished === filterPublished)
        : posts,
    [posts, filterPublished]
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [filterPublished]);

  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

  const handleEdit = (post: BlogPost) => {
    setSelectedPost(post);
    setIsEditModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedPost(null);
    setIsCreateModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setIsCreateModalOpen(false);
    setSelectedPost(null);
  };

  const handleSave = async (data: any) => {
    if (selectedPost) {
      const result = await updateBlogPost(selectedPost.id, data);
      if (result.success && result.post) {
        setPosts((prev) =>
          prev.map((p) => (p.id === selectedPost.id ? result.post! : p))
        );
        handleCloseModal();
      } else {
        alert(result.error || 'Սխալ է տեղի ունեցել');
      }
    } else {
      const result = await createBlogPost(data);
      if (result.success && result.post) {
        setPosts((prev) => [result.post!, ...prev]);
        handleCloseModal();
      } else {
        alert(result.error || 'Սխալ է տեղի ունեցել');
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Դուք համոզված եք, որ ցանկանում եք ջնջել այս հոդվածը?')) {
      return;
    }

    setIsDeleting(id);
    const result = await deleteBlogPost(id);
    setIsDeleting(null);

    if (result.success) {
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } else {
      alert(result.error || 'Սխալ է տեղի ունեցել');
    }
  };

  return (
    <>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-[#1A2229]">Բլոգ</h1>
          <button
            onClick={handleCreate}
            className="rounded-[10px] bg-[#FA8604] hover:bg-[#FA8604]/90 text-white px-6 py-2 font-medium transition-colors"
          >
            + Նոր հոդված
          </button>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-[#8D8D8D]">
            Ընդամենը {filteredPosts.length} հոդված
            {filteredPosts.length !== posts.length &&
              ` (${posts.length} ընդամենը)`}
          </p>
          <div className="flex gap-4 items-center">
            <label className="text-sm font-medium text-[#1A2229]">
              Կարգավիճակ:
            </label>
            <select
              value={
                filterPublished === null
                  ? ''
                  : filterPublished
                    ? 'published'
                    : 'draft'
              }
              onChange={(e) => {
                const value = e.target.value;
                setFilterPublished(
                  value === '' ? null : value === 'published' ? true : false
                );
              }}
              className="border border-gray-300 rounded-[10px] px-4 py-2 focus:outline-none focus:border-[#FA8604]"
            >
              <option value="">Բոլորը</option>
              <option value="published">Հրապարակված</option>
              <option value="draft">Սևագիր</option>
            </select>
          </div>
        </div>
      </div>

      {paginatedPosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-[#8D8D8D] text-lg">
            {filteredPosts.length === 0
              ? 'Հոդվածներ չկան'
              : 'Այս էջում հոդվածներ չկան'}
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-[#1A2229]">
                    Վերնագիր
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-[#1A2229]">
                    Slug
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-[#1A2229]">
                    Կարգավիճակ
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-[#1A2229]">
                    Ամսաթիվ
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-[#1A2229]">
                    Գործողություններ
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedPosts.map((post) => (
                  <tr
                    key={post.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="font-medium text-[#1A2229]">
                        {post.title}
                      </div>
                      {post.excerpt && (
                        <div className="text-sm text-[#8D8D8D] mt-1 line-clamp-1">
                          {post.excerpt}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <code className="text-sm text-[#8D8D8D] bg-gray-100 px-2 py-1 rounded">
                        {post.slug}
                      </code>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          post.isPublished
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {post.isPublished ? 'Հրապարակված' : 'Սևագիր'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-[#8D8D8D]">
                      {post.publishedAt
                        ? new Date(post.publishedAt).toLocaleDateString('hy-AM')
                        : new Date(post.createdAt).toLocaleDateString('hy-AM')}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(post)}
                          className="text-[#FA8604] hover:text-[#e67503] transition-colors px-3 py-1 rounded-[10px] hover:bg-[#FA8604]/10"
                        >
                          Խմբագրել
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          disabled={isDeleting === post.id}
                          className="text-red-500 hover:text-red-700 transition-colors px-3 py-1 rounded-[10px] hover:bg-red-50 disabled:opacity-50"
                        >
                          {isDeleting === post.id ? 'Ջնջվում է...' : 'Ջնջել'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
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
        <BlogEditModal
          post={selectedPost}
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      )}
    </>
  );
}
