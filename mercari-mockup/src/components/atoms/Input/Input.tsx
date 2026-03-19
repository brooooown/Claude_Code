import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';

export type InputVariant = 'default' | 'search' | 'outlined' | 'filled';
export type InputSize = 'sm' | 'md' | 'lg';

interface InputProps {
  value?: string;
  placeholder?: string;
  variant?: InputVariant;
  size?: InputSize;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
  helperText?: string;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  clearable?: boolean;
  autoFocus?: boolean;
  type?: 'text' | 'email' | 'password' | 'search' | 'tel' | 'url';
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onClear?: () => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  className?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  value = '',
  placeholder,
  variant = 'default',
  size = 'md',
  disabled = false,
  error = false,
  errorMessage,
  helperText,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  clearable = false,
  autoFocus = false,
  type = 'text',
  onChange,
  onFocus,
  onBlur,
  onClear,
  onKeyDown,
  className = ''
}, ref) => {
  const baseClasses = 'transition-all duration-300 focus:outline-none';

  const variantClasses = {
    default: 'border border-gray-300 bg-white focus:border-mercari-red focus:ring-2 focus:ring-mercari-red focus:ring-opacity-20',
    search: 'border border-gray-200 bg-background-secondary focus:border-mercari-red focus:ring-2 focus:ring-mercari-red focus:ring-opacity-20 rounded-full',
    outlined: 'border-2 border-gray-300 bg-transparent focus:border-mercari-red',
    filled: 'border-0 bg-background-secondary focus:bg-white focus:ring-2 focus:ring-mercari-red focus:ring-opacity-20'
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-5 py-4 text-lg'
  };

  const errorClasses = error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : '';
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : '';
  const fullWidthClass = fullWidth ? 'w-full' : '';
  const roundedClass = variant === 'search' ? 'rounded-full' : 'rounded-lg';

  const inputClasses = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    errorClasses,
    disabledClasses,
    fullWidthClass,
    roundedClass,
    'text-japanese',
    className
  ].join(' ');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  const handleClear = () => {
    if (onClear) {
      onClear();
    } else if (onChange) {
      onChange('');
    }
  };

  return (
    <div className={fullWidthClass}>
      <div className="relative">
        {/* Left Icon */}
        {icon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400">{icon}</span>
          </div>
        )}

        {/* Input Field */}
        <motion.input
          ref={ref}
          type={type}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          autoFocus={autoFocus}
          className={`${inputClasses} ${
            icon && iconPosition === 'left' ? 'pl-10' : ''
          } ${
            (icon && iconPosition === 'right') || clearable ? 'pr-10' : ''
          }`}
          onChange={handleChange}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          whileFocus={{
            scale: variant === 'search' ? 1.02 : 1,
            transition: { duration: 0.2, ease: 'easeOut' }
          }}
        />

        {/* Right Icon or Clear Button */}
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          {clearable && value && !disabled && (
            <motion.button
              type="button"
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 focus:outline-none p-1"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.1 }}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>
          )}

          {icon && iconPosition === 'right' && !clearable && (
            <span className="text-gray-400">{icon}</span>
          )}
        </div>
      </div>

      {/* Helper Text or Error Message */}
      {(helperText || errorMessage) && (
        <motion.div
          className={`mt-2 text-sm ${error ? 'text-red-500' : 'text-text-secondary'}`}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {error ? errorMessage : helperText}
        </motion.div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;