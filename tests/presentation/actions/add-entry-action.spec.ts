import { addEntryAction } from '@/presentation/actions';
import { EntryFormData } from '@/infra/validation';
import { AddEntry, AddEntryParams } from '@/domain/usecases';
import type { TokenStorage } from '@/data/protocols';

// Mock Next.js functions
jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

jest.mock('next/cache', () => ({
  revalidateTag: jest.fn(),
}));

const mockRedirect = jest.mocked(jest.requireMock('next/navigation').redirect);
const mockRevalidateTag = jest.mocked(
  jest.requireMock('next/cache').revalidateTag
);

const mockAddEntry: jest.Mocked<AddEntry> = {
  add: jest.fn(),
};

const mockTokenStorage: jest.Mocked<TokenStorage> = {
  setAccessToken: jest.fn(),
  getAccessToken: jest.fn(() => 'mock-access-token'),
  setRefreshToken: jest.fn(),
  getRefreshToken: jest.fn(),
  setTokens: jest.fn(),
  clearTokens: jest.fn(),
};

describe('addEntryAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should call addEntry.add with correct params', async () => {
    const entryData: EntryFormData = {
      description: 'Test Entry',
      amount: 100.5,
      type: 'INCOME',
      categoryId: 'category-1',
      date: new Date('2024-01-01'),
      isFixed: false,
    };

    const expectedParams: AddEntryParams = {
      description: 'Test Entry',
      amount: 10050, // Converted to cents
      type: 'INCOME',
      categoryId: 'category-1',
      date: new Date('2024-01-01'),
      isFixed: false,
      userId: 'mock-user-id',
    };

    mockAddEntry.add.mockResolvedValueOnce({
      id: 'entry-1',
      description: 'Test Entry',
      amount: 10050,
      type: 'INCOME',
      categoryId: 'category-1',
      categoryName: 'Test Category',
      userId: 'mock-user-id',
      date: new Date('2024-01-01'),
      isFixed: false,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    });

    await addEntryAction(entryData, mockAddEntry, mockTokenStorage);

    expect(mockAddEntry.add).toHaveBeenCalledWith(expectedParams);
  });

  it('should convert amount to cents correctly', async () => {
    const entryData: EntryFormData = {
      description: 'Test Entry',
      amount: 123.45,
      type: 'EXPENSE',
      categoryId: 'category-1',
      date: new Date('2024-01-01'),
      isFixed: true,
    };

    mockAddEntry.add.mockResolvedValueOnce({
      id: 'entry-1',
      description: 'Test Entry',
      amount: 12345,
      type: 'EXPENSE',
      categoryId: 'category-1',
      categoryName: 'Test Category',
      userId: 'mock-user-id',
      date: new Date('2024-01-01'),
      isFixed: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    });

    await addEntryAction(entryData, mockAddEntry, mockTokenStorage);

    expect(mockAddEntry.add).toHaveBeenCalledWith(
      expect.objectContaining({
        amount: 12345, // Should be converted to cents
      })
    );
  });

  it('should revalidate cache tags on success', async () => {
    const entryData: EntryFormData = {
      description: 'Test Entry',
      amount: 100.5,
      type: 'INCOME',
      categoryId: 'category-1',
      date: new Date('2024-01-01'),
      isFixed: false,
    };

    mockAddEntry.add.mockResolvedValueOnce({
      id: 'entry-1',
      description: 'Test Entry',
      amount: 10050,
      type: 'INCOME',
      categoryId: 'category-1',
      categoryName: 'Test Category',
      userId: 'mock-user-id',
      date: new Date('2024-01-01'),
      isFixed: false,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    });

    await addEntryAction(entryData, mockAddEntry, mockTokenStorage);

    expect(mockRevalidateTag).toHaveBeenCalledWith('entries');
    expect(mockRevalidateTag).toHaveBeenCalledWith('entries-mock-user-id');
  });

  it('should redirect to entries page on success', async () => {
    const entryData: EntryFormData = {
      description: 'Test Entry',
      amount: 100.5,
      type: 'INCOME',
      categoryId: 'category-1',
      date: new Date('2024-01-01'),
      isFixed: false,
    };

    mockAddEntry.add.mockResolvedValueOnce({
      id: 'entry-1',
      description: 'Test Entry',
      amount: 10050,
      type: 'INCOME',
      categoryId: 'category-1',
      categoryName: 'Test Category',
      userId: 'mock-user-id',
      date: new Date('2024-01-01'),
      isFixed: false,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    });

    await addEntryAction(entryData, mockAddEntry, mockTokenStorage);

    expect(mockRedirect).toHaveBeenCalledWith('/entries');
  });

  it('should log error and re-throw when addEntry fails', async () => {
    const consoleSpy = jest.spyOn(console, 'error');
    const entryData: EntryFormData = {
      description: 'Test Entry',
      amount: 100.5,
      type: 'INCOME',
      categoryId: 'category-1',
      date: new Date('2024-01-01'),
      isFixed: false,
    };

    const addEntryError = new Error('Failed to add entry');
    mockAddEntry.add.mockRejectedValueOnce(addEntryError);

    const promise = addEntryAction(entryData, mockAddEntry, mockTokenStorage);

    await expect(promise).rejects.toThrow('Failed to add entry');
    expect(consoleSpy).toHaveBeenCalledWith('Add entry error:', addEntryError);
    expect(mockRevalidateTag).not.toHaveBeenCalled();
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it('should handle addEntry error without calling revalidate or redirect', async () => {
    const entryData: EntryFormData = {
      description: 'Test Entry',
      amount: 100.5,
      type: 'INCOME',
      categoryId: 'category-1',
      date: new Date('2024-01-01'),
      isFixed: false,
    };

    mockAddEntry.add.mockRejectedValueOnce(new Error('Network error'));

    try {
      await addEntryAction(entryData, mockAddEntry, mockTokenStorage);
    } catch {
      // Expected to throw
    }

    expect(mockRevalidateTag).not.toHaveBeenCalled();
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it('should throw error when user is not authenticated', async () => {
    const entryData: EntryFormData = {
      description: 'Test Entry',
      amount: 100.5,
      type: 'INCOME',
      categoryId: 'category-1',
      date: new Date('2024-01-01'),
      isFixed: false,
    };

    const mockTokenStorageWithoutToken: jest.Mocked<TokenStorage> = {
      ...mockTokenStorage,
      getAccessToken: jest.fn(() => null),
    };

    const promise = addEntryAction(
      entryData,
      mockAddEntry,
      mockTokenStorageWithoutToken
    );

    await expect(promise).rejects.toThrow('Usuário não autenticado');
    expect(mockAddEntry.add).not.toHaveBeenCalled();
    expect(mockRevalidateTag).not.toHaveBeenCalled();
    expect(mockRedirect).not.toHaveBeenCalled();
  });
});
