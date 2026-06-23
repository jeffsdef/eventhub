import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

interface CardProps {
  children?: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ children, className, hover = false, onClick }: CardProps) {
  const Component = hover ? motion.div : 'div';

  return (
    <Component
      className={cn(
        'bg-card text-card-foreground rounded-2xl border border-border shadow-sm',
        hover && 'cursor-pointer transition-all duration-200',
        className
      )}
      onClick={onClick}
      {...(hover ? {
        whileHover: { y: -4, boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)' },
        transition: { duration: 0.2 }
      } : {})}
    >
      {children}
    </Component>
  );
}
