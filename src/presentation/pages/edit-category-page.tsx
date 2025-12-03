'use client';

import React, { useEffect, useMemo, useState, useTransition } from 'react';
import { makeCategoryFormValidator } from '@/main/factories/validation';
import { loadCategoriesAction, updateCategoryAction } from '../actions';
import { Button, Card, Input, Select, PageLoading } from '../components';
import { typeOptions } from '@/domain/constants';
import { redirect } from 'next/navigation';

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

    console.log('aqui');

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
    return <PageLoading text='Carregando categorias...' />;
  }

  return (
    <div className='min-h-screen bg-background-secondary pt-20 pb-20 lg:pb-8'>
      <div className='flex justify-center px-4 sm:px-6 lg:px-8 lg:ml-64'>
        <div className='w-full max-w-2xl box-border'>
          <div className='text-center mb-8'>
            <h1 className='text-3xl font-bold text-foreground mb-2'>
              Editar Categoria
            </h1>
            <p className='text-foreground'>
              Atualize os dados da sua categoria
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
                required
                label='Tipo'
                value={formData.type}
                onValueChange={value => handleInputChange('type', value)}
                options={typeOptions}
                placeholder='Selecione o tipo'
                error={errors.type?.[0]}
                disabled={isPendingUpdate}
              />

              <div>
                <label className='text-sm text-foreground'>Cor</label>
                <div className='flex items-center gap-3'>
                  <input
                    type='color'
                    value={formData.color}
                    onChange={e =>
                      handleInputChange('color', e.target.value.toUpperCase())
                    }
                    className='h-10 w-10 rounded border border-border-foreground'
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

              <div className='flex space-x-4'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => redirect('/categories')}
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
  );
};
