'use client';

import React, { useEffect, useState, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button, Input } from '../components';
import { verifyEmailAction, resendVerificationEmailAction } from '../actions';
import Link from 'next/link';
import {
  CheckCircleIcon,
  XCircleIcon,
  EnvelopeIcon,
  ArrowRightIcon,
  CircleNotchIcon,
} from '@phosphor-icons/react';

export const VerifyEmailPage: React.FC = () => {
  const searchParams = useSearchParams();
  const [isVerifying, startVerification] = useTransition();
  const [verificationResult, setVerificationResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [resendEmail, setResendEmail] = useState<string>('');
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setVerificationResult({
        success: false,
        message: 'Token de verificação não fornecido.',
      });
      return;
    }

    startVerification(async () => {
      try {
        const result = await verifyEmailAction(token);
        setVerificationResult({
          success: result.success,
          message: result.message,
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        setVerificationResult({
          success: false,
          message:
            errorMessage ||
            'Erro ao verificar email. O token pode estar expirado ou inválido.',
        });
      }
    });
  }, [searchParams]);

  const handleResendVerification = async () => {
    if (!resendEmail || !resendEmail.includes('@')) {
      setResendMessage({
        type: 'error',
        text: 'Por favor, insira um email válido.',
      });
      return;
    }

    setIsResending(true);
    setResendMessage(null);

    try {
      const result = await resendVerificationEmailAction(resendEmail);
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
          <div
            className={`inline-flex items-center justify-center w-20 h-20 rounded-3xl shadow-xl mb-6 ${
              verificationResult?.success
                ? 'bg-green-100'
                : verificationResult?.success === false
                  ? 'bg-red-100'
                  : 'bg-blue-100'
            }`}
          >
            {isVerifying ? (
              <CircleNotchIcon className='w-10 h-10 text-blue-600 animate-spin' />
            ) : verificationResult?.success ? (
              <CheckCircleIcon
                className='w-10 h-10 text-green-600'
                weight='fill'
              />
            ) : verificationResult?.success === false ? (
              <XCircleIcon className='w-10 h-10 text-red-600' weight='fill' />
            ) : (
              <EnvelopeIcon className='w-10 h-10 text-blue-600' weight='fill' />
            )}
          </div>
          <h1 className='text-4xl font-bold text-neutral-900 mb-3'>
            {isVerifying
              ? 'Verificando email...'
              : verificationResult?.success
                ? 'Email verificado!'
                : 'Verificação falhou'}
          </h1>
          <p className='text-base text-neutral-600 font-medium'>
            {isVerifying
              ? 'Aguarde enquanto verificamos seu email'
              : verificationResult?.success
                ? 'Sua conta foi verificada com sucesso'
                : 'Não foi possível verificar seu email'}
          </p>
        </div>

        <div className='bg-background rounded-3xl shadow-xl p-8 backdrop-blur-sm border border-border-foreground'>
          <div className='space-y-6'>
            {isVerifying ? (
              <div className='text-center py-8'>
                <p className='text-neutral-600'>
                  Por favor, aguarde enquanto verificamos seu token...
                </p>
              </div>
            ) : verificationResult ? (
              <>
                <div
                  className={`px-5 py-4 rounded-xl ${
                    verificationResult.success
                      ? 'bg-green-50 border border-green-200 text-green-700'
                      : 'bg-red-50 border border-red-100 text-red-700'
                  }`}
                >
                  <p className='text-sm font-medium'>
                    {verificationResult.message}
                  </p>
                </div>

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

                {!verificationResult.success && (
                  <div className='space-y-4'>
                    <p className='text-sm text-neutral-600 text-center'>
                      Se você não recebeu o email ou o link expirou, você pode
                      solicitar um novo email de verificação.
                    </p>
                    <Input
                      label='Email'
                      type='email'
                      value={resendEmail}
                      onChange={e => setResendEmail(e.target.value)}
                      placeholder='seu@email.com'
                      disabled={isResending}
                      required
                    />
                    <Button
                      type='button'
                      variant='secondary'
                      size='lg'
                      className='w-full'
                      onClick={handleResendVerification}
                      isLoading={isResending}
                      disabled={isResending || !resendEmail}
                    >
                      <EnvelopeIcon className='w-5 h-5 mr-2' weight='bold' />
                      Reenviar email de verificação
                    </Button>
                  </div>
                )}

                <div className='relative my-6'>
                  <div className='absolute inset-0 flex items-center'>
                    <div className='w-full border-t border-gray-200' />
                  </div>
                  <div className='relative flex justify-center text-sm'>
                    <span className='px-4 bg-background-secondary text-neutral-500 font-medium'>
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
                      {verificationResult.success
                        ? 'Ir para o login'
                        : 'Voltar para o login'}
                      <ArrowRightIcon className='ml-2 w-4 h-4' weight='bold' />
                    </Button>
                  </Link>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
