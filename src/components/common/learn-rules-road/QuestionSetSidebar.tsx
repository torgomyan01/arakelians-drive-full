'use client';

import clsx from 'clsx';
import {
  Select,
  MenuItem,
  FormControl,
  SelectChangeEvent,
} from '@mui/material';

interface LessonCategory {
  id: number;
  name: string;
  questionCount: number;
}

interface QuestionSetSidebarProps {
  items: number[];
  categories: LessonCategory[];
  activeItem?: number;
  onItemSelect?: (item: number) => void;
}

export default function QuestionSetSidebar({
  items,
  categories,
  activeItem = 1,
  onItemSelect,
}: QuestionSetSidebarProps) {
  const bgOrange = 'bg-[#FA8604]';
  const sidebarItemActive =
    'p-2.5 bg-white rounded-[30px] text-[#FA8604] text-base w-full text-center mb-1.5';
  const sidebarItemInactive =
    'p-2.5 bg-white/30 rounded-[30px] text-white text-base w-full text-center mb-1.5';

  // Create a map for quick lookup of category data
  const categoryMap = new Map(categories.map((cat) => [cat.id, cat]));

  return (
    <>
      {/* Mobile Select */}
      <div className="hidden max-[1024px]:block w-full mb-5">
        <FormControl fullWidth>
          <Select
            value={activeItem ? String(activeItem) : ''}
            onChange={(e: SelectChangeEvent<string>) => {
              const selectedValue = e.target.value;
              if (selectedValue) {
                onItemSelect?.(Number(selectedValue));
              }
            }}
            displayEmpty
            sx={{
              height: '55px',
              borderRadius: '10px',
            }}
          >
            <MenuItem value="" disabled>
              <em>Ընտրեք հարցաշարը</em>
            </MenuItem>
            {items.map((id) => {
              const category = categoryMap.get(id);
              return (
                <MenuItem key={id} value={String(id)}>
                  {category?.name || `Հարցաշար ${id}`}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </div>

      {/* Sidebar */}
      <div
        className={`py-5 px-4 ${bgOrange} flex-js-s flex-col rounded-[20px] min-w-[290px] w-[290px] max-[1200px]:w-[250px] max-[1200px]:min-w-[250px] max-[1024px]:min-w-full max-[1024px]:w-full max-[1024px]:hidden`}
      >
        {items.map((id) => {
          const category = categoryMap.get(id);
          return (
            <button
              key={id}
              onClick={() => onItemSelect?.(id)}
              className={clsx(
                id === activeItem ? sidebarItemActive : sidebarItemInactive,
                'cursor-pointer hover:bg-white/40 '
              )}
            >
              {category?.name || `Հարցաշար ${id}`}
            </button>
          );
        })}
      </div>
    </>
  );
}
