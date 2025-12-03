'use client';

import React, { useMemo, useState, useTransition } from 'react';
import { Button, Input } from '../components';
import { makeForgotPasswordFormValidatorFactory } from '@/main/factories/validation';
import { requestPasswordResetAction } from '../actions';
import {
  XCircleIcon,
  LockIcon,
  ArrowRightIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
} from '@phosphor-icons/react';
import Link from 'next/link';
import { isRedirectError } from '../helpers';

export const ForgotPasswordPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
  });
  const [isLoading, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const validator = useMemo(() => makeForgotPasswordFormValidatorFactory(), []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      email: value,
    }));

    if (errors.email) {
      setErrors(prev => ({
        ...prev,
        email: [],
      }));
    }

    if (successMessage) {
      setSuccessMessage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const dataToValidate = {
      email: formData.email,
    };

    const result = validator.validate(dataToValidate);

    if (!result.success) {
      setErrors(result.errors || {});
      return;
    }

    startTransition(async () => {
      try {
        const response = await requestPasswordResetAction(result.data!.email);
        setSuccessMessage(
          response.message ||
            'Se o email existir e estiver verificado, um link de redefinição de senha foi enviado.'
        );
        setFormData({
          email: '',
        });
        setErrors({});
      } catch (error) {
        if (isRedirectError(error)) {
          throw error;
        }

        const errorMessage =
          error instanceof Error ? error.message : String(error);
        console.error('Request password reset error:', errorMessage);

        if (errorMessage.includes('Email not verified')) {
          setErrors({
            general: [
              'Email não verificado. Por favor, verifique seu email antes de solicitar a redefinição de senha.',
            ],
          });
        } else if (errorMessage.includes('Too many')) {
          setErrors({
            general: [
              'Muitas solicitações. Por favor, aguarde antes de tentar novamente.',
            ],
          });
        } else {
          setErrors({
            general: [
              'Erro ao solicitar redefinição de senha. Tente novamente mais tarde.',
            ],
          });
        }
      }
    });
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-neutral-50 to-blue-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden'>
      <div className='absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full opacity-20 blur-3xl -translate-y-1/2 translate-x-1/2' />
      <div className='absolute bottom-0 left-0 w-96 h-96 bg-indigo-100 rounded-full opacity-20 blur-3xl translate-y-1/2 -translate-x-1/2' />

      <div className='relative z-10 w-full max-w-md mx-auto'>
        <div className='text-center mb-8'>
          <div className='inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-primary-800 rounded-3xl shadow-xl mb-6'>
            <LockIcon className='w-10 h-10 text-white' weight='bold' />
          </div>
          <h1 className='text-4xl font-bold text-neutral-900 mb-3'>
            Esqueceu sua senha?
          </h1>
          <p className='text-base text-neutral-600 font-medium'>
            Digite seu email e enviaremos um link para redefinir sua senha
          </p>
        </div>

        <div className='bg-white rounded-3xl shadow-xl p-8 backdrop-blur-sm border border-neutral-100'>
          {successMessage ? (
            <div className='space-y-6'>
              <div className='px-5 py-4 rounded-xl bg-green-50 border border-green-200 text-green-700 flex items-start gap-3'>
                <CheckCircleIcon
                  className='w-5 h-5 flex-shrink-0 mt-0.5'
                  weight='fill'
                />
                <span className='text-sm font-medium'>{successMessage}</span>
              </div>

              <div className='relative my-6'>
                <div className='absolute inset-0 flex items-center'>
                  <div className='w-full border-t border-neutral-200' />
                </div>
                <div className='relative flex justify-center text-sm'>
                  <span className='px-4 bg-white text-neutral-500 font-medium'>
                    Próximo passo
                  </span>
                </div>
              </div>

              <div className='text-center space-y-4'>
                <Link href='/login'>
                  <Button
                    type='button'
                    variant='primary'
                    size='lg'
                    className='w-full'
                  >
                    Voltar para o login
                    <ArrowRightIcon className='ml-2 w-4 h-4' weight='bold' />
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className='space-y-6'>
              {errors.general && (
                <div className='px-5 py-4 rounded-xl flex items-start gap-3 bg-error-100 border border-error text-error'>
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
                label='Email'
                type='email'
                value={formData.email}
                onChange={handleInputChange}
                error={errors.email?.[0]}
                disabled={isLoading}
                required
                placeholder='seu@email.com'
              />

              <Button
                type='submit'
                variant='primary'
                size='lg'
                className='w-full mt-8'
                isLoading={isLoading}
                disabled={isLoading}
              >
                <EnvelopeIcon className='w-5 h-5 mr-2' weight='bold' />
                Enviar link de redefinição
              </Button>

              <div className='relative my-6'>
                <div className='absolute inset-0 flex items-center'>
                  <div className='w-full border-t border-neutral-200' />
                </div>
                <div className='relative flex justify-center text-sm'>
                  <span className='px-4 bg-white text-neutral-500 font-medium'>
                    Lembrou sua senha?
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
          <p className='text-xs text-neutral-500 font-medium flex items-center justify-center gap-2'>
            <LockIcon className='w-4 h-4' weight='bold' />
            Seus dados estão seguros e protegidos
          </p>
        </div>
      </div>
    </div>
  );
};
