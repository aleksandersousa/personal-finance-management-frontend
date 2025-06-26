import { z } from 'zod';
import { FormValidator, ValidationResult } from '@/presentation/protocols';

export class ZodFormValidator<T> implements FormValidator<T> {
  constructor(private readonly schema: z.ZodSchema<T>) {}

  validate(data: unknown): ValidationResult<T> {
    try {
      const validatedData = this.schema.parse(data);
      return {
        success: true,
        data: validatedData,
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string[]> = {};

        error.errors.forEach(err => {
          const path = err.path.join('.');
          if (!errors[path]) {
            errors[path] = [];
          }
          errors[path].push(err.message);
        });

        return {
          success: false,
          errors,
        };
      }

      return {
        success: false,
        errors: {
          general: ['Validation failed'],
        },
      };
    }
  }
}
