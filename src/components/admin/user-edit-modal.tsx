'use client';

import { useState, useEffect } from 'react';
import { UserWithStats } from '@/app/actions/admin-users';
import { createUser, updateUser, deleteUser } from '@/app/actions/admin-users';
import { useRouter } from 'next/navigation';

interface UserEditModalProps {
  user: UserWithStats | null;
  onClose: () => void;
  isOpen: boolean;
}

export default function UserEditModal({
  user,
  onClose,
  isOpen,
}: UserEditModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    role: 'user',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email,
        name: user.name || '',
        password: '',
        role: user.role,
      });
    } else {
      // Reset form for new user
      setFormData({
        email: '',
        name: '',
        password: '',
        role: 'user',
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate
      if (!formData.email.trim()) {
        setError('Email-ը պարտադիր է');
        setLoading(false);
        return;
      }

      if (!user && !formData.password.trim()) {
        setError('Գաղտնաբառը պարտադիր է նոր օգտատիրոջ համար');
        setLoading(false);
        return;
      }

      if (user) {
        // Update existing user
        const result = await updateUser(user.id, {
          email: formData.email,
          name: formData.name || null,
          password: formData.password || undefined,
          role: formData.role,
        });

        if (!result.success) {
          setError(result.error || 'Սխալ է տեղի ունեցել');
        } else {
          router.refresh();
          onClose();
        }
      } else {
        // Create new user
        const result = await createUser({
          email: formData.email,
          name: formData.name || undefined,
          password: formData.password,
          role: formData.role,
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
    if (!user || !confirm('Վստահ ե՞ք, որ ցանկանում եք ջնջել այս օգտատիրոջը?')) {
      return;
    }

    setLoading(true);
    try {
      const result = await deleteUser(user.id);
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
              {user ? 'Խմբագրել օգտատիրոջը' : 'Նոր օգտատեր'}
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
            <div>
              <label className="block text-sm font-medium text-[#1A2229] mb-2">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                className="w-full border border-gray-300 rounded-[10px] px-4 py-2 focus:outline-none focus:border-[#FA8604]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A2229] mb-2">
                Անուն (ընտրովի)
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full border border-gray-300 rounded-[10px] px-4 py-2 focus:outline-none focus:border-[#FA8604]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A2229] mb-2">
                Գաղտնաբառ {user ? '(թողեք դատարկ, եթե չեք փոխում)' : '*'}
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required={!user}
                className="w-full border border-gray-300 rounded-[10px] px-4 py-2 focus:outline-none focus:border-[#FA8604]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A2229] mb-2">
                Դեր *
              </label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                required
                className="w-full border border-gray-300 rounded-[10px] px-4 py-2 focus:outline-none focus:border-[#FA8604]"
              >
                <option value="user">Օգտատեր</option>
                <option value="admin">Ադմին</option>
              </select>
            </div>

            <div className="flex justify-between pt-4 border-t border-gray-200">
              <div>
                {user && (
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
