describe('Cash Flow Forecast Flow', () => {
  beforeEach(() => {
    // Mock API responses for forecast data
    cy.intercept('GET', '**/users/*/cash-flow-forecast*', {
      fixture: 'cash-flow-forecast.json',
    }).as('loadForecast');

    // Navigate to forecast page
    cy.visit('/forecast');
  });

  it('should display forecast page with default settings', () => {
    // Wait for initial data load
    cy.wait('@loadForecast');

    // Check page elements
    cy.contains('Previsão de Fluxo de Caixa').should('be.visible');
    cy.contains('Visualize suas projeções financeiras').should('be.visible');

    // Check default controls
    cy.get('[data-testid="period-select"]').should('contain', '6 meses');
    cy.get('[data-testid="confidence-select"]').should(
      'contain',
      'Média confiança'
    );
    cy.get('[data-testid="include-variable-checkbox"]').should('be.checked');
  });

  it('should update forecast when changing period', () => {
    cy.wait('@loadForecast');

    // Mock new request for 12 months
    cy.intercept('GET', '**/users/*/cash-flow-forecast*period=12*', {
      fixture: 'cash-flow-forecast-12months.json',
    }).as('loadForecast12');

    // Change period to 12 months
    cy.get('[data-testid="period-select"]').click();
    cy.contains('12 meses').click();

    // Verify new request was made
    cy.wait('@loadForecast12');

    // Verify chart updated (check for 12 data points)
    cy.get('[data-testid="cumulative-chart"]').should('be.visible');
    cy.get('[data-testid="monthly-chart"]').should('be.visible');
  });

  it('should update forecast when changing confidence threshold', () => {
    cy.wait('@loadForecast');

    // Mock new request for high confidence
    cy.intercept(
      'GET',
      '**/users/*/cash-flow-forecast*confidenceThreshold=HIGH*',
      {
        fixture: 'cash-flow-forecast-high-confidence.json',
      }
    ).as('loadForecastHigh');

    // Change confidence to high
    cy.get('[data-testid="confidence-select"]').click();
    cy.contains('Alta confiança').click();

    // Verify new request was made
    cy.wait('@loadForecastHigh');
  });

  it('should toggle variable projections', () => {
    cy.wait('@loadForecast');

    // Mock new request without variable projections
    cy.intercept(
      'GET',
      '**/users/*/cash-flow-forecast*includeVariableProjections=false*',
      {
        fixture: 'cash-flow-forecast-no-variable.json',
      }
    ).as('loadForecastNoVariable');

    // Uncheck variable projections
    cy.get('[data-testid="include-variable-checkbox"]').click();

    // Verify new request was made
    cy.wait('@loadForecastNoVariable');

    // Verify checkbox is unchecked
    cy.get('[data-testid="include-variable-checkbox"]').should(
      'not.be.checked'
    );
  });

  it('should refresh forecast data', () => {
    cy.wait('@loadForecast');

    // Mock refresh request
    cy.intercept('GET', '**/users/*/cash-flow-forecast*', {
      fixture: 'cash-flow-forecast-refreshed.json',
    }).as('refreshForecast');

    // Click refresh button
    cy.get('[data-testid="refresh-button"]').click();

    // Verify loading state
    cy.contains('Atualizando...').should('be.visible');

    // Verify new request was made
    cy.wait('@refreshForecast');

    // Verify loading state is gone
    cy.contains('Atualizando...').should('not.exist');
  });

  it('should display monthly details table', () => {
    cy.wait('@loadForecast');

    // Check table headers
    cy.contains('Detalhes Mensais').should('be.visible');
    cy.contains('Mês').should('be.visible');
    cy.contains('Receitas').should('be.visible');
    cy.contains('Despesas').should('be.visible');
    cy.contains('Saldo').should('be.visible');
    cy.contains('Acumulado').should('be.visible');
    cy.contains('Confiança').should('be.visible');

    // Check table rows (should have data for the period)
    cy.get('tbody tr').should('have.length.at.least', 1);

    // Check currency formatting
    cy.contains('R$').should('be.visible');
  });

  it('should show chart tooltips on hover', () => {
    cy.wait('@loadForecast');

    // Hover over first data point in cumulative chart
    cy.get('[data-testid="cumulative-chart"] circle')
      .first()
      .trigger('mouseover');

    // Check tooltip appears
    cy.get('[data-testid="chart-tooltip"]').should('be.visible');
    cy.get('[data-testid="chart-tooltip"]').should('contain', 'R$');
  });

  it('should handle error state gracefully', () => {
    // Mock API error
    cy.intercept('GET', '**/users/*/cash-flow-forecast*', {
      statusCode: 500,
      body: { error: 'Internal Server Error' },
    }).as('loadForecastError');

    cy.visit('/forecast');
    cy.wait('@loadForecastError');

    // Check error message
    cy.contains('Erro ao carregar previsão').should('be.visible');
    cy.contains('Não foi possível carregar a previsão').should('be.visible');

    // Verify fallback UI is shown
    cy.get('[data-testid="forecast-controls"]').should('be.visible');
  });

  it('should maintain URL parameters for filtering', () => {
    // Visit with specific parameters
    cy.visit(
      '/forecast?period=3&includeVariableProjections=false&confidenceThreshold=HIGH'
    );

    // Mock request with those parameters
    cy.intercept(
      'GET',
      '**/users/*/cash-flow-forecast*period=3*includeVariableProjections=false*confidenceThreshold=HIGH*',
      {
        fixture: 'cash-flow-forecast-custom.json',
      }
    ).as('loadCustomForecast');

    cy.wait('@loadCustomForecast');

    // Verify controls reflect URL parameters
    cy.get('[data-testid="period-select"]').should('contain', '3 meses');
    cy.get('[data-testid="confidence-select"]').should(
      'contain',
      'Alta confiança'
    );
    cy.get('[data-testid="include-variable-checkbox"]').should(
      'not.be.checked'
    );
  });

  it('should show cumulative and monthly balance charts', () => {
    cy.wait('@loadForecast');

    // Check both charts are present
    cy.get('[data-testid="cumulative-chart"]').should('be.visible');
    cy.contains('Saldo Acumulado').should('be.visible');

    cy.get('[data-testid="monthly-chart"]').should('be.visible');
    cy.contains('Saldo Mensal').should('be.visible');

    // Check charts have data points
    cy.get('[data-testid="cumulative-chart"] circle').should(
      'have.length.at.least',
      1
    );
    cy.get('[data-testid="monthly-chart"] circle').should(
      'have.length.at.least',
      1
    );
  });
});
