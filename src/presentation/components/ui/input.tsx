import * as React from 'react';
import { useId } from 'react';

import { cn } from '@/lib/utils';

export interface InputProps extends React.ComponentProps<'input'> {
  label?: string;
  error?: string;
  helperText?: string;
}

function Input({
  className,
  type,
  label,
  error,
  helperText,
  id,
  required,
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id || generatedId;

  const inputClasses = cn(
    'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-lg border bg-transparent px-3 py-1 text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
    error ? 'aria-invalid:border-destructive border-destructive' : '',
    className
  );

  if (label || error || helperText) {
    return (
      <div className='space-y-1'>
        {label && (
          <label
            htmlFor={inputId}
            className='block text-sm font-medium text-foreground'
          >
            {label}
            {required && <span className='text-red-500'>*</span>}
          </label>
        )}

        <input
          id={inputId}
          type={type}
          data-slot='input'
          className={inputClasses}
          aria-invalid={error ? true : undefined}
          {...props}
        />

        {error && (
          <p className='text-sm text-destructive' id={`${inputId}-error`}>
            {error}
          </p>
        )}

        {helperText && !error && (
          <p className='text-sm text-muted-foreground' id={`${inputId}-helper`}>
            {helperText}
          </p>
        )}
      </div>
    );
  }

  return (
    <input
      id={inputId}
      type={type}
      data-slot='input'
      className={inputClasses}
      {...props}
    />
  );
}

export { Input };
