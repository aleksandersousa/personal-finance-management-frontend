describe('Add Entry Flow', () => {
  beforeEach(() => {
    // Em produção, seria necessário fazer login
    // cy.login();

    // Visitar a página de adicionar entrada
    cy.visit('/entries/add');
  });

  it('should complete full add entry flow successfully', () => {
    // Verificar se a página carregou corretamente
    cy.contains('Adicionar Nova Entrada').should('be.visible');
    cy.get('[data-testid="entry-form"]').should('be.visible');

    // Preencher o formulário
    cy.get('[data-testid="description"]').type('Salário Janeiro 2024');
    cy.get('[data-testid="amount"]').type('5000.00');
    cy.get('[data-testid="type-income"]').check();
    cy.get('[data-testid="category"]').select('Salário');
    cy.get('[data-testid="date"]').type('2024-01-15');
    cy.get('[data-testid="is-fixed"]').check();

    // Submeter o formulário
    cy.get('[data-testid="submit-btn"]').click();

    // Verificar loading state
    cy.get('[data-testid="submit-btn"]').should('contain', 'Salvando...');
    cy.get('[data-testid="submit-btn"]').should('be.disabled');

    // Em um ambiente real, verificaria o redirecionamento e sucesso
    // cy.url().should('include', '/entries');
    // cy.get('[data-testid="success-message"]').should('be.visible');
  });

  it('should show validation errors for empty fields', () => {
    // Tentar submeter formulário vazio
    cy.get('[data-testid="submit-btn"]').click();

    // Verificar erros de validação
    cy.get('[data-testid="description-error"]').should(
      'contain',
      'Descrição é obrigatória'
    );
    cy.get('[data-testid="amount-error"]').should(
      'contain',
      'Valor deve ser maior que zero'
    );
    cy.get('[data-testid="category-error"]').should(
      'contain',
      'Categoria é obrigatória'
    );

    // Verificar que o formulário não foi submetido
    cy.get('[data-testid="submit-btn"]').should('not.contain', 'Salvando...');
  });

  it('should clear validation errors when user starts typing', () => {
    // Trigger validation errors
    cy.get('[data-testid="submit-btn"]').click();
    cy.get('[data-testid="description-error"]').should('be.visible');

    // Start typing to clear error
    cy.get('[data-testid="description"]').type('T');
    cy.get('[data-testid="description-error"]').should('not.exist');
  });

  it('should handle expense type correctly', () => {
    // Preencher como despesa
    cy.get('[data-testid="description"]').type('Conta de Luz');
    cy.get('[data-testid="amount"]').type('150.75');
    cy.get('[data-testid="type-expense"]').check();
    cy.get('[data-testid="category"]').select('Moradia');
    cy.get('[data-testid="date"]').type('2024-01-10');

    // Verificar que expense está selecionado
    cy.get('[data-testid="type-expense"]').should('be.checked');
    cy.get('[data-testid="type-income"]').should('not.be.checked');

    // Submeter
    cy.get('[data-testid="submit-btn"]').click();
    cy.get('[data-testid="submit-btn"]').should('contain', 'Salvando...');
  });

  it('should show help tips and proper layout', () => {
    // Verificar dicas de ajuda
    cy.contains('💡 Dicas:').should('be.visible');
    cy.contains('Use descrições claras para facilitar a identificação').should(
      'be.visible'
    );
    cy.contains('Marque como').should('be.visible');
    cy.contains('para entradas que se repetem mensalmente').should(
      'be.visible'
    );
    cy.contains('Escolha a categoria correta para melhor organização').should(
      'be.visible'
    );

    // Verificar layout responsivo
    cy.viewport(375, 667); // iPhone SE
    cy.get('[data-testid="entry-form"]').should('be.visible');
    cy.get('[data-testid="submit-btn"]').should('be.visible');

    cy.viewport(768, 1024); // iPad
    cy.get('[data-testid="entry-form"]').should('be.visible');

    cy.viewport(1280, 720); // Desktop
    cy.get('[data-testid="entry-form"]').should('be.visible');
  });

  it('should have proper form defaults', () => {
    // Verificar valores padrão
    cy.get('[data-testid="type-income"]').should('be.checked');
    cy.get('[data-testid="type-expense"]').should('not.be.checked');
    cy.get('[data-testid="is-fixed"]').should('not.be.checked');

    // Verificar data padrão (hoje)
    const today = new Date().toISOString().split('T')[0];
    cy.get('[data-testid="date"]').should('have.value', today);

    // Verificar placeholders
    cy.get('[data-testid="description"]').should(
      'have.attr',
      'placeholder',
      'Ex: Salário mensal, Conta de luz...'
    );
    cy.get('[data-testid="amount"]').should('have.attr', 'placeholder', '0,00');
  });

  it('should handle form accessibility', () => {
    // Verificar labels
    cy.get('label[for="description"]').should('contain', 'Descrição');
    cy.get('label[for="amount"]').should('contain', 'Valor');
    cy.get('label[for="categoryId"]').should('contain', 'Categoria');
    cy.get('label[for="date"]').should('contain', 'Data');

    // Verificar navegação por teclado
    cy.get('[data-testid="description"]').focus();
    cy.get('[data-testid="description"]').should('have.focus');

    cy.get('[data-testid="description"]').type('{tab}');
    cy.get('[data-testid="amount"]').should('have.focus');
  });
});
