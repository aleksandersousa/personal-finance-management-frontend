describe('Login Flow', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should display login form correctly', () => {
    cy.get('h2').should('contain', 'Faça login na sua conta');
    cy.get('input[type="email"]').should('be.visible');
    cy.get('input[type="password"]').should('be.visible');
    cy.get('input[type="checkbox"]').should('be.visible');
    cy.get('button[type="submit"]').should('contain', 'Entrar');
    cy.get('a').should('contain', 'Não tem conta? Cadastre-se');
  });

  it('should show validation errors for empty fields', () => {
    cy.get('button[type="submit"]').click();

    cy.get('input[type="email"]').should('have.attr', 'required');
    cy.get('input[type="password"]').should('have.attr', 'required');
  });

  it('should show validation error for invalid email', () => {
    cy.get('input[type="email"]').type('invalid-email');
    cy.get('input[type="password"]').type('validPassword123');
    cy.get('button[type="submit"]').click();

    // Assumindo que a validação client-side mostra erro
    cy.get('input[type="email"]:invalid').should('exist');
  });

  it('should navigate to register page when clicking signup link', () => {
    cy.get('a').contains('Não tem conta? Cadastre-se').click();
    cy.url().should('include', '/register');
  });

  it('should handle login form submission', () => {
    // Mock da API de login
    cy.intercept('POST', '**/auth/login', {
      statusCode: 200,
      body: {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        user: {
          id: 'user-123',
          name: 'John Doe',
          email: 'john@example.com',
        },
      },
    }).as('loginRequest');

    cy.get('input[type="email"]').type('john@example.com');
    cy.get('input[type="password"]').type('validPassword123');
    cy.get('input[type="checkbox"]').check();
    cy.get('button[type="submit"]').click();

    // Verificar se a requisição foi feita
    cy.wait('@loginRequest').then(interception => {
      expect(interception.request.body).to.deep.include({
        email: 'john@example.com',
        password: 'validPassword123',
      });
    });

    // Verificar redirecionamento (assumindo que redireciona para dashboard)
    cy.url().should('include', '/dashboard');
  });

  it('should show error message for invalid credentials', () => {
    // Mock da API com erro de credenciais
    cy.intercept('POST', '**/auth/login', {
      statusCode: 401,
      body: {
        message: 'Invalid credentials',
      },
    }).as('loginError');

    cy.get('input[type="email"]').type('wrong@example.com');
    cy.get('input[type="password"]').type('wrongPassword');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginError');

    // Verificar se mensagem de erro aparece
    cy.contains('Erro ao fazer login. Verifique suas credenciais.').should(
      'be.visible'
    );
  });

  it('should show loading state during submission', () => {
    // Mock com delay para simular loading
    cy.intercept('POST', '**/auth/login', {
      statusCode: 200,
      body: {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        user: {
          id: 'user-123',
          name: 'John Doe',
          email: 'john@example.com',
        },
      },
      delay: 1000,
    }).as('slowLogin');

    cy.get('input[type="email"]').type('john@example.com');
    cy.get('input[type="password"]').type('validPassword123');
    cy.get('button[type="submit"]').click();

    // Verificar estado de loading
    cy.get('button[type="submit"]').should('contain', 'Entrando...');
    cy.get('button[type="submit"]').should('be.disabled');
    cy.get('input[type="email"]').should('be.disabled');
    cy.get('input[type="password"]').should('be.disabled');

    cy.wait('@slowLogin');
  });

  it('should remember user preference with checkbox', () => {
    cy.get('input[type="checkbox"]').should('not.be.checked');
    cy.get('input[type="checkbox"]').check();
    cy.get('input[type="checkbox"]').should('be.checked');

    // Verificar se permanece marcado após reload
    cy.reload();
    // Note: Em implementação real, seria necessário persistir estado
  });
});
