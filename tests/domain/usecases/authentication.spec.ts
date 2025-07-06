import { AuthenticationParams, AuthenticationModel } from '@/domain/usecases';

describe('Authentication Use Case', () => {
  it('should validate required fields in AuthenticationParams', () => {
    const validParams: AuthenticationParams = {
      email: 'test@example.com',
      password: 'validPassword123',
      rememberMe: true,
    };

    // Validar que todos os campos obrigatórios estão presentes
    expect(validParams.email).toBeDefined();
    expect(validParams.email).toContain('@');
    expect(validParams.password).toBeDefined();
    expect(validParams.password.length).toBeGreaterThanOrEqual(8);
    expect(typeof validParams.rememberMe).toBe('boolean');
  });

  it('should validate AuthenticationModel structure', () => {
    const validModel: AuthenticationModel = {
      user: {
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
      },
      tokens: {
        accessToken: 'valid-access-token',
        refreshToken: 'valid-refresh-token',
        expiresIn: 900,
      },
    };

    // Validar estrutura do modelo de resposta
    expect(validModel.user).toBeDefined();
    expect(validModel.user.id).toBeDefined();
    expect(validModel.user.name).toBeDefined();
    expect(validModel.user.email).toBeDefined();
    expect(validModel.user.email).toContain('@');
    expect(validModel.tokens).toBeDefined();
    expect(validModel.tokens.accessToken).toBeDefined();
    expect(validModel.tokens.refreshToken).toBeDefined();
    expect(validModel.tokens.expiresIn).toBeDefined();
    expect(typeof validModel.tokens.expiresIn).toBe('number');
  });

  it('should allow optional rememberMe field', () => {
    const paramsWithoutRememberMe: AuthenticationParams = {
      email: 'test@example.com',
      password: 'validPassword123',
    };

    const paramsWithRememberMe: AuthenticationParams = {
      email: 'test@example.com',
      password: 'validPassword123',
      rememberMe: false,
    };

    expect(paramsWithoutRememberMe.rememberMe).toBeUndefined();
    expect(paramsWithRememberMe.rememberMe).toBe(false);
  });
});
