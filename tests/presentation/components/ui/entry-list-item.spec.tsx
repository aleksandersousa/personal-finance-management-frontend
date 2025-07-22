import { render, screen } from '@testing-library/react';
import { EntryListItem } from '@/presentation/components/ui/entry-list-item';
import { EntryModel } from '@/domain/models';

describe('EntryListItem', () => {
  const mockIncomeEntry: EntryModel = {
    id: '1',
    description: 'Salário',
    amount: 500000, // R$ 5000,00
    type: 'INCOME',
    isFixed: false,
    categoryId: 'cat1',
    categoryName: 'Trabalho',
    userId: 'user1',
    date: new Date('2024-01-15'),
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  };

  const mockExpenseEntry: EntryModel = {
    id: '2',
    description: 'Aluguel',
    amount: 150000, // R$ 1500,00
    type: 'EXPENSE',
    isFixed: true,
    categoryId: 'cat2',
    categoryName: 'Moradia',
    userId: 'user1',
    date: new Date('2024-01-10'),
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
  };

  it('should render income entry correctly', () => {
    render(<EntryListItem entry={mockIncomeEntry} />);

    expect(screen.getByText('Salário')).toBeInTheDocument();
    expect(screen.getByText(/Trabalho/)).toBeInTheDocument();
    expect(screen.getByText(/1\/15\/2024/)).toBeInTheDocument();
    expect(screen.getByText('+ R$ 5000.00')).toBeInTheDocument();
  });

  it('should render expense entry correctly', () => {
    render(<EntryListItem entry={mockExpenseEntry} />);

    expect(screen.getByText('Aluguel')).toBeInTheDocument();
    expect(screen.getByText(/Moradia/)).toBeInTheDocument();
    expect(screen.getByText(/1\/10\/2024/)).toBeInTheDocument();
    expect(screen.getByText('- R$ 1500.00')).toBeInTheDocument();
  });

  it('should apply correct styling for income entry', () => {
    render(<EntryListItem entry={mockIncomeEntry} />);

    const amountElement = screen.getByText('+ R$ 5000.00');
    expect(amountElement).toHaveClass('text-green-600');
  });

  it('should apply correct styling for expense entry', () => {
    render(<EntryListItem entry={mockExpenseEntry} />);

    const amountElement = screen.getByText('- R$ 1500.00');
    expect(amountElement).toHaveClass('text-red-600');
  });

  it('should format amount correctly for different values', () => {
    const entryWithDecimal: EntryModel = {
      ...mockIncomeEntry,
      amount: 123456, // R$ 1234,56
    };

    render(<EntryListItem entry={entryWithDecimal} />);

    expect(screen.getByText('+ R$ 1234.56')).toBeInTheDocument();
  });

  it('should format amount correctly for whole numbers', () => {
    const entryWithWholeNumber: EntryModel = {
      ...mockIncomeEntry,
      amount: 100000, // R$ 1000,00
    };

    render(<EntryListItem entry={entryWithWholeNumber} />);

    expect(screen.getByText('+ R$ 1000.00')).toBeInTheDocument();
  });

  it('should display date in correct format', () => {
    const entryWithSpecificDate: EntryModel = {
      ...mockIncomeEntry,
      date: new Date('2024-12-25'),
    };

    render(<EntryListItem entry={entryWithSpecificDate} />);

    expect(screen.getByText(/Trabalho/)).toBeInTheDocument();
    expect(screen.getByText(/12\/25\/2024/)).toBeInTheDocument();
  });

  it('should render all entry information correctly', () => {
    render(<EntryListItem entry={mockIncomeEntry} />);

    // Verifica se todos os elementos estão presentes
    expect(screen.getByText('Salário')).toBeInTheDocument();
    expect(screen.getByText(/Trabalho/)).toBeInTheDocument();
    expect(screen.getByText(/1\/15\/2024/)).toBeInTheDocument();
    expect(screen.getByText('+ R$ 5000.00')).toBeInTheDocument();
  });

  it('should handle different category names', () => {
    const entryWithDifferentCategory: EntryModel = {
      ...mockIncomeEntry,
      categoryName: 'Freelance',
    };

    render(<EntryListItem entry={entryWithDifferentCategory} />);

    expect(screen.getByText(/Freelance/)).toBeInTheDocument();
    expect(screen.getByText(/1\/15\/2024/)).toBeInTheDocument();
  });

  it('should handle different descriptions', () => {
    const entryWithDifferentDescription: EntryModel = {
      ...mockIncomeEntry,
      description: 'Bônus Anual',
    };

    render(<EntryListItem entry={entryWithDifferentDescription} />);

    expect(screen.getByText('Bônus Anual')).toBeInTheDocument();
  });
});
