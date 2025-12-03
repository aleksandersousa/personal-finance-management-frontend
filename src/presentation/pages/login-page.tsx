'use client';

import React, { useMemo, useState, useTransition } from 'react';
import { Button, Input } from '../components';
import { makeLoginFormValidator } from '@/main/factories/validation';
import { loginAction, resendVerificationEmailAction } from '../actions';
import {
  CurrencyCircleDollarIcon,
  XCircleIcon,
  LockIcon,
  ArrowRightIcon,
  EnvelopeIcon,
  CheckCircleIcon,
} from '@phosphor-icons/react';
import Link from 'next/link';
import { isRedirectError } from '../helpers';

export const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isEmailNotVerified, setIsEmailNotVerified] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

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
        setIsEmailNotVerified(false);
        setResendMessage(null);
      } catch (error) {
        if (isRedirectError(error)) {
          throw error;
        }

        const errorMessage =
          error instanceof Error ? error.message : String(error);
        console.log('errorMessage', errorMessage);
        const isUnverifiedError = errorMessage.includes('Email not verified');

        if (isUnverifiedError) {
          setIsEmailNotVerified(true);
          setErrors({
            general: [
              'Email não verificado. Por favor, verifique sua caixa de entrada e clique no link de verificação antes de fazer login.',
            ],
          });
        } else {
          setIsEmailNotVerified(false);
          setErrors({
            general: ['Erro ao fazer login. Verifique suas credenciais.'],
          });
        }
      }
    });
  };

  const handleResendVerification = async () => {
    if (!formData.email) return;

    setIsResending(true);
    setResendMessage(null);

    try {
      const result = await resendVerificationEmailAction(formData.email);
      setResendMessage({
        type: 'success',
        text: result.message || 'Email de verificação reenviado com sucesso!',
      });
    } catch (error) {
      console.log('error', error);
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
            <CurrencyCircleDollarIcon
              className='w-10 h-10 text-white'
              weight='bold'
            />
          </div>
          <h1 className='text-4xl font-bold text-neutral-900 mb-3'>
            Bem-vindo de volta
          </h1>
          <p className='text-base text-neutral-600 font-medium'>
            Acesse seu painel financeiro pessoal
          </p>
        </div>

        <div className='bg-white rounded-3xl shadow-xl p-8 backdrop-blur-sm border border-neutral-100'>
          <form onSubmit={handleSubmit} className='space-y-6'>
            {errors.general && (
              <div
                className={`px-5 py-4 rounded-xl flex items-start gap-3 ${
                  isEmailNotVerified
                    ? 'bg-error-100 border border-error text-error'
                    : 'bg-error-100 border border-error text-error'
                }`}
              >
                <XCircleIcon
                  className='w-5 h-5 flex-shrink-0 mt-0.5'
                  weight='fill'
                />
                <div className='flex-1'>
                  <span className='text-sm font-medium block mb-2'>
                    {errors.general[0]}
                  </span>
                  {isEmailNotVerified && (
                    <Button
                      type='button'
                      variant='danger'
                      size='sm'
                      className='mt-2'
                      onClick={handleResendVerification}
                      isLoading={isResending}
                      disabled={isResending}
                    >
                      <EnvelopeIcon className='w-4 h-4 mr-2' weight='bold' />
                      Reenviar email de verificação
                    </Button>
                  )}
                </div>
              </div>
            )}

            {resendMessage && (
              <div
                className={`px-5 py-4 rounded-xl flex items-start gap-3 ${
                  resendMessage.type === 'success'
                    ? 'bg-green-50 border border-green-200 text-green-700'
                    : 'bg-red-50 border border-red-100 text-red-700'
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

            <div className='text-center mt-4'>
              <Link
                href='/forgot-password'
                className='inline-flex items-center justify-center text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200'
              >
                Esqueceu sua senha?
              </Link>
            </div>

            <div className='relative my-6'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-neutral-200' />
              </div>
              <div className='relative flex justify-center text-sm'>
                <span className='px-4 bg-white text-neutral-500 font-medium'>
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
          <p className='text-xs text-neutral-500 font-medium flex items-center justify-center gap-2'>
            <LockIcon className='w-4 h-4' weight='bold' />
            Seus dados estão seguros e protegidos
          </p>
        </div>
      </div>
    </div>
  );
};
