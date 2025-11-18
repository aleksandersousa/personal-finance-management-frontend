'use client';

import React, { useMemo, useState, useTransition } from 'react';
import { Button, Input } from '../components';
import { makeLoginFormValidator } from '@/main/factories/validation';
import { loginAction } from '../actions';

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
    <div className='min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative'>
      <div className='sm:mx-auto sm:w-full sm:max-w-md'>
        <div className='text-center'>
          <h2 className='mt-6 text-3xl font-extrabold text-gray-900'>
            Faça login na sua conta
          </h2>
          <p className='mt-2 text-sm text-gray-600'>
            Acesse seu painel financeiro pessoal
          </p>
        </div>
      </div>

      <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
        <div className='bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10'>
          <form onSubmit={handleSubmit} className='space-y-4'>
            {errors.general && (
              <div className='bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded'>
                {errors.general[0]}
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
              className='w-full'
              isLoading={isLoading}
              disabled={isLoading}
            >
              Entrar
            </Button>

            <div className='text-center'>
              <a
                href='/register'
                className='text-sm text-blue-600 hover:text-blue-500'
              >
                Não tem conta? Cadastre-se
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
