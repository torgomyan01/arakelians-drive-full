'use client';

import { useState } from 'react';
import { FaqItem as FaqItemType } from '@/data/faq-data';
import FaqItem from './FaqItem';

interface FaqListProps {
  items: FaqItemType[];
}

export default function FaqList({ items }: FaqListProps) {
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setOpenFaqId((prevId) => (prevId === id ? null : id));
  };

  return (
    <ul>
      {items.map((item) => (
        <FaqItem
          key={item.id}
          item={item}
          isOpen={openFaqId === item.id}
          onToggle={() => handleToggle(item.id)}
        />
      ))}
    </ul>
  );
}
