'use client';

import React, { useState, useTransition } from 'react';
import { Button, Input } from '@/presentation/components/ui';
import { FormValidator } from '@/presentation/protocols';
import { LoginFormData } from '@/infra/validation';
import { loginAction } from '@/presentation/actions';

export interface LoginFormProps {
  validator: FormValidator<LoginFormData>;
}

export const LoginForm: React.FC<LoginFormProps> = ({ validator }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string[]>>({});

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
