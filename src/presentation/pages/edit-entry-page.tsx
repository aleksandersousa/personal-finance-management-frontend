'use client';

import React, { useEffect, useMemo, useState, useTransition } from 'react';
import { makeEntryFormValidator } from '@/main/factories/validation';
import type { EntryModel } from '@/domain/models/entry';
import {
  loadCategoriesAction,
  loadEntryByIdFromCache,
  updateEntryAction,
} from '../actions';
import type { CategoryWithStatsModel } from '@/domain/models';
import {
  Button,
  Card,
  Input,
  PageLoading,
  Select,
  DateTimePicker,
  CheckboxWithLabel,
} from '../components';
import { redirect } from 'next/navigation';
import { formatCurrencyInput, parseCurrencyInput } from '@/lib/utils';

export interface EditEntryPageProps {
  entryId: string;
  listMonthFilter?: string;
}

export const EditEntryPage: React.FC<EditEntryPageProps> = ({
  entryId,
  listMonthFilter,
}) => {
  const [entry, setEntry] = useState<EntryModel | null>(null);
  const [formData, setFormData] = useState<{
    description: string;
    amount: string;
    categoryId: string;
    date: Date | undefined;
    isPaid: boolean;
    isRecurring: boolean;
    recurrenceId: string | null;
  }>({
    description: '',
    amount: '',
    categoryId: '',
    date: undefined,
    isPaid: false,
    isRecurring: false,
    recurrenceId: null,
  });
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [categories, setCategories] = useState<CategoryWithStatsModel[]>([]);

  const [isPendingEntry, startEntryTransition] = useTransition();
  const [isPendingCategories, startCategoriesTransition] = useTransition();
  const [isPendingUpdate, startUpdateTransition] = useTransition();

  const validator = useMemo(() => makeEntryFormValidator(), []);
  const categoryOptions = useMemo(() => {
    return categories.map(category => ({
      value: category.id,
      label: category.name,
    }));
  }, [categories]);

  useEffect(() => {
    const loadEntry = async () => {
      startEntryTransition(async () => {
        const cachedEntry = await loadEntryByIdFromCache(
          entryId,
          listMonthFilter
        );

        if (cachedEntry) {
          setEntry(cachedEntry);
        }
      });
    };

    loadEntry();
  }, [entryId, listMonthFilter]);

  useEffect(() => {
    if (entry) {
      setFormData({
        description: entry.description,
        amount: formatCurrencyInput(entry.amount.toString()),
        categoryId: entry.categoryId || '',
        date: new Date(entry.dueDate),
        isPaid: entry.isPaid ?? false,
        isRecurring: !!entry.recurrenceId,
        recurrenceId: entry.recurrenceId,
      });
    }
  }, [entry]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const result = await loadCategoriesAction({
          includeStats: false,
          limit: 100,
        });
        setCategories(result.data);
      } catch (error) {
        console.error('Error loading categories:', error);
        setCategories([]);
      }
    };

    startCategoriesTransition(() => {
      loadCategories();
    });
  }, []);

  useEffect(() => {
    if (!entry) return;

    if (entry.categoryId && categories.length > 0) {
      handleInputChange('categoryId', entry.categoryId);
    }
  }, [categories, entry?.categoryId, entry]);

  const handleInputChange = (
    field: string,
    value: string | boolean | Date | undefined
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: [],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!entry || !formData.date) return;

    const dataToValidate = {
      description: formData.description,
      amount: parseCurrencyInput(formData.amount),
      categoryId: formData.categoryId,
      date: formData.date,
    };

    const result = validator.validate(dataToValidate);

    if (!result.success) {
      setErrors(result.errors || {});
      return;
    }

    try {
      startUpdateTransition(async () => {
        await updateEntryAction(
          entryId,
          result.data!,
          listMonthFilter,
          formData.isPaid,
          formData.isRecurring,
          formData.recurrenceId
        );
      });
      setErrors({});
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({
        general: ['Erro ao atualizar entrada. Tente novamente.'],
      });
    }
  };

  if (isPendingEntry || isPendingCategories) {
    return <PageLoading text='Carregando dados...' />;
  }

  if (!entry) {
    return <div>Entrada não encontrada</div>;
  }

  return (
    <>
      <div className='min-h-screen bg-background-secondary pt-20 pb-20 lg:pb-8'>
        <div className='flex justify-center px-4 sm:px-6 lg:px-8 lg:ml-64'>
          <div className='w-full max-w-2xl box-border'>
            <div className='text-center mb-8'>
              <h1 className='text-3xl font-bold text-foreground mb-2'>
                Editar Entrada
              </h1>
              <p className='text-foreground'>
                Atualize os dados da sua entrada financeira
              </p>
            </div>

            <Card className='rounded-3xl p-6 sm:p-8'>
              <form onSubmit={handleSubmit} className='space-y-6'>
                {errors.general && (
                  <div className='bg-pink-50 border border-pink-400 text-pink-700 px-4 py-3 rounded'>
                    {errors.general.map((error, index) => (
                      <p key={index}>{error}</p>
                    ))}
                  </div>
                )}

                <Input
                  label='Descrição'
                  value={formData.description}
                  onChange={e =>
                    handleInputChange('description', e.target.value)
                  }
                  placeholder='Digite a descrição da entrada'
                  error={errors.description?.[0]}
                  required
                  disabled={isPendingUpdate}
                />

                <Input
                  label='Valor (R$)'
                  type='text'
                  inputMode='numeric'
                  value={formData.amount}
                  onChange={e => {
                    const formatted = formatCurrencyInput(e.target.value);
                    handleInputChange('amount', formatted);
                  }}
                  placeholder='0,00'
                  error={errors.amount?.[0]}
                  required
                  disabled={isPendingUpdate}
                />

                {categoryOptions.length > 0 && (
                  <Select
                    required
                    label='Categoria'
                    value={formData.categoryId}
                    onValueChange={value =>
                      handleInputChange('categoryId', value)
                    }
                    options={categoryOptions}
                    placeholder={
                      isPendingUpdate
                        ? 'Carregando categorias...'
                        : 'Selecione a categoria'
                    }
                    error={errors.categoryId?.[0]}
                    disabled={isPendingUpdate}
                  />
                )}

                <DateTimePicker
                  label='Data e Hora'
                  value={formData.date}
                  onChange={date => handleInputChange('date', date)}
                  error={errors.date?.[0]}
                  required
                  disabled={isPendingUpdate}
                  placeholder='Selecione data e hora'
                />

                {entry.entryType === 'EXPENSE' && (
                  <CheckboxWithLabel
                    id='isPaid'
                    checked={formData.isPaid}
                    onCheckedChange={checked =>
                      handleInputChange('isPaid', checked as boolean)
                    }
                    disabled={isPendingUpdate}
                    label='Marcar como pago'
                  />
                )}

                <CheckboxWithLabel
                  id='isRecurring'
                  checked={formData.isRecurring}
                  onCheckedChange={checked =>
                    handleInputChange('isRecurring', checked as boolean)
                  }
                  disabled={isPendingUpdate}
                  label='Marcar como recorrente'
                />

                <div className='flex space-x-4'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() =>
                      redirect(
                        listMonthFilter
                          ? `/entries?month=${encodeURIComponent(listMonthFilter)}`
                          : '/entries'
                      )
                    }
                    disabled={isPendingUpdate}
                    className='flex-1 rounded-xl'
                  >
                    Cancelar
                  </Button>
                  <Button
                    type='submit'
                    variant='primary'
                    isLoading={isPendingUpdate}
                    disabled={isPendingUpdate}
                    className='flex-1 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-250'
                  >
                    {isPendingUpdate ? 'Salvando...' : 'Salvar Alterações'}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};
