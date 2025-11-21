import { Suspense } from 'react';
import { PageLoading } from '@/presentation/components';
import { RegistrationPage } from '@/presentation/pages';

export default function RegisterPageRoute() {
  return (
    <Suspense fallback={<PageLoading text='Carregando cadastro...' />}>
      <RegistrationPage />
    </Suspense>
  );
}

export const metadata = {
  title: 'Criar Conta | Gestão Financeira',
  description: 'Crie sua conta para começar a gerenciar suas finanças',
};
