import { FormValidator } from '@/presentation/protocols';

export const mockFormValidator = <T>(): jest.Mocked<FormValidator<T>> => ({
  validate: jest.fn(),
});
