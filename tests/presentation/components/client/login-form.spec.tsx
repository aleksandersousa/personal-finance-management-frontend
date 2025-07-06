import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm, LoginFormProps } from '@/presentation/components/client';
import { FormValidator, ValidationResult } from '@/presentation/protocols';
import { LoginFormData } from '@/infra/validation/login-form-schema';

// Mock do FormValidator
const mockValidator: jest.Mocked<FormValidator<LoginFormData>> = {
  validate: jest.fn(),
};

// Mock do onSubmit
const mockOnSubmit = jest.fn();

const defaultProps: LoginFormProps = {
  validator: mockValidator,
  onSubmit: mockOnSubmit,
  isLoading: false,
};

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render form fields correctly', () => {
    render(<LoginForm {...defaultProps} />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/lembrar-me/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
    expect(
      screen.getByText(/não tem conta\? cadastre-se/i)
    ).toBeInTheDocument();
  });

  it('should update form data when typing', async () => {
    render(<LoginForm {...defaultProps} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/senha/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('should toggle rememberMe checkbox', () => {
    render(<LoginForm {...defaultProps} />);

    const checkbox = screen.getByLabelText(/lembrar-me/i);

    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);

    expect(checkbox).toBeChecked();
  });

  it('should call onSubmit with valid data', async () => {
    const validationResult: ValidationResult<LoginFormData> = {
      success: true,
      data: {
        email: 'test@example.com',
        password: 'password123',
        rememberMe: false,
      },
    };

    mockValidator.validate.mockReturnValue(validationResult);
    mockOnSubmit.mockResolvedValue(undefined);

    render(<LoginForm {...defaultProps} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/senha/i);
    const submitButton = screen.getByRole('button', { name: /entrar/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockValidator.validate).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        rememberMe: false,
      });
    });

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        rememberMe: false,
      });
    });
  });

  it('should display validation errors with valid input', async () => {
    const validationResult: ValidationResult<LoginFormData> = {
      success: false,
      errors: {
        email: ['Email inválido'],
        password: ['Senha muito fraca'],
      },
    };

    mockValidator.validate.mockReturnValue(validationResult);

    render(<LoginForm {...defaultProps} />);

    // Preencher campos com dados válidos para HTML5 mas inválidos para nossa validação
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/senha/i);
    fireEvent.change(emailInput, { target: { value: 'invalid@email' } });
    fireEvent.change(passwordInput, { target: { value: 'weak123456' } });

    const submitButton = screen.getByRole('button', { name: /entrar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Email inválido')).toBeInTheDocument();
      expect(screen.getByText('Senha muito fraca')).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should display general error when submit fails', async () => {
    const validationResult: ValidationResult<LoginFormData> = {
      success: true,
      data: {
        email: 'test@example.com',
        password: 'password123',
        rememberMe: false,
      },
    };

    mockValidator.validate.mockReturnValue(validationResult);
    mockOnSubmit.mockRejectedValue(new Error('Network error'));

    render(<LoginForm {...defaultProps} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/senha/i);
    const submitButton = screen.getByRole('button', { name: /entrar/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText('Erro ao fazer login. Verifique suas credenciais.')
      ).toBeInTheDocument();
    });
  });

  it('should disable form when loading', () => {
    render(<LoginForm {...defaultProps} isLoading />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/senha/i);
    const checkbox = screen.getByLabelText(/lembrar-me/i);
    const submitButton = screen.getByRole('button', { name: /carregando.../i });

    expect(emailInput).toBeDisabled();
    expect(passwordInput).toBeDisabled();
    expect(checkbox).toBeDisabled();
    expect(submitButton).toBeDisabled();
  });

  it('should clear errors when user starts typing', async () => {
    const validationResult: ValidationResult<LoginFormData> = {
      success: false,
      errors: {
        email: ['Email inválido'],
      },
    };

    mockValidator.validate.mockReturnValue(validationResult);

    render(<LoginForm {...defaultProps} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/senha/i);
    const submitButton = screen.getByRole('button', { name: /entrar/i });

    // Preencher campos primeiro
    fireEvent.change(emailInput, { target: { value: 'invalid@email' } });
    fireEvent.change(passwordInput, { target: { value: 'weak123456' } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Email inválido')).toBeInTheDocument();
    });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    await waitFor(() => {
      expect(screen.queryByText('Email inválido')).not.toBeInTheDocument();
    });
  });

  it('should use default isLoading value when not provided', () => {
    const propsWithoutLoading = {
      validator: mockValidator,
      onSubmit: mockOnSubmit,
    };

    render(<LoginForm {...propsWithoutLoading} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/senha/i);
    const checkbox = screen.getByLabelText(/lembrar-me/i);
    const submitButton = screen.getByRole('button', { name: /entrar/i });

    // Form should not be disabled when isLoading is not provided (defaults to false)
    expect(emailInput).not.toBeDisabled();
    expect(passwordInput).not.toBeDisabled();
    expect(checkbox).not.toBeDisabled();
    expect(submitButton).not.toBeDisabled();
  });

  it('should handle validation errors when result.errors is undefined', async () => {
    const validationResult: ValidationResult<LoginFormData> = {
      success: false,
      errors: undefined,
    };

    mockValidator.validate.mockReturnValue(validationResult);

    render(<LoginForm {...defaultProps} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/senha/i);
    const submitButton = screen.getByRole('button', { name: /entrar/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockValidator.validate).toHaveBeenCalled();
    });

    // Should not call onSubmit when validation fails
    expect(mockOnSubmit).not.toHaveBeenCalled();

    // Should not display any error messages since errors is undefined
    expect(screen.queryByText(/email inválido/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/senha muito fraca/i)).not.toBeInTheDocument();
  });
});
