import { render } from '@testing-library/react';
import { EntryFormWithFeedbackFactory } from '@/main/factories/components';
import { makeEntryFormValidator } from '@/main/factories/validation';
import { makeRemoteAddEntry } from '@/main/factories/usecases';

// Mock the makeEntryFormValidator
jest.mock('@/main/factories/validation/entry-form-validator-factory', () => ({
  makeEntryFormValidator: jest.fn(() => ({
    validate: jest.fn(),
  })),
}));

// Mock the makeRemoteAddEntry
jest.mock('@/main/factories/usecases/add-entry-factory', () => ({
  makeRemoteAddEntry: jest.fn(() => ({
    add: jest.fn(),
  })),
}));

// Mock the EntryFormWithFeedback component
jest.mock('@/presentation/components/client/entry-form-with-feedback', () => ({
  EntryFormWithFeedback: ({
    validator,
    addEntry,
    tokenStorage,
  }: {
    validator: unknown;
    addEntry: unknown;
    tokenStorage: unknown;
  }) => (
    <div data-testid='entry-form-with-feedback'>
      <div data-testid='has-validator'>{validator ? 'true' : 'false'}</div>
      <div data-testid='has-add-entry'>{addEntry ? 'true' : 'false'}</div>
      <div data-testid='has-token-storage'>
        {tokenStorage ? 'true' : 'false'}
      </div>
    </div>
  ),
}));

const mockMakeEntryFormValidator =
  makeEntryFormValidator as jest.MockedFunction<typeof makeEntryFormValidator>;

const mockMakeRemoteAddEntry = makeRemoteAddEntry as jest.MockedFunction<
  typeof makeRemoteAddEntry
>;

describe('EntryFormWithFeedbackFactory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create EntryFormWithFeedback with validator, addEntry and tokenStorage injected', () => {
    const { getByTestId } = render(<EntryFormWithFeedbackFactory />);

    expect(getByTestId('entry-form-with-feedback')).toBeInTheDocument();
    expect(getByTestId('has-validator')).toHaveTextContent('true');
    expect(getByTestId('has-add-entry')).toHaveTextContent('true');
    expect(getByTestId('has-token-storage')).toHaveTextContent('true');
  });

  it('should call makeEntryFormValidator to create validator', () => {
    render(<EntryFormWithFeedbackFactory />);

    expect(mockMakeEntryFormValidator).toHaveBeenCalledTimes(1);
  });

  it('should call makeRemoteAddEntry to create addEntry use case', () => {
    render(<EntryFormWithFeedbackFactory />);

    expect(mockMakeRemoteAddEntry).toHaveBeenCalledTimes(1);
  });

  it('should render as a valid React component', () => {
    const { container } = render(<EntryFormWithFeedbackFactory />);

    expect(container).toBeInTheDocument();
    expect(container.firstChild).toBeTruthy();
  });
});
