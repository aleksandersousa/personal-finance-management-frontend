'use client';

import React, { useEffect, useMemo, useState, useTransition } from 'react';
import { makeEntryFormValidator } from '@/main/factories/validation';
import type { EntryModel } from '@/domain/models/entry';
import {
  loadCategoriesAction,
  loadEntryByIdFromCache,
  updateEntryAction,
} from '../actions';
import type { EntryFormData } from '@/infra/validation';
import type { CategoryWithStatsModel } from '@/domain/models';
import {
  Button,
  Card,
  Input,
  PageLoading,
  Select,
  DatePicker,
  CheckboxWithLabel,
} from '../components';
import { redirect } from 'next/navigation';
import { typeOptions } from '@/domain/constants';

export interface EditEntryPageProps {
  entryId: string;
}

export const EditEntryPage: React.FC<EditEntryPageProps> = ({ entryId }) => {
  const [entry, setEntry] = useState<EntryModel | null>(null);
  const [formData, setFormData] = useState<{
    description: string;
    amount: string;
    type: string;
    categoryId: string;
    date: Date | undefined;
    isFixed: boolean;
  }>({
    description: '',
    amount: '',
    type: '',
    categoryId: '',
    date: undefined,
    isFixed: false,
  });
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [showFixedModal, setShowFixedModal] = useState(false);
  const [pendingSubmit, setPendingSubmit] = useState<EntryFormData | null>(
    null
  );
  const [categories, setCategories] = useState<CategoryWithStatsModel[]>([]);

  const [isPendingEntry, startEntryTransition] = useTransition();
  const [isPendingCategories, startCategoriesTransition] = useTransition();
  const [isPendingUpdate, startUpdateTransition] = useTransition();

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
    const loadEntry = async () => {
      startEntryTransition(async () => {
        const cachedEntry = await loadEntryByIdFromCache(entryId);

        if (cachedEntry) {
          setEntry(cachedEntry);
        }
      });
    };

    loadEntry();
  }, [entryId]);

  useEffect(() => {
    if (entry) {
      setFormData({
        description: entry.description,
        amount: (entry.amount / 100).toString(),
        type: entry.type,
        categoryId: entry.categoryId,
        date: new Date(entry.date),
        isFixed: entry.isFixed,
      });
    }
  }, [entry]);

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

  useEffect(() => {
    if (!entry) return;

    if (entry.categoryId && categories.length > 0) {
      handleInputChange('categoryId', entry.categoryId);
    }
  }, [categories, entry?.categoryId]);

  const handleInputChange = (
    field: string,
    value: string | boolean | Date | undefined
  ) => {
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

  const handleCancelModal = () => {
    setShowFixedModal(false);
    setPendingSubmit(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!entry || !formData.date) return;

    const dataToValidate = {
      description: formData.description,
      amount: parseFloat(formData.amount) || 0,
      type: formData.type as 'INCOME' | 'EXPENSE',
      categoryId: formData.categoryId,
      date: formData.date,
      isFixed: formData.isFixed,
    };

    const result = validator.validate(dataToValidate);

    if (!result.success) {
      setErrors(result.errors || {});
      return;
    }

    if (entry.isFixed !== formData.isFixed) {
      setPendingSubmit(result.data!);
      setShowFixedModal(true);
      return;
    }

    try {
      startUpdateTransition(async () => {
        await updateEntryAction(entryId, result.data!);
      });
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
        startUpdateTransition(async () => {
          await updateEntryAction(entryId, pendingSubmit);
        });
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

  if (isPendingEntry || isPendingCategories) {
    return <PageLoading text='Carregando dados...' />;
  }

  if (!entry) {
    return <div>Entrada não encontrada</div>;
  }

  return (
    <>
      <div className='min-h-screen bg-slate-50 pt-20 pb-20 lg:pb-8'>
        <div className='flex justify-center px-4 sm:px-6 lg:px-8 lg:ml-64'>
          <div className='w-full max-w-2xl box-border'>
            <div className='text-center mb-8'>
              <h1 className='text-3xl font-bold text-slate-900 mb-2'>
                Editar Entrada
              </h1>
              <p className='text-slate-600'>
                Atualize os dados da sua entrada financeira
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
                  label='Descrição'
                  value={formData.description}
                  onChange={e =>
                    handleInputChange('description', e.target.value)
                  }
                  placeholder='Digite a descrição da entrada'
                  error={errors.description?.[0]}
                  required
                  disabled={isPendingUpdate}
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

                {categoryOptions.length > 0 && (
                  <Select
                    label='Categoria'
                    value={formData.categoryId}
                    onValueChange={value =>
                      handleInputChange('categoryId', value)
                    }
                    options={categoryOptions}
                    placeholder={
                      isPendingUpdate
                        ? 'Carregando categorias...'
                        : formData.type
                          ? 'Selecione a categoria'
                          : 'Selecione primeiro o tipo'
                    }
                    error={errors.categoryId?.[0]}
                    disabled={isPendingUpdate || !formData.type}
                  />
                )}

                <DatePicker
                  label='Data'
                  value={formData.date}
                  onChange={date => handleInputChange('date', date)}
                  error={errors.date?.[0]}
                  required
                  disabled={isPendingUpdate}
                  placeholder='Selecione a data'
                />

                <CheckboxWithLabel
                  id='isFixed'
                  checked={formData.isFixed}
                  onCheckedChange={checked =>
                    handleInputChange('isFixed', checked as boolean)
                  }
                  disabled={isPendingUpdate}
                  label='Entrada fixa (recorrente mensalmente)'
                />

                <div className='flex space-x-4'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => redirect('/entries')}
                    disabled={isPendingUpdate}
                    className='flex-1 rounded-xl border-slate-200 bg-white hover:bg-slate-50 font-semibold text-slate-700 hover:text-slate-700 transition-all duration-250'
                  >
                    Cancelar
                  </Button>
                  <Button
                    type='submit'
                    isLoading={isPendingUpdate}
                    disabled={isPendingUpdate}
                    className='flex-1 rounded-xl bg-slate-900 hover:bg-black text-white font-semibold shadow-md hover:shadow-lg transition-all duration-250'
                  >
                    {isPendingUpdate ? 'Salvando...' : 'Salvar Alterações'}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </div>

      {showFixedModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
          <div className='bg-white rounded-xl p-6 max-w-md w-full'>
            <h3 className='text-lg font-semibold text-slate-900 mb-4'>
              Confirmar Alteração
            </h3>

            <p className='text-slate-600 mb-6'>
              {entry?.isFixed
                ? 'Você está alterando uma entrada fixa para variável. Isso afetará suas projeções futuras.'
                : 'Você está alterando uma entrada variável para fixa. Isso incluirá esta entrada nas projeções futuras.'}
            </p>

            <div className='flex space-x-3'>
              <Button
                onClick={handleConfirmSubmit}
                variant='primary'
                className='flex-1'
                isLoading={isPendingUpdate}
                disabled={isPendingUpdate}
              >
                Confirmar
              </Button>

              <Button
                onClick={handleCancelModal}
                variant='secondary'
                className='flex-1'
                disabled={isPendingUpdate}
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
