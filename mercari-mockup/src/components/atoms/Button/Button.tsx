import React from 'react';
import { motion } from 'framer-motion';
import { buttonVariants } from '../../../animations/navigationVariants';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  onClick,
  type = 'button',
  className = ''
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantClasses = {
    primary: 'bg-mercari-red text-white hover:bg-mercari-red-dark focus:ring-mercari-red',
    secondary: 'bg-background-secondary text-text-primary hover:bg-gray-300 focus:ring-gray-300',
    outline: 'border-2 border-mercari-red text-mercari-red hover:bg-mercari-red hover:text-white focus:ring-mercari-red',
    ghost: 'text-mercari-red hover:bg-mercari-red hover:bg-opacity-10 focus:ring-mercari-red',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500'
  };

  const sizeClasses = {
    xs: 'px-2 py-1 text-xs rounded',
    sm: 'px-3 py-1.5 text-sm rounded-md',
    md: 'px-4 py-2 text-sm rounded-lg',
    lg: 'px-6 py-3 text-base rounded-lg',
    xl: 'px-8 py-4 text-lg rounded-xl'
  };

  const disabledClasses = disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  const fullWidthClass = fullWidth ? 'w-full' : '';

  const buttonClasses = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    disabledClasses,
    fullWidthClass,
    className
  ].join(' ');

  const handleClick = () => {
    if (!disabled && !loading && onClick) {
      onClick();
    }
  };

  return (
    <motion.button
      type={type}
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled || loading}
      variants={buttonVariants}
      initial="idle"
      whileHover={!disabled && !loading ? "hover" : undefined}
      whileTap={!disabled && !loading ? "tap" : undefined}
      animate={loading ? "loading" : "idle"}
    >
      {loading ? (
        <div className="flex items-center">
          <motion.div
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          読み込み中...
        </div>
      ) : (
        <div className="flex items-center">
          {icon && iconPosition === 'left' && (
            <span className="mr-2">{icon}</span>
          )}
          {children}
          {icon && iconPosition === 'right' && (
            <span className="ml-2">{icon}</span>
          )}
        </div>
      )}
    </motion.button>
  );
};

export default Button;