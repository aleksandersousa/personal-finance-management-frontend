import { makeLoginPage } from '@/main/factories/pages';

export default function LoginPageRoute() {
  return makeLoginPage();
}

export const metadata = {
  title: 'Login | Gestão Financeira',
  description: 'Faça login na sua conta para acessar o painel financeiro',
};
