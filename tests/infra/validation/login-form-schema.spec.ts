import { loginFormSchema } from '@/infra/validation';

describe('LoginFormSchema', () => {
  it('should validate correct login data', () => {
    const validData = {
      email: 'test@example.com',
      password: 'validPassword123',
      rememberMe: true,
    };

    const result = loginFormSchema.safeParse(validData);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validData);
    }
  });

  it('should validate without rememberMe field', () => {
    const validData = {
      email: 'test@example.com',
      password: 'validPassword123',
    };

    const result = loginFormSchema.safeParse(validData);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.rememberMe).toBeUndefined();
    }
  });

  it('should fail validation with invalid email', () => {
    const invalidData = {
      email: 'invalid-email',
      password: 'validPassword123',
    };

    const result = loginFormSchema.safeParse(invalidData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: ['email'],
            message: 'Email deve ter formato válido',
          }),
        ])
      );
    }
  });

  it('should fail validation with empty email', () => {
    const invalidData = {
      email: '',
      password: 'validPassword123',
    };

    const result = loginFormSchema.safeParse(invalidData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: ['email'],
            message: 'Email é obrigatório',
          }),
        ])
      );
    }
  });

  it('should fail validation with empty password', () => {
    const invalidData = {
      email: 'test@example.com',
      password: '',
    };

    const result = loginFormSchema.safeParse(invalidData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: ['password'],
            message: 'Senha é obrigatória',
          }),
        ])
      );
    }
  });

  it('should fail validation with short password', () => {
    const invalidData = {
      email: 'test@example.com',
      password: '1234567', // 7 characters
    };

    const result = loginFormSchema.safeParse(invalidData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: ['password'],
            message: 'Senha deve ter pelo menos 8 caracteres',
          }),
        ])
      );
    }
  });

  it('should validate with rememberMe as false', () => {
    const validData = {
      email: 'test@example.com',
      password: 'validPassword123',
      rememberMe: false,
    };

    const result = loginFormSchema.safeParse(validData);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.rememberMe).toBe(false);
    }
  });
});
