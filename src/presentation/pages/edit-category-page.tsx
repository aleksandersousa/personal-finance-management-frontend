'use client';

import React, { useEffect, useMemo, useState, useTransition } from 'react';
import { makeCategoryFormValidator } from '@/main/factories/validation';
import { loadCategoriesAction, updateCategoryAction } from '../actions';
import { Button, Input, Select } from '../components';
import { typeOptions } from '@/domain/constants';

export interface EditCategoryPageProps {
  categoryId: string;
}

export const EditCategoryPage: React.FC<EditCategoryPageProps> = ({
  categoryId,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
    color: '#3B82F6',
  });
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const [isPendingCategory, startCategoryTransition] = useTransition();
  const [isPendingUpdate, startUpdateTransition] = useTransition();

  const validator = useMemo(() => makeCategoryFormValidator(), []);

  useEffect(() => {
    const loadCategory = async () => {
      try {
        startCategoryTransition(async () => {
          const result = await loadCategoriesAction({ includeStats: false });
          const category = result.data.find(cat => cat.id === categoryId);

          if (category) {
            setFormData({
              name: category.name,
              description: category.description || '',
              type: category.type,
              color: category.color,
            });
          }
        });
      } catch (error) {
        console.error('Error loading category:', error);
        setErrors({
          general: ['Erro ao carregar categoria. Tente novamente.'],
        });
      }
    };

    loadCategory();
  }, [categoryId]);

  const handleInputChange = (field: string, value: string) => {
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

    const validation = validator.validate(formData);

    if (!validation.success) {
      setErrors(validation.errors || {});
      return;
    }

    try {
      startUpdateTransition(async () => {
        await updateCategoryAction(categoryId, validation.data!);
      });
    } catch (error) {
      console.error('Form submission error:', error);
      setErrors({
        general: ['Erro ao salvar categoria. Tente novamente.'],
      });
    }
  };

  if (isPendingCategory) {
    return (
      <div className='flex items-center justify-center py-8'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4'></div>
          <p className='text-muted-foreground'>Carregando categoria...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-slate-50 pt-20 pb-20 lg:pb-8'>
      <div className='flex justify-center px-4 sm:px-6 lg:px-8 lg:ml-64'>
        <div className='w-full max-w-2xl box-border'>
          <div className='text-center mb-8'>
            <h1 className='text-3xl font-bold text-slate-900 mb-2'>
              Editar Categoria
            </h1>
            <p className='text-slate-600'>Atualize os dados da sua categoria</p>
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
                label='Nome'
                value={formData.name}
                onChange={e => handleInputChange('name', e.target.value)}
                placeholder='Digite o nome da categoria'
                error={errors.name?.[0]}
                required
                disabled={isPendingUpdate}
              />

              <Input
                label='Descrição'
                value={formData.description}
                onChange={e => handleInputChange('description', e.target.value)}
                placeholder='Digite uma descrição (opcional)'
                error={errors.description?.[0]}
                disabled={isPendingUpdate}
              />

              <Select
                label='Tipo'
                value={formData.type}
                onValueChange={value => handleInputChange('type', value)}
                options={typeOptions}
                placeholder='Selecione o tipo'
                error={errors.type?.[0]}
                disabled={isPendingUpdate}
                required
              />

              <div>
                <label className='text-sm font-medium text-foreground'>
                  Cor
                </label>
                <div className='flex items-center gap-3'>
                  <input
                    type='color'
                    value={formData.color}
                    onChange={e =>
                      handleInputChange('color', e.target.value.toUpperCase())
                    }
                    className='h-10 w-10 rounded border border-gray-300'
                    disabled={isPendingUpdate}
                    aria-label='Selecionar cor'
                  />
                  <Input
                    value={formData.color}
                    onChange={e => {
                      const raw = e.target.value.replace(/[^0-9a-fA-F#]/g, '');
                      const withoutHash = raw.startsWith('#')
                        ? raw.slice(1)
                        : raw;
                      const trimmed = withoutHash.slice(0, 6);
                      const hex = `#${trimmed}`;
                      handleInputChange('color', hex.toUpperCase());
                    }}
                    placeholder='#000000'
                    error={errors.color?.[0]}
                    disabled={isPendingUpdate}
                  />
                </div>
              </div>

              <div className='flex justify-end space-x-3 pt-4'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => window.history.back()}
                  disabled={isPendingUpdate}
                >
                  Cancelar
                </Button>
                <Button type='submit' disabled={isPendingUpdate}>
                  {isPendingUpdate ? 'Salvando...' : 'Salvar'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
