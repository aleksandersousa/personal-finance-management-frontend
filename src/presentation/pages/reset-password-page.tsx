'use client';

import React, { useEffect, useMemo, useState, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button, Input } from '../components';
import { makeResetPasswordFormValidatorFactory } from '@/main/factories/validation';
import { resetPasswordAction } from '../actions';
import Link from 'next/link';
import {
  CheckCircleIcon,
  XCircleIcon,
  LockIcon,
  ArrowRightIcon,
  CircleNotchIcon,
  ArrowLeftIcon,
} from '@phosphor-icons/react';
import { isRedirectError } from '../helpers';

export const ResetPasswordPage: React.FC = () => {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    newPassword: '',
  });
  const [isLoading, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [hasTokenError, setHasTokenError] = useState(false);

  const validator = useMemo(() => makeResetPasswordFormValidatorFactory(), []);

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (!tokenParam) {
      setHasTokenError(true);
      setErrors({
        general: ['Token de redefinição não fornecido.'],
      });
    } else {
      setToken(tokenParam);
    }
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      newPassword: value,
    }));

    if (errors.newPassword) {
      setErrors(prev => ({
        ...prev,
        newPassword: [],
      }));
    }

    if (errors.general) {
      setErrors(prev => ({
        ...prev,
        general: [],
      }));
    }

    if (successMessage) {
      setSuccessMessage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setErrors({
        general: ['Token de redefinição não fornecido.'],
      });
      return;
    }

    const dataToValidate = {
      token,
      newPassword: formData.newPassword,
    };

    const result = validator.validate(dataToValidate);

    if (!result.success) {
      setErrors(result.errors || {});
      return;
    }

    startTransition(async () => {
      try {
        const response = await resetPasswordAction(
          result.data!.token,
          result.data!.newPassword
        );
        setSuccessMessage(response.message || 'Senha redefinida com sucesso!');
        setFormData({
          newPassword: '',
        });
        setErrors({});
      } catch (error) {
        if (isRedirectError(error)) {
          throw error;
        }

        const errorMessage =
          error instanceof Error ? error.message : String(error);
        console.error('Reset password error:', errorMessage);

        if (
          errorMessage.includes('Invalid') ||
          errorMessage.includes('expired') ||
          errorMessage.includes('already been used')
        ) {
          setHasTokenError(true);
          setErrors({
            general: [
              'Token inválido ou expirado. Por favor, solicite um novo link de redefinição de senha.',
            ],
          });
        } else if (errorMessage.includes('at least 6 characters')) {
          setErrors({
            newPassword: ['Senha deve ter pelo menos 6 caracteres'],
          });
        } else {
          setErrors({
            general: [
              'Erro ao redefinir senha. Tente novamente ou solicite um novo link.',
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
          <div
            className={`inline-flex items-center justify-center w-20 h-20 rounded-3xl shadow-xl mb-6 ${
              successMessage
                ? 'bg-green-100'
                : hasTokenError
                  ? 'bg-red-100'
                  : 'bg-blue-100'
            }`}
          >
            {isLoading ? (
              <CircleNotchIcon className='w-10 h-10 text-blue-600 animate-spin' />
            ) : successMessage ? (
              <CheckCircleIcon
                className='w-10 h-10 text-green-600'
                weight='fill'
              />
            ) : hasTokenError ? (
              <XCircleIcon className='w-10 h-10 text-red-600' weight='fill' />
            ) : (
              <LockIcon className='w-10 h-10 text-blue-600' weight='fill' />
            )}
          </div>
          <h1 className='text-4xl font-bold text-neutral-900 mb-3'>
            {successMessage
              ? 'Senha redefinida!'
              : hasTokenError
                ? 'Token inválido'
                : 'Redefinir senha'}
          </h1>
          <p className='text-base text-neutral-600 font-medium'>
            {successMessage
              ? 'Sua senha foi redefinida com sucesso'
              : hasTokenError
                ? 'O token de redefinição é inválido ou expirado'
                : 'Digite sua nova senha'}
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

              <div className='text-center'>
                <Link href='/login'>
                  <Button
                    type='button'
                    variant='primary'
                    size='lg'
                    className='w-full'
                  >
                    Ir para o login
                    <ArrowRightIcon className='ml-2 w-4 h-4' weight='bold' />
                  </Button>
                </Link>
              </div>
            </div>
          ) : hasTokenError ? (
            <div className='space-y-6'>
              <div className='px-5 py-4 rounded-xl bg-red-50 border border-red-100 text-red-700 flex items-start gap-3'>
                <XCircleIcon
                  className='w-5 h-5 flex-shrink-0 mt-0.5'
                  weight='fill'
                />
                <span className='text-sm font-medium'>
                  {errors.general?.[0] ||
                    'Token inválido ou expirado. Por favor, solicite um novo link de redefinição de senha.'}
                </span>
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
                <Link href='/forgot-password'>
                  <Button
                    type='button'
                    variant='primary'
                    size='lg'
                    className='w-full'
                  >
                    Solicitar novo link
                    <ArrowRightIcon className='ml-2 w-4 h-4' weight='bold' />
                  </Button>
                </Link>
                <Link href='/login'>
                  <Button
                    type='button'
                    variant='outline'
                    size='lg'
                    className='w-full mt-4'
                  >
                    <ArrowLeftIcon className='mr-2 w-4 h-4' weight='bold' />
                    Voltar para o login
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
                label='Nova senha'
                type='password'
                value={formData.newPassword}
                onChange={handleInputChange}
                error={errors.newPassword?.[0]}
                disabled={isLoading}
                required
                placeholder='Mínimo 8 caracteres'
              />

              <Button
                type='submit'
                variant='primary'
                size='lg'
                className='w-full mt-8'
                isLoading={isLoading}
                disabled={isLoading || !token}
              >
                <LockIcon className='w-5 h-5 mr-2' weight='bold' />
                Redefinir senha
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
