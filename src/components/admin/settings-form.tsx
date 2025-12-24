'use client';

import { useState, useEffect } from 'react';
import { Setting, updateMultipleSettings } from '@/app/actions/admin-settings';
import { useRouter } from 'next/navigation';

interface SettingsFormProps {
  settings: Setting[];
}

// Define settings
const SETTINGS = [
  {
    key: 'phone_number',
    label: 'Հեռախոսահամար',
    description:
      'Հեռախոսահամարը, որը ցուցադրվում է կայքի բոլոր բաժիններում (կոնտակտային բաժին, զանգի կոճակ, գլխավոր էջ)',
    placeholder: '+374 77 76-96-68',
    type: 'tel' as const,
  },
  {
    key: 'address',
    label: 'Հասցե',
    description: 'Հասցեն, որը ցուցադրվում է կայքի բոլոր տեղերում',
    placeholder: 'Ք․ Սիսիան',
    type: 'text' as const,
  },
  {
    key: 'telegram',
    label: 'Telegram',
    description:
      'Telegram հասցեն (օրինակ: @username կամ https://t.me/username)',
    placeholder: 'https://t.me/username',
    type: 'url' as const,
  },
  {
    key: 'whatsapp',
    label: 'WhatsApp',
    description: 'WhatsApp հասցեն (օրինակ: https://wa.me/374XXXXXXXXX)',
    placeholder: 'https://wa.me/374XXXXXXXXX',
    type: 'url' as const,
  },
];

export default function SettingsForm({ settings }: SettingsFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Initialize form data with existing settings
    const initialData: Record<string, string> = {};
    SETTINGS.forEach((setting) => {
      const existingSetting = settings.find((s) => s.key === setting.key);
      initialData[setting.key] = existingSetting?.value || '';
    });
    setFormData(initialData);
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const settingsToUpdate = SETTINGS.map((setting) => ({
        key: setting.key,
        value: formData[setting.key] || '',
      }));

      const result = await updateMultipleSettings(settingsToUpdate);

      if (!result.success) {
        setError(result.error || 'Սխալ է տեղի ունեցել');
      } else {
        setSuccess(true);
        router.refresh();
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err: any) {
      setError(err.message || 'Սխալ է տեղի ունեցել');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-[10px] text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-[10px] text-sm">
          Կարգավորումները հաջողությամբ թարմացվել են
        </div>
      )}

      <div className="space-y-6">
        {SETTINGS.map((setting) => (
          <div key={setting.key} className="border-b border-gray-200 pb-6">
            <label
              htmlFor={setting.key}
              className="block text-lg font-semibold text-[#1A2229] mb-2"
            >
              {setting.label}
            </label>
            <p className="text-sm text-[#8D8D8D] mb-4">{setting.description}</p>
            <input
              type={setting.type}
              id={setting.key}
              value={formData[setting.key] || ''}
              onChange={(e) => handleChange(setting.key, e.target.value)}
              placeholder={setting.placeholder}
              className="w-full px-4 py-3 border border-gray-300 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#FA8604] focus:border-transparent text-[#1A2229]"
            />
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-4 pt-6">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-[#FA8604] text-white rounded-[10px] font-medium hover:bg-[#E67504] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Պահպանվում է...' : 'Պահպանել փոփոխությունները'}
        </button>
      </div>
    </form>
  );
}
