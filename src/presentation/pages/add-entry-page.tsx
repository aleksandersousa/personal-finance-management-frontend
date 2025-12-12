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
import { typeOptions } from '@/domain/constants';
import { redirect } from 'next/navigation';
import { formatCurrencyInput, parseCurrencyInput } from '@/lib/utils';

export const AddEntryPage: React.FC = () => {
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [categories, setCategories] = useState<CategoryWithStatsModel[]>([]);
  const [formData, setFormData] = useState<{
    description: string;
    amount: string;
    type: string;
    categoryId: string;
    date: Date | undefined;
    isFixed: boolean;
    isPaid: boolean;
  }>({
    description: '',
    amount: '0,00',
    type: '',
    categoryId: '',
    date: new Date(),
    isFixed: false,
    isPaid: false,
  });

  const [isPendingSubmit, startSubmitTransition] = useTransition();
  const [isPendingCategories, startCategoriesTransition] = useTransition();

  const validator = useMemo(() => makeEntryFormValidator(), []);

  const categoryOptions = useMemo(() => {
    const mapCategories = (categories: CategoryWithStatsModel[]) => {
      return categories.map(category => ({
        value: category.id,
        label: category.name,
      }));
    };

    if (!formData.type) {
      return mapCategories(categories);
    }

    const filteredCategories = categories.filter(
      category => category.type === formData.type
    );

    return mapCategories(filteredCategories);
  }, [categories, formData.type]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const result = await loadCategoriesAction({ includeStats: false });
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
      if (field === 'type') {
        newData.categoryId = '';
      }

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
      type: formData.type as 'INCOME' | 'EXPENSE',
      categoryId: formData.categoryId,
      date: formData.date,
      isFixed: formData.isFixed,
      isPaid: formData.isPaid,
    };

    const result = validator.validate(dataToValidate);

    if (!result.success) {
      setErrors(result.errors || {});
      return;
    }

    try {
      startSubmitTransition(async () => {
        await addEntryAction({
          ...result.data!,
          categoryId: result.data!.categoryId || undefined,
        });
      });

      setFormData({
        description: '',
        amount: '0,00',
        type: '',
        categoryId: '',
        date: new Date(),
        isFixed: false,
        isPaid: false,
      });
      setErrors({});
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({
        general: ['Erro ao salvar entrada. Tente novamente.'],
      });
    }
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

              <Select
                required
                label='Tipo'
                value={formData.type}
                onValueChange={value => handleInputChange('type', value)}
                options={typeOptions}
                placeholder='Selecione o tipo'
                error={errors.type?.[0]}
                disabled={isPendingSubmit}
              />

              {categoryOptions.length > 0 && (
                <Select
                  label='Categoria'
                  value={formData.categoryId}
                  onValueChange={value =>
                    handleInputChange('categoryId', value)
                  }
                  options={categoryOptions}
                  placeholder={
                    isPendingCategories
                      ? 'Carregando categorias...'
                      : formData.type
                        ? 'Selecione a categoria'
                        : 'Selecione primeiro o tipo'
                  }
                  error={errors.categoryId?.[0]}
                  disabled={
                    isPendingSubmit || isPendingCategories || !formData.type
                  }
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

              <CheckboxWithLabel
                id='isFixed'
                checked={formData.isFixed}
                onCheckedChange={checked =>
                  handleInputChange('isFixed', checked as boolean)
                }
                disabled={isPendingSubmit}
                label='Entrada fixa (recorrente mensalmente)'
              />

              {formData.type === 'EXPENSE' && (
                <CheckboxWithLabel
                  id='isPaid'
                  checked={formData.isPaid}
                  onCheckedChange={checked =>
                    handleInputChange('isPaid', checked as boolean)
                  }
                  disabled={isPendingSubmit}
                  label='Marcado como pago'
                />
              )}

              <div className='flex space-x-4'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => redirect('/entries')}
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
