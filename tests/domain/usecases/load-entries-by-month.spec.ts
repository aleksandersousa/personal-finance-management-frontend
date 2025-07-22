import {
  LoadEntriesByMonthParams,
  LoadEntriesByMonthResult,
} from '@/domain/usecases/load-entries-by-month';
import { EntryModel } from '@/domain/models';

describe('LoadEntriesByMonth Use Case', () => {
  it('should accept required and optional params', () => {
    const params: LoadEntriesByMonthParams = {
      month: '2024-06',
      userId: 'user-1',
      page: 2,
      limit: 10,
      type: 'INCOME',
      categoryId: 'cat-1',
    };
    expect(params.month).toMatch(/\d{4}-\d{2}/);
    expect(params.userId).toBeDefined();
    expect(params.page).toBe(2);
    expect(params.limit).toBe(10);
    expect(params.type).toBe('INCOME');
    expect(params.categoryId).toBe('cat-1');
  });

  it('should have correct result structure', () => {
    const entry: EntryModel = {
      id: 'entry-1',
      amount: 10000,
      description: 'Salário',
      type: 'INCOME',
      isFixed: true,
      categoryId: 'cat-1',
      categoryName: 'Salário',
      userId: 'user-1',
      date: new Date('2024-06-01'),
      createdAt: new Date('2024-06-01T10:00:00Z'),
      updatedAt: new Date('2024-06-01T10:00:00Z'),
    };
    const result: LoadEntriesByMonthResult = {
      data: [entry],
      meta: {
        page: 1,
        limit: 20,
        total: 1,
        totalPages: 1,
      },
    };
    expect(result.data[0].description).toBe('Salário');
    expect(result.meta.page).toBe(1);
    expect(result.meta.limit).toBe(20);
  });
});
