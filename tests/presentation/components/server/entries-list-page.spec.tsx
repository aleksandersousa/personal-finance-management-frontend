import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { EntriesListPage } from '@/presentation/components/server/entries-list-page';
import { EntryModel } from '@/domain/models';

// Mock das dependências
jest.mock('@/presentation/actions', () => ({
  loadEntriesByMonthAction: jest.fn(),
}));

jest.mock('@/main/factories/usecases', () => ({
  makeRemoteLoadEntriesByMonth: jest.fn(() => jest.fn()),
}));

jest.mock('@/main/factories/storage', () => ({
  makeLocalStorageAdapter: jest.fn(() => ({
    get: jest.fn(),
    set: jest.fn(),
  })),
}));

// Mock dos componentes filhos
jest.mock('@/presentation/components/ui/entry-list-item', () => ({
  EntryListItem: ({ entry }: { entry: EntryModel }) => (
    <div data-testid={`entry-${entry.id}`}>
      {entry.description} - {entry.categoryName}
    </div>
  ),
}));

jest.mock('@/presentation/components/client/pagination', () => ({
  Pagination: ({
    currentPage,
    totalPages,
  }: {
    currentPage: number;
    totalPages: number;
  }) => (
    <div data-testid='pagination'>
      Page {currentPage} of {totalPages}
    </div>
  ),
}));

const { loadEntriesByMonthAction: mockLoadEntriesByMonthAction } =
  jest.requireMock('@/presentation/actions');
const { makeRemoteLoadEntriesByMonth } = jest.requireMock(
  '@/main/factories/usecases'
);
const { makeLocalStorageAdapter } = jest.requireMock(
  '@/main/factories/storage'
);

