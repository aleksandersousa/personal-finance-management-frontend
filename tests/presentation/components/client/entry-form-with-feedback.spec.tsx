import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EntryFormWithFeedback } from '@/presentation/components/client/entry-form-with-feedback';
import { mockFormValidator } from '../../../presentation/mocks/form-validator-mock';
import { EntryFormData } from '@/infra/validation/entry-form-schema';

// Mock the EntryForm component
jest.mock('@/presentation/components/client/entry-form', () => ({
  EntryForm: ({
    onSubmit,
    isLoading,
    validator,
  }: {
    onSubmit: (data: EntryFormData) => void;
    isLoading: boolean;
    validator: unknown;
  }) => (
    <div data-testid='entry-form'>
      <button
        onClick={() =>
          onSubmit({
            description: 'Test entry',
            amount: 100,
            type: 'INCOME' as const,
            categoryId: 'cat-1',
            date: new Date(),
            isFixed: false,
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

describe('EntryFormWithFeedback', () => {
  const mockValidator = mockFormValidator<EntryFormData>();
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockValidator.validate.mockReturnValue({
      success: true,
      data: {} as EntryFormData,
    });
  });

  it('should render EntryForm component', () => {
    render(
      <EntryFormWithFeedback
        validator={mockValidator}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByTestId('entry-form')).toBeInTheDocument();
    expect(screen.getByTestId('validator-used')).toHaveTextContent(
      'validator-present'
    );
  });

  it('should not show feedback initially', () => {
    render(
      <EntryFormWithFeedback
        validator={mockValidator}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.queryByText(/sucesso/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/erro/i)).not.toBeInTheDocument();
  });

  it('should show success feedback when submission succeeds', async () => {
    mockOnSubmit.mockResolvedValueOnce(undefined);

    render(
      <EntryFormWithFeedback
        validator={mockValidator}
        onSubmit={mockOnSubmit}
      />
    );

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText('Entrada adicionada com sucesso!')
      ).toBeInTheDocument();
    });

    // Just verify the success message is displayed
    expect(
      screen.getByText('Entrada adicionada com sucesso!')
    ).toBeInTheDocument();
  });

  it('should show error feedback when submission fails', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    mockOnSubmit.mockRejectedValueOnce(new Error('Submission failed'));

    render(
      <EntryFormWithFeedback
        validator={mockValidator}
        onSubmit={mockOnSubmit}
      />
    );

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText('Erro ao adicionar entrada. Tente novamente.')
      ).toBeInTheDocument();
    });

    // Just verify the error message is displayed
    expect(
      screen.getByText('Erro ao adicionar entrada. Tente novamente.')
    ).toBeInTheDocument();
    expect(consoleErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });

  it('should clear feedback when submitting again', async () => {
    mockOnSubmit.mockResolvedValueOnce(undefined);

    render(
      <EntryFormWithFeedback
        validator={mockValidator}
        onSubmit={mockOnSubmit}
      />
    );

    const submitButton = screen.getByTestId('submit-button');

    // First submission - success
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(
        screen.getByText('Entrada adicionada com sucesso!')
      ).toBeInTheDocument();
    });

    // Second submission - should clear previous feedback
    mockOnSubmit.mockRejectedValueOnce(new Error('Failed'));
    fireEvent.click(submitButton);

    // Success message should be cleared immediately
    expect(
      screen.queryByText('Entrada adicionada com sucesso!')
    ).not.toBeInTheDocument();

    // Error message should appear
    await waitFor(() => {
      expect(
        screen.getByText('Erro ao adicionar entrada. Tente novamente.')
      ).toBeInTheDocument();
    });
  });

  it('should show loading state during submission', async () => {
    let resolveSubmit: () => void;
    const submitPromise = new Promise<void>(resolve => {
      resolveSubmit = resolve;
    });
    mockOnSubmit.mockReturnValueOnce(submitPromise);

    render(
      <EntryFormWithFeedback
        validator={mockValidator}
        onSubmit={mockOnSubmit}
      />
    );

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    // Should show loading state
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(submitButton).toBeDisabled();

    // Resolve the promise
    resolveSubmit!();
    await waitFor(() => {
      expect(screen.getByText('Submit')).toBeInTheDocument();
    });
  });

  it('should pass correct props to EntryForm', () => {
    render(
      <EntryFormWithFeedback
        validator={mockValidator}
        onSubmit={mockOnSubmit}
      />
    );

    // Verify that the validator is passed correctly
    expect(screen.getByTestId('validator-used')).toHaveTextContent(
      'validator-present'
    );

    // Verify submit button is not disabled initially
    expect(screen.getByTestId('submit-button')).not.toBeDisabled();
  });
});
