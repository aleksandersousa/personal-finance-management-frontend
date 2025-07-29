import {
  CashFlowForecast,
  MonthlyForecastData,
  ForecastEntry,
  ForecastPeriod,
  ConfidenceLevel,
  ForecastFilters,
} from '@/domain/models';

describe('CashFlowForecast Models', () => {
  describe('CashFlowForecast', () => {
    it('should have all required properties', () => {
      const forecast: CashFlowForecast = {
        id: 'forecast-1',
        userId: 'user-1',
        forecastPeriod: 6,
        monthlyData: [],
        generatedAt: new Date('2024-01-01'),
        basedOnDataUntil: new Date('2024-01-01'),
      };

      expect(forecast.id).toBeDefined();
      expect(forecast.userId).toBeDefined();
      expect([3, 6, 12]).toContain(forecast.forecastPeriod);
      expect(Array.isArray(forecast.monthlyData)).toBe(true);
      expect(forecast.generatedAt).toBeInstanceOf(Date);
      expect(forecast.basedOnDataUntil).toBeInstanceOf(Date);
    });
  });

  describe('MonthlyForecastData', () => {
    it('should have all required properties with correct types', () => {
      const monthlyData: MonthlyForecastData = {
        month: new Date('2024-02-01'),
        projectedIncome: 500000, // R$ 5000.00 em centavos
        projectedExpenses: 300000, // R$ 3000.00 em centavos
        projectedBalance: 200000, // R$ 2000.00 em centavos
        cumulativeBalance: 200000, // R$ 2000.00 em centavos
        fixedIncomes: [],
        fixedExpenses: [],
        projectedVariableIncomes: 100000, // R$ 1000.00 em centavos
        projectedVariableExpenses: 50000, // R$ 500.00 em centavos
        confidence: 'HIGH',
      };

      expect(monthlyData.month).toBeInstanceOf(Date);
      expect(typeof monthlyData.projectedIncome).toBe('number');
      expect(typeof monthlyData.projectedExpenses).toBe('number');
      expect(typeof monthlyData.projectedBalance).toBe('number');
      expect(typeof monthlyData.cumulativeBalance).toBe('number');
      expect(Array.isArray(monthlyData.fixedIncomes)).toBe(true);
      expect(Array.isArray(monthlyData.fixedExpenses)).toBe(true);
      expect(typeof monthlyData.projectedVariableIncomes).toBe('number');
      expect(typeof monthlyData.projectedVariableExpenses).toBe('number');
      expect(['HIGH', 'MEDIUM', 'LOW']).toContain(monthlyData.confidence);
    });

    it('should validate balance calculation logic', () => {
      const monthlyData: MonthlyForecastData = {
        month: new Date('2024-02-01'),
        projectedIncome: 500000,
        projectedExpenses: 300000,
        projectedBalance: 200000,
        cumulativeBalance: 200000,
        fixedIncomes: [],
        fixedExpenses: [],
        projectedVariableIncomes: 100000,
        projectedVariableExpenses: 50000,
        confidence: 'HIGH',
      };

      // Balance should be income - expenses
      const calculatedBalance =
        monthlyData.projectedIncome - monthlyData.projectedExpenses;
      expect(monthlyData.projectedBalance).toBe(calculatedBalance);
    });
  });

  describe('ForecastEntry', () => {
    it('should have all required properties for fixed entries', () => {
      const entry: ForecastEntry = {
        id: 'entry-1',
        description: 'Salário',
        amount: 400000, // R$ 4000.00 em centavos
        type: 'INCOME',
        categoryId: 'cat-1',
        categoryName: 'Salário',
        isFixed: true,
      };

      expect(entry.id).toBeDefined();
      expect(entry.description).toBeDefined();
      expect(typeof entry.amount).toBe('number');
      expect(['INCOME', 'EXPENSE']).toContain(entry.type);
      expect(entry.categoryId).toBeDefined();
      expect(entry.categoryName).toBeDefined();
      expect(entry.isFixed).toBe(true);
    });

    it('should validate amount is positive for expenses', () => {
      const expenseEntry: ForecastEntry = {
        id: 'entry-2',
        description: 'Aluguel',
        amount: 150000, // R$ 1500.00 em centavos
        type: 'EXPENSE',
        categoryId: 'cat-2',
        categoryName: 'Moradia',
        isFixed: true,
      };

      expect(expenseEntry.amount).toBeGreaterThan(0);
      expect(expenseEntry.type).toBe('EXPENSE');
    });
  });

  describe('ForecastPeriod', () => {
    it('should only allow valid period values', () => {
      const validPeriods: ForecastPeriod[] = [3, 6, 12];

      validPeriods.forEach(period => {
        expect([3, 6, 12]).toContain(period);
      });
    });
  });

  describe('ConfidenceLevel', () => {
    it('should only allow valid confidence values', () => {
      const validLevels: ConfidenceLevel[] = ['HIGH', 'MEDIUM', 'LOW'];

      validLevels.forEach(level => {
        expect(['HIGH', 'MEDIUM', 'LOW']).toContain(level);
      });
    });
  });

  describe('ForecastFilters', () => {
    it('should have all required properties with correct types', () => {
      const filters: ForecastFilters = {
        period: 6,
        includeVariableProjections: true,
        confidenceThreshold: 'MEDIUM',
      };

      expect([3, 6, 12]).toContain(filters.period);
      expect(typeof filters.includeVariableProjections).toBe('boolean');
      expect(['HIGH', 'MEDIUM', 'LOW']).toContain(filters.confidenceThreshold);
    });
  });
});
