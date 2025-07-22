import { render, screen } from '@testing-library/react';
import { EntriesListPage } from '@/presentation/components/server/entries-list-page';
import { loadEntriesByMonthAction } from '@/presentation/actions';
import { EntryModel } from '@/domain/models';
import { LoadEntriesByMonthResult } from '@/domain/usecases/load-entries-by-month';

// Mock das dependências
jest.mock('@/presentation/actions', () => ({
  loadEntriesByMonthAction: jest.fn(),
}));

jest.mock('@/main/factories/usecases', () => ({
  makeRemoteLoadEntriesByMonth: jest.fn(() => jest.fn()),
}));

jest.mock('@/main/factories/storage', () => ({
  makeCookieStorageAdapter: jest.fn(() => ({
    get: jest.fn(),
    set: jest.fn(),
  })),
}));

jest.mock('next/dynamic', () => ({
  __esModule: true,
  default: jest.fn(() => {
    return function MockPaginationWrapper({
      currentPage,
      totalPages,
    }: {
      currentPage: number;
      totalPages: number;
    }) {
      return (
        <div data-testid='pagination-wrapper'>
          Pagination: {currentPage} of {totalPages}
        </div>
      );
    };
  }),
}));

const mockLoadEntriesByMonthAction =
  loadEntriesByMonthAction as jest.MockedFunction<
    typeof loadEntriesByMonthAction
  >;

