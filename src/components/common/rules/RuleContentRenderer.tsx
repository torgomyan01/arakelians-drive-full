'use client';

import { useState } from 'react';

interface RuleItem {
  number: string;
  content: string;
  type?: 'rule' | 'prohibition' | 'requirement' | 'definition' | 'note';
  important?: boolean;
  title?: string;
}

interface RuleContentRendererProps {
  content: string;
  items?: Array<{
    id: number;
    number: string;
    title: string | null;
    content: string;
    type: string;
    important: boolean;
    order: number;
  }>;
}

export default function RuleContentRenderer({
  content,
  items: dbItems,
}: RuleContentRendererProps) {
  const [expandedSections, setExpandedSections] = useState<Set<number>>(
    new Set()
  );

  const parseContent = (text: string): RuleItem[] => {
    const items: RuleItem[] = [];
    const lines = text.split('\n').filter((line) => line.trim() !== '');

    let currentItem: RuleItem | null = null;
    let currentMainNumber = '';

    lines.forEach((line) => {
      const trimmed = line.trim();

      // Check if it's a numbered rule (e.g., "1.", "73.", "96.")
      const ruleMatch = trimmed.match(/^(\d+)\.\s+(.+)$/);
      if (ruleMatch) {
        if (currentItem) {
          items.push(currentItem);
        }
        currentMainNumber = ruleMatch[1];
        currentItem = {
          number: ruleMatch[1],
          content: ruleMatch[2],
          type: 'rule',
        };

        // Check for prohibitions or requirements in the content
        if (
          ruleMatch[2].includes('արգելվում է') ||
          ruleMatch[2].includes('արգելված') ||
          ruleMatch[2].includes('Արգելվում է')
        ) {
          currentItem.type = 'prohibition';
          currentItem.important = true;
        } else if (ruleMatch[2].includes('պետք է')) {
          currentItem.type = 'requirement';
        }

        return;
      }

      // Check if it's a numbered list item (e.g., "1)", "2)")
      const listMatch = trimmed.match(/^(\d+)\)\s+(.+)$/);
      if (listMatch) {
        // Save current main item first if it exists
        if (currentItem && currentItem.number === currentMainNumber) {
          items.push(currentItem);
        }

        // Create sub-item
        const subItem: RuleItem = {
          number: `${currentMainNumber}.${listMatch[1]}`,
          content: listMatch[2],
          type: currentItem?.type || 'requirement',
        };

        // Check for prohibitions in sub-item
        if (
          listMatch[2].includes('արգելվում է') ||
          listMatch[2].includes('արգելված') ||
          listMatch[2].includes('Արգելվում է')
        ) {
          subItem.type = 'prohibition';
          subItem.important = true;
        }

        items.push(subItem);
        currentItem = null; // Reset current item after adding sub-item
        return;
      }

      // Check if it's a bold title (starts with **)
      if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
        if (currentItem) {
          items.push(currentItem);
        }
        const title = trimmed.replace(/\*\*/g, '');
        currentItem = {
          number: '',
          content: title,
          type: 'definition',
        };
        return;
      }

      // Append to current item
      if (currentItem) {
        currentItem.content += (currentItem.content ? ' ' : '') + trimmed;
      } else {
        // Create new item for orphaned content
        currentItem = {
          number: '',
          content: trimmed,
          type: 'rule',
        };
      }
    });

    if (currentItem) {
      items.push(currentItem);
    }

    // Post-process: ensure main items are properly identified
    return items.map((item, index) => {
      // If item has sub-items (items with same main number), mark it
      const hasSubItems = items.some(
        (other, otherIndex) =>
          otherIndex !== index &&
          other.number &&
          item.number &&
          other.number.startsWith(item.number + '.')
      );

      return {
        ...item,
        important:
          item.important || (item.type === 'prohibition' && hasSubItems),
      };
    });
  };

  // Use database items if available, otherwise parse from content
  const items: RuleItem[] = dbItems
    ? dbItems.map((item) => ({
        number: item.number,
        content: item.content,
        type: item.type as RuleItem['type'],
        important: item.important,
        title: item.title || undefined,
      }))
    : parseContent(content);

  const toggleSection = (index: number) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSections(newExpanded);
  };

  const getTypeStyles = (type?: string) => {
    switch (type) {
      case 'prohibition':
        return {
          border: 'border-l-4 border-red-500',
          bg: 'bg-red-50',
          icon: '🚫',
          badge: 'bg-red-100 text-red-800',
        };
      case 'requirement':
        return {
          border: 'border-l-4 border-blue-500',
          bg: 'bg-blue-50',
          icon: '✅',
          badge: 'bg-blue-100 text-blue-800',
        };
      case 'definition':
        return {
          border: 'border-l-4 border-purple-500',
          bg: 'bg-purple-50',
          icon: '📖',
          badge: 'bg-purple-100 text-purple-800',
        };
      case 'note':
        return {
          border: 'border-l-4 border-yellow-500',
          bg: 'bg-yellow-50',
          icon: '💡',
          badge: 'bg-yellow-100 text-yellow-800',
        };
      default:
        return {
          border: 'border-l-4 border-[#FA8604]',
          bg: 'bg-white',
          icon: '📋',
          badge: 'bg-[#FA8604]/10 text-[#FA8604]',
        };
    }
  };

  // Group items by main rule number
  const groupedItems: { [key: string]: RuleItem[] } = {};
  items.forEach((item) => {
    const mainNumber = item.number
      ? item.number.split('.')[0]
      : `orphan-${items.indexOf(item)}`;
    if (!groupedItems[mainNumber]) {
      groupedItems[mainNumber] = [];
    }
    groupedItems[mainNumber].push(item);
  });

  return (
    <div className="space-y-4">
      {Object.entries(groupedItems).map(
        ([mainNumber, groupItems], groupIndex) => {
          const isExpanded = expandedSections.has(groupIndex);
          // Find the main item (the one with just the main number, no sub-number)
          const mainItem =
            groupItems.find(
              (item) =>
                item.number === mainNumber ||
                (item.number && item.number.split('.').length === 1)
            ) || groupItems[0];
          const subItems = groupItems.filter(
            (item) =>
              item !== mainItem && item.number && item.number.includes('.')
          );
          const styles = getTypeStyles(mainItem.type);

          return (
            <div
              key={groupIndex}
              className={`${styles.bg} ${styles.border} rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden`}
            >
              {/* Main Rule Card */}
              <div
                className={`p-6 cursor-pointer ${
                  subItems.length > 0 ? 'hover:bg-opacity-80' : ''
                } transition-colors`}
                onClick={() => subItems.length > 0 && toggleSection(groupIndex)}
              >
                <div className="flex items-start gap-4 flex-col md:flex-row">
                  {/* Number Badge */}
                  {mainItem.number && (
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-[#FA8604] text-white rounded-lg flex items-center justify-center font-bold text-lg shadow-md">
                        {mainItem.number}
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {mainItem.type && (
                        <span
                          className={`${styles.badge} px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1`}
                        >
                          <span>{styles.icon}</span>
                          <span>
                            {mainItem.type === 'prohibition'
                              ? 'Արգելված'
                              : mainItem.type === 'requirement'
                                ? 'Պահանջ'
                                : mainItem.type === 'definition'
                                  ? 'Սահմանում'
                                  : 'Կանոն'}
                          </span>
                        </span>
                      )}
                      {mainItem.important && (
                        <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-semibold">
                          ⭐ Կարևոր
                        </span>
                      )}
                    </div>
                    {mainItem.title && (
                      <h3 className="text-lg font-semibold text-[#1A2229] mb-2">
                        {mainItem.title}
                      </h3>
                    )}
                    <div className="text-[#222] leading-relaxed text-base">
                      {mainItem.content.split('\n').map((line, lineIndex) => {
                        if (line.trim() === '') return null;
                        return (
                          <p key={lineIndex} className="mb-2">
                            {line.trim()}
                          </p>
                        );
                      })}
                    </div>
                  </div>

                  {/* Expand Icon */}
                  {subItems.length > 0 && (
                    <div className="flex-shrink-0">
                      <svg
                        className={`w-6 h-6 text-[#FA8604] transition-transform ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              {/* Sub-items (Expandable) */}
              {subItems.length > 0 && isExpanded && (
                <div className="border-t border-gray-200 bg-white/50">
                  <div className="p-4 space-y-3">
                    {subItems.map((subItem, subIndex) => (
                      <div
                        key={subIndex}
                        className="bg-white rounded-lg p-4 shadow-sm border border-gray-100"
                      >
                        <div className="flex items-start gap-3">
                          {subItem.number && (
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 bg-gray-100 text-gray-700 rounded-md flex items-center justify-center font-semibold text-sm">
                                {subItem.number.split('.')[1] || subItem.number}
                              </div>
                            </div>
                          )}
                          <div className="text-[#222] leading-relaxed text-sm flex-1">
                            {subItem.content
                              .split('\n')
                              .map((line, lineIndex) => {
                                if (line.trim() === '') return null;
                                return (
                                  <p key={lineIndex} className="mb-1">
                                    {line.trim()}
                                  </p>
                                );
                              })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        }
      )}
    </div>
  );
}
