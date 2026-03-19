import React from 'react';
import { motion } from 'framer-motion';
import { filterTagVariants } from '../../../animations/searchAnimations';
import { Icon } from '../Icon';

export type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
export type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  removable?: boolean;
  count?: number;
  dot?: boolean;
  rounded?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  removable = false,
  count,
  dot = false,
  rounded = true,
  onClick,
  onRemove,
  className = ''
}) => {
  const baseClasses = 'inline-flex items-center font-medium transition-all duration-200';

  const variantClasses = {
    default: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
    primary: 'bg-mercari-red text-white hover:bg-mercari-red-dark',
    secondary: 'bg-background-secondary text-text-primary hover:bg-gray-300',
    success: 'bg-green-100 text-green-800 hover:bg-green-200',
    warning: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
    danger: 'bg-red-100 text-red-800 hover:bg-red-200'
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const roundedClass = rounded ? 'rounded-full' : 'rounded-md';
  const clickableClass = onClick ? 'cursor-pointer hover:scale-105' : '';
  const dotClass = dot ? 'w-2 h-2 rounded-full' : '';

  const badgeClasses = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    roundedClass,
    clickableClass,
    dotClass,
    className
  ].join(' ');

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove();
    }
  };

  if (dot) {
    return (
      <motion.span
        className={badgeClasses}
        variants={filterTagVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        whileHover="hover"
        layout
      />
    );
  }

  return (
    <motion.span
      className={badgeClasses}
      onClick={handleClick}
      variants={filterTagVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      whileHover={onClick ? "hover" : undefined}
      whileTap={onClick ? { scale: 0.95 } : undefined}
      layout
    >
      <span className="flex items-center">
        {children}
        {count !== undefined && count > 0 && (
          <span className="ml-1 font-semibold">
            {count > 99 ? '99+' : count}
          </span>
        )}
        {removable && (
          <motion.button
            type="button"
            className="ml-1 p-0.5 hover:bg-white hover:bg-opacity-20 rounded-full"
            onClick={handleRemove}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.1 }}
          >
            <Icon name="close" size="xs" />
          </motion.button>
        )}
      </span>
    </motion.span>
  );
};

// Filter Tag Component - specialized badge for search filters
interface FilterTagProps {
  label: string;
  onRemove?: () => void;
  isActive?: boolean;
}

export const FilterTag: React.FC<FilterTagProps> = ({
  label,
  onRemove,
  isActive = true
}) => {
  return (
    <Badge
      variant={isActive ? 'primary' : 'default'}
      size="sm"
      removable={!!onRemove}
      onRemove={onRemove}
      className="mr-2 mb-2"
    >
      {label}
    </Badge>
  );
};

// Notification Badge - for showing counts
interface NotificationBadgeProps {
  count: number;
  max?: number;
  dot?: boolean;
  children?: React.ReactNode;
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  count,
  max = 99,
  dot = false,
  children
}) => {
  if (count === 0 && !dot) {
    return children ? <>{children}</> : null;
  }

  if (dot) {
    return (
      <div className="relative inline-block">
        {children}
        <Badge
          variant="danger"
          size="sm"
          dot
          className="absolute -top-1 -right-1"
        />
      </div>
    );
  }

  const displayCount = count > max ? `${max}+` : count.toString();

  return (
    <div className="relative inline-block">
      {children}
      <Badge
        variant="danger"
        size="sm"
        className="absolute -top-2 -right-2 min-w-[1.25rem] h-5 flex items-center justify-center px-1"
      >
        {displayCount}
      </Badge>
    </div>
  );
};

export default Badge;