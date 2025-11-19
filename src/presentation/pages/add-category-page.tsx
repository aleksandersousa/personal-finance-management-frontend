'use client';

import React, { useMemo, useTransition, useState } from 'react';
import { makeCategoryFormValidator } from '@/main/factories/validation';
import { addCategoryAction } from '../actions';
import { Button, Input, Select } from '../components';
import { typeOptions } from '@/domain/constants';

const colorOptions = [
  { value: '#3B82F6', label: 'Azul' },
  { value: '#10B981', label: 'Verde' },
  { value: '#F59E0B', label: 'Amarelo' },
  { value: '#EF4444', label: 'Vermelho' },
  { value: '#8B5CF6', label: 'Roxo' },
  { value: '#F97316', label: 'Laranja' },
  { value: '#06B6D4', label: 'Ciano' },
  { value: '#84CC16', label: 'Lima' },
  { value: '#EC4899', label: 'Rosa' },
  { value: '#6B7280', label: 'Cinza' },
];

const iconOptions = [
  { value: '💰', label: '💰 Dinheiro' },
  { value: '🛒', label: '🛒 Compras' },
  { value: '🍕', label: '🍕 Alimentação' },
  { value: '⛽', label: '⛽ Combustível' },
  { value: '🏠', label: '🏠 Casa' },
  { value: '🚗', label: '🚗 Transporte' },
  { value: '💊', label: '💊 Saúde' },
  { value: '🎓', label: '🎓 Educação' },
  { value: '🎮', label: '🎮 Entretenimento' },
  { value: '💼', label: '💼 Trabalho' },
  { value: '💳', label: '💳 Cartão' },
  { value: '📱', label: '📱 Tecnologia' },
  { value: '👕', label: '👕 Roupas' },
  { value: '✈️', label: '✈️ Viagem' },
  { value: '🎁', label: '🎁 Presente' },
  { value: '💡', label: '💡 Outros' },
];

export const AddCategoryPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
    color: '#3B82F6',
    icon: '💰',
  });
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const [isPending, startTransition] = useTransition();

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
      startTransition(async () => {
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

  return (
    <div className='bg-slate-50 pt-20 pb-20 lg:pb-8 w-full min-h-screen'>
      <div className='flex justify-center px-4 sm:px-6 lg:px-8 lg:ml-64'>
        <div className='w-full max-w-2xl box-border'>
          <div className='text-center mb-8'>
            <h1 className='text-3xl font-bold text-slate-900 mb-2'>
              Adicionar Nova Categoria
            </h1>
            <p className='text-slate-600'>
              Crie categorias para organizar suas receitas e despesas
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
                label='Nome'
                value={formData.name}
                onChange={e => handleInputChange('name', e.target.value)}
                placeholder='Digite o nome da categoria'
                error={errors.name?.[0]}
                required
                disabled={isPending}
              />

              <Input
                label='Descrição'
                value={formData.description}
                onChange={e => handleInputChange('description', e.target.value)}
                placeholder='Digite uma descrição (opcional)'
                error={errors.description?.[0]}
                disabled={isPending}
              />

              <Select
                label='Tipo'
                value={formData.type}
                onValueChange={value => handleInputChange('type', value)}
                options={typeOptions}
                placeholder='Selecione o tipo'
                error={errors.type?.[0]}
                disabled={isPending}
                required
              />

              <div className='space-y-2'>
                <label className='text-sm font-medium text-foreground'>
                  Cor
                </label>
                <div className='grid grid-cols-5 gap-2'>
                  {colorOptions.map(color => (
                    <button
                      key={color.value}
                      type='button'
                      onClick={() => handleInputChange('color', color.value)}
                      className={`w-10 h-10 rounded-lg border-2 transition-all ${
                        formData.color === color.value
                          ? 'border-foreground ring-2 ring-primary'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.label}
                      disabled={isPending}
                    />
                  ))}
                </div>
                {errors.color?.[0] && (
                  <p className='text-sm text-red-600'>{errors.color[0]}</p>
                )}
              </div>

              <div className='space-y-2'>
                <label className='text-sm font-medium text-foreground'>
                  Ícone
                </label>
                <div className='grid grid-cols-8 gap-2'>
                  {iconOptions.map(icon => (
                    <button
                      key={icon.value}
                      type='button'
                      onClick={() => handleInputChange('icon', icon.value)}
                      className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center text-lg transition-all ${
                        formData.icon === icon.value
                          ? 'border-foreground ring-2 ring-primary'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      title={icon.label}
                      disabled={isPending}
                    >
                      {icon.value}
                    </button>
                  ))}
                </div>
                {errors.icon?.[0] && (
                  <p className='text-sm text-red-600'>{errors.icon[0]}</p>
                )}
              </div>

              <div className='flex justify-end space-x-3 pt-4'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => window.history.back()}
                  disabled={isPending}
                >
                  Cancelar
                </Button>
                <Button type='submit' disabled={isPending}>
                  {isPending ? 'Salvando...' : 'Salvar'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
