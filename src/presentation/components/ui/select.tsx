import React from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  helperText,
  options,
  placeholder,
  className = '',
  id,
  ...props
}) => {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

  const baseClasses =
    'block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm';
  const normalClasses =
    'border-slate-300 focus:ring-cyan-400 focus:border-cyan-400';
  const errorClasses =
    'border-pink-400 focus:ring-pink-400 focus:border-pink-400';

  const selectClasses = `${baseClasses} ${error ? errorClasses : normalClasses} ${className}`;

  return (
    <div className='space-y-1'>
      {label && (
        <label
          htmlFor={selectId}
          className='block text-sm font-medium text-slate-700'
        >
          {label}
        </label>
      )}

      <select id={selectId} className={selectClasses} {...props}>
        {placeholder && (
          <option value='' disabled>
            {placeholder}
          </option>
        )}
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && (
        <p className='text-sm text-pink-600' id={`${selectId}-error`}>
          {error}
        </p>
      )}

      {helperText && !error && (
        <p className='text-sm text-slate-500' id={`${selectId}-helper`}>
          {helperText}
        </p>
      )}
    </div>
  );
};
