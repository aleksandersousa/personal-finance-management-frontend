'use client';

import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { CheckIcon } from '@phosphor-icons/react/dist/ssr';

import { cn } from '@/lib/utils';

const Checkbox = React.forwardRef<
  React.ComponentRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      'cursor-pointer peer h-5 w-5 shrink-0 rounded border border-border-foreground ring-offset-white focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-neutral-0',
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn('flex items-center justify-center text-current')}
    >
      <CheckIcon className='h-5 w-5' />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export interface CheckboxWithLabelProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  label?: string;
  error?: string;
  helperText?: string;
  id?: string;
}

const CheckboxWithLabel = React.forwardRef<
  React.ComponentRef<typeof CheckboxPrimitive.Root>,
  CheckboxWithLabelProps
>(({ label, error, helperText, id, className, ...props }, ref) => {
  const generatedId = React.useId();
  const checkboxId = id || generatedId;

  return (
    <div className='space-y-1'>
      <div className='flex items-center space-x-2'>
        <Checkbox ref={ref} id={checkboxId} className={className} {...props} />
        {label && (
          <label
            htmlFor={checkboxId}
            className='text-sm text-foreground opacity-90 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer'
          >
            {label}
          </label>
        )}
      </div>

      {error && (
        <p className='text-sm text-error' id={`${checkboxId}-error`}>
          {error}
        </p>
      )}

      {helperText && !error && (
        <p className='text-sm text-foreground' id={`${checkboxId}-helper`}>
          {helperText}
        </p>
      )}
    </div>
  );
});
CheckboxWithLabel.displayName = 'CheckboxWithLabel';

export { Checkbox, CheckboxWithLabel };
