/// <reference types="jest" />

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveTextContent(text: string | RegExp): R;
      toHaveAttribute(attr: string, value?: string): R;
      toHaveClass(...classNames: string[]): R;
      toHaveValue(value: string | number): R;
      toBeRequired(): R;
      toBeDisabled(): R;
      toHaveLength(length: number): R;
      toBeTruthy(): R;
      toBeFalsy(): R;
      toBeDefined(): R;
      toBeUndefined(): R;
      toBeNull(): R;
      toBe(value: unknown): R;
      toEqual(value: unknown): R;
      toContain(value: unknown): R;
      toBeInstanceOf(constructor: new (...args: unknown[]) => unknown): R;
      toBeGreaterThan(value: number): R;
      toBeGreaterThanOrEqual(value: number): R;
      toBeLessThan(value: number): R;
      toBeLessThanOrEqual(value: number): R;
      toHaveBeenCalled(): R;
      toHaveBeenCalledTimes(times: number): R;
      toHaveBeenCalledWith(...args: unknown[]): R;
      toHaveBeenLastCalledWith(...args: unknown[]): R;
      toHaveBeenNthCalledWith(call: number, ...args: unknown[]): R;
      toHaveReturnedWith(value: unknown): R;
      toHaveReturnedTimes(times: number): R;
      toThrow(error?: string | RegExp | Error): R;
      toThrowError(error?: string | RegExp | Error): R;
      resolves: jest.Matchers<Promise<R>>;
      rejects: jest.Matchers<Promise<R>>;
    }

    interface Expect {
      any(constructor: new (...args: unknown[]) => unknown): unknown;
      anything(): unknown;
      arrayContaining(array: readonly unknown[]): unknown;
      objectContaining(object: Record<string, unknown>): unknown;
      stringContaining(string: string): unknown;
      stringMatching(regexp: RegExp | string): unknown;
    }
  }
}

import '@testing-library/jest-dom';
