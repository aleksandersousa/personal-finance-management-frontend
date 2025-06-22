import { addEntryAction } from '@/presentation/actions/add-entry-action';
import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

// Mock Next.js functions
jest.mock('next/cache', () => ({
  revalidateTag: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

const mockRevalidateTag = revalidateTag as jest.MockedFunction<
  typeof revalidateTag
>;
const mockRedirect = redirect as jest.MockedFunction<typeof redirect>;

describe('addEntryAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should process form data and call revalidateTag and redirect', async () => {
    const formData = new FormData();
    formData.append('description', 'Test entry');
    formData.append('amount', '100.50');
    formData.append('type', 'INCOME');
    formData.append('categoryId', 'category-1');
    formData.append('date', '2024-01-01');
    formData.append('isFixed', 'true');

    await addEntryAction(formData);

    expect(mockRevalidateTag).toHaveBeenCalledWith('entries');
    expect(mockRedirect).toHaveBeenCalledWith('/entries');
  });

  it('should handle EXPENSE type correctly', async () => {
    const consoleSpy = jest.spyOn(console, 'log');
    const formData = new FormData();
    formData.append('description', 'Test expense');
    formData.append('amount', '50.25');
    formData.append('type', 'EXPENSE');
    formData.append('categoryId', 'category-2');
    formData.append('date', '2024-02-01');
    formData.append('isFixed', 'false');

    await addEntryAction(formData);

    expect(consoleSpy).toHaveBeenCalledWith('Adding entry:', {
      description: 'Test expense',
      amount: 50.25,
      type: 'EXPENSE',
      categoryId: 'category-2',
      date: new Date('2024-02-01'),
      isFixed: false,
      userId: 'mock-user-id',
    });
  });

  it('should handle boolean conversion for isFixed', async () => {
    const consoleSpy = jest.spyOn(console, 'log');

    // Test with 'true'
    const formData1 = new FormData();
    formData1.append('description', 'Test');
    formData1.append('amount', '100');
    formData1.append('type', 'INCOME');
    formData1.append('categoryId', 'cat-1');
    formData1.append('date', '2024-01-01');
    formData1.append('isFixed', 'true');

    await addEntryAction(formData1);

    expect(consoleSpy).toHaveBeenCalledWith(
      'Adding entry:',
      expect.objectContaining({
        isFixed: true,
      })
    );

    // Test with 'false' or any other value
    const formData2 = new FormData();
    formData2.append('description', 'Test');
    formData2.append('amount', '100');
    formData2.append('type', 'INCOME');
    formData2.append('categoryId', 'cat-1');
    formData2.append('date', '2024-01-01');
    formData2.append('isFixed', 'false');

    await addEntryAction(formData2);

    expect(consoleSpy).toHaveBeenCalledWith(
      'Adding entry:',
      expect.objectContaining({
        isFixed: false,
      })
    );
  });

  it('should handle errors and throw them', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error');

    // Mock revalidateTag to throw an error
    mockRevalidateTag.mockImplementationOnce(() => {
      throw new Error('Revalidation failed');
    });

    const formData = new FormData();
    formData.append('description', 'Test');
    formData.append('amount', '100');
    formData.append('type', 'INCOME');
    formData.append('categoryId', 'cat-1');
    formData.append('date', '2024-01-01');
    formData.append('isFixed', 'false');

    await expect(addEntryAction(formData)).rejects.toThrow(
      'Revalidation failed'
    );
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error adding entry:',
      expect.any(Error)
    );
  });

  it('should use mock user ID', async () => {
    const consoleSpy = jest.spyOn(console, 'log');
    const formData = new FormData();
    formData.append('description', 'Test');
    formData.append('amount', '100');
    formData.append('type', 'INCOME');
    formData.append('categoryId', 'cat-1');
    formData.append('date', '2024-01-01');
    formData.append('isFixed', 'false');

    await addEntryAction(formData);

    expect(consoleSpy).toHaveBeenCalledWith(
      'Adding entry:',
      expect.objectContaining({
        userId: 'mock-user-id',
      })
    );
  });
});
