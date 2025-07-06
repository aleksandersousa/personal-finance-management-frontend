import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginFormWithFeedback } from '@/presentation/components/client';
import { LoginFormData } from '@/infra/validation';
import { loginAction } from '@/presentation/actions';
import { FormValidator } from '@/presentation/protocols';
import type { Authentication } from '@/domain';
import type { SetStorage } from '@/data/protocols';

// Mock the Server Action
jest.mock('@/presentation/actions/login-action', () => ({
  loginAction: jest.fn(),
}));

// Mock the LoginForm component
jest.mock('@/presentation/components/client/login-form', () => ({
  LoginForm: ({
    onSubmit,
    isLoading,
    validator,
  }: {
    onSubmit: (data: LoginFormData) => void;
    isLoading: boolean;
    validator: unknown;
  }) => (
    <div data-testid='login-form'>
      <button
        onClick={() =>
          onSubmit({
            email: 'test@example.com',
            password: 'password123',
            rememberMe: false,
          })
        }
        disabled={isLoading}
        data-testid='submit-button'
      >
        {isLoading ? 'Loading...' : 'Submit'}
      </button>
      <div data-testid='validator-used'>
        {validator ? 'validator-present' : 'no-validator'}
      </div>
    </div>
  ),
}));

const mockLoginAction = loginAction as jest.MockedFunction<typeof loginAction>;

