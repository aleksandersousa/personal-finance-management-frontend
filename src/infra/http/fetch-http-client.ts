import { HttpClient } from '@/data/protocols';

class HttpError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly body?: unknown
  ) {
    super(message);
  }
}

export class FetchHttpClient implements HttpClient {
  private async parseResponse<T>(response: Response): Promise<T> {
    if (response.status === 204) {
      return undefined as T;
    }
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return undefined as T;
    }
    return (await response.json()) as T;
  }

  private async throwHttpError(response: Response): Promise<never> {
    let errorBody: unknown;
    try {
      errorBody = await response.json();
    } catch {
      errorBody = undefined;
    }
    throw new HttpError(
      `HTTP error! status: ${response.status}`,
      response.status,
      errorBody
    );
  }

  async get<T = unknown>(url: string, config?: RequestInit): Promise<T> {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers,
      },
      ...config,
    });

    if (!response.ok) {
      await this.throwHttpError(response);
    }

    return this.parseResponse<T>(response);
  }

  async post<T = unknown>(
    url: string,
    data?: any,
    config?: RequestInit
  ): Promise<T> {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      await this.throwHttpError(response);
    }

    return this.parseResponse<T>(response);
  }

  async put<T = unknown>(
    url: string,
    data?: any,
    config?: RequestInit
  ): Promise<T> {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      await this.throwHttpError(response);
    }

    return this.parseResponse<T>(response);
  }

  async patch<T = unknown>(
    url: string,
    data?: unknown,
    config?: RequestInit
  ): Promise<T> {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      await this.throwHttpError(response);
    }

    return this.parseResponse<T>(response);
  }

  async delete<T = unknown>(url: string, config?: RequestInit): Promise<T> {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers,
      },
    });

    if (!response.ok) {
      await this.throwHttpError(response);
    }

    return this.parseResponse<T>(response);
  }
}