describe('EntriesListPage', () => {
  const mockSearchParams = { page: '1', month: '2024-01' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render entries list page with data', async () => {
    const mockEntries: EntryModel[] = [
      {
        id: '1',
        description: 'Salary',
        amount: 500000, // R$ 5000.00 em centavos
        type: 'INCOME',
        date: new Date('2024-01-15'),
        isFixed: true,
        categoryId: 'cat-1',
        categoryName: 'Salary',
        userId: 'user-1',
        createdAt: new Date('2024-01-15T10:00:00Z'),
        updatedAt: new Date('2024-01-15T10:00:00Z'),
      },
      {
        id: '2',
        description: 'Rent',
        amount: 150000, // R$ 1500.00 em centavos
        type: 'EXPENSE',
        date: new Date('2024-01-20'),
        isFixed: true,
        categoryId: 'cat-2',
        categoryName: 'Housing',
        userId: 'user-1',
        createdAt: new Date('2024-01-20T10:00:00Z'),
        updatedAt: new Date('2024-01-20T10:00:00Z'),
      },
    ];

    const mockResult: LoadEntriesByMonthResult = {
      data: mockEntries,
      meta: {
        page: 1,
        limit: 10,
        total: 6,
        totalPages: 3,
      },
    };

    mockLoadEntriesByMonthAction.mockResolvedValue(mockResult);

    render(<EntriesListPage searchParams={mockSearchParams} />);

    // Aguarda a renderização assíncrona
    await screen.findByText('Entradas do Mês');

    expect(screen.getByText('Entradas do Mês')).toBeInTheDocument();
    expect(
      screen.getByText('Visualize e gerencie todas as suas receitas e despesas')
    ).toBeInTheDocument();
    expect(screen.getByText('Entradas do mês')).toBeInTheDocument();
    expect(screen.getByText('Salary')).toBeInTheDocument();
    expect(screen.getByText('Rent')).toBeInTheDocument();
    expect(screen.getByText('Adicionar Nova Entrada')).toBeInTheDocument();
    expect(screen.getByText('Ver Resumo Mensal')).toBeInTheDocument();
    expect(screen.getByTestId('pagination-wrapper')).toBeInTheDocument();
  });

  it('should render empty state when no entries', async () => {
    const mockResult: LoadEntriesByMonthResult = {
      data: [],
      meta: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1,
      },
    };

    mockLoadEntriesByMonthAction.mockResolvedValue(mockResult);

    render(<EntriesListPage searchParams={mockSearchParams} />);

    await screen.findByText('Entradas do Mês');

    expect(screen.getByText('Nenhuma entrada encontrada.')).toBeInTheDocument();
    expect(screen.queryByTestId('pagination-wrapper')).not.toBeInTheDocument();
  });

  it('should render error state when action throws error', async () => {
    mockLoadEntriesByMonthAction.mockRejectedValue(new Error('API Error'));

    render(<EntriesListPage searchParams={mockSearchParams} />);

    await screen.findByText('Erro ao carregar entradas. Tente novamente.');

    expect(
      screen.getByText('Erro ao carregar entradas. Tente novamente.')
    ).toBeInTheDocument();
  });

  it('should not render pagination when totalPages is 1', async () => {
    const mockEntries: EntryModel[] = [
      {
        id: '1',
        description: 'Salary',
        amount: 500000,
        type: 'INCOME',
        date: new Date('2024-01-15'),
        isFixed: true,
        categoryId: 'cat-1',
        categoryName: 'Salary',
        userId: 'user-1',
        createdAt: new Date('2024-01-15T10:00:00Z'),
        updatedAt: new Date('2024-01-15T10:00:00Z'),
      },
    ];

    const mockResult: LoadEntriesByMonthResult = {
      data: mockEntries,
      meta: {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
      },
    };

    mockLoadEntriesByMonthAction.mockResolvedValue(mockResult);

    render(<EntriesListPage searchParams={mockSearchParams} />);

    await screen.findByText('Entradas do Mês');

    expect(screen.queryByTestId('pagination-wrapper')).not.toBeInTheDocument();
  });

  it('should render pagination when totalPages is greater than 1', async () => {
    const mockEntries: EntryModel[] = [
      {
        id: '1',
        description: 'Salary',
        amount: 500000,
        type: 'INCOME',
        date: new Date('2024-01-15'),
        isFixed: true,
        categoryId: 'cat-1',
        categoryName: 'Salary',
        userId: 'user-1',
        createdAt: new Date('2024-01-15T10:00:00Z'),
        updatedAt: new Date('2024-01-15T10:00:00Z'),
      },
    ];

    const mockResult: LoadEntriesByMonthResult = {
      data: mockEntries,
      meta: {
        page: 1,
        limit: 10,
        total: 50,
        totalPages: 5,
      },
    };

    mockLoadEntriesByMonthAction.mockResolvedValue(mockResult);

    render(<EntriesListPage searchParams={mockSearchParams} />);

    await screen.findByText('Entradas do Mês');

    expect(screen.getByTestId('pagination-wrapper')).toBeInTheDocument();
  });

  it('should handle multiple entries correctly', async () => {
    const mockEntries: EntryModel[] = [
      {
        id: '1',
        description: 'Salary',
        amount: 500000,
        type: 'INCOME',
        date: new Date('2024-01-15'),
        isFixed: true,
        categoryId: 'cat-1',
        categoryName: 'Salary',
        userId: 'user-1',
        createdAt: new Date('2024-01-15T10:00:00Z'),
        updatedAt: new Date('2024-01-15T10:00:00Z'),
      },
      {
        id: '2',
        description: 'Rent',
        amount: 150000,
        type: 'EXPENSE',
        date: new Date('2024-01-20'),
        isFixed: true,
        categoryId: 'cat-2',
        categoryName: 'Housing',
        userId: 'user-1',
        createdAt: new Date('2024-01-20T10:00:00Z'),
        updatedAt: new Date('2024-01-20T10:00:00Z'),
      },
      {
        id: '3',
        description: 'Groceries',
        amount: 30000,
        type: 'EXPENSE',
        date: new Date('2024-01-25'),
        isFixed: false,
        categoryId: 'cat-3',
        categoryName: 'Food',
        userId: 'user-1',
        createdAt: new Date('2024-01-25T10:00:00Z'),
        updatedAt: new Date('2024-01-25T10:00:00Z'),
      },
    ];

    const mockResult: LoadEntriesByMonthResult = {
      data: mockEntries,
      meta: {
        page: 1,
        limit: 3,
        total: 6,
        totalPages: 2,
      },
    };

    mockLoadEntriesByMonthAction.mockResolvedValue(mockResult);

    render(<EntriesListPage searchParams={mockSearchParams} />);

    await screen.findByText('Entradas do Mês');

    expect(screen.getByText('Salary')).toBeInTheDocument();
    expect(screen.getByText('Rent')).toBeInTheDocument();
    expect(screen.getByText('Groceries')).toBeInTheDocument();
    expect(screen.getByTestId('pagination-wrapper')).toBeInTheDocument();
  });

  it('should call loadEntriesByMonthAction with correct parameters', async () => {
    const mockResult: LoadEntriesByMonthResult = {
      data: [],
      meta: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1,
      },
    };

    mockLoadEntriesByMonthAction.mockResolvedValue(mockResult);

    render(<EntriesListPage searchParams={mockSearchParams} />);

    await screen.findByText('Entradas do Mês');

    expect(mockLoadEntriesByMonthAction).toHaveBeenCalledWith(
      mockSearchParams,
      expect.any(Function), // loadEntriesByMonth
      expect.any(Object) // getStorage
    );
  });

  it('should handle different search params', async () => {
    const differentSearchParams = { page: '2', month: '2024-02' };
    const mockResult: LoadEntriesByMonthResult = {
      data: [],
      meta: {
        page: 2,
        limit: 10,
        total: 0,
        totalPages: 1,
      },
    };

    mockLoadEntriesByMonthAction.mockResolvedValue(mockResult);

    render(<EntriesListPage searchParams={differentSearchParams} />);

    await screen.findByText('Entradas do Mês');

    expect(mockLoadEntriesByMonthAction).toHaveBeenCalledWith(
      differentSearchParams,
      expect.any(Function),
      expect.any(Object)
    );
  });
});
