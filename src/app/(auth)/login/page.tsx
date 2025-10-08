import { Suspense } from 'react';
import { makeLoginPage } from '@/main/factories/pages';
import { PageLoading } from '@/presentation/components';

export default function LoginPageRoute() {
  return (
    <Suspense fallback={<PageLoading text='Carregando login...' />}>
      {makeLoginPage()}
    </Suspense>
  );
}

export const metadata = {
  title: 'Login | Gestão Financeira',
  description: 'Faça login na sua conta para acessar o painel financeiro',
};
