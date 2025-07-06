import { addEntryAction } from '@/presentation/actions';
import { EntryFormData } from '@/infra/validation';

describe('addEntryAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should process entry data and log the converted params', async () => {
    const consoleSpy = jest.spyOn(console, 'log');
    const entryData: EntryFormData = {
      description: 'Test entry',
      amount: 100.5,
      type: 'INCOME',
      categoryId: 'category-1',
      date: new Date('2024-01-01'),
      isFixed: true,
    };

    await addEntryAction(entryData);

    expect(consoleSpy).toHaveBeenCalledWith('Adding entry:', {
      description: 'Test entry',
      amount: 10050, // Converted to cents
      type: 'INCOME',
      categoryId: 'category-1',
      date: new Date('2024-01-01'),
      isFixed: true,
      userId: 'mock-user-id',
    });
  });

  it('should handle EXPENSE type correctly', async () => {
    const consoleSpy = jest.spyOn(console, 'log');
    const entryData: EntryFormData = {
      description: 'Test expense',
      amount: 50.25,
      type: 'EXPENSE',
      categoryId: 'category-2',
      date: new Date('2024-02-01'),
      isFixed: false,
    };

    await addEntryAction(entryData);

    expect(consoleSpy).toHaveBeenCalledWith('Adding entry:', {
      description: 'Test expense',
      amount: 5025, // Converted to cents
      type: 'EXPENSE',
      categoryId: 'category-2',
      date: new Date('2024-02-01'),
      isFixed: false,
      userId: 'mock-user-id',
    });
  });

  it('should handle boolean values for isFixed', async () => {
    const consoleSpy = jest.spyOn(console, 'log');

    // Test with true
    const entryData1: EntryFormData = {
      description: 'Test',
      amount: 100,
      type: 'INCOME',
      categoryId: 'cat-1',
      date: new Date('2024-01-01'),
      isFixed: true,
    };

    await addEntryAction(entryData1);

    expect(consoleSpy).toHaveBeenCalledWith(
      'Adding entry:',
      expect.objectContaining({
        isFixed: true,
      })
    );

    // Test with false
    const entryData2: EntryFormData = {
      description: 'Test',
      amount: 100,
      type: 'INCOME',
      categoryId: 'cat-1',
      date: new Date('2024-01-01'),
      isFixed: false,
    };

    await addEntryAction(entryData2);

    expect(consoleSpy).toHaveBeenCalledWith(
      'Adding entry:',
      expect.objectContaining({
        isFixed: false,
      })
    );
  });

  it('should simulate API call delay', async () => {
    const entryData: EntryFormData = {
      description: 'Test',
      amount: 100,
      type: 'INCOME',
      categoryId: 'cat-1',
      date: new Date('2024-01-01'),
      isFixed: false,
    };

    const startTime = Date.now();
    await addEntryAction(entryData);
    const endTime = Date.now();

    // Should take at least 1000ms due to the setTimeout
    expect(endTime - startTime).toBeGreaterThanOrEqual(1000);
  });

  it('should use mock user ID', async () => {
    const consoleSpy = jest.spyOn(console, 'log');
    const entryData: EntryFormData = {
      description: 'Test',
      amount: 100,
      type: 'INCOME',
      categoryId: 'cat-1',
      date: new Date('2024-01-01'),
      isFixed: false,
    };

    await addEntryAction(entryData);

    expect(consoleSpy).toHaveBeenCalledWith(
      'Adding entry:',
      expect.objectContaining({
        userId: 'mock-user-id',
      })
    );
  });
});
