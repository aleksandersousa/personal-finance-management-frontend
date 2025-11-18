import { Suspense } from 'react';
import { PageLoading } from '@/presentation/components';
import { LoginPage } from '@/presentation';

export default function LoginPageRoute() {
  return (
    <Suspense fallback={<PageLoading text='Carregando login...' />}>
      <LoginPage />
    </Suspense>
  );
}

export const metadata = {
  title: 'Login | Gestão Financeira',
  description: 'Faça login na sua conta para acessar o painel financeiro',
};
