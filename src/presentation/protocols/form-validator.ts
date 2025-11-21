export interface FormValidator<T> {
  validate(data: unknown): ValidationResult<T>;
}

export type ValidationResult<T> = {
  success: boolean;
  data?: T;
  errors?: Record<string, string[]>;
};
