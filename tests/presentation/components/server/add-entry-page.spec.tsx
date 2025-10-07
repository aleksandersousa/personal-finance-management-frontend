import { render, screen } from '@testing-library/react';
import { AddEntryPage } from '@/presentation/pages';

// Mock the middleware to avoid Request not defined error
jest.mock('@/main/config/middleware', () => ({
  middleware: jest.fn(),
}));

// Mock the factory
jest.mock(
  '@/main/factories/components/entry-form-with-feedback-factory',
  () => ({
    EntryFormWithFeedbackFactory: jest.fn(() => (
      <div data-testid='entry-form-with-feedback'>
        <input aria-label='Descrição' />
        <input aria-label='Valor (R$)' />
        <select aria-label='Tipo' />
        <select aria-label='Categoria' />
        <input aria-label='Data' />
      </div>
    )),
  })
);

describe('AddEntryPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render page title and description', () => {
    render(<AddEntryPage />);

    expect(screen.getByText('Adicionar Nova Entrada')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Registre suas receitas e despesas para manter o controle financeiro'
      )
    ).toBeInTheDocument();
  });

  it('should render EntryFormWithFeedback component', () => {
    render(<AddEntryPage />);

    // Verificar se o formulário está presente
    expect(screen.getByLabelText('Descrição')).toBeInTheDocument();
    expect(screen.getByLabelText('Valor (R$)')).toBeInTheDocument();
    expect(screen.getByLabelText('Tipo')).toBeInTheDocument();
    expect(screen.getByLabelText('Categoria')).toBeInTheDocument();
    expect(screen.getByLabelText('Data')).toBeInTheDocument();
  });

  it('should render factory-created form component', () => {
    render(<AddEntryPage />);

    // Verificar se o componente criado pelo factory está presente
    expect(screen.getByTestId('entry-form-with-feedback')).toBeInTheDocument();
  });

  it('should render help tips', () => {
    render(<AddEntryPage />);

    expect(
      screen.getByText('💡 Dicas para categorizar suas entradas')
    ).toBeInTheDocument();
    expect(screen.getByText('Receitas')).toBeInTheDocument();
    expect(screen.getByText('Despesas')).toBeInTheDocument();
    expect(
      screen.getByText('• Salário: renda mensal fixa')
    ).toBeInTheDocument();
    expect(
      screen.getByText('• Alimentação: mercado, restaurantes')
    ).toBeInTheDocument();
  });

  it('should have proper layout and styling', () => {
    render(<AddEntryPage />);

    // Verificar se tem o layout correto - buscar pelo container principal
    const mainContainer = screen
      .getByText('Adicionar Nova Entrada')
      .closest('div')?.parentElement?.parentElement;
    expect(mainContainer).toHaveClass('min-h-screen', 'bg-slate-50');

    // Verificar se o card do formulário tem as classes corretas
    const formCard = screen.getByLabelText('Descrição').closest('.bg-white');
    expect(formCard).toHaveClass(
      'bg-white',
      'rounded-xl',
      'shadow-sm',
      'border',
      'border-slate-200'
    );
  });

  it('should render quick action links', () => {
    render(<AddEntryPage />);

    expect(screen.getByText('📋 Ver Todas as Entradas')).toBeInTheDocument();
    expect(screen.getByText('📈 Ver Resumo Mensal')).toBeInTheDocument();

    // Verificar se os links têm os hrefs corretos
    const entriesLink = screen
      .getByText('📋 Ver Todas as Entradas')
      .closest('a');
    const summaryLink = screen.getByText('📈 Ver Resumo Mensal').closest('a');

    expect(entriesLink).toHaveAttribute('href', '/entries');
    expect(summaryLink).toHaveAttribute('href', '/summary');
  });

  it('should render fixed entries explanation', () => {
    render(<AddEntryPage />);

    expect(screen.getByText('Entradas fixas:')).toBeInTheDocument();
    expect(
      screen.getByText(/Marque como.*fixa.*despesas recorrentes/)
    ).toBeInTheDocument();
  });
});
