import { Button } from '@/presentation/components/ui/button';

export default function Home() {
  return (
    <div className='min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8'>
      <div className='max-w-4xl mx-auto text-center'>
        <h1 className='text-4xl font-bold text-gray-900 mb-4'>
          Sistema de Gerenciamento Financeiro Pessoal
        </h1>
        <p className='text-lg text-gray-600 mb-8'>
          Boilerplate Next.js 15 com Clean Architecture, TailwindCSS e
          TypeScript
        </p>

        <div className='bg-white rounded-lg shadow-md p-6 mb-8'>
          <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
            ✅ Configurações Implementadas
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-left'>
            <div className='space-y-2'>
              <h3 className='font-medium text-gray-700'>Frontend</h3>
              <ul className='text-sm text-gray-600 space-y-1'>
                <li>• Next.js 15 com App Router</li>
                <li>• TypeScript configurado</li>
                <li>• TailwindCSS para estilização</li>
                <li>• Clean Architecture estruturada</li>
                <li>• Path aliases configurados</li>
              </ul>
            </div>
            <div className='space-y-2'>
              <h3 className='font-medium text-gray-700'>Desenvolvimento</h3>
              <ul className='text-sm text-gray-600 space-y-1'>
                <li>• Jest + Testing Library</li>
                <li>• Cypress para E2E</li>
                <li>• ESLint + Prettier</li>
                <li>• Husky + lint-staged</li>
                <li>• Docker configurado</li>
              </ul>
            </div>
            <div className='space-y-2'>
              <h3 className='font-medium text-gray-700'>CI/CD</h3>
              <ul className='text-sm text-gray-600 space-y-1'>
                <li>• GitHub Actions workflows</li>
                <li>• Deploy automatizado Vercel</li>
                <li>• Security audit</li>
                <li>• Testes automatizados</li>
                <li>• Notificações Slack</li>
              </ul>
            </div>
            <div className='space-y-2'>
              <h3 className='font-medium text-gray-700'>Arquitetura</h3>
              <ul className='text-sm text-gray-600 space-y-1'>
                <li>• Domain models</li>
                <li>• Use cases interfaces</li>
                <li>• Clean separation</li>
                <li>• Dependency injection</li>
                <li>• Component library</li>
              </ul>
            </div>
          </div>
        </div>

        <div className='flex gap-4 justify-center'>
          <Button variant='primary' size='lg'>
            Começar Desenvolvimento
          </Button>
          <Button variant='secondary' size='lg'>
            Ver Documentação
          </Button>
        </div>

        <div className='mt-8 text-sm text-gray-500'>
          <p>Pronto para implementar as funcionalidades do MVP! 🚀</p>
        </div>
      </div>
    </div>
  );
}
