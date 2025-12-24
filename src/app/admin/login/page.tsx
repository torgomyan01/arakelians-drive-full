'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      console.log('Login result:', result);

      if (result?.error) {
        console.error('Login error:', result.error);
        setError(
          result.error === 'CredentialsSignin'
            ? 'Սխալ email կամ գաղտնաբառ'
            : `Սխալ: ${result.error}`
        );
      } else if (result?.ok) {
        router.push('/admin');
        router.refresh();
      } else {
        setError('Սխալ է տեղի ունեցել. Խնդրում ենք փորձել կրկին:');
      }
    } catch (err: any) {
      console.error('Login exception:', err);
      setError(
        err?.message || 'Սխալ է տեղի ունեցել. Խնդրում ենք փորձել կրկին:'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-[20px] shadow-[0_0_60px_30px_rgba(0,0,0,0.03)] p-8">
          <h1 className="text-3xl font-bold text-center mb-2 text-[#1A2229]">
            Ադմինի մուտք
          </h1>
          <p className="text-center text-[#8D8D8D] mb-8">
            Մուտքագրեք ձեր տվյալները
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#1A2229] mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border-0 border-b border-b-[#8D8D8D] py-2.5 px-0 focus:outline-none focus:border-b-[#FA8604] bg-transparent"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#1A2229] mb-2"
              >
                Գաղտնաբառ
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border-0 border-b border-b-[#8D8D8D] py-2.5 px-0 focus:outline-none focus:border-b-[#FA8604] bg-transparent"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-[10px] bg-[linear-gradient(90deg,#FA8604_0%,rgba(250,134,4,0.6)_100%)] py-3 px-[35px] text-lg text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Մուտք գործում...' : 'Մուտք'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
