'use client';

import React, { useMemo, useTransition, useState } from 'react';
import { makeCategoryFormValidator } from '@/main/factories/validation';
import { addCategoryAction } from '../actions';
import { Button, Card, Input, PageLoading, Select } from '../components';
import { typeOptions } from '@/domain/constants';
import { redirect } from 'next/navigation';

export const AddCategoryPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
    color: '#3B82F6',
    icon: '💰',
  });
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const [isPendingCategory, startCategoryTransition] = useTransition();
  const [isPendingAdd, startAddTransition] = useTransition();

  const validator = useMemo(() => makeCategoryFormValidator(), []);

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
      startAddTransition(async () => {
        await addCategoryAction(validation.data!);
      });

      setFormData({
        name: '',
        description: '',
        type: '',
        color: '#3B82F6',
        icon: '💰',
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
              Adicionar Nova Categoria
            </h1>
            <p className='text-foreground'>
              Crie categorias para organizar suas receitas e despesas
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
                disabled={isPendingAdd}
              />

              <Input
                label='Descrição'
                value={formData.description}
                onChange={e => handleInputChange('description', e.target.value)}
                placeholder='Digite uma descrição (opcional)'
                error={errors.description?.[0]}
                disabled={isPendingAdd}
              />

              <Select
                required
                label='Tipo'
                value={formData.type}
                onValueChange={value => handleInputChange('type', value)}
                options={typeOptions}
                placeholder='Selecione o tipo'
                error={errors.type?.[0]}
                disabled={isPendingAdd}
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
                    disabled={isPendingAdd}
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
                    disabled={isPendingAdd}
                  />
                </div>
              </div>

              <div className='flex space-x-4'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => redirect('/categories')}
                  disabled={isPendingAdd}
                  className='flex-1 rounded-xl'
                >
                  Cancelar
                </Button>
                <Button
                  type='submit'
                  variant='primary'
                  isLoading={isPendingAdd}
                  disabled={isPendingAdd}
                  className='flex-1 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-250'
                >
                  {isPendingAdd ? 'Salvando...' : 'Adicionar Categoria'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};