describe('EntriesListPage', () => {
  const mockEntries: EntryModel[] = [
    {
      id: '1',
      description: 'Salário',
      amount: 500000,
      type: 'INCOME',
      isFixed: false,
      categoryId: 'cat1',
      categoryName: 'Trabalho',
      userId: 'user1',
      date: new Date('2024-01-15'),
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
    },
    {
      id: '2',
      description: 'Aluguel',
      amount: 150000,
      type: 'EXPENSE',
      isFixed: true,
      categoryId: 'cat2',
      categoryName: 'Moradia',
      userId: 'user1',
      date: new Date('2024-01-10'),
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-10'),
    },
  ];

  const mockSearchParams = {
    month: '1',
    year: '2024',
    page: '1',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render entries list page with data', async () => {
    mockLoadEntriesByMonthAction.mockResolvedValue({
      data: mockEntries,
      meta: {
        page: 1,
        totalPages: 1,
        totalItems: 2,
      },
    });

    await act(async () => {
      render(
        <React.Suspense fallback={<div>Loading...</div>}>
          <EntriesListPage searchParams={mockSearchParams} />
        </React.Suspense>
      );
    });

    expect(screen.getByText('Entradas do Mês')).toBeInTheDocument();
    expect(
      screen.getByText('Visualize e gerencie todas as suas receitas e despesas')
    ).toBeInTheDocument();
    expect(screen.getByText('Entradas do mês')).toBeInTheDocument();
    expect(screen.getByTestId('entry-1')).toBeInTheDocument();
    expect(screen.getByTestId('entry-2')).toBeInTheDocument();
    expect(screen.getByText(/Adicionar Nova Entrada/)).toBeInTheDocument();
    expect(screen.getByText(/Ver Resumo Mensal/)).toBeInTheDocument();
  });

  it('should render empty state when no entries', async () => {
    mockLoadEntriesByMonthAction.mockResolvedValue({
      data: [],
      meta: {
        page: 1,
        totalPages: 1,
        totalItems: 0,
      },
    });

    await act(async () => {
      render(
        <React.Suspense fallback={<div>Loading...</div>}>
          <EntriesListPage searchParams={mockSearchParams} />
        </React.Suspense>
      );
    });

    expect(screen.getByText('Nenhuma entrada encontrada.')).toBeInTheDocument();
  });

  it('should render pagination when totalPages > 1', async () => {
    mockLoadEntriesByMonthAction.mockResolvedValue({
      data: mockEntries,
      meta: {
        page: 1,
        totalPages: 3,
        totalItems: 6,
      },
    });

    await act(async () => {
      render(
        <React.Suspense fallback={<div>Loading...</div>}>
          <EntriesListPage searchParams={mockSearchParams} />
        </React.Suspense>
      );
    });

    // Verifica se a paginação está presente
    expect(screen.getByTestId('pagination')).toBeInTheDocument();
  });

  it('should not render pagination when totalPages = 1', async () => {
    mockLoadEntriesByMonthAction.mockResolvedValue({
      data: mockEntries,
      meta: {
        page: 1,
        totalPages: 1,
        totalItems: 2,
      },
    });

    await act(async () => {
      render(
        <React.Suspense fallback={<div>Loading...</div>}>
          <EntriesListPage searchParams={mockSearchParams} />
        </React.Suspense>
      );
    });

    // Verifica se a paginação não está presente
    expect(screen.queryByTestId('pagination')).not.toBeInTheDocument();
  });

  it('should render error state when action throws error', async () => {
    mockLoadEntriesByMonthAction.mockRejectedValue(new Error('API Error'));

    await act(async () => {
      render(
        <React.Suspense fallback={<div>Loading...</div>}>
          <EntriesListPage searchParams={mockSearchParams} />
        </React.Suspense>
      );
    });

    expect(
      screen.getByText('Erro ao carregar entradas. Tente novamente.')
    ).toBeInTheDocument();
  });

  it('should render quick action links correctly', async () => {
    mockLoadEntriesByMonthAction.mockResolvedValue({
      data: mockEntries,
      meta: {
        page: 1,
        totalPages: 1,
        totalItems: 2,
      },
    });

    await act(async () => {
      render(
        <React.Suspense fallback={<div>Loading...</div>}>
          <EntriesListPage searchParams={mockSearchParams} />
        </React.Suspense>
      );
    });

    const addEntryLink = screen.getByText(/Adicionar Nova Entrada/);
    const summaryLink = screen.getByText(/Ver Resumo Mensal/);

    expect(addEntryLink).toHaveAttribute('href', '/entries/add');
    expect(summaryLink).toHaveAttribute('href', '/summary');
  });

  it('should call loadEntriesByMonthAction with correct parameters', async () => {
    const mockLoadEntriesByMonth = jest.fn();
    const mockGetStorage = jest.fn();

    makeRemoteLoadEntriesByMonth.mockReturnValue(mockLoadEntriesByMonth);
    makeLocalStorageAdapter.mockReturnValue(mockGetStorage);

    mockLoadEntriesByMonthAction.mockResolvedValue({
      data: mockEntries,
      meta: {
        page: 1,
        totalPages: 1,
        totalItems: 2,
      },
    });

    await act(async () => {
      render(
        <React.Suspense fallback={<div>Loading...</div>}>
          <EntriesListPage searchParams={mockSearchParams} />
        </React.Suspense>
      );
    });

    expect(mockLoadEntriesByMonthAction).toHaveBeenCalledWith(
      mockSearchParams,
      mockLoadEntriesByMonth,
      mockGetStorage
    );
  });

  it('should handle multiple entries correctly', async () => {
    const multipleEntries = [
      ...mockEntries,
      {
        id: '3',
        description: 'Freelance',
        amount: 200000,
        type: 'INCOME',
        isFixed: false,
        categoryId: 'cat3',
        categoryName: 'Freelance',
        userId: 'user1',
        date: new Date('2024-01-20'),
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-20'),
      },
    ];

    mockLoadEntriesByMonthAction.mockResolvedValue({
      data: multipleEntries,
      meta: {
        page: 1,
        totalPages: 1,
        totalItems: 3,
      },
    });

    await act(async () => {
      render(
        <React.Suspense fallback={<div>Loading...</div>}>
          <EntriesListPage searchParams={mockSearchParams} />
        </React.Suspense>
      );
    });

    expect(screen.getByTestId('entry-1')).toBeInTheDocument();
    expect(screen.getByTestId('entry-2')).toBeInTheDocument();
    expect(screen.getByTestId('entry-3')).toBeInTheDocument();
  });

  it('should render with different search parameters', async () => {
    const differentSearchParams = {
      month: '12',
      year: '2023',
      page: '2',
    };

    mockLoadEntriesByMonthAction.mockResolvedValue({
      data: mockEntries,
      meta: {
        page: 2,
        totalPages: 1,
        totalItems: 2,
      },
    });

    await act(async () => {
      render(
        <React.Suspense fallback={<div>Loading...</div>}>
          <EntriesListPage searchParams={differentSearchParams} />
        </React.Suspense>
      );
    });

    // Garante que pelo menos uma chamada foi feita com os parâmetros esperados
    const found = mockLoadEntriesByMonthAction.mock.calls.some(
      ([params, fn]: [
        Record<string, string>,
        (...args: unknown[]) => unknown,
      ]) =>
        JSON.stringify(params) === JSON.stringify(differentSearchParams) &&
        typeof fn === 'function'
    );
    expect(found).toBe(true);
  });
});
