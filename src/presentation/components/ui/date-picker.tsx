'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon } from '@phosphor-icons/react/dist/ssr';

import { cn } from '@/lib/utils';
import { Button } from './button';
import { Calendar } from './calendar';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

export interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  label?: string;
  error?: string;
  helperText?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  id?: string;
}

export function DatePicker({
  value,
  onChange,
  label,
  error,
  helperText,
  placeholder = 'Selecione uma data',
  disabled,
  required,
  className,
  id,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const generatedId = React.useId();
  const datePickerId = id || generatedId;

  return (
    <div className='space-y-1'>
      {label && (
        <label
          htmlFor={datePickerId}
          className='block text-sm font-medium text-foreground'
        >
          {label}
          {required && <span className='text-red-500'>*</span>}
        </label>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={datePickerId}
            variant='outline'
            className={cn(
              'w-full justify-start text-left font-normal h-9 rounded-lg',
              !value && 'text-muted-foreground',
              error && 'border-destructive',
              className
            )}
            disabled={disabled}
            type='button'
          >
            <CalendarIcon className='mr-2 h-4 w-4' />
            {value ? (
              format(value, 'PPP', { locale: ptBR })
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0' align='start'>
          <Calendar
            mode='single'
            selected={value}
            onSelect={date => {
              onChange?.(date);
              setOpen(false);
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {error && (
        <p className='text-sm text-destructive' id={`${datePickerId}-error`}>
          {error}
        </p>
      )}

      {helperText && !error && (
        <p
          className='text-sm text-muted-foreground'
          id={`${datePickerId}-helper`}
        >
          {helperText}
        </p>
      )}
    </div>
  );
}
