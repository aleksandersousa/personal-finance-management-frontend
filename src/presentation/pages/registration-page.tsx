'use client';

import React, { useMemo, useState, useTransition } from 'react';
import { Button, Input } from '../components';
import { makeRegistrationFormValidator } from '@/main/factories/validation';
import { registrationAction, resendVerificationEmailAction } from '../actions';
import Link from 'next/link';
import {
  UserCirclePlusIcon,
  XCircleIcon,
  ArrowLeftIcon,
  LockIcon,
  CheckCircleIcon,
  EnvelopeIcon,
} from '@phosphor-icons/react';
import { isRedirectError } from '../helpers';

export const RegistrationPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [isLoading, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const validator = useMemo(() => makeRegistrationFormValidator(), []);

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
      name: formData.name,
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
        const registrationResult = await registrationAction(result.data!);
        setRegistrationSuccess(true);
        setUserEmail(result.data!.email);
        setFormData({
          name: '',
          email: '',
          password: '',
        });
        setErrors({});
      } catch (error) {
        if (isRedirectError(error)) {
          throw error;
        }

        setErrors({
          general: ['Erro ao criar conta. Tente novamente.'],
        });
      }
    });
  };

  const handleResendVerification = async () => {
    if (!userEmail) return;

    setIsResending(true);
    setResendMessage(null);

    try {
      const result = await resendVerificationEmailAction(userEmail);
      setResendMessage({
        type: 'success',
        text: result.message || 'Email de verificação reenviado com sucesso!',
      });
    } catch (error) {
      setResendMessage({
        type: 'error',
        text: 'Erro ao reenviar email de verificação. Tente novamente.',
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-neutral-50 to-blue-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden'>
      <div className='absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full opacity-20 blur-3xl -translate-y-1/2 translate-x-1/2' />
      <div className='absolute bottom-0 left-0 w-96 h-96 bg-indigo-100 rounded-full opacity-20 blur-3xl translate-y-1/2 -translate-x-1/2' />

      <div className='relative z-10 w-full max-w-md mx-auto'>
        <div className='text-center mb-8'>
          <div className='inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-primary-800 rounded-3xl shadow-xl mb-6'>
            <UserCirclePlusIcon
              className='w-10 h-10 text-white'
              weight='bold'
            />
          </div>
          <h1 className='text-4xl font-bold text-neutral-900 mb-3'>
            Crie sua conta
          </h1>
          <p className='text-base text-neutral-600 font-medium'>
            Comece a gerenciar suas finanças hoje mesmo
          </p>
        </div>

        <div className='bg-background rounded-3xl shadow-xl p-8 backdrop-blur-sm border border-border-foreground'>
          {registrationSuccess ? (
            <div className='space-y-6'>
              <div className='text-center'>
                <div className='inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4'>
                  <CheckCircleIcon
                    className='w-8 h-8 text-green-600'
                    weight='fill'
                  />
                </div>
                <h2 className='text-2xl font-bold text-neutral-900 mb-2'>
                  Conta criada com sucesso!
                </h2>
                <p className='text-base text-neutral-600 mb-6'>
                  Enviamos um email de verificação para{' '}
                  <span className='font-semibold'>{userEmail}</span>. Por favor,
                  verifique sua caixa de entrada e clique no link para ativar
                  sua conta.
                </p>
              </div>

              {resendMessage && (
                <div
                  className={`px-5 py-4 rounded-xl flex items-start gap-3 ${
                    resendMessage.type === 'success'
                      ? 'bg-green-50 border border-green-200 text-green-700'
                      : 'bg-error-100 border border-error text-error'
                  }`}
                >
                  {resendMessage.type === 'success' ? (
                    <CheckCircleIcon
                      className='w-5 h-5 flex-shrink-0 mt-0.5'
                      weight='fill'
                    />
                  ) : (
                    <XCircleIcon
                      className='w-5 h-5 flex-shrink-0 mt-0.5'
                      weight='fill'
                    />
                  )}
                  <span className='text-sm font-medium'>
                    {resendMessage.text}
                  </span>
                </div>
              )}

              <Button
                type='button'
                variant='secondary'
                size='lg'
                className='w-full'
                onClick={handleResendVerification}
                isLoading={isResending}
                disabled={isResending}
              >
                <EnvelopeIcon className='w-5 h-5 mr-2' weight='bold' />
                Reenviar email de verificação
              </Button>

              <div className='relative my-6'>
                <div className='absolute inset-0 flex items-center'>
                  <div className='w-full border-t border-gray-200' />
                </div>
                <div className='relative flex justify-center text-sm'>
                  <span className='px-4 bg-background-secondary text-neutral-500 font-medium'>
                    Já verificou seu email?
                  </span>
                </div>
              </div>

              <div className='text-center'>
                <Link
                  href='/login'
                  className='inline-flex items-center justify-center text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200'
                >
                  <ArrowLeftIcon className='mr-2 w-4 h-4' weight='bold' />
                  Ir para o login
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className='space-y-6'>
              {errors.general && (
                <div className='bg-error-100 border border-error text-error px-5 py-4 rounded-xl flex items-start gap-3'>
                  <XCircleIcon
                    className='w-5 h-5 flex-shrink-0 mt-0.5'
                    weight='fill'
                  />
                  <span className='text-sm font-medium'>
                    {errors.general[0]}
                  </span>
                </div>
              )}

              <Input
                label='Nome completo'
                type='text'
                value={formData.name}
                onChange={handleInputChange('name')}
                error={errors.name?.[0]}
                disabled={isLoading}
                required
              />

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

              <div className='text-xs text-gray-500 mt-2'>
                A senha deve ter pelo menos 8 caracteres
              </div>

              <Button
                type='submit'
                variant='primary'
                size='lg'
                className='w-full mt-8'
                isLoading={isLoading}
                disabled={isLoading}
              >
                Criar conta
              </Button>

              <div className='relative my-6'>
                <div className='absolute inset-0 flex items-center'>
                  <div className='w-full border-t border-gray-200' />
                </div>
                <div className='relative flex justify-center text-sm'>
                  <span className='px-4 bg-background-secondary text-neutral-500 font-medium'>
                    Já tem uma conta?
                  </span>
                </div>
              </div>

              <div className='text-center'>
                <Link
                  href='/login'
                  className='inline-flex items-center justify-center text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200'
                >
                  <ArrowLeftIcon className='mr-2 w-4 h-4' weight='bold' />
                  Voltar para o login
                </Link>
              </div>
            </form>
          )}
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
