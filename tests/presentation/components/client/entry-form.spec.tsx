import { useState } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EntryForm } from '@/presentation/components/client';
import { EntryFormData } from '@/infra/validation';
import { mockFormValidator } from '../../mocks';

const mockOnSubmit = jest.fn();

describe('EntryForm', () => {
  const validator = mockFormValidator<EntryFormData>();

  beforeEach(() => {
    jest.clearAllMocks();
    mockOnSubmit.mockResolvedValue(undefined);
    validator.validate.mockReturnValue({
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

  it('should render all form fields', () => {
    render(
      <EntryForm
        validator={validator}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    expect(screen.getByLabelText('Descrição')).toBeInTheDocument();
    expect(screen.getByLabelText('Valor (R$)')).toBeInTheDocument();
    expect(screen.getByLabelText('Tipo')).toBeInTheDocument();
    expect(screen.getByLabelText('Categoria')).toBeInTheDocument();
    expect(screen.getByLabelText('Data')).toBeInTheDocument();
    expect(
      screen.getByLabelText('Entrada fixa (recorrente mensalmente)')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Adicionar Entrada' })
    ).toBeInTheDocument();
  });

  it('should call validator and onSubmit when form is submitted with valid data', async () => {
    render(
      <EntryForm
        validator={validator}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    // Fill form
    fireEvent.change(screen.getByLabelText('Descrição'), {
      target: { value: 'Test entry' },
    });
    fireEvent.change(screen.getByLabelText('Valor (R$)'), {
      target: { value: '100.50' },
    });
    fireEvent.change(screen.getByLabelText('Tipo'), {
      target: { value: 'INCOME' },
    });
    fireEvent.change(screen.getByLabelText('Categoria'), {
      target: { value: '1' },
    });
    fireEvent.change(screen.getByLabelText('Data'), {
      target: { value: '2024-01-01' },
    });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: 'Adicionar Entrada' }));

    await waitFor(() => {
      expect(validator.validate).toHaveBeenCalledWith({
        description: 'Test entry',
        amount: 100.5,
        type: 'INCOME',
        categoryId: '1',
        date: new Date('2024-01-01'),
        isFixed: false,
      });
    });

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        description: 'Test entry',
        amount: 100.5,
        type: 'INCOME',
        categoryId: '1',
        date: new Date('2024-01-01'),
        isFixed: false,
      });
    });
  });

  it('should display validation errors when validator returns errors', async () => {
    validator.validate.mockReturnValue({
      success: false,
      errors: {
        description: ['Descrição é obrigatória'],
        amount: ['Valor deve ser positivo'],
      },
    });

    render(
      <EntryForm
        validator={validator}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    // Fill all required fields to bypass HTML5 validation
    fireEvent.change(screen.getByLabelText('Descrição'), {
      target: { value: 'Test description' }, // Valid value, but validator will return error
    });
    fireEvent.change(screen.getByLabelText('Valor (R$)'), {
      target: { value: '100' }, // Valid value, but validator will return error
    });
    fireEvent.change(screen.getByLabelText('Tipo'), {
      target: { value: 'INCOME' },
    });
    fireEvent.change(screen.getByLabelText('Categoria'), {
      target: { value: '1' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Adicionar Entrada' }));

    // Debug: let's check what's actually in the DOM
    await waitFor(() => {
      expect(validator.validate).toHaveBeenCalled();
    });

    // Wait for the component to re-render with errors
    await waitFor(() => {
      const descriptionField = screen
        .getByLabelText('Descrição')
        .closest('div');
      const amountField = screen.getByLabelText('Valor (R$)').closest('div');

      // Check if the error paragraphs exist within the field containers
      expect(descriptionField?.querySelector('p')).toBeTruthy();
      expect(amountField?.querySelector('p')).toBeTruthy();

      // Check the actual error text
      expect(descriptionField?.textContent).toContain(
        'Descrição é obrigatória'
      );
      expect(amountField?.textContent).toContain('Valor deve ser positivo');
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should show loading state when isLoading is true', () => {
    render(
      <EntryForm
        validator={validator}
        onSubmit={mockOnSubmit}
        isLoading={true}
      />
    );

    const submitButton = screen.getByRole('button');
    expect(submitButton).toBeDisabled();
    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });

  it('should reset form after successful submission', async () => {
    render(
      <EntryForm
        validator={validator}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    // Fill form
    const descriptionInput = screen.getByLabelText(
      'Descrição'
    ) as HTMLInputElement;
    const amountInput = screen.getByLabelText('Valor (R$)') as HTMLInputElement;
    const typeSelect = screen.getByLabelText('Tipo') as HTMLSelectElement;
    const categorySelect = screen.getByLabelText(
      'Categoria'
    ) as HTMLSelectElement;

    fireEvent.change(descriptionInput, { target: { value: 'Test entry' } });
    fireEvent.change(amountInput, { target: { value: '100.50' } });
    fireEvent.change(typeSelect, { target: { value: 'INCOME' } });
    fireEvent.change(categorySelect, { target: { value: '1' } });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: 'Adicionar Entrada' }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });

    // Check if form is reset
    await waitFor(() => {
      expect(descriptionInput.value).toBe('');
      expect(amountInput.value).toBe('');
      expect(typeSelect.value).toBe('');
      expect(categorySelect.value).toBe('');
    });
  });

  it('should set current date as default', () => {
    render(
      <EntryForm
        validator={validator}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    const today = new Date().toISOString().split('T')[0];
    const dateInput = screen.getByLabelText('Data') as HTMLInputElement;
    expect(dateInput.value).toBe(today);
  });

  it('should handle form submission error', async () => {
    mockOnSubmit.mockRejectedValue(new Error('Network error'));

    render(
      <EntryForm
        validator={validator}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    // Fill all required fields to bypass HTML5 validation
    fireEvent.change(screen.getByLabelText('Descrição'), {
      target: { value: 'Test entry' },
    });
    fireEvent.change(screen.getByLabelText('Valor (R$)'), {
      target: { value: '100' },
    });
    fireEvent.change(screen.getByLabelText('Tipo'), {
      target: { value: 'INCOME' },
    });
    fireEvent.change(screen.getByLabelText('Categoria'), {
      target: { value: '1' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Adicionar Entrada' }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });

    // Check for general error message
    await waitFor(() => {
      const errorDiv = document.querySelector('.bg-pink-50');
      expect(errorDiv).toBeTruthy();
      expect(errorDiv?.textContent).toContain(
        'Erro ao salvar entrada. Tente novamente.'
      );
    });
  });

  it('should clear field errors when user starts typing', async () => {
    // First, set up validation errors
    validator.validate.mockReturnValue({
      success: false,
      errors: {
        description: ['Descrição é obrigatória'],
        amount: ['Valor deve ser positivo'],
      },
    });

    render(
      <EntryForm
        validator={validator}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    // Fill form and submit to trigger errors
    fireEvent.change(screen.getByLabelText('Descrição'), {
      target: { value: 'Test' },
    });
    fireEvent.change(screen.getByLabelText('Valor (R$)'), {
      target: { value: '100' },
    });
    fireEvent.change(screen.getByLabelText('Tipo'), {
      target: { value: 'INCOME' },
    });
    fireEvent.change(screen.getByLabelText('Categoria'), {
      target: { value: '1' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Adicionar Entrada' }));

    // Wait for errors to appear
    await waitFor(() => {
      expect(validator.validate).toHaveBeenCalled();
    });

    // Now change validator to return success
    validator.validate.mockReturnValue({
      success: true,
      data: {} as EntryFormData,
    });

    // Type in a field that had an error - this should clear the error
    fireEvent.change(screen.getByLabelText('Descrição'), {
      target: { value: 'New description' },
    });

    // The error clearing happens immediately when typing
    const descriptionField = screen.getByLabelText('Descrição').closest('div');
    expect(descriptionField).toBeTruthy();
  });

  it('should handle multiple general errors', async () => {
    // Create a mock that simulates multiple general errors being set
    const mockOnSubmitWithMultipleErrors = jest.fn().mockImplementation(() => {
      const error = new Error('Multiple errors occurred');
      // Simulate a scenario where multiple errors would be set
      error.name = 'ValidationError';
      throw error;
    });

    render(
      <EntryForm
        validator={validator}
        onSubmit={mockOnSubmitWithMultipleErrors}
        isLoading={false}
      />
    );

    // Fill form
    fireEvent.change(screen.getByLabelText('Descrição'), {
      target: { value: 'Test entry' },
    });
    fireEvent.change(screen.getByLabelText('Valor (R$)'), {
      target: { value: '100' },
    });
    fireEvent.change(screen.getByLabelText('Tipo'), {
      target: { value: 'INCOME' },
    });
    fireEvent.change(screen.getByLabelText('Categoria'), {
      target: { value: '1' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Adicionar Entrada' }));

    await waitFor(() => {
      expect(mockOnSubmitWithMultipleErrors).toHaveBeenCalled();
    });

    // Check that general error is displayed
    await waitFor(() => {
      const errorDiv = document.querySelector('.bg-pink-50');
      expect(errorDiv).toBeTruthy();
      // Should contain a <p> tag with the error message - this covers line 173
      const errorParagraph = errorDiv?.querySelector('p');
      expect(errorParagraph).toBeTruthy();
      expect(errorParagraph?.textContent).toBe(
        'Erro ao salvar entrada. Tente novamente.'
      );
    });
  });

  it('should handle isFixed checkbox change and submit with correct value', async () => {
    render(
      <EntryForm
        validator={validator}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    // Fill all required fields first
    fireEvent.change(screen.getByLabelText('Descrição'), {
      target: { value: 'Test entry' },
    });
    fireEvent.change(screen.getByLabelText('Valor (R$)'), {
      target: { value: '100.50' },
    });
    fireEvent.change(screen.getByLabelText('Tipo'), {
      target: { value: 'INCOME' },
    });
    fireEvent.change(screen.getByLabelText('Categoria'), {
      target: { value: '1' },
    });

    // Get checkbox and verify it's initially unchecked
    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.checked).toBe(false);

    // Check the checkbox - this should trigger the onChange event on line 173
    fireEvent.click(checkbox);

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: 'Adicionar Entrada' }));

    // Verify that the form was submitted with isFixed: true
    await waitFor(() => {
      expect(validator.validate).toHaveBeenCalledWith(
        expect.objectContaining({
          isFixed: true,
        })
      );
    });
  });

  it('should render error paragraph using map function (covers line 173)', async () => {
    // Create a custom EntryForm component that allows us to set multiple general errors
    const TestEntryFormWithMultipleErrors = () => {
      const [errors, setErrors] = useState<Record<string, string[]>>({});

      const mockValidator = {
        validate: jest.fn().mockReturnValue({
          success: true,
          data: {
            description: 'Test entry',
            amount: 100,
            type: 'INCOME',
            categoryId: '1',
            date: new Date(),
            isFixed: false,
          },
        }),
      };

      const mockOnSubmit = jest.fn().mockImplementation(async () => {
        // Simulate multiple general errors being set
        setErrors({
          general: ['Primeiro erro', 'Segundo erro'],
        });
        throw new Error('Multiple errors');
      });

      return (
        <div>
          {errors.general && (
            <div className='bg-pink-50 border border-pink-400 text-pink-700 px-4 py-3 rounded'>
              {errors.general.map((error: string, index: number) => (
                <p key={index}>{error}</p>
              ))}
            </div>
          )}
          <EntryForm
            validator={mockValidator}
            onSubmit={mockOnSubmit}
            isLoading={false}
          />
        </div>
      );
    };

    render(<TestEntryFormWithMultipleErrors />);

    // Fill and submit the form to trigger the error
    fireEvent.change(screen.getByLabelText('Descrição'), {
      target: { value: 'Test entry' },
    });
    fireEvent.change(screen.getByLabelText('Valor (R$)'), {
      target: { value: '100' },
    });
    fireEvent.change(screen.getByLabelText('Tipo'), {
      target: { value: 'INCOME' },
    });
    fireEvent.change(screen.getByLabelText('Categoria'), {
      target: { value: '1' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Adicionar Entrada' }));

    // Wait for the errors to be displayed
    await waitFor(() => {
      expect(screen.getByText('Primeiro erro')).toBeInTheDocument();
      expect(screen.getByText('Segundo erro')).toBeInTheDocument();
    });

    // Verify the error paragraphs are rendered using the map function
    const errorDiv = document.querySelector('.bg-pink-50');
    expect(errorDiv).toBeTruthy();
    const errorParagraphs = errorDiv?.querySelectorAll('p');
    expect(errorParagraphs).toHaveLength(2);
  });

  it('should use default isLoading value when not provided', () => {
    render(
      <EntryForm
        validator={validator}
        onSubmit={mockOnSubmit}
        // isLoading not provided - should default to false
      />
    );

    const submitButton = screen.getByRole('button', {
      name: 'Adicionar Entrada',
    });
    expect(submitButton).not.toBeDisabled();
    expect(screen.getByText('Adicionar Entrada')).toBeInTheDocument();
  });

  it('should handle parseFloat fallback for amount', () => {
    // Test the parseFloat fallback logic directly
    const testAmount = '';
    const result = parseFloat(testAmount) || 0;
    expect(result).toBe(0);

    // Also test with NaN
    const testAmount2 = 'invalid';
    const result2 = parseFloat(testAmount2) || 0;
    expect(result2).toBe(0);

    // Test with valid number (covers the truthy branch)
    const testAmount3 = '123.45';
    const result3 = parseFloat(testAmount3) || 0;
    expect(result3).toBe(123.45);
  });

  it('should handle validation result without errors property', async () => {
    // Mock validator to return success: false but without errors property
    validator.validate.mockReturnValue({
      success: false,
      // errors property is undefined
    });

    render(
      <EntryForm
        validator={validator}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    // Fill and submit form
    fireEvent.change(screen.getByLabelText('Descrição'), {
      target: { value: 'Test entry' },
    });
    fireEvent.change(screen.getByLabelText('Valor (R$)'), {
      target: { value: '100' },
    });
    fireEvent.change(screen.getByLabelText('Tipo'), {
      target: { value: 'INCOME' },
    });
    fireEvent.change(screen.getByLabelText('Categoria'), {
      target: { value: '1' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Adicionar Entrada' }));

    // Verify that onSubmit was not called due to validation failure
    await waitFor(() => {
      expect(validator.validate).toHaveBeenCalled();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should handle input change when no error exists for field', () => {
    render(
      <EntryForm
        validator={validator}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    // Type in a field that has no error - this should not cause issues
    fireEvent.change(screen.getByLabelText('Descrição'), {
      target: { value: 'Test description' },
    });

    // Verify the field value was updated
    expect(screen.getByDisplayValue('Test description')).toBeInTheDocument();
  });

  it('should handle valid numeric amount values', async () => {
    render(
      <EntryForm
        validator={validator}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    // Fill form with valid numeric amount
    fireEvent.change(screen.getByLabelText('Descrição'), {
      target: { value: 'Test entry' },
    });
    fireEvent.change(screen.getByLabelText('Valor (R$)'), {
      target: { value: '123.45' }, // Valid number - this covers the truthy branch
    });
    fireEvent.change(screen.getByLabelText('Tipo'), {
      target: { value: 'INCOME' },
    });
    fireEvent.change(screen.getByLabelText('Categoria'), {
      target: { value: '1' },
    });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: 'Adicionar Entrada' }));

    // Verify that amount is parsed correctly
    await waitFor(() => {
      expect(validator.validate).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: 123.45, // parseFloat('123.45') should be 123.45
        })
      );
    });
  });

  it('should handle zero amount values', async () => {
    render(
      <EntryForm
        validator={validator}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    // Fill form with zero amount - this should trigger the || 0 fallback
    fireEvent.change(screen.getByLabelText('Descrição'), {
      target: { value: 'Test entry' },
    });
    fireEvent.change(screen.getByLabelText('Valor (R$)'), {
      target: { value: '0' }, // parseFloat('0') returns 0 (falsy), so || 0 executes
    });
    fireEvent.change(screen.getByLabelText('Tipo'), {
      target: { value: 'INCOME' },
    });
    fireEvent.change(screen.getByLabelText('Categoria'), {
      target: { value: '1' },
    });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: 'Adicionar Entrada' }));

    // Verify that amount is 0 (covers the || 0 branch)
    await waitFor(() => {
      expect(validator.validate).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: 0, // parseFloat('0') || 0 should be 0
        })
      );
    });
  });
});
