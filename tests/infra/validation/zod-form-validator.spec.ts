import { z } from 'zod';
import { ZodFormValidator } from '@/infra/validation/zod-form-validator';

describe('ZodFormValidator', () => {
  const testSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    age: z.number().min(18, 'Must be at least 18'),
    email: z.string().email('Invalid email'),
  });

  let sut: ZodFormValidator<{ name: string; age: number; email: string }>;

  beforeEach(() => {
    sut = new ZodFormValidator(testSchema);
  });

  describe('validate', () => {
    it('should return success with valid data', () => {
      const validData = {
        name: 'John Doe',
        age: 25,
        email: 'john@example.com',
      };

      const result = sut.validate(validData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it('should return errors for invalid data', () => {
      const invalidData = {
        name: '',
        age: 16,
        email: 'invalid-email',
      };

      const result = sut.validate(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors).toEqual({
          name: ['Name is required'],
          age: ['Must be at least 18'],
          email: ['Invalid email'],
        });
      }
    });

    it('should handle nested field errors', () => {
      const nestedSchema = z.object({
        user: z.object({
          profile: z.object({
            name: z.string().min(1, 'Name required'),
          }),
        }),
      });

      const validator = new ZodFormValidator(nestedSchema);
      const invalidData = {
        user: {
          profile: {
            name: '',
          },
        },
      };

      const result = validator.validate(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors?.['user.profile.name']).toEqual(['Name required']);
      }
    });

    it('should handle multiple errors for the same field', () => {
      const strictSchema = z.object({
        password: z
          .string()
          .min(8, 'Too short')
          .max(20, 'Too long')
          .regex(/[A-Z]/, 'Must contain uppercase'),
      });

      const validator = new ZodFormValidator(strictSchema);
      const invalidData = { password: 'short' };

      const result = validator.validate(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors?.password).toContain('Too short');
        expect(result.errors?.password).toContain('Must contain uppercase');
      }
    });

    it('should handle non-ZodError exceptions', () => {
      const mockSchema = {
        parse: jest.fn().mockImplementation(() => {
          throw new Error('Generic error');
        }),
      } as unknown as z.ZodSchema<unknown>;

      const validator = new ZodFormValidator(mockSchema);
      const result = validator.validate({});

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors).toEqual({
          general: ['Validation failed'],
        });
      }
    });
  });
});
