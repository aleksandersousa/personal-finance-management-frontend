import { render } from '@testing-library/react';
import { EntryFormWithFeedbackFactory } from '@/main/factories/components';
import { makeEntryFormValidator } from '@/main/factories/validation';

// Mock the makeEntryFormValidator
jest.mock('@/main/factories/validation/entry-form-validator-factory', () => ({
  makeEntryFormValidator: jest.fn(() => ({
    validate: jest.fn(),
  })),
}));

// Mock the EntryFormWithFeedback component
jest.mock('@/presentation/components/client/entry-form-with-feedback', () => ({
  EntryFormWithFeedback: ({ validator }: { validator: unknown }) => (
    <div data-testid='entry-form-with-feedback'>
      <div data-testid='has-validator'>{validator ? 'true' : 'false'}</div>
    </div>
  ),
}));

const mockMakeEntryFormValidator =
  makeEntryFormValidator as jest.MockedFunction<typeof makeEntryFormValidator>;

describe('EntryFormWithFeedbackFactory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create EntryFormWithFeedback with validator injected', () => {
    const { getByTestId } = render(<EntryFormWithFeedbackFactory />);

    expect(getByTestId('entry-form-with-feedback')).toBeInTheDocument();
    expect(getByTestId('has-validator')).toHaveTextContent('true');
  });

  it('should call makeEntryFormValidator to create validator', () => {
    render(<EntryFormWithFeedbackFactory />);

    expect(mockMakeEntryFormValidator).toHaveBeenCalledTimes(1);
  });

  it('should render as a valid React component', () => {
    const { container } = render(<EntryFormWithFeedbackFactory />);

    expect(container).toBeInTheDocument();
    expect(container.firstChild).toBeTruthy();
  });
});
