import { makeEntryFormValidator } from '@/main/factories/validation';
import { ZodFormValidator } from '@/infra/validation';

describe('makeEntryFormValidator', () => {
  it('should return a ZodFormValidator instance', () => {
    const validator = makeEntryFormValidator();

    expect(validator).toBeInstanceOf(ZodFormValidator);
  });

  it('should create a validator that validates entry form data correctly', () => {
    const validator = makeEntryFormValidator();

    const validData = {
      description: 'Test entry',
      amount: 100.5,
      type: 'INCOME' as const,
      categoryId: 'category-1',
      date: new Date('2024-01-01'),
      isFixed: false,
    };

    const result = validator.validate(validData);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validData);
    }
  });

  it('should create a validator that rejects invalid entry form data', () => {
    const validator = makeEntryFormValidator();

    const invalidData = {
      description: '',
      amount: -100,
      type: 'INVALID',
      categoryId: '',
      date: 'invalid-date',
      isFixed: 'not-boolean',
    };

    const result = validator.validate(invalidData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors?.description).toBeDefined();
      expect(result.errors?.amount).toBeDefined();
      expect(result.errors?.type).toBeDefined();
      expect(result.errors?.categoryId).toBeDefined();
      expect(result.errors?.date).toBeDefined();
    }
  });
});
