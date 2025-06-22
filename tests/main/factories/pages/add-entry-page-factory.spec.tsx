import { render } from '@testing-library/react';
import { makeAddEntryPage } from '@/main/factories/pages/add-entry-page-factory';

// Mock the dependencies
jest.mock('@/main/factories/validation/entry-form-validator-factory', () => ({
  makeEntryFormValidator: () => ({
    validate: jest.fn().mockReturnValue({ success: true, data: {} }),
  }),
}));

describe('makeAddEntryPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock console.log to avoid noise in tests
    jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render AddEntryPage component', () => {
    const component = makeAddEntryPage();

    const { container } = render(component);

    expect(container).toBeInTheDocument();
  });

  it('should create component with validator and submit handler', () => {
    const component = makeAddEntryPage();

    expect(component).toBeDefined();
    expect(component.type.name).toBe('AddEntryPage');
  });

  it('should handle submit with correct data transformation', async () => {
    const consoleSpy = jest.spyOn(console, 'log');
    const component = makeAddEntryPage();

    // Access the props to test the handleSubmit function
    const props = component.props;
    const handleSubmit = props.onSubmit;

    const formData = {
      description: 'Test entry',
      amount: 100.5,
      type: 'INCOME' as const,
      categoryId: 'category-1',
      date: new Date('2024-01-01'),
      isFixed: false,
    };

    await handleSubmit(formData);

    expect(consoleSpy).toHaveBeenCalledWith('Adding entry:', {
      description: 'Test entry',
      amount: 10050, // Converted to cents
      type: 'INCOME',
      categoryId: 'category-1',
      date: new Date('2024-01-01'),
      isFixed: false,
      userId: 'mock-user-id',
    });
  });

  it('should simulate API call delay', async () => {
    const component = makeAddEntryPage();
    const handleSubmit = component.props.onSubmit;

    const startTime = Date.now();
    await handleSubmit({
      description: 'Test',
      amount: 100,
      type: 'INCOME' as const,
      categoryId: 'cat-1',
      date: new Date(),
      isFixed: false,
    });
    const endTime = Date.now();

    // Should take at least 1000ms due to the setTimeout
    expect(endTime - startTime).toBeGreaterThanOrEqual(1000);
  });
});
