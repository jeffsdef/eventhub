import { CategoryIcon } from '@/components/CategoryIcon';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

interface CategoryBadgeProps {
  category: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
}

export function CategoryBadge({
  category,
  className,
  variant = 'primary',
}: CategoryBadgeProps) {
  return (
    <Badge variant={variant} className={cn('inline-flex items-center gap-1.5', className)}>
      <CategoryIcon category={category} size="xs" className="ring-0 rounded-md" />
      {category}
    </Badge>
  );
}
