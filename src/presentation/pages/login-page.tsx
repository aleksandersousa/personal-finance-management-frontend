'use client';

import React, { useMemo, useState, useTransition } from 'react';
import { Button, Input } from '../components';
import { makeLoginFormValidator } from '@/main/factories/validation';
import { loginAction } from '../actions';
import {
  CurrencyCircleDollarIcon,
  XCircleIcon,
  LockIcon,
  ArrowRightIcon,
} from '@phosphor-icons/react';
import Link from 'next/link';

export const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const validator = useMemo(() => makeLoginFormValidator(), []);

  const handleInputChange =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
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
      email: formData.email,
      password: formData.password,
    };

    const result = validator.validate(dataToValidate);

    if (!result.success) {
      setErrors(result.errors || {});
      return;
    }

    startTransition(async () => {
      try {
        await loginAction(result.data!);
        setFormData({
          email: '',
          password: '',
        });
        setErrors({});
      } catch {
        setErrors({
          general: ['Erro ao fazer login. Verifique suas credenciais.'],
        });
      }
    });
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden'>
      <div className='absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full opacity-20 blur-3xl -translate-y-1/2 translate-x-1/2' />
      <div className='absolute bottom-0 left-0 w-96 h-96 bg-indigo-100 rounded-full opacity-20 blur-3xl translate-y-1/2 -translate-x-1/2' />

      <div className='relative z-10 w-full max-w-md mx-auto'>
        <div className='text-center mb-8'>
          <div className='inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl shadow-xl mb-6'>
            <CurrencyCircleDollarIcon
              className='w-10 h-10 text-white'
              weight='bold'
            />
          </div>
          <h1 className='text-4xl font-bold text-gray-900 mb-3'>
            Bem-vindo de volta
          </h1>
          <p className='text-base text-gray-600 font-medium'>
            Acesse seu painel financeiro pessoal
          </p>
        </div>

        <div className='bg-white rounded-3xl shadow-xl p-8 backdrop-blur-sm border border-gray-100'>
          <form onSubmit={handleSubmit} className='space-y-6'>
            {errors.general && (
              <div className='bg-red-50 border border-red-100 text-red-700 px-5 py-4 rounded-xl flex items-start gap-3'>
                <XCircleIcon
                  className='w-5 h-5 flex-shrink-0 mt-0.5'
                  weight='fill'
                />
                <span className='text-sm font-medium'>{errors.general[0]}</span>
              </div>
            )}

            <Input
              label='Email'
              type='email'
              value={formData.email}
              onChange={handleInputChange('email')}
              error={errors.email?.[0]}
              disabled={isLoading}
              required
            />

            <Input
              label='Senha'
              type='password'
              value={formData.password}
              onChange={handleInputChange('password')}
              error={errors.password?.[0]}
              disabled={isLoading}
              required
            />

            <Button
              type='submit'
              variant='primary'
              size='lg'
              className='w-full mt-8'
              isLoading={isLoading}
              disabled={isLoading}
            >
              Entrar
            </Button>

            <div className='relative my-6'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-gray-200' />
              </div>
              <div className='relative flex justify-center text-sm'>
                <span className='px-4 bg-white text-gray-500 font-medium'>
                  Novo por aqui?
                </span>
              </div>
            </div>

            <div className='text-center'>
              <Link
                href='/register'
                className='inline-flex items-center justify-center text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200'
              >
                Criar uma conta gratuita
                <ArrowRightIcon className='ml-2 w-4 h-4' weight='bold' />
              </Link>
            </div>
          </form>
        </div>

        <div className='mt-8 text-center'>
          <p className='text-xs text-gray-500 font-medium flex items-center justify-center gap-2'>
            <LockIcon className='w-4 h-4' weight='bold' />
            Seus dados estão seguros e protegidos
          </p>
        </div>
      </div>
    </div>
  );
};
