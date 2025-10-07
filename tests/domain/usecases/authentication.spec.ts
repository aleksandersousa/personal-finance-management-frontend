import { AuthenticationParams, AuthenticationModel } from '@/domain/usecases';

describe('Authentication Use Case', () => {
  it('should validate required fields in AuthenticationParams', () => {
    const validParams: AuthenticationParams = {
      email: 'test@example.com',
      password: 'validPassword123',
    };

    // Validar que todos os campos obrigatórios estão presentes
    expect(validParams.email).toBeDefined();
    expect(validParams.email).toContain('@');
    expect(validParams.password).toBeDefined();
    expect(validParams.password.length).toBeGreaterThanOrEqual(8);
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
});
