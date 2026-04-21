'use client';

import React, { useEffect, useMemo, useState, useTransition } from 'react';
import {
  Button,
  Card,
  Input,
  Select,
  DateTimePicker,
  CheckboxWithLabel,
} from '../components';
import { makeEntryFormValidator } from '@/main/factories/validation';
import { addEntryAction, loadCategoriesAction } from '../actions';
import type { CategoryWithStatsModel } from '@/domain/models';
import { useRouter } from 'next/navigation';
import { formatCurrencyInput, parseCurrencyInput } from '@/lib/utils';
import { toast } from 'sonner';
import { isRedirectError } from '@/presentation/helpers';

export const AddEntryPage: React.FC = () => {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [categories, setCategories] = useState<CategoryWithStatsModel[]>([]);
  const [formData, setFormData] = useState<{
    description: string;
    amount: string;
    categoryId: string;
    date: Date | undefined;
    isPaid: boolean;
    isRecurring: boolean;
  }>({
    description: '',
    amount: '0,00',
    categoryId: '',
    date: new Date(),
    isPaid: false,
    isRecurring: false,
  });

  const [isPendingSubmit, startSubmitTransition] = useTransition();
  const [isPendingCategories, startCategoriesTransition] = useTransition();

  const validator = useMemo(() => makeEntryFormValidator(), []);

  const categoryOptions = useMemo(() => {
    return categories.map(category => ({
      value: category.id,
      label: category.name,
    }));
  }, [categories]);
  const selectedCategory = useMemo(
    () =>
      categories.find(category => category.id === formData.categoryId) ?? null,
    [categories, formData.categoryId]
  );

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

  const handleInputChange = (
    field: string,
    value: string | boolean | Date | undefined
  ) => {
    setFormData(prev => {
      const newData = {
        ...prev,
        [field]: value,
      };

      // Se o tipo mudou, limpar a categoria selecionada
      return newData;
    });

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: [],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.date) return;

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

    startSubmitTransition(async () => {
      try {
        const actionResult = await addEntryAction({
          ...result.data!,
          categoryId: result.data!.categoryId,
          isPaid: formData.isPaid,
          isRecurring: formData.isRecurring,
        });
        if (actionResult.ok) {
          toast.success('Entrada criada com sucesso');
          setFormData({
            description: '',
            amount: '0,00',
            categoryId: '',
            date: new Date(),
            isPaid: false,
            isRecurring: false,
          });
          setErrors({});
        } else {
          toast.error('Erro ao criar entrada. Tente novamente.');
          setErrors({
            general: ['Erro ao salvar entrada. Tente novamente.'],
          });
        }
      } catch (error) {
        if (isRedirectError(error)) {
          throw error;
        }
        console.error('Error submitting form:', error);
        toast.error('Erro ao criar entrada. Tente novamente.');
        setErrors({
          general: ['Erro ao salvar entrada. Tente novamente.'],
        });
      }
    });
  };

  return (
    <div className='min-h-screen bg-background-secondary pt-20 pb-20 lg:pb-8'>
      <div className='flex justify-center px-4 sm:px-6 lg:px-8 lg:ml-64'>
        <div className='w-full max-w-2xl box-border'>
          <div className='text-center mb-8'>
            <h1 className='text-3xl font-bold text-foreground mb-2'>
              Adicionar Nova Entrada
            </h1>
            <p className='text-foreground'>
              Registre suas receitas e despesas para manter o controle
              financeiro
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
                label='Nome'
                value={formData.description}
                onChange={e => handleInputChange('description', e.target.value)}
                placeholder='Digite o nome da entrada'
                error={errors.description?.[0]}
                required
                disabled={isPendingSubmit}
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
                disabled={isPendingSubmit}
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
                    isPendingCategories
                      ? 'Carregando categorias...'
                      : 'Selecione a categoria'
                  }
                  error={errors.categoryId?.[0]}
                  disabled={isPendingSubmit || isPendingCategories}
                />
              )}

              <DateTimePicker
                label='Data e Hora'
                value={formData.date}
                onChange={date => handleInputChange('date', date)}
                error={errors.date?.[0]}
                required
                disabled={isPendingSubmit}
                placeholder='Selecione data e hora'
              />

              {selectedCategory?.type === 'EXPENSE' && (
                <CheckboxWithLabel
                  id='isPaid'
                  checked={formData.isPaid}
                  onCheckedChange={checked =>
                    handleInputChange('isPaid', checked as boolean)
                  }
                  disabled={isPendingSubmit}
                  label='Marcar como pago'
                />
              )}

              <CheckboxWithLabel
                id='isRecurring'
                checked={formData.isRecurring}
                onCheckedChange={checked =>
                  handleInputChange('isRecurring', checked as boolean)
                }
                disabled={isPendingSubmit}
                label='Marcar como recorrente'
              />

              <div className='flex space-x-4'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => router.push('/entries')}
                  disabled={isPendingSubmit}
                  className='flex-1 rounded-xl'
                >
                  Cancelar
                </Button>
                <Button
                  type='submit'
                  variant='primary'
                  isLoading={isPendingSubmit}
                  disabled={isPendingSubmit}
                  className='flex-1 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-250'
                >
                  {isPendingSubmit ? 'Salvando...' : 'Adicionar Entrada'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};
