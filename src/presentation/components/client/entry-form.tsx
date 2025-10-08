'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { Button, Input, Select } from '@/presentation/components/ui';
import { FormValidator } from '@/presentation/protocols';
import { EntryFormData } from '@/infra/validation';
import { loadCategoriesAction } from '@/presentation/actions';
import { CategoryWithStatsModel } from '@/domain/models/category';

const typeOptions = [
  { value: 'INCOME', label: 'Receita' },
  { value: 'EXPENSE', label: 'Despesa' },
];

export interface EntryFormProps {
  validator: FormValidator<EntryFormData>;
  onSubmit: (data: EntryFormData) => Promise<void>;
  isLoading?: boolean;
}

export const EntryForm: React.FC<EntryFormProps> = ({
  validator,
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: '',
    categoryId: '',
    date: new Date().toISOString().split('T')[0],
    isFixed: false,
  });

  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [categories, setCategories] = useState<CategoryWithStatsModel[]>([]);
  const [isPending, startTransition] = useTransition();

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

    startTransition(() => {
      loadCategories();
    });
  }, []);

  const getFilteredCategories = () => {
    if (!formData.type) return categories;
    return categories.filter(category => category.type === formData.type);
  };

  const categoryOptions = getFilteredCategories().map(category => ({
    value: category.id,
    label: category.name,
  }));

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
      await onSubmit(result.data!);
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
        disabled={isLoading}
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
        disabled={isLoading}
      />

      <Select
        label='Tipo'
        value={formData.type}
        onValueChange={value => handleInputChange('type', value)}
        options={typeOptions}
        placeholder='Selecione o tipo'
        error={errors.type?.[0]}
        disabled={isLoading}
      />

      {categoryOptions.length > 0 && (
        <Select
          label='Categoria'
          value={formData.categoryId}
          onValueChange={value => handleInputChange('categoryId', value)}
          options={categoryOptions}
          placeholder={
            isPending
              ? 'Carregando categorias...'
              : formData.type
                ? 'Selecione a categoria'
                : 'Selecione primeiro o tipo'
          }
          error={errors.categoryId?.[0]}
          disabled={isLoading || isPending || !formData.type}
        />
      )}

      <Input
        label='Data'
        type='date'
        value={formData.date}
        onChange={e => handleInputChange('date', e.target.value)}
        error={errors.date?.[0]}
        required
        disabled={isLoading}
      />

      <div className='flex items-center space-x-2'>
        <input
          type='checkbox'
          id='isFixed'
          checked={formData.isFixed}
          onChange={e => handleInputChange('isFixed', e.target.checked)}
          className='h-4 w-4 text-cyan-400 focus:ring-cyan-400 border-slate-300 rounded'
          disabled={isLoading}
        />
        <label htmlFor='isFixed' className='text-sm font-medium text-slate-700'>
          Entrada fixa (recorrente mensalmente)
        </label>
      </div>

      <Button
        type='submit'
        className='w-full'
        size='lg'
        isLoading={isLoading}
        disabled={isLoading}
      >
        {isLoading ? 'Carregando...' : 'Adicionar Entrada'}
      </Button>
    </form>
  );
};
