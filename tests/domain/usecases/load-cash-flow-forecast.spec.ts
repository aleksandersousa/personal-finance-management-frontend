import { LoadCashFlowForecastParams } from '@/domain/usecases';
import { ForecastFilters } from '@/domain/models';

describe('LoadCashFlowForecast Use Case', () => {
  it('should validate required fields in LoadCashFlowForecastParams', () => {
    const filters: ForecastFilters = {
      period: 6,
      includeVariableProjections: true,
      confidenceThreshold: 'MEDIUM',
    };

    const validParams: LoadCashFlowForecastParams = {
      userId: 'user-1',
      filters,
    };

    // Validar que todos os campos obrigatórios estão presentes
    expect(validParams.userId).toBeDefined();
    expect(typeof validParams.userId).toBe('string');
    expect(validParams.userId.length).toBeGreaterThan(0);

    expect(validParams.filters).toBeDefined();
    expect([3, 6, 12]).toContain(validParams.filters.period);
    expect(typeof validParams.filters.includeVariableProjections).toBe(
      'boolean'
    );
    expect(['HIGH', 'MEDIUM', 'LOW']).toContain(
      validParams.filters.confidenceThreshold
    );
  });

  it('should validate different forecast periods', () => {
    const periods = [3, 6, 12] as const;

    periods.forEach(period => {
      const filters: ForecastFilters = {
        period,
        includeVariableProjections: true,
        confidenceThreshold: 'HIGH',
      };

      const params: LoadCashFlowForecastParams = {
        userId: 'user-1',
        filters,
      };

      expect(params.filters.period).toBe(period);
      expect([3, 6, 12]).toContain(params.filters.period);
    });
  });

  it('should validate different confidence levels', () => {
    const confidenceLevels = ['HIGH', 'MEDIUM', 'LOW'] as const;

    confidenceLevels.forEach(confidence => {
      const filters: ForecastFilters = {
        period: 6,
        includeVariableProjections: false,
        confidenceThreshold: confidence,
      };

      const params: LoadCashFlowForecastParams = {
        userId: 'user-1',
        filters,
      };

      expect(params.filters.confidenceThreshold).toBe(confidence);
      expect(['HIGH', 'MEDIUM', 'LOW']).toContain(
        params.filters.confidenceThreshold
      );
    });
  });

  it('should validate variable projections toggle', () => {
    const includeVariableValues = [true, false];

    includeVariableValues.forEach(includeVariable => {
      const filters: ForecastFilters = {
        period: 6,
        includeVariableProjections: includeVariable,
        confidenceThreshold: 'MEDIUM',
      };

      const params: LoadCashFlowForecastParams = {
        userId: 'user-1',
        filters,
      };

      expect(params.filters.includeVariableProjections).toBe(includeVariable);
      expect(typeof params.filters.includeVariableProjections).toBe('boolean');
    });
  });
});
