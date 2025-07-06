import { LocalStorageAdapter } from '@/infra/storage';

import 'jest-localstorage-mock';

const makeSut = (): LocalStorageAdapter => new LocalStorageAdapter();

describe('LocalStorageAdapter', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('Should call localStorage.setItem with correct values', async () => {
    const sut = makeSut();
    const key = 'test-key';
    const value = { test: 'value' };

    sut.set(key, value);

    expect(localStorage.setItem).toHaveBeenCalledWith(
      key,
      JSON.stringify(value)
    );
  });

  test('Should call localStorage.removeItem if value is null', async () => {
    const sut = makeSut();
    const key = 'test-key';

    sut.set(key, null);

    expect(localStorage.removeItem).toHaveBeenCalledWith(key);
  });

  test('Should call localStorage.getItem with correct value', async () => {
    const sut = makeSut();
    const key = 'test-key';
    const value = { test: 'value' };
    const getItemSpy = jest
      .spyOn(localStorage, 'getItem')
      .mockReturnValueOnce(JSON.stringify(value));

    const obj = sut.get(key);

    expect(obj).toEqual(value);
    expect(getItemSpy).toHaveBeenCalledWith(key);
  });

  test('Should return null when localStorage.getItem returns null', async () => {
    const sut = makeSut();
    const key = 'non-existent-key';
    const getItemSpy = jest
      .spyOn(localStorage, 'getItem')
      .mockReturnValueOnce(null);

    const result = sut.get(key);

    expect(result).toBeNull();
    expect(getItemSpy).toHaveBeenCalledWith(key);
  });
});
