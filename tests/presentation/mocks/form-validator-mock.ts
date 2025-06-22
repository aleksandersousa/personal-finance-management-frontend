import { FormValidator } from '@/presentation/protocols/form-validator';

export const mockFormValidator = <T>(): jest.Mocked<FormValidator<T>> => ({
  validate: jest.fn(),
});
