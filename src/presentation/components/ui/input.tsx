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
    'text-foreground file:text-foreground placeholder:text-foreground placeholder:opacity-50 selection:bg-neutral-200 selection:text-foreground border-border-foreground flex h-9 w-full min-w-0 rounded-lg border bg-transparent px-3 py-1 text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
    error ? 'aria-invalid:border-error border-error' : '',
    className
  );

  if (label || error || helperText) {
    return (
      <div className='space-y-1'>
        {label && (
          <label htmlFor={inputId} className='block text-sm text-foreground'>
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
          <p className='text-sm text-error' id={`${inputId}-error`}>
            {error}
          </p>
        )}

        {helperText && !error && (
          <p className='text-sm text-foreground' id={`${inputId}-helper`}>
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
