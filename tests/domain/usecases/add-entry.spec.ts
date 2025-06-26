import { AddEntry, AddEntryParams } from '@/domain/usecases/add-entry';
import { EntryModel } from '@/domain/models/entry';

class AddEntrySpy implements AddEntry {
  params!: AddEntryParams;
  result: EntryModel = {
    id: 'any_id',
    amount: 10000, // R$ 100,00 em centavos
    description: 'any_description',
    type: 'INCOME',
    isFixed: false,
    categoryId: 'any_category_id',
    categoryName: 'any_category_name',
    userId: 'any_user_id',
    date: new Date('2024-01-01'),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  async add(params: AddEntryParams): Promise<EntryModel> {
    this.params = params;
    return this.result;
  }
}

describe('AddEntry', () => {
  let addEntrySpy: AddEntrySpy;

  beforeEach(() => {
    addEntrySpy = new AddEntrySpy();
  });

  it('should call AddEntry with correct params', async () => {
    const params: AddEntryParams = {
      amount: 10000, // R$ 100,00 em centavos
      description: 'Test Entry',
      type: 'INCOME',
      isFixed: false,
      categoryId: 'category_id',
      userId: 'user_id',
      date: new Date('2024-01-01'),
    };

    await addEntrySpy.add(params);

    expect(addEntrySpy.params).toEqual(params);
  });

  it('should return an EntryModel', async () => {
    const params: AddEntryParams = {
      amount: 10000,
      description: 'Test Entry',
      type: 'INCOME',
      isFixed: false,
      categoryId: 'category_id',
      userId: 'user_id',
      date: new Date('2024-01-01'),
    };

    const result = await addEntrySpy.add(params);

    expect(result).toEqual(addEntrySpy.result);
  });

  it('should handle expense type correctly', async () => {
    const params: AddEntryParams = {
      amount: 5000, // R$ 50,00 em centavos
      description: 'Test Expense',
      type: 'EXPENSE',
      isFixed: true,
      categoryId: 'category_id',
      userId: 'user_id',
      date: new Date('2024-01-01'),
    };

    addEntrySpy.result = {
      ...addEntrySpy.result,
      amount: 5000,
      description: 'Test Expense',
      type: 'EXPENSE',
      isFixed: true,
    };

    const result = await addEntrySpy.add(params);

    expect(result.type).toBe('EXPENSE');
    expect(result.isFixed).toBe(true);
    expect(result.amount).toBe(5000);
  });
});
