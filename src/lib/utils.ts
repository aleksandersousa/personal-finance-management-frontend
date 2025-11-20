import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (date: Date | string) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  // Verificar se a data é válida
  if (isNaN(dateObj.getTime())) {
    return 'Data inválida';
  }

  const month = dateObj.getUTCMonth() + 1;
  const day = dateObj.getUTCDate();
  const year = dateObj.getUTCFullYear();
  return `${month}/${day}/${year}`;
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount / 100);
};

/**
 * Formats a value to Brazilian currency format (R$ 1.234,56)
 * @param value - The numeric value as string
 * @returns Formatted string
 */
export const formatCurrencyInput = (value: string): string => {
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, '');

  if (!digits) return '';

  // Convert to number and divide by 100 to get decimal places
  const numberValue = Number(digits) / 100;

  // Format with Brazilian locale
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numberValue);
};

/**
 * Parses a Brazilian formatted currency string to a number
 * @param value - The formatted string (e.g., "1.234,56")
 * @returns The numeric value
 */
export const parseCurrencyInput = (value: string): number => {
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, '');

  if (!digits) return 0;

  // Convert to number and divide by 100
  return Number(digits) / 100;
};
