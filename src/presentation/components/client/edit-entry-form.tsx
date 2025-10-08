'use client';

import React, { startTransition, useEffect, useState } from 'react';
import { Button, Input, Select } from '@/presentation/components/ui';
import { FormValidator } from '@/presentation/protocols';
import { EntryFormData } from '@/infra/validation';
import { EntryModel } from '@/domain/models/entry';
import type { CategoryWithStatsModel } from '@/domain/models/category';
import { loadCategoriesAction } from '@/presentation/actions/load-categories-action';
import { redirect } from 'next/navigation';

const typeOptions = [
  { value: 'INCOME', label: 'Receita' },
  { value: 'EXPENSE', label: 'Despesa' },
];

export interface EditEntryFormProps {
  entry: EntryModel;
  validator: FormValidator<EntryFormData>;
  onSubmit: (data: EntryFormData) => Promise<void>;
  isLoading?: boolean;
}

export const EditEntryForm: React.FC<EditEntryFormProps> = ({
  entry,
  validator,
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    description: entry.description,
    amount: (entry.amount / 100).toString(), // Converter de centavos para reais
    type: entry.type,
    categoryId: entry.categoryId,
    date: entry.date.toISOString().split('T')[0],
    isFixed: entry.isFixed,
  });

  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [showFixedModal, setShowFixedModal] = useState(false);
  const [pendingSubmit, setPendingSubmit] = useState<EntryFormData | null>(
    null
  );
  const [categories, setCategories] = useState<CategoryWithStatsModel[]>([]);

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

  const handleInputChange = (field: string, value: string | boolean) => {
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

    // Se a entrada era fixa e agora não é mais, ou vice-versa, mostrar modal
    if (entry.isFixed !== formData.isFixed) {
      setPendingSubmit(result.data!);
      setShowFixedModal(true);
      return;
    }

    try {
      await onSubmit(result.data!);
      setErrors({});
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({
        general: ['Erro ao atualizar entrada. Tente novamente.'],
      });
    }
  };

  const handleConfirmSubmit = async () => {
    if (pendingSubmit) {
      try {
        await onSubmit(pendingSubmit);
        setShowFixedModal(false);
        setPendingSubmit(null);
        setErrors({});
      } catch (error) {
        console.error('Error submitting form:', error);
        setErrors({
          general: ['Erro ao atualizar entrada. Tente novamente.'],
        });
        setShowFixedModal(false);
        setPendingSubmit(null);
      }
    }
  };

  const getFilteredCategories = () => {
    if (!formData.type) return categories;
    return categories.filter(category => category.type === formData.type);
  };

  const handleCancelModal = () => {
    setShowFixedModal(false);
    setPendingSubmit(null);
  };

  const categoryOptions = getFilteredCategories().map(category => ({
    value: category.id,
    label: category.name,
  }));

  return (
    <>
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
              isLoading
                ? 'Carregando categorias...'
                : formData.type
                  ? 'Selecione a categoria'
                  : 'Selecione primeiro o tipo'
            }
            error={errors.categoryId?.[0]}
            disabled={isLoading || !formData.type}
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
          <label
            htmlFor='isFixed'
            className='text-sm font-medium text-slate-700'
          >
            Entrada fixa (recorrente mensalmente)
          </label>
        </div>

        <div className='flex space-x-4'>
          <Button
            type='button'
            variant='secondary'
            onClick={() => redirect('/entries')}
            disabled={isLoading}
            className='flex-1'
            size='lg'
          >
            Cancelar
          </Button>
          <Button
            type='submit'
            isLoading={isLoading}
            disabled={isLoading}
            className='flex-1'
            size='lg'
          >
            {isLoading ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </div>
      </form>

      {/* Modal de confirmação para mudanças em entradas fixas */}
      {showFixedModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
          <div className='bg-white rounded-xl p-6 max-w-md w-full'>
            <h3 className='text-lg font-semibold text-slate-900 mb-4'>
              Confirmar Alteração
            </h3>

            <p className='text-slate-600 mb-6'>
              {entry.isFixed
                ? 'Você está alterando uma entrada fixa para variável. Isso afetará suas projeções futuras.'
                : 'Você está alterando uma entrada variável para fixa. Isso incluirá esta entrada nas projeções futuras.'}
            </p>

            <div className='flex space-x-3'>
              <Button
                onClick={handleConfirmSubmit}
                variant='primary'
                className='flex-1'
                isLoading={isLoading}
                disabled={isLoading}
              >
                Confirmar
              </Button>

              <Button
                onClick={handleCancelModal}
                variant='secondary'
                className='flex-1'
                disabled={isLoading}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
