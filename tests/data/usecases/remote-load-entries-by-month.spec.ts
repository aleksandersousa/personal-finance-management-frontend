import { RemoteLoadEntriesByMonth } from '@/data/usecases/remote-load-entries-by-month';
import { mockHttpClient } from '../mocks/http-client-mock';
import {
  LoadEntriesByMonthParams,
  LoadEntriesByMonthResult,
} from '@/domain/usecases/load-entries-by-month';

describe('RemoteLoadEntriesByMonth', () => {
  let sut: RemoteLoadEntriesByMonth;
  const url = 'http://localhost:3001/entries';

  beforeEach(() => {
    sut = new RemoteLoadEntriesByMonth(url, mockHttpClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call HttpClient.get with correct query params', async () => {
    const params: LoadEntriesByMonthParams = {
      month: '2024-06',
      userId: 'user-1',
      page: 2,
      limit: 10,
      type: 'INCOME',
      categoryId: 'cat-1',
    };
    const expectedQuery =
      'month=2024-06&page=2&limit=10&type=INCOME&categoryId=cat-1';
    mockHttpClient.get.mockResolvedValueOnce({
      data: [],
      meta: { page: 2, limit: 10, total: 0, totalPages: 0 },
    });
    await sut.load(params);
    expect(mockHttpClient.get).toHaveBeenCalledWith(`${url}?${expectedQuery}`);
  });

  it('should return LoadEntriesByMonthResult on success', async () => {
    const params: LoadEntriesByMonthParams = {
      month: '2024-06',
      userId: 'user-1',
    };
    const mockResult: LoadEntriesByMonthResult = {
      data: [],
      meta: { page: 1, limit: 20, total: 0, totalPages: 0 },
    };
    mockHttpClient.get.mockResolvedValueOnce(mockResult);
    const result = await sut.load(params);
    expect(result).toEqual(mockResult);
  });
});