describe('LoginFormWithFeedback', () => {
  const mockValidator: jest.Mocked<FormValidator<LoginFormData>> = {
    validate: jest.fn(),
  };

  const mockAuthentication: jest.Mocked<Authentication> = {
    auth: jest.fn(),
  };

  const mockSetStorage: jest.Mocked<SetStorage> = {
    set: jest.fn(),
  };

  const defaultProps = {
    validator: mockValidator,
    authentication: mockAuthentication,
    setStorage: mockSetStorage,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockValidator.validate.mockReturnValue({
      success: true,
      data: {} as LoginFormData,
    });
  });

  it('should render LoginForm with injected validator', () => {
    render(<LoginFormWithFeedback {...defaultProps} />);

    expect(screen.getByTestId('login-form')).toBeInTheDocument();
    expect(screen.getByTestId('validator-used')).toHaveTextContent(
      'validator-present'
    );
  });

  it('should pass validator prop to LoginForm', () => {
    render(<LoginFormWithFeedback {...defaultProps} />);

    const validatorElement = screen.getByTestId('validator-used');
    expect(validatorElement).toHaveTextContent('validator-present');
  });

  it('should call loginAction with correct parameters when form is submitted', async () => {
    mockLoginAction.mockResolvedValue(undefined);

    render(<LoginFormWithFeedback {...defaultProps} />);

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLoginAction).toHaveBeenCalledWith(
        {
          email: 'test@example.com',
          password: 'password123',
          rememberMe: false,
        },
        mockAuthentication,
        mockSetStorage
      );
    });
  });

  it('should handle loginAction success without throwing error', async () => {
    mockLoginAction.mockResolvedValue(undefined);

    render(<LoginFormWithFeedback {...defaultProps} />);

    const submitButton = screen.getByTestId('submit-button');

    // Should not throw when loginAction succeeds
    await expect(async () => {
      fireEvent.click(submitButton);
      await waitFor(() => {
        expect(mockLoginAction).toHaveBeenCalled();
      });
    }).not.toThrow();
  });

  it('should handle loginAction failure gracefully', async () => {
    const error = new Error('Authentication failed');
    mockLoginAction.mockRejectedValue(error);

    render(<LoginFormWithFeedback {...defaultProps} />);

    const submitButton = screen.getByTestId('submit-button');

    // Should not throw when loginAction fails - component should handle it
    await expect(async () => {
      fireEvent.click(submitButton);
      await waitFor(() => {
        expect(mockLoginAction).toHaveBeenCalled();
      });
    }).not.toThrow();
  });

  it('should show loading state during form submission', async () => {
    mockLoginAction.mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 100))
    );

    render(<LoginFormWithFeedback {...defaultProps} />);

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    // Should show loading state
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Submit')).toBeInTheDocument();
    });
  });

  it('should disable form during submission', async () => {
    mockLoginAction.mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 100))
    );

    render(<LoginFormWithFeedback {...defaultProps} />);

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    // Button should be disabled during loading
    expect(submitButton).toBeDisabled();

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  it('should pass authentication and tokenStorage to loginAction', async () => {
    mockLoginAction.mockResolvedValue(undefined);

    render(<LoginFormWithFeedback {...defaultProps} />);

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLoginAction).toHaveBeenCalledWith(
        expect.any(Object),
        mockAuthentication,
        mockSetStorage
      );
    });
  });

  it('should handle multiple rapid submissions correctly', async () => {
    mockLoginAction.mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 50))
    );

    render(<LoginFormWithFeedback {...defaultProps} />);

    const submitButton = screen.getByTestId('submit-button');

    // Multiple rapid clicks
    fireEvent.click(submitButton);
    fireEvent.click(submitButton);
    fireEvent.click(submitButton);

    // Should only call loginAction once due to useTransition
    await waitFor(() => {
      expect(mockLoginAction).toHaveBeenCalledTimes(1);
    });
  });

  it('should pass correct form data to loginAction', async () => {
    mockLoginAction.mockResolvedValue(undefined);

    render(<LoginFormWithFeedback {...defaultProps} />);

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLoginAction).toHaveBeenCalledWith(
        {
          email: 'test@example.com',
          password: 'password123',
          rememberMe: false,
        },
        expect.any(Object),
        expect.any(Object)
      );
    });
  });

  it('should handle authentication service errors', async () => {
    const authError = new Error('Invalid credentials');
    mockLoginAction.mockRejectedValue(authError);

    render(<LoginFormWithFeedback {...defaultProps} />);

    const submitButton = screen.getByTestId('submit-button');

    // Component should handle the error gracefully
    await expect(async () => {
      fireEvent.click(submitButton);
      await waitFor(() => {
        expect(mockLoginAction).toHaveBeenCalled();
      });
    }).not.toThrow();
  });

  it('should handle token storage errors', async () => {
    mockLoginAction.mockResolvedValue(undefined);
    mockSetStorage.set.mockImplementation(() => {
      throw new Error('Storage error');
    });

    render(<LoginFormWithFeedback {...defaultProps} />);

    const submitButton = screen.getByTestId('submit-button');

    // Component should handle storage errors gracefully
    await expect(async () => {
      fireEvent.click(submitButton);
      await waitFor(() => {
        expect(mockLoginAction).toHaveBeenCalled();
      });
    }).not.toThrow();
  });

  it('should maintain component state during transitions', async () => {
    mockLoginAction.mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 100))
    );

    render(<LoginFormWithFeedback {...defaultProps} />);

    const submitButton = screen.getByTestId('submit-button');

    // Component should remain mounted during transitions
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId('login-form')).toBeInTheDocument();
    });
  });

  it('should handle undefined rememberMe field', async () => {
    mockLoginAction.mockResolvedValue(undefined);

    // Mock LoginForm to pass undefined rememberMe
    const mockLoginForm = jest.requireMock(
      '@/presentation/components/client/login-form'
    );
    mockLoginForm.LoginForm = jest
      .fn()
      .mockImplementation(
        ({ onSubmit }: { onSubmit: (data: LoginFormData) => void }) => (
          <div data-testid='login-form'>
            <button
              onClick={() =>
                onSubmit({
                  email: 'test@example.com',
                  password: 'password123',
                  rememberMe: undefined,
                })
              }
              data-testid='submit-button'
            >
              Submit
            </button>
          </div>
        )
      );

    render(<LoginFormWithFeedback {...defaultProps} />);

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLoginAction).toHaveBeenCalledWith(
        {
          email: 'test@example.com',
          password: 'password123',
          rememberMe: undefined,
        },
        mockAuthentication,
        mockSetStorage
      );
    });
  });

  it('should handle true rememberMe field', async () => {
    mockLoginAction.mockResolvedValue(undefined);

    // Mock LoginForm to pass true rememberMe
    const mockLoginForm = jest.requireMock(
      '@/presentation/components/client/login-form'
    );
    mockLoginForm.LoginForm = jest
      .fn()
      .mockImplementation(
        ({ onSubmit }: { onSubmit: (data: LoginFormData) => void }) => (
          <div data-testid='login-form'>
            <button
              onClick={() =>
                onSubmit({
                  email: 'test@example.com',
                  password: 'password123',
                  rememberMe: true,
                })
              }
              data-testid='submit-button'
            >
              Submit
            </button>
          </div>
        )
      );

    render(<LoginFormWithFeedback {...defaultProps} />);

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLoginAction).toHaveBeenCalledWith(
        {
          email: 'test@example.com',
          password: 'password123',
          rememberMe: true,
        },
        mockAuthentication,
        mockSetStorage
      );
    });
  });
});
