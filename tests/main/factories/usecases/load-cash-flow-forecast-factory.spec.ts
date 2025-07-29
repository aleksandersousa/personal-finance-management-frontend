import { makeRemoteLoadCashFlowForecast } from '@/main/factories/usecases';
import { LoadCashFlowForecast } from '@/domain/usecases';
import { RemoteLoadCashFlowForecast } from '@/data/usecases';

// Mock the dependencies
jest.mock('@/main/factories/http/fetch-http-client-factory', () => ({
  makeFetchHttpClient: () => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  }),
}));

jest.mock('@/main/factories/http/api-url-factory', () => ({
  makeApiUrl: () => 'http://localhost:3001',
}));

describe('makeRemoteLoadCashFlowForecast Factory', () => {
  it('should return LoadCashFlowForecast instance', () => {
    const loadCashFlowForecast = makeRemoteLoadCashFlowForecast();

    expect(loadCashFlowForecast).toBeDefined();
    expect(typeof loadCashFlowForecast.load).toBe('function');
  });

  it('should return RemoteLoadCashFlowForecast instance', () => {
    const loadCashFlowForecast = makeRemoteLoadCashFlowForecast();

    expect(loadCashFlowForecast).toBeInstanceOf(RemoteLoadCashFlowForecast);
  });

  it('should satisfy LoadCashFlowForecast interface', () => {
    const loadCashFlowForecast = makeRemoteLoadCashFlowForecast();

    // Should have the load method
    expect(loadCashFlowForecast).toHaveProperty('load');
    expect(typeof loadCashFlowForecast.load).toBe('function');

    // Should be assignable to interface
    const interfaceInstance: LoadCashFlowForecast = loadCashFlowForecast;
    expect(interfaceInstance).toBeDefined();
  });

  it('should create new instance on each call', () => {
    const instance1 = makeRemoteLoadCashFlowForecast();
    const instance2 = makeRemoteLoadCashFlowForecast();

    expect(instance1).not.toBe(instance2);
    expect(instance1).toBeInstanceOf(RemoteLoadCashFlowForecast);
    expect(instance2).toBeInstanceOf(RemoteLoadCashFlowForecast);
  });
});
