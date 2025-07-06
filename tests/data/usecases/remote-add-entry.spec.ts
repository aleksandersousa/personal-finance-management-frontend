import { RemoteAddEntry } from '@/data/usecases';
import { AddEntryParams } from '@/domain/usecases';
import { mockHttpClient } from '../mocks';

describe('RemoteAddEntry', () => {
  let sut: RemoteAddEntry;
  const url = 'http://localhost:3001/entries';

  beforeEach(() => {
    sut = new RemoteAddEntry(url, mockHttpClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call HttpClient.post with correct values', async () => {
    const params: AddEntryParams = {
      description: 'Test entry',
      amount: 10050, // 100.50 in cents
      type: 'INCOME',
      categoryId: 'category-1',
      userId: 'user-1',
      date: new Date('2024-01-01'),
      isFixed: false,
    };

    mockHttpClient.post.mockResolvedValueOnce({
      id: 'entry-1',
      ...params,
      categoryName: 'Test Category',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    });

    await sut.add(params);

    expect(mockHttpClient.post).toHaveBeenCalledWith(url, params);
  });

  it('should return entry on success', async () => {
    const params: AddEntryParams = {
      description: 'Test entry',
      amount: 10050,
      type: 'EXPENSE',
      categoryId: 'category-1',
      userId: 'user-1',
      date: new Date('2024-01-01'),
      isFixed: true,
    };

    const apiResponse = {
      id: 'entry-1',
      ...params,
      date: '2024-01-01T00:00:00.000Z',
      categoryName: 'Test Category',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    };

    const expectedEntry = {
      id: 'entry-1',
      description: 'Test entry',
      amount: 10050,
      type: 'EXPENSE',
      categoryId: 'category-1',
      categoryName: 'Test Category',
      userId: 'user-1',
      date: new Date('2024-01-01'),
      isFixed: true,
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
      updatedAt: new Date('2024-01-01T00:00:00.000Z'),
    };

    mockHttpClient.post.mockResolvedValueOnce(apiResponse);

    const result = await sut.add(params);

    expect(result).toEqual(expectedEntry);
  });

  it('should throw error when HttpClient.post throws', async () => {
    const params: AddEntryParams = {
      description: 'Test entry',
      amount: 10050,
      type: 'INCOME',
      categoryId: 'category-1',
      userId: 'user-1',
      date: new Date('2024-01-01'),
      isFixed: false,
    };

    mockHttpClient.post.mockRejectedValueOnce(new Error('Network error'));

    await expect(sut.add(params)).rejects.toThrow('Network error');
  });

  it('should use "Unknown" as default categoryName when categoryName is not provided', async () => {
    const params: AddEntryParams = {
      description: 'Test entry',
      amount: 10050,
      type: 'INCOME',
      categoryId: 'category-1',
      userId: 'user-1',
      date: new Date('2024-01-01'),
      isFixed: false,
    };

    const apiResponse = {
      id: 'entry-1',
      description: 'Test entry',
      amount: 10050,
      type: 'INCOME' as const,
      categoryId: 'category-1',
      // categoryName is undefined
      userId: 'user-1',
      date: '2024-01-01T00:00:00.000Z',
      isFixed: false,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    };

    mockHttpClient.post.mockResolvedValueOnce(apiResponse);

    const result = await sut.add(params);

    expect(result.categoryName).toBe('Unknown');
  });
});
