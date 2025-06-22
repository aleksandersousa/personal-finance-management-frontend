import React from 'react';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  const baseClasses =
    'block w-full px-3 py-2 border rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm';
  const normalClasses =
    'border-slate-300 focus:ring-cyan-400 focus:border-cyan-400';
  const errorClasses =
    'border-pink-400 focus:ring-pink-400 focus:border-pink-400';

  const inputClasses = `${baseClasses} ${error ? errorClasses : normalClasses} ${className}`;

  return (
    <div className='space-y-1'>
      {label && (
        <label
          htmlFor={inputId}
          className='block text-sm font-medium text-slate-700'
        >
          {label}
        </label>
      )}

      <input id={inputId} className={inputClasses} {...props} />

      {error && (
        <p className='text-sm text-pink-600' id={`${inputId}-error`}>
          {error}
        </p>
      )}

      {helperText && !error && (
        <p className='text-sm text-slate-500' id={`${inputId}-helper`}>
          {helperText}
        </p>
      )}
    </div>
  );
};
