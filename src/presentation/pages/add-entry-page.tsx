'use client';

import React, { useEffect, useMemo, useState, useTransition } from 'react';
import { Button, Input, Select } from '../components';
import { makeEntryFormValidator } from '@/main/factories/validation';
import { addEntryAction, loadCategoriesAction } from '../actions';
import type { CategoryWithStatsModel } from '@/domain/models';
import { typeOptions } from '@/domain/constants';

export const AddEntryPage: React.FC = () => {
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [categories, setCategories] = useState<CategoryWithStatsModel[]>([]);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: '',
    categoryId: '',
    date: new Date().toISOString().split('T')[0],
    isFixed: false,
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

  const handleInputChange = (field: string, value: string | boolean) => {
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

    const dataToValidate = {
      description: formData.description,
      amount: parseFloat(formData.amount) || 0,
      type: formData.type as 'INCOME' | 'EXPENSE',
      categoryId: formData.categoryId,
      date: new Date(formData.date),
      isFixed: formData.isFixed,
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
        amount: '',
        type: '',
        categoryId: '',
        date: new Date().toISOString().split('T')[0],
        isFixed: false,
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
    <div className='bg-slate-50 pt-20 pb-20 lg:pb-8 w-full min-h-screen'>
      <div className='flex justify-center px-4 sm:px-6 lg:px-8 lg:ml-64'>
        <div className='w-full max-w-2xl box-border'>
          <div className='text-center mb-8'>
            <h1 className='text-3xl font-bold text-slate-900 mb-2'>
              Adicionar Nova Entrada
            </h1>
            <p className='text-slate-600'>
              Registre suas receitas e despesas para manter o controle
              financeiro
            </p>
          </div>

          <div className='bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8'>
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
                onChange={e => handleInputChange('description', e.target.value)}
                placeholder='Digite a descrição da entrada'
                error={errors.description?.[0]}
                required
                disabled={isPendingSubmit}
              />

              <Input
                label='Valor (R$)'
                type='number'
                step='0.01'
                min='0'
                value={formData.amount}
                onChange={e => handleInputChange('amount', e.target.value)}
                placeholder='0,00'
                error={errors.amount?.[0]}
                required
                disabled={isPendingSubmit}
              />

              <Select
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

              <Input
                label='Data'
                type='date'
                value={formData.date}
                onChange={e => handleInputChange('date', e.target.value)}
                error={errors.date?.[0]}
                required
                disabled={isPendingSubmit}
              />

              <div className='flex items-center space-x-2'>
                <input
                  type='checkbox'
                  id='isFixed'
                  checked={formData.isFixed}
                  onChange={e => handleInputChange('isFixed', e.target.checked)}
                  className='h-4 w-4 text-cyan-400 focus:ring-cyan-400 border-slate-300 rounded'
                  disabled={isPendingSubmit}
                />
                <label
                  htmlFor='isFixed'
                  className='text-sm font-medium text-slate-700'
                >
                  Entrada fixa (recorrente mensalmente)
                </label>
              </div>

              <Button
                type='submit'
                className='w-full'
                size='lg'
                isLoading={isPendingSubmit}
                disabled={isPendingSubmit}
              >
                {isPendingSubmit ? 'Carregando...' : 'Adicionar Entrada'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
