import { FetchHttpClient } from '@/infra/http';

// Mock global fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('FetchHttpClient', () => {
  let sut: FetchHttpClient;

  beforeEach(() => {
    sut = new FetchHttpClient();
    mockFetch.mockClear();
  });

  describe('get', () => {
    it('should call fetch with correct values', async () => {
      // Arrange
      const url = 'http://any-url.com';
      const mockResponse = { data: 'any-data' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      // Act
      await sut.get(url);

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });

    it('should call fetch with custom config', async () => {
      // Arrange
      const url = 'http://any-url.com';
      const config = {
        headers: {
          Authorization: 'Bearer token',
        },
      };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      // Act
      await sut.get(url, config);

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(url, {
        method: 'GET',
        headers: {
          Authorization: 'Bearer token',
        },
      });
    });

    it('should return correct data on success', async () => {
      // Arrange
      const url = 'http://any-url.com';
      const mockResponse = { data: 'any-data' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      // Act
      const result = await sut.get(url);

      // Assert
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when response is not ok', async () => {
      // Arrange
      const url = 'http://any-url.com';
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      // Act & Assert
      await expect(sut.get(url)).rejects.toThrow('HTTP error! status: 404');
    });
  });

  describe('post', () => {
    it('should call fetch with correct values', async () => {
      // Arrange
      const url = 'http://any-url.com';
      const data = { field: 'value' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      // Act
      await sut.post(url, data);

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    });

    it('should call fetch without body when data is not provided', async () => {
      // Arrange
      const url = 'http://any-url.com';
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      // Act
      await sut.post(url);

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: undefined,
      });
    });

    it('should call fetch with custom config', async () => {
      // Arrange
      const url = 'http://any-url.com';
      const data = { field: 'value' };
      const config = {
        headers: {
          Authorization: 'Bearer token',
        },
      };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      // Act
      await sut.post(url, data, config);

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(url, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer token',
        },
        body: JSON.stringify(data),
      });
    });

    it('should return correct data on success', async () => {
      // Arrange
      const url = 'http://any-url.com';
      const data = { field: 'value' };
      const mockResponse = { id: 1, ...data };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      // Act
      const result = await sut.post(url, data);

      // Assert
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when response is not ok', async () => {
      // Arrange
      const url = 'http://any-url.com';
      const data = { field: 'value' };
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
      });

      // Act & Assert
      await expect(sut.post(url, data)).rejects.toThrow(
        'HTTP error! status: 400'
      );
    });
  });

  describe('put', () => {
    it('should call fetch with correct values', async () => {
      // Arrange
      const url = 'http://any-url.com';
      const data = { field: 'updated-value' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      // Act
      await sut.put(url, data);

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    });

    it('should call fetch without body when data is not provided', async () => {
      // Arrange
      const url = 'http://any-url.com';
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      // Act
      await sut.put(url);

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: undefined,
      });
    });

    it('should return correct data on success', async () => {
      // Arrange
      const url = 'http://any-url.com';
      const data = { field: 'updated-value' };
      const mockResponse = { id: 1, ...data };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      // Act
      const result = await sut.put(url, data);

      // Assert
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when response is not ok', async () => {
      // Arrange
      const url = 'http://any-url.com';
      const data = { field: 'updated-value' };
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      // Act & Assert
      await expect(sut.put(url, data)).rejects.toThrow(
        'HTTP error! status: 500'
      );
    });
  });

  describe('delete', () => {
    it('should call fetch with correct values', async () => {
      // Arrange
      const url = 'http://any-url.com';
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      // Act
      await sut.delete(url);

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });

    it('should call fetch with custom config', async () => {
      // Arrange
      const url = 'http://any-url.com';
      const config = {
        headers: {
          Authorization: 'Bearer token',
        },
      };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      // Act
      await sut.delete(url, config);

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(url, {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer token',
        },
      });
    });

    it('should return correct data on success', async () => {
      // Arrange
      const url = 'http://any-url.com';
      const mockResponse = { success: true };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      // Act
      const result = await sut.delete(url);

      // Assert
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when response is not ok', async () => {
      // Arrange
      const url = 'http://any-url.com';
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
      });

      // Act & Assert
      await expect(sut.delete(url)).rejects.toThrow('HTTP error! status: 403');
    });
  });
});
