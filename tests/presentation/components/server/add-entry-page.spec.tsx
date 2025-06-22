import { render, screen } from '@testing-library/react';
import { AddEntryPage } from '@/presentation/components/server/add-entry-page';
import { mockFormValidator } from '../../mocks';
import { EntryFormData } from '@/infra/validation/entry-form-schema';

// Mock do FormValidator
const mockValidator = mockFormValidator<EntryFormData>();
const mockOnSubmit = jest.fn();

describe('AddEntryPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockValidator.validate.mockReturnValue({
      success: true,
      data: {
        description: 'Test entry',
        amount: 100.5,
        type: 'INCOME',
        categoryId: '1',
        date: new Date('2024-01-01'),
        isFixed: false,
      },
    });
  });

  it('should render page title and description', () => {
    render(<AddEntryPage validator={mockValidator} onSubmit={mockOnSubmit} />);

    expect(screen.getByText('Adicionar Nova Entrada')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Registre suas receitas e despesas para manter o controle financeiro'
      )
    ).toBeInTheDocument();
  });

  it('should render EntryFormWithFeedback component', () => {
    render(<AddEntryPage validator={mockValidator} onSubmit={mockOnSubmit} />);

    // Verificar se o formulário está presente
    expect(screen.getByLabelText('Descrição')).toBeInTheDocument();
    expect(screen.getByLabelText('Valor (R$)')).toBeInTheDocument();
    expect(screen.getByLabelText('Tipo')).toBeInTheDocument();
    expect(screen.getByLabelText('Categoria')).toBeInTheDocument();
    expect(screen.getByLabelText('Data')).toBeInTheDocument();
  });

  it('should render help tips', () => {
    render(<AddEntryPage validator={mockValidator} onSubmit={mockOnSubmit} />);

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
    render(<AddEntryPage validator={mockValidator} onSubmit={mockOnSubmit} />);

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
    render(<AddEntryPage validator={mockValidator} onSubmit={mockOnSubmit} />);

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
    render(<AddEntryPage validator={mockValidator} onSubmit={mockOnSubmit} />);

    expect(screen.getByText('Entradas fixas:')).toBeInTheDocument();
    expect(
      screen.getByText(/Marque como.*fixa.*despesas recorrentes/)
    ).toBeInTheDocument();
  });
});
