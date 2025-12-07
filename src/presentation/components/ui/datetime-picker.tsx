'use client';

import { useState, useEffect, useId } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, ClockIcon } from '@phosphor-icons/react/dist/ssr';

import { cn } from '@/lib/utils';
import { Button } from './button';
import { Calendar } from './calendar';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Input } from './input';

export interface DateTimePickerProps {
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

export function DateTimePicker({
  value,
  onChange,
  label,
  error,
  helperText,
  placeholder = 'Selecione data e hora',
  disabled,
  required,
  className,
  id,
}: DateTimePickerProps) {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(value);
  const [hours, setHours] = useState<string>(
    value ? String(value.getHours()).padStart(2, '0') : '00'
  );
  const [minutes, setMinutes] = useState<string>(
    value ? String(value.getMinutes()).padStart(2, '0') : '00'
  );

  const generatedId = useId();
  const dateTimePickerId = id || generatedId;

  // Update local state when value prop changes
  useEffect(() => {
    if (value) {
      setSelectedDate(value);
      setHours(String(value.getHours()).padStart(2, '0'));
      setMinutes(String(value.getMinutes()).padStart(2, '0'));
    } else {
      setSelectedDate(undefined);
      setHours('00');
      setMinutes('00');
    }
  }, [value]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const newDate = new Date(date);
      newDate.setHours(parseInt(hours) || 0);
      newDate.setMinutes(parseInt(minutes) || 0);
      setSelectedDate(newDate);
      onChange?.(newDate);
    } else {
      setSelectedDate(undefined);
      onChange?.(undefined);
    }
  };

  const handleTimeChange = (type: 'hours' | 'minutes', val: string) => {
    const numValue = parseInt(val) || 0;
    let clampedValue = numValue;

    if (type === 'hours') {
      clampedValue = Math.max(0, Math.min(23, numValue));
      setHours(String(clampedValue).padStart(2, '0'));
    } else {
      clampedValue = Math.max(0, Math.min(59, numValue));
      setMinutes(String(clampedValue).padStart(2, '0'));
    }

    if (selectedDate) {
      const newDate = new Date(selectedDate);
      if (type === 'hours') {
        newDate.setHours(clampedValue);
      } else {
        newDate.setMinutes(clampedValue);
      }
      setSelectedDate(newDate);
      onChange?.(newDate);
    }
  };

  const handleConfirm = () => {
    if (selectedDate) {
      const finalDate = new Date(selectedDate);
      finalDate.setHours(parseInt(hours) || 0);
      finalDate.setMinutes(parseInt(minutes) || 0);
      onChange?.(finalDate);
    }
    setOpen(false);
  };

  const displayValue = selectedDate
    ? format(selectedDate, "PPP 'às' HH:mm", { locale: ptBR })
    : null;

  return (
    <div className='space-y-1'>
      {label && (
        <label
          htmlFor={dateTimePickerId}
          className='block text-sm text-foreground'
        >
          {label}
          {required && <span className='text-red-500'>*</span>}
        </label>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={dateTimePickerId}
            variant='outline'
            className={cn(
              'w-full justify-start text-left font-normal h-9 rounded-lg shadow-none',
              !selectedDate && 'text-foreground',
              error && 'border-error',
              className
            )}
            disabled={disabled}
            type='button'
          >
            <CalendarIcon className='mr-2 h-4 w-4' />
            {displayValue ? (
              <span>{displayValue}</span>
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0' align='start'>
          <div className='p-3'>
            <Calendar
              mode='single'
              selected={selectedDate}
              onSelect={handleDateSelect}
            />
            <div className='border-t pt-3 mt-3'>
              <div className='flex items-center gap-2'>
                <ClockIcon className='h-4 w-4 text-neutral-900' />
                <span className='text-sm font-medium text-neutral-900'>
                  Hora
                </span>
              </div>
              <div className='flex items-center gap-2 mt-2'>
                <Input
                  type='number'
                  min='0'
                  max='23'
                  value={hours}
                  onChange={e => handleTimeChange('hours', e.target.value)}
                  className='w-16 text-center text-neutral-900'
                  placeholder='00'
                />
                <span className='text-neutral-900'>:</span>
                <Input
                  type='number'
                  min='0'
                  max='59'
                  value={minutes}
                  onChange={e => handleTimeChange('minutes', e.target.value)}
                  className='w-16 text-center text-neutral-900'
                  placeholder='00'
                />
              </div>
              <Button
                type='button'
                variant='primary'
                onClick={handleConfirm}
                className='w-full mt-3'
              >
                Confirmar
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {error && (
        <p className='text-sm text-error' id={`${dateTimePickerId}-error`}>
          {error}
        </p>
      )}

      {helperText && !error && (
        <p
          className='text-sm text-foreground'
          id={`${dateTimePickerId}-helper`}
        >
          {helperText}
        </p>
      )}
    </div>
  );
}
