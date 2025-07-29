import { RemoteLoadCashFlowForecast } from '@/data/usecases';
import { LoadCashFlowForecastParams } from '@/domain/usecases';
import { HttpClient } from '@/data/protocols/http';

const mockHttpClient: jest.Mocked<HttpClient> = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
};

describe('RemoteLoadCashFlowForecast', () => {
  let sut: RemoteLoadCashFlowForecast;
  const url = 'http://localhost:3001';

  beforeEach(() => {
    sut = new RemoteLoadCashFlowForecast(url, mockHttpClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call HttpClient.get with correct URL and query params', async () => {
    const params: LoadCashFlowForecastParams = {
      userId: 'user-1',
      filters: {
        period: 6,
        includeVariableProjections: true,
        confidenceThreshold: 'MEDIUM',
      },
    };

    const mockApiResponse = {
      id: 'forecast-1',
      userId: 'user-1',
      forecastPeriod: 6,
      monthlyData: [
        {
          month: '2024-02-01T00:00:00.000Z',
          projectedIncome: 500000,
          projectedExpenses: 300000,
          projectedBalance: 200000,
          cumulativeBalance: 200000,
          fixedIncomes: [],
          fixedExpenses: [],
          projectedVariableIncomes: 100000,
          projectedVariableExpenses: 50000,
          confidence: 'HIGH',
        },
      ],
      generatedAt: '2024-01-01T00:00:00.000Z',
      basedOnDataUntil: '2024-01-01T00:00:00.000Z',
    };

    mockHttpClient.get.mockResolvedValueOnce(mockApiResponse);

    await sut.load(params);

    const expectedUrl = `${url}/users/${params.userId}/cash-flow-forecast?period=6&includeVariableProjections=true&confidenceThreshold=MEDIUM`;
    expect(mockHttpClient.get).toHaveBeenCalledWith(expectedUrl);
  });

  it('should return CashFlowForecast with correct data transformation', async () => {
    const params: LoadCashFlowForecastParams = {
      userId: 'user-1',
      filters: {
        period: 3,
        includeVariableProjections: false,
        confidenceThreshold: 'HIGH',
      },
    };

    const mockApiResponse = {
      id: 'forecast-1',
      userId: 'user-1',
      forecastPeriod: 3,
      monthlyData: [
        {
          month: '2024-02-01T00:00:00.000Z',
          projectedIncome: 500000,
          projectedExpenses: 300000,
          projectedBalance: 200000,
          cumulativeBalance: 200000,
          fixedIncomes: [
            {
              id: 'entry-1',
              description: 'Salário',
              amount: 400000,
              type: 'INCOME' as const,
              categoryId: 'cat-1',
              categoryName: 'Salário',
              isFixed: true as const,
            },
          ],
          fixedExpenses: [
            {
              id: 'entry-2',
              description: 'Aluguel',
              amount: 150000,
              type: 'EXPENSE' as const,
              categoryId: 'cat-2',
              categoryName: 'Moradia',
              isFixed: true as const,
            },
          ],
          projectedVariableIncomes: 100000,
          projectedVariableExpenses: 50000,
          confidence: 'HIGH' as const,
        },
      ],
      generatedAt: '2024-01-01T00:00:00.000Z',
      basedOnDataUntil: '2024-01-01T00:00:00.000Z',
    };

    mockHttpClient.get.mockResolvedValueOnce(mockApiResponse);

    const result = await sut.load(params);

    expect(result.id).toBe('forecast-1');
    expect(result.userId).toBe('user-1');
    expect(result.forecastPeriod).toBe(3);
    expect(result.monthlyData).toHaveLength(1);
    expect(result.monthlyData[0].month).toBeInstanceOf(Date);
    expect(result.monthlyData[0].projectedIncome).toBe(500000);
    expect(result.monthlyData[0].projectedExpenses).toBe(300000);
    expect(result.monthlyData[0].projectedBalance).toBe(200000);
    expect(result.monthlyData[0].cumulativeBalance).toBe(200000);
    expect(result.monthlyData[0].fixedIncomes).toHaveLength(1);
    expect(result.monthlyData[0].fixedExpenses).toHaveLength(1);
    expect(result.monthlyData[0].projectedVariableIncomes).toBe(100000);
    expect(result.monthlyData[0].projectedVariableExpenses).toBe(50000);
    expect(result.monthlyData[0].confidence).toBe('HIGH');
    expect(result.generatedAt).toBeInstanceOf(Date);
    expect(result.basedOnDataUntil).toBeInstanceOf(Date);
  });

  it('should build correct query params for different filter combinations', async () => {
    const testCases = [
      {
        filters: {
          period: 3,
          includeVariableProjections: true,
          confidenceThreshold: 'LOW',
        },
        expectedQuery:
          'period=3&includeVariableProjections=true&confidenceThreshold=LOW',
      },
      {
        filters: {
          period: 12,
          includeVariableProjections: false,
          confidenceThreshold: 'HIGH',
        },
        expectedQuery:
          'period=12&includeVariableProjections=false&confidenceThreshold=HIGH',
      },
    ] as const;

    for (const testCase of testCases) {
      const params: LoadCashFlowForecastParams = {
        userId: 'user-1',
        filters: testCase.filters,
      };

      const mockResponse = {
        id: 'forecast-1',
        userId: 'user-1',
        forecastPeriod: testCase.filters.period,
        monthlyData: [],
        generatedAt: '2024-01-01T00:00:00.000Z',
        basedOnDataUntil: '2024-01-01T00:00:00.000Z',
      };

      mockHttpClient.get.mockResolvedValueOnce(mockResponse);

      await sut.load(params);

      const expectedUrl = `${url}/users/${params.userId}/cash-flow-forecast?${testCase.expectedQuery}`;
      expect(mockHttpClient.get).toHaveBeenCalledWith(expectedUrl);

      jest.clearAllMocks();
    }
  });

  it('should handle empty monthly data', async () => {
    const params: LoadCashFlowForecastParams = {
      userId: 'user-1',
      filters: {
        period: 6,
        includeVariableProjections: true,
        confidenceThreshold: 'MEDIUM',
      },
    };

    const mockApiResponse = {
      id: 'forecast-1',
      userId: 'user-1',
      forecastPeriod: 6,
      monthlyData: [],
      generatedAt: '2024-01-01T00:00:00.000Z',
      basedOnDataUntil: '2024-01-01T00:00:00.000Z',
    };

    mockHttpClient.get.mockResolvedValueOnce(mockApiResponse);

    const result = await sut.load(params);

    expect(result.monthlyData).toHaveLength(0);
    expect(Array.isArray(result.monthlyData)).toBe(true);
  });

  it('should throw error when HttpClient throws', async () => {
    const params: LoadCashFlowForecastParams = {
      userId: 'user-1',
      filters: {
        period: 6,
        includeVariableProjections: true,
        confidenceThreshold: 'MEDIUM',
      },
    };

    const error = new Error('Network error');
    mockHttpClient.get.mockRejectedValueOnce(error);

    await expect(sut.load(params)).rejects.toThrow('Network error');
  });
});
