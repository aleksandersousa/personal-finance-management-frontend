'use client';

import React, { useState } from 'react';
import { Button, Input } from '@/presentation/components/ui';
import { FormValidator } from '@/presentation/protocols';
import { LoginFormData } from '@/infra/validation';

export interface LoginFormProps {
  validator: FormValidator<LoginFormData>;
  onSubmit: (data: LoginFormData) => Promise<void>;
  isLoading?: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  validator,
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const dataToValidate = {
      email: formData.email,
      password: formData.password,
      rememberMe: formData.rememberMe,
    };

    const result = validator.validate(dataToValidate);

    if (!result.success) {
      setErrors(result.errors || {});
      return;
    }

    try {
      await onSubmit(result.data!);
      setFormData({
        email: '',
        password: '',
        rememberMe: false,
      });
      setErrors({});
    } catch {
      setErrors({
        general: ['Erro ao fazer login. Verifique suas credenciais.'],
      });
    }
  };

  const handleInputChange =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = field === 'rememberMe' ? e.target.checked : e.target.value;
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

  return (
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

      <div className='flex items-center'>
        <input
          id='rememberMe'
          type='checkbox'
          className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
          checked={formData.rememberMe}
          disabled={isLoading}
          onChange={handleInputChange('rememberMe')}
        />
        <label
          htmlFor='rememberMe'
          className='ml-2 block text-sm text-gray-900'
        >
          Lembrar-me
        </label>
      </div>

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
  );
};
