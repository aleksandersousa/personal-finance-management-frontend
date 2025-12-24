import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (date: Date | string) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return 'Data inválida';
  }

  let month = String(dateObj.getUTCMonth() + 1);
  let day = String(dateObj.getUTCDate());
  let year = String(dateObj.getUTCFullYear());

  if (Number(day) < 10) {
    day = `0${day}`;
  }
  if (Number(month) < 10) {
    month = `0${month}`;
  }
  if (Number(year) < 10) {
    year = `0${year}`;
  }

  return `${day}/${month}/${year}`;
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount / 100);
};

export const formatCurrencyInput = (value: string): string => {
  const digits = value.replace(/\D/g, '');

  if (!digits) return '';

  const numberValue = Number(digits) / 100;

  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numberValue);
};

export const parseCurrencyInput = (value: string): number => {
  const digits = value.replace(/\D/g, '');
  if (!digits) return 0;
  return Number(digits) / 100;
};
