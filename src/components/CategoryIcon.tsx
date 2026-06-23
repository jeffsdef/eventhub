'use client';

import type { Category } from '@/types';
import { getCategoryByName } from '@/lib/categories';
import { cn } from '@/lib/utils';
import { ImageWithFallback } from '@/components/ImageWithFallback';

type CategoryIconSize = 'xs' | 'sm' | 'md' | 'lg' | 'fill';

const sizeClasses: Record<CategoryIconSize, string> = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  fill: 'w-full h-full',
};

interface CategoryIconProps {
  category: Category | string;
  size?: CategoryIconSize;
  className?: string;
  imageClassName?: string;
}

export function CategoryIcon({
  category,
  size = 'md',
  className,
  imageClassName,
}: CategoryIconProps) {
  const resolved =
    typeof category === 'string' ? getCategoryByName(category) : category;

  if (!resolved) {
    return null;
  }

  return (
    <div
      className={cn(
        'overflow-hidden shrink-0 rounded-lg ring-1 ring-border/40',
        sizeClasses[size],
        className,
      )}
    >
      <ImageWithFallback
        src={resolved.icon}
        alt={resolved.name}
        className={cn('w-full h-full object-cover', imageClassName)}
      />
    </div>
  );
}
