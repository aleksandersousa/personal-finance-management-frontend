import { render, screen } from '@testing-library/react';
import { LoginPage } from '@/presentation/pages';

// Mock the factory
jest.mock(
  '@/main/factories/components/login-form-with-feedback-factory',
  () => ({
    LoginFormWithFeedbackFactory: jest.fn(() => (
      <div data-testid='login-form-with-feedback'>
        <input aria-label='Email' type='email' />
        <input aria-label='Senha' type='password' />
        <input aria-label='Lembrar-me' type='checkbox' />
        <button type='submit'>Entrar</button>
      </div>
    )),
  })
);

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render page title and description', () => {
    render(<LoginPage />);

    expect(screen.getByText('Faça login na sua conta')).toBeInTheDocument();
    expect(
      screen.getByText('Acesse seu painel financeiro pessoal')
    ).toBeInTheDocument();
  });

  it('should render LoginFormWithFeedback component', () => {
    render(<LoginPage />);

    // Verificar se o formulário está presente
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Senha')).toBeInTheDocument();
    expect(screen.getByLabelText('Lembrar-me')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument();
  });

  it('should render factory-created form component', () => {
    render(<LoginPage />);

    // Verificar se o componente criado pelo factory está presente
    expect(screen.getByTestId('login-form-with-feedback')).toBeInTheDocument();
  });

  it('should have proper layout and styling', () => {
    render(<LoginPage />);

    // Verificar se tem o layout correto - buscar pelo container principal
    const mainContainer = screen
      .getByText('Faça login na sua conta')
      .closest('div')?.parentElement?.parentElement;
    expect(mainContainer).toHaveClass('min-h-screen', 'bg-gray-50');

    // Verificar se o card do formulário tem as classes corretas
    const formCard = screen.getByLabelText('Email').closest('.bg-white');
    expect(formCard).toHaveClass(
      'bg-white',
      'py-8',
      'px-4',
      'shadow',
      'sm:rounded-lg',
      'sm:px-10'
    );
  });

  it('should have correct responsive classes', () => {
    render(<LoginPage />);

    // Verificar classes responsivas no container do título
    const titleContainer = screen
      .getByText('Faça login na sua conta')
      .closest('div')?.parentElement;
    expect(titleContainer).toHaveClass(
      'sm:mx-auto',
      'sm:w-full',
      'sm:max-w-md'
    );

    // Verificar classes responsivas no container do formulário
    const formContainer = screen
      .getByTestId('login-form-with-feedback')
      .closest('.bg-white')?.parentElement;
    expect(formContainer).toHaveClass('sm:mx-auto', 'sm:w-full', 'sm:max-w-md');
  });

  it('should have correct heading hierarchy', () => {
    render(<LoginPage />);

    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('Faça login na sua conta');
    expect(heading).toHaveClass('text-3xl', 'font-extrabold', 'text-gray-900');
  });

  it('should have correct text styling', () => {
    render(<LoginPage />);

    const subtitle = screen.getByText('Acesse seu painel financeiro pessoal');
    expect(subtitle).toHaveClass('text-sm', 'text-gray-600');
  });
});
