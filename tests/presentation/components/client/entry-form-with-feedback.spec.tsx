import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EntryFormWithFeedback } from '@/presentation/components/client/entry-form-with-feedback';
import { EntryFormData } from '@/infra/validation/entry-form-schema';

// Mock the ZodFormValidator
jest.mock('@/infra/validation/zod-form-validator', () => ({
  ZodFormValidator: jest.fn().mockImplementation(() => ({
    validate: jest.fn().mockReturnValue({
      success: true,
      data: {} as EntryFormData,
    }),
  })),
}));

// Mock the Server Action
jest.mock('@/presentation/actions/add-entry-action', () => ({
  addEntryAction: jest.fn(),
}));

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

// Import the mocked function after the mock is defined
import { addEntryAction } from '@/presentation/actions/add-entry-action';
const mockAddEntryAction = addEntryAction as jest.MockedFunction<
  typeof addEntryAction
>;

describe('EntryFormWithFeedback', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render EntryForm component', () => {
    render(<EntryFormWithFeedback />);

    expect(screen.getByTestId('entry-form')).toBeInTheDocument();
    expect(screen.getByTestId('validator-used')).toHaveTextContent(
      'validator-present'
    );
  });

  it('should not show feedback initially', () => {
    render(<EntryFormWithFeedback />);

    expect(screen.queryByText(/sucesso/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/erro/i)).not.toBeInTheDocument();
  });

  it('should show success feedback when submission succeeds', async () => {
    mockAddEntryAction.mockResolvedValueOnce(undefined);

    render(<EntryFormWithFeedback />);

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText('Entrada adicionada com sucesso!')
      ).toBeInTheDocument();
    });

    // Verify success styling is applied
    const feedbackElement = screen.getByText('Entrada adicionada com sucesso!');
    expect(feedbackElement).toHaveClass(
      'bg-green-50',
      'border',
      'border-green-200',
      'text-green-700',
      'p-4',
      'rounded-lg'
    );
  });

  it('should show error feedback when submission fails', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    mockAddEntryAction.mockRejectedValueOnce(new Error('Submission failed'));

    render(<EntryFormWithFeedback />);

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText('Erro ao adicionar entrada. Tente novamente.')
      ).toBeInTheDocument();
    });

    // Verify error styling is applied
    const feedbackElement = screen.getByText(
      'Erro ao adicionar entrada. Tente novamente.'
    );
    expect(feedbackElement).toHaveClass(
      'bg-red-50',
      'border',
      'border-red-200',
      'text-red-700',
      'p-4',
      'rounded-lg'
    );
    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.any(Error));

    consoleErrorSpy.mockRestore();
  });

  it('should clear feedback when submitting again', async () => {
    mockAddEntryAction.mockResolvedValueOnce(undefined);

    render(<EntryFormWithFeedback />);

    const submitButton = screen.getByTestId('submit-button');

    // First submission - success
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(
        screen.getByText('Entrada adicionada com sucesso!')
      ).toBeInTheDocument();
    });

    // Second submission - should clear previous feedback immediately
    mockAddEntryAction.mockRejectedValueOnce(new Error('Failed'));
    fireEvent.click(submitButton);

    // Success message should be cleared immediately (line 21: setFeedback({ type: null, message: '' }))
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
    mockAddEntryAction.mockReturnValueOnce(submitPromise);

    render(<EntryFormWithFeedback />);

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
    render(<EntryFormWithFeedback />);

    // Verify that the validator is passed correctly
    expect(screen.getByTestId('validator-used')).toHaveTextContent(
      'validator-present'
    );

    // Verify submit button is not disabled initially
    expect(screen.getByTestId('submit-button')).not.toBeDisabled();
  });

  it('should handle startTransition callback properly on success', async () => {
    mockAddEntryAction.mockResolvedValueOnce(undefined);

    render(<EntryFormWithFeedback />);

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    // Verify that the success path in startTransition is executed (lines 24-28)
    await waitFor(() => {
      expect(mockAddEntryAction).toHaveBeenCalledWith({
        description: 'Test entry',
        amount: 100,
        type: 'INCOME',
        categoryId: 'cat-1',
        date: expect.any(Date),
        isFixed: false,
      });
    });

    await waitFor(() => {
      expect(
        screen.getByText('Entrada adicionada com sucesso!')
      ).toBeInTheDocument();
    });
  });

  it('should handle startTransition callback properly on error', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    const testError = new Error('Test error');
    mockAddEntryAction.mockRejectedValueOnce(testError);

    render(<EntryFormWithFeedback />);

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    // Verify that the error path in startTransition is executed (lines 29-32)
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(testError);
    });

    await waitFor(() => {
      expect(
        screen.getByText('Erro ao adicionar entrada. Tente novamente.')
      ).toBeInTheDocument();
    });

    consoleErrorSpy.mockRestore();
  });

  it('should render feedback container with correct styling', async () => {
    mockAddEntryAction.mockResolvedValueOnce(undefined);

    render(<EntryFormWithFeedback />);

    // Initially no feedback container should be visible
    expect(
      screen.queryByText('Entrada adicionada com sucesso!')
    ).not.toBeInTheDocument();

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    await waitFor(() => {
      const feedbackContainer = screen.getByText(
        'Entrada adicionada com sucesso!'
      );
      expect(feedbackContainer).toHaveClass('p-4', 'rounded-lg');
    });
  });

  it('should maintain component structure with space-y-4 class', () => {
    render(<EntryFormWithFeedback />);

    const mainContainer = screen.getByTestId('entry-form').parentElement;
    expect(mainContainer).toHaveClass('space-y-4');
  });
});
