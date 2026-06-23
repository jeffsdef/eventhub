import { cn, getInitials } from '@/lib/utils';

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-16 h-16 text-lg',
  lg: 'w-32 h-32 text-3xl',
};

export function UserInitials({
  name,
  size = 'md',
  className,
}: {
  name: string;
  size?: keyof typeof sizeClasses;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0',
        sizeClasses[size],
        className,
      )}
      aria-hidden
    >
      {getInitials(name) || '?'}
    </div>
  );
}
