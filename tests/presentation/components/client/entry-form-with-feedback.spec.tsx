import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EntryFormWithFeedback } from '@/presentation/components/client/entry-form-with-feedback';
import { EntryFormData } from '@/infra/validation/entry-form-schema';
import { addEntryAction } from '@/presentation/actions/add-entry-action';
import { FormValidator } from '@/presentation/protocols/form-validator';

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

const mockAddEntryAction = addEntryAction as jest.MockedFunction<
  typeof addEntryAction
>;

describe('EntryFormWithFeedback', () => {
  const mockValidator: jest.Mocked<FormValidator<EntryFormData>> = {
    validate: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockValidator.validate.mockReturnValue({
      success: true,
      data: {} as EntryFormData,
    });
  });

  it('should render EntryForm with injected validator', () => {
    render(<EntryFormWithFeedback validator={mockValidator} />);

    expect(screen.getByTestId('entry-form')).toBeInTheDocument();
    expect(screen.getByTestId('validator-used')).toHaveTextContent(
      'validator-present'
    );
  });

  it('should pass validator prop to EntryForm', () => {
    render(<EntryFormWithFeedback validator={mockValidator} />);

    const validatorElement = screen.getByTestId('validator-used');
    expect(validatorElement).toHaveTextContent('validator-present');
  });

  it('should show success feedback when form submission succeeds', async () => {
    mockAddEntryAction.mockResolvedValue(undefined);

    render(<EntryFormWithFeedback validator={mockValidator} />);

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText('Entrada adicionada com sucesso!')
      ).toBeInTheDocument();
    });

    expect(mockAddEntryAction).toHaveBeenCalledWith({
      description: 'Test entry',
      amount: 100,
      type: 'INCOME',
      categoryId: 'cat-1',
      date: expect.any(Date),
      isFixed: false,
    });
  });

  it('should show error feedback when form submission fails', async () => {
    mockAddEntryAction.mockRejectedValue(new Error('API Error'));

    render(<EntryFormWithFeedback validator={mockValidator} />);

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText('Erro ao adicionar entrada. Tente novamente.')
      ).toBeInTheDocument();
    });
  });

  it('should disable form during submission', async () => {
    mockAddEntryAction.mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 100))
    );

    render(<EntryFormWithFeedback validator={mockValidator} />);

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Submit')).toBeInTheDocument();
    });
  });

  it('should clear feedback when new submission starts', async () => {
    mockAddEntryAction.mockResolvedValue(undefined);

    render(<EntryFormWithFeedback validator={mockValidator} />);

    const submitButton = screen.getByTestId('submit-button');

    // First submission - success
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(
        screen.getByText('Entrada adicionada com sucesso!')
      ).toBeInTheDocument();
    });

    // Second submission should clear previous feedback
    fireEvent.click(submitButton);

    // During transition, feedback should be cleared
    await waitFor(() => {
      expect(
        screen.queryByText('Entrada adicionada com sucesso!')
      ).not.toBeInTheDocument();
    });
  });
});
