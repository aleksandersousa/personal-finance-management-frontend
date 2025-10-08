import { Button } from '@/presentation/components/ui/button';

export default function Home() {
  return (
    <div className='min-h-screen bg-slate-50 flex flex-col items-center justify-center pt-20 pb-8'>
      <div className='max-w-4xl mx-auto text-center'>
        <h1 className='text-4xl font-bold text-slate-900 mb-4'>
          Sistema de Gerenciamento Financeiro Pessoal
        </h1>
        <p className='text-lg text-slate-600 mb-8'>
          Controle suas finanças pessoais com facilidade e precisão
        </p>

        <div className='bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8'>
          <h2 className='text-2xl font-semibold text-slate-800 mb-6'>
            🚀 Funcionalidades Disponíveis
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6'>
            {/* Dashboard */}
            <div className='bg-gradient-to-r from-cyan-50 to-cyan-100 border border-cyan-200 rounded-lg p-4'>
              <div className='flex items-center justify-center w-12 h-12 bg-cyan-400 rounded-lg mx-auto mb-3'>
                <svg
                  className='w-6 h-6 text-white'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                  />
                </svg>
              </div>
              <h3 className='font-semibold text-slate-900 mb-2'>Dashboard</h3>
              <p className='text-sm text-slate-600'>
                Resumo completo das suas finanças
              </p>
            </div>

            {/* Entradas */}
            <div className='bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-4'>
              <div className='flex items-center justify-center w-12 h-12 bg-green-400 rounded-lg mx-auto mb-3'>
                <svg
                  className='w-6 h-6 text-white'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
                  />
                </svg>
              </div>
              <h3 className='font-semibold text-slate-900 mb-2'>
                Gerenciar Entradas
              </h3>
              <p className='text-sm text-slate-600'>
                Adicione, edite e exclua suas transações
              </p>
            </div>

            {/* Categorias */}
            <div className='bg-gradient-to-r from-pink-50 to-pink-100 border border-pink-200 rounded-lg p-4'>
              <div className='flex items-center justify-center w-12 h-12 bg-pink-400 rounded-lg mx-auto mb-3'>
                <svg
                  className='w-6 h-6 text-white'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z'
                  />
                </svg>
              </div>
              <h3 className='font-semibold text-slate-900 mb-2'>
                Análise por Categoria
              </h3>
              <p className='text-sm text-slate-600'>
                Veja onde você gasta mais
              </p>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-left'>
            <div className='space-y-2'>
              <h3 className='font-medium text-slate-700'>
                ✅ Funcionalidades Implementadas
              </h3>
              <ul className='text-sm text-slate-600 space-y-1'>
                <li>• Dashboard com resumo financeiro</li>
                <li>• Adicionar novas entradas</li>
                <li>• Editar entradas existentes</li>
                <li>• Excluir entradas (com confirmação)</li>
                <li>• Visualizar lista de entradas</li>
                <li>• Comparativos mensais</li>
                <li>• Breakdown por categorias</li>
              </ul>
            </div>
            <div className='space-y-2'>
              <h3 className='font-medium text-slate-700'>🏗️ Arquitetura</h3>
              <ul className='text-sm text-slate-600 space-y-1'>
                <li>• Clean Architecture</li>
                <li>• TypeScript 100%</li>
                <li>• Server Components + Actions</li>
                <li>• Design System completo</li>
                <li>• Injeção de dependência</li>
                <li>• Testabilidade garantida</li>
              </ul>
            </div>
          </div>
        </div>

        <div className='flex gap-4 justify-center flex-wrap'>
          <a href='/dashboard'>
            <Button variant='primary' size='lg'>
              📊 Ver Dashboard
            </Button>
          </a>
          <a href='/entries'>
            <Button variant='secondary' size='lg'>
              📝 Gerenciar Entradas
            </Button>
          </a>
          <a href='/entries/add'>
            <Button variant='primary' size='lg'>
              ➕ Nova Entrada
            </Button>
          </a>
        </div>

        <div className='mt-8 text-sm text-slate-500'>
          <p>Sistema completo de gestão financeira pessoal! 💰</p>
        </div>
      </div>
    </div>
  );
}
