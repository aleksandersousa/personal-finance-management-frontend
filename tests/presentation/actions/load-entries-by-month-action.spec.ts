import { loadEntriesByMonthAction } from '@/presentation/actions/load-entries-by-month-action';
import {
  LoadEntriesByMonth,
  LoadEntriesByMonthResult,
} from '@/domain/usecases/load-entries-by-month';
import { GetStorage } from '@/data/protocols/storage';
import { UserModel } from '@/domain/models';

// Mock Next.js functions
jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

jest.mock('next/cache', () => ({
  revalidateTag: jest.fn(),
}));

describe('loadEntriesByMonthAction', () => {
  let mockLoadEntriesByMonth: jest.Mocked<LoadEntriesByMonth>;
  let mockGetStorage: jest.Mocked<GetStorage>;
  let mockUser: UserModel;

  beforeEach(() => {
    mockUser = {
      id: 'user-123',
      name: 'John Doe',
      email: 'john@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockGetStorage = {
      get: jest.fn().mockReturnValue(mockUser),
    };

    mockLoadEntriesByMonth = {
      load: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should load entries with default parameters', async () => {
    const searchParams = {};
    const expectedResult: LoadEntriesByMonthResult = {
      data: [],
      meta: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
      },
    };

    mockLoadEntriesByMonth.load.mockResolvedValueOnce(expectedResult);

    const result = await loadEntriesByMonthAction(
      searchParams,
      mockLoadEntriesByMonth,
      mockGetStorage
    );

    expect(mockGetStorage.get).toHaveBeenCalledWith('user');
    expect(mockLoadEntriesByMonth.load).toHaveBeenCalledWith({
      month: expect.stringMatching(/\d{4}-\d{2}/),
      userId: 'user-123',
      page: 1,
      limit: 20,
    });
    expect(result).toEqual(expectedResult);
  });

  it('should load entries with custom parameters', async () => {
    const searchParams = {
      month: '2024-06',
      page: '2',
      limit: '10',
      type: 'INCOME',
      categoryId: 'cat-123',
    };
    const expectedResult: LoadEntriesByMonthResult = {
      data: [],
      meta: {
        page: 2,
        limit: 10,
        total: 0,
        totalPages: 0,
      },
    };

    mockLoadEntriesByMonth.load.mockResolvedValueOnce(expectedResult);

    const result = await loadEntriesByMonthAction(
      searchParams,
      mockLoadEntriesByMonth,
      mockGetStorage
    );

    expect(mockLoadEntriesByMonth.load).toHaveBeenCalledWith({
      month: '2024-06',
      userId: 'user-123',
      page: 2,
      limit: 10,
      type: 'INCOME',
      categoryId: 'cat-123',
    });
    expect(result).toEqual(expectedResult);
  });

  it('should handle authentication error', async () => {
    const searchParams = {};
    mockGetStorage.get.mockReturnValue(null);

    await expect(
      loadEntriesByMonthAction(
        searchParams,
        mockLoadEntriesByMonth,
        mockGetStorage
      )
    ).rejects.toThrow('Usuário não autenticado');

    expect(mockLoadEntriesByMonth.load).not.toHaveBeenCalled();
  });

  it('should handle load entries error', async () => {
    const searchParams = {};
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    const loadError = new Error('Failed to load entries');

    mockLoadEntriesByMonth.load.mockRejectedValueOnce(loadError);

    await expect(
      loadEntriesByMonthAction(
        searchParams,
        mockLoadEntriesByMonth,
        mockGetStorage
      )
    ).rejects.toThrow('Failed to load entries');

    expect(consoleSpy).toHaveBeenCalledWith(
      'Load entries by month error:',
      loadError
    );
    consoleSpy.mockRestore();
  });

  it('should handle invalid page parameter', async () => {
    const searchParams = { page: 'invalid' };
    const expectedResult: LoadEntriesByMonthResult = {
      data: [],
      meta: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
      },
    };

    mockLoadEntriesByMonth.load.mockResolvedValueOnce(expectedResult);

    const result = await loadEntriesByMonthAction(
      searchParams,
      mockLoadEntriesByMonth,
      mockGetStorage
    );

    expect(mockLoadEntriesByMonth.load).toHaveBeenCalledWith({
      month: expect.stringMatching(/\d{4}-\d{2}/),
      userId: 'user-123',
      page: 1, // Should default to 1 for invalid input
      limit: 20,
    });
    expect(result).toEqual(expectedResult);
  });
});
