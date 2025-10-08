'use client';

import React, { useState, useEffect } from 'react';
import { Button, Input, Select } from '@/presentation/components/ui';
import { FormValidator } from '@/presentation/protocols';
import { CategoryFormData } from '@/infra/validation';
import { loadCategoriesAction } from '@/presentation/actions';

const typeOptions = [
  { value: 'INCOME', label: 'Receita' },
  { value: 'EXPENSE', label: 'Despesa' },
];

// Removed predefined color options in favor of a color picker

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

export interface EditCategoryFormProps {
  categoryId: string;
  validator: FormValidator<CategoryFormData>;
  onSubmit: (data: CategoryFormData) => Promise<void>;
  isLoading?: boolean;
}

export const EditCategoryForm: React.FC<EditCategoryFormProps> = ({
  categoryId,
  validator,
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
    color: '#3B82F6',
  });

  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategory = async () => {
      try {
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
      } catch (error) {
        console.error('Error loading category:', error);
        setErrors({
          general: ['Erro ao carregar categoria. Tente novamente.'],
        });
      } finally {
        setLoading(false);
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
      await onSubmit(validation.data!);
    } catch (error) {
      console.error('Form submission error:', error);
      setErrors({
        general: ['Erro ao salvar categoria. Tente novamente.'],
      });
    }
  };

  if (loading) {
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
        disabled={isLoading}
      />

      <Input
        label='Descrição'
        value={formData.description}
        onChange={e => handleInputChange('description', e.target.value)}
        placeholder='Digite uma descrição (opcional)'
        error={errors.description?.[0]}
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
        required
      />

      <div>
        <label className='text-sm font-medium text-foreground'>Cor</label>
        <div className='flex items-center gap-3'>
          <input
            type='color'
            value={formData.color}
            onChange={e =>
              handleInputChange('color', e.target.value.toUpperCase())
            }
            className='h-10 w-10 rounded border border-gray-300'
            disabled={isLoading}
            aria-label='Selecionar cor'
          />
          <Input
            value={formData.color}
            onChange={e => {
              const raw = e.target.value.replace(/[^0-9a-fA-F#]/g, '');
              const withoutHash = raw.startsWith('#') ? raw.slice(1) : raw;
              const trimmed = withoutHash.slice(0, 6);
              const hex = `#${trimmed}`;
              handleInputChange('color', hex.toUpperCase());
            }}
            placeholder='#000000'
            error={errors.color?.[0]}
            disabled={isLoading}
          />
        </div>
      </div>

      <div className='flex justify-end space-x-3 pt-4'>
        <Button
          type='button'
          variant='outline'
          onClick={() => window.history.back()}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button type='submit' disabled={isLoading}>
          {isLoading ? 'Salvando...' : 'Salvar'}
        </Button>
      </div>
    </form>
  );
};
