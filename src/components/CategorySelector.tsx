'use client';

import type { Category } from '@/types';
import { cn } from '@/lib/utils';
import { ImageWithFallback } from '@/components/ImageWithFallback';

interface CategorySelectorProps {
  categories: Category[];
  selected: string[];
  onToggle: (categoryName: string) => void;
  multiple?: boolean;
  columns?: 2 | 3;
}

export function CategorySelector({
  categories,
  selected,
  onToggle,
  multiple = true,
  columns = 2,
}: CategorySelectorProps) {
  return (
    <div
      className={cn(
        'grid gap-3',
        columns === 3 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-2',
      )}
    >
      {categories.map((category) => {
        const isSelected = selected.includes(category.name);

        return (
          <button
            key={category.id}
            type="button"
            onClick={() => {
              if (multiple) {
                onToggle(category.name);
                return;
              }
              onToggle(isSelected ? '' : category.name);
            }}
            className={cn(
              'relative overflow-hidden rounded-xl border-2 text-left transition-all',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              isSelected
                ? 'border-primary ring-2 ring-primary/20'
                : 'border-border hover:border-primary/50',
            )}
          >
            <div className="relative h-24 sm:h-28">
              <ImageWithFallback
                src={category.icon}
                alt={category.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <span className="absolute bottom-2 left-2 right-2 text-sm font-semibold text-white">
                {category.name}
              </span>
              {isSelected && (
                <span className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  ✓
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
