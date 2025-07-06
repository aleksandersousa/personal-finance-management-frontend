# 🔌 API Integration Guide

## 📋 Visão Geral

Este documento contém todas as informações necessárias para o frontend consumir corretamente a API do Sistema de Gerenciamento Financeiro Pessoal. A API segue os padrões RESTful e está documentada com Swagger.

## 🏗️ Arquitetura da API

### Stack Tecnológico da API

- **Framework**: NestJS (TypeScript)
- **ORM**: TypeORM
- **Database**: PostgreSQL
- **Authentication**: JWT
- **Documentation**: Swagger (OpenAPI)
- **Architecture**: Clean Architecture + SOLID

### Base URL

```
# Development
http://localhost:3001/api

# Production
https://api.financial-management.com/api
```

## 🔐 Autenticação

### JWT Authentication Flow

A API utiliza JWT tokens para autenticação com refresh token pattern:

```typescript
// Tipos para autenticação
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // segundos
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
  };
  tokens: AuthTokens;
}
```

### Endpoints de Autenticação

#### Registro de Usuário

```http
POST /auth/register
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@exemplo.com",
  "password": "senhaSegura123"
}
```

**Response (201):**

```json
{
  "id": "uuid",
  "name": "João Silva",
  "email": "joao@exemplo.com",
  "createdAt": "2024-01-15T10:30:00Z",
  "tokens": {
    "accessToken": "jwt-access-token",
    "refreshToken": "jwt-refresh-token",
    "expiresIn": 900
  }
}
```

#### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "joao@exemplo.com",
  "password": "senhaSegura123"
}
```

**Response (200):**

```json
{
  "user": {
    "id": "uuid",
    "name": "João Silva",
    "email": "joao@exemplo.com"
  },
  "tokens": {
    "accessToken": "jwt-access-token",
    "refreshToken": "jwt-refresh-token",
    "expiresIn": 900
  }
}
```

#### Refresh Token

```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "jwt-refresh-token"
}
```

**Response (200):**

```json
{
  "accessToken": "new-jwt-access-token",
  "expiresIn": 900
}
```

### Headers de Autenticação

Para endpoints protegidos, incluir o header:

```http
Authorization: Bearer {accessToken}
```

## 💰 Endpoints Financeiros

### Modelos de Dados

```typescript
export interface EntryModel {
  id: string;
  amount: number; // em centavos
  description: string;
  type: 'INCOME' | 'EXPENSE';
  isFixed: boolean;
  categoryId: string;
  categoryName: string;
  userId: string;
  date: string; // ISO date
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
}

export interface CategoryModel {
  id: string;
  name: string;
  description?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface MonthlySummaryModel {
  month: string; // YYYY-MM
  totalIncome: number; // em centavos
  totalExpenses: number; // em centavos
  balance: number; // em centavos
  entriesCount: number;
}

export interface CashFlowForecastModel {
  month: string; // YYYY-MM
  projectedIncome: number; // em centavos
  projectedExpenses: number; // em centavos
  projectedBalance: number; // em centavos
  confidence: number; // 0-1
}
```

### Entries (Lançamentos)

#### Criar Entry

```http
POST /entries
Authorization: Bearer {token}
Content-Type: application/json

{
  "amount": 500000, // R$ 5000.00 em centavos
  "description": "Salário Janeiro",
  "type": "INCOME",
  "isFixed": true,
  "categoryId": "uuid-categoria",
  "date": "2024-01-15"
}
```

**Response (201):**

```json
{
  "id": "uuid",
  "amount": 500000,
  "description": "Salário Janeiro",
  "type": "INCOME",
  "isFixed": true,
  "categoryId": "uuid-categoria",
  "categoryName": "Salário",
  "userId": "uuid-user",
  "date": "2024-01-15T00:00:00Z",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

#### Listar Entries por Mês

```http
GET /entries?month=2024-01&page=1&limit=20
Authorization: Bearer {token}
```

**Query Parameters:**

- `month`: YYYY-MM (obrigatório)
- `page`: número da página (padrão: 1)
- `limit`: itens por página (padrão: 20, máx: 100)
- `type`: 'INCOME' | 'EXPENSE' (opcional)
- `categoryId`: UUID da categoria (opcional)

**Response (200):**

```json
{
  "data": [
    {
      "id": "uuid",
      "amount": 500000,
      "description": "Salário Janeiro",
      "type": "INCOME",
      "isFixed": true,
      "categoryId": "uuid-categoria",
      "categoryName": "Salário",
      "userId": "uuid-user",
      "date": "2024-01-15T00:00:00Z",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "totalPages": 1
  }
}
```

#### Atualizar Entry

```http
PUT /entries/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "amount": 550000,
  "description": "Salário Janeiro (Ajustado)",
  "type": "INCOME",
  "isFixed": true,
  "categoryId": "uuid-categoria",
  "date": "2024-01-15"
}
```

#### Deletar Entry

```http
DELETE /entries/{id}
Authorization: Bearer {token}
```

**Response (204):** No content

### Categories (Categorias)

#### Listar Categorias

```http
GET /categories
Authorization: Bearer {token}
```

**Response (200):**

```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Salário",
      "description": "Renda principal",
      "userId": "uuid-user",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

#### Criar Categoria

```http
POST /categories
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Alimentação",
  "description": "Gastos com comida"
}
```

### Summary (Resumo)

#### Resumo Mensal

```http
GET /summary/monthly?month=2024-01
Authorization: Bearer {token}
```

**Response (200):**

```json
{
  "month": "2024-01",
  "totalIncome": 500000,
  "totalExpenses": 300000,
  "balance": 200000,
  "entriesCount": 15,
  "categories": [
    {
      "categoryId": "uuid",
      "categoryName": "Salário",
      "total": 500000,
      "count": 1
    }
  ]
}
```

### Forecast (Previsão)

#### Previsão de Fluxo de Caixa

```http
GET /forecast/cash-flow?months=6
Authorization: Bearer {token}
```

**Query Parameters:**

- `months`: número de meses para projetar (padrão: 3, máx: 12)

**Response (200):**

```json
{
  "data": [
    {
      "month": "2024-02",
      "projectedIncome": 500000,
      "projectedExpenses": 300000,
      "projectedBalance": 200000,
      "confidence": 0.95
    }
  ]
}
```

## 🚨 Tratamento de Erros

### Códigos de Status HTTP

- **200**: Sucesso
- **201**: Criado com sucesso
- **204**: Sucesso sem conteúdo
- **400**: Dados inválidos
- **401**: Não autenticado
- **403**: Não autorizado
- **404**: Recurso não encontrado
- **422**: Erro de validação
- **500**: Erro interno do servidor

### Formato de Erro

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "details": [
    {
      "field": "amount",
      "message": "Amount must be a positive number"
    }
  ]
}
```

### Erros Comuns

#### Token Expirado (401)

```json
{
  "statusCode": 401,
  "message": "Token expired",
  "error": "Unauthorized"
}
```

**Ação**: Usar refresh token para obter novo access token

#### Recurso Não Encontrado (404)

```json
{
  "statusCode": 404,
  "message": "Entry not found",
  "error": "Not Found"
}
```

#### Validação Falhou (422)

```json
{
  "statusCode": 422,
  "message": "Validation failed",
  "error": "Unprocessable Entity",
  "details": [
    {
      "field": "email",
      "message": "Email must be a valid email address"
    }
  ]
}
```

## 🔧 Implementação no Frontend (Next.js 15)

### A. HTTP Client Implementation (Fetch-based)

```typescript
// src/infra/http/fetch-http-client.ts
import { HttpClient } from '@/data/protocols/http';

export class FetchHttpClient implements HttpClient {
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
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async post<T = unknown>(
    url: string,
    data?: unknown,
    config?: RequestInit
  ): Promise<T> {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
      ...config,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async put<T = unknown>(
    url: string,
    data?: unknown,
    config?: RequestInit
  ): Promise<T> {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
      ...config,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async delete<T = unknown>(url: string, config?: RequestInit): Promise<T> {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers,
      },
      ...config,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}
```

### B. HTTP Client Decorator para Autenticação

```typescript
// src/main/decorators/authorize-http-client-decorator.ts
import { HttpClient } from '@/data/protocols/http';
import { GetStorage } from '@/data/protocols/storage';
import type { AuthTokens } from '@/domain';

export class AuthorizeHttpClientDecorator implements HttpClient {
  constructor(
    private readonly getStorage: GetStorage,
    private readonly httpClient: HttpClient
  ) {}

  private addAuthorizationHeader(config?: unknown): unknown {
    const tokens = this.getStorage.get('tokens') as AuthTokens;

    if (tokens?.accessToken) {
      const configObj = config as Record<string, unknown> | undefined;
      return {
        ...configObj,
        headers: {
          ...(configObj?.headers as Record<string, string> | undefined),
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      };
    }

    return config;
  }

  async get<T = unknown>(url: string, config?: unknown): Promise<T> {
    const configWithAuth = this.addAuthorizationHeader(config);
    return this.httpClient.get<T>(url, configWithAuth);
  }

  async post<T = unknown>(
    url: string,
    data?: unknown,
    config?: unknown
  ): Promise<T> {
    const configWithAuth = this.addAuthorizationHeader(config);
    return this.httpClient.post<T>(url, data, configWithAuth);
  }

  async put<T = unknown>(
    url: string,
    data?: unknown,
    config?: unknown
  ): Promise<T> {
    const configWithAuth = this.addAuthorizationHeader(config);
    return this.httpClient.put<T>(url, data, configWithAuth);
  }

  async delete<T = unknown>(url: string, config?: unknown): Promise<T> {
    const configWithAuth = this.addAuthorizationHeader(config);
    return this.httpClient.delete<T>(url, configWithAuth);
  }
}
```

### C. Server Actions (Para Mutações)

```typescript
// src/presentation/actions/add-entry-action.ts
'use server';

import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { EntryFormData } from '@/infra/validation';
import { AddEntryParams, type AddEntry } from '@/domain/usecases';
import { GetStorage } from '@/data/protocols/storage';
import { getCurrentUser } from '../helpers';

export async function addEntryAction(
  data: EntryFormData,
  addEntry: AddEntry,
  getStorage: GetStorage
): Promise<void> {
  try {
    const user = await getCurrentUser(getStorage);

    const params: AddEntryParams = {
      description: data.description,
      amount: Math.round(data.amount * 100), // converter para centavos
      type: data.type,
      categoryId: data.categoryId,
      date: data.date,
      isFixed: data.isFixed,
      userId: user.id,
    };

    await addEntry.add(params);

    revalidateTag('entries');
    revalidateTag(`entries-${user.id}`);

    redirect('/entries');
  } catch (error) {
    console.error('Add entry error:', error);
    throw error;
  }
}

export async function updateEntryAction(
  id: string,
  data: EntryFormData,
  updateEntry: UpdateEntry,
  getStorage: GetStorage
): Promise<void> {
  try {
    const user = await getCurrentUser(getStorage);

    const params: UpdateEntryParams = {
      id,
      description: data.description,
      amount: Math.round(data.amount * 100),
      type: data.type,
      categoryId: data.categoryId,
      date: data.date,
      isFixed: data.isFixed,
      userId: user.id,
    };

    await updateEntry.update(params);

    revalidateTag('entries');
    revalidateTag(`entries-${user.id}`);

    redirect('/entries');
  } catch (error) {
    console.error('Update entry error:', error);
    throw error;
  }
}

export async function deleteEntryAction(
  id: string,
  deleteEntry: DeleteEntry,
  getStorage: GetStorage
): Promise<void> {
  try {
    const user = await getCurrentUser(getStorage);

    await deleteEntry.delete(id);

    revalidateTag('entries');
    revalidateTag(`entries-${user.id}`);
  } catch (error) {
    console.error('Delete entry error:', error);
    throw error;
  }
}
```

### D. Server Components (Para Leitura de Dados)

```typescript
// src/presentation/components/server/entries-list-page.tsx
import { Suspense } from 'react';
import { makeRemoteLoadEntries } from '@/main/factories/usecases';
import { getCurrentUser } from '@/presentation/helpers';
import { LocalStorageAdapter } from '@/infra/storage';

export default async function EntriesListPage({
  searchParams,
}: {
  searchParams: { month?: string; page?: string };
}) {
  const getStorage = new LocalStorageAdapter();
  const user = await getCurrentUser(getStorage);
  const loadEntries = makeRemoteLoadEntries();

  const month = searchParams.month || new Date().toISOString().slice(0, 7);
  const page = parseInt(searchParams.page || '1');

  const entries = await loadEntries.load({ month, page, userId: user.id });

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Entradas Financeiras
          </h1>
          <p className="text-slate-600">
            Controle suas receitas e despesas
          </p>
        </div>

        <Suspense fallback={<div>Carregando...</div>}>
          <EntriesList entries={entries} />
        </Suspense>
      </div>
    </div>
  );
}
```

### E. Client Components (Para Interatividade)

```typescript
// src/presentation/components/client/entry-form-with-feedback.tsx
'use client';

import React, { useState } from 'react';
import { EntryForm } from './entry-form';
import { FormValidator } from '@/presentation/protocols';
import { EntryFormData } from '@/infra/validation';
import { AddEntry } from '@/domain/usecases';
import { GetStorage } from '@/data/protocols/storage';
import { addEntryAction } from '@/presentation/actions';

export interface EntryFormWithFeedbackProps {
  validator: FormValidator<EntryFormData>;
  addEntry: AddEntry;
  getStorage: GetStorage;
}

export const EntryFormWithFeedback: React.FC<EntryFormWithFeedbackProps> = ({
  validator,
  addEntry,
  getStorage,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: EntryFormData) => {
    setIsLoading(true);
    try {
      await addEntryAction(data, addEntry, getStorage);
    } catch (error) {
      console.error('Error submitting form:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <EntryForm
      validator={validator}
      onSubmit={handleSubmit}
      isLoading={isLoading}
    />
  );
};
```

### F. Storage Implementation

```typescript
// src/infra/storage/local-storage-adapter.ts
import { SetStorage, GetStorage } from '@/data/protocols/storage';

export class LocalStorageAdapter implements SetStorage, GetStorage {
  set(key: string, value: object | null | undefined): void {
    if (value !== null && value !== undefined) {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      localStorage.removeItem(key);
    }
  }

  get(key: string): unknown {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }
}

// src/data/protocols/storage/index.ts
export interface SetStorage {
  set(key: string, value: object | null | undefined): void;
}

export interface GetStorage {
  get(key: string): unknown;
}
```

### G. API URL Factory

```typescript
// src/main/factories/http/api-url-factory.ts
export const makeApiUrl = (path: string): string => {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
  return `${baseUrl}${path}`;
};
```

### H. Exemplo de Caso de Uso

```typescript
// src/data/usecases/remote-add-entry.ts
import { AddEntry, AddEntryParams } from '@/domain/usecases';
import { EntryModel } from '@/domain/models';
import { HttpClient } from '@/data/protocols';

export class RemoteAddEntry implements AddEntry {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient
  ) {}

  async add(params: AddEntryParams): Promise<EntryModel> {
    const response = await this.httpClient.post<unknown>(this.url, params);

    // Type assertion with runtime validation would be ideal here
    const apiResponse = response as {
      id: string;
      description: string;
      amount: number;
      type: 'INCOME' | 'EXPENSE';
      categoryId: string;
      categoryName?: string;
      userId: string;
      date: string;
      isFixed: boolean;
      createdAt: string;
      updatedAt: string;
    };

    return {
      id: apiResponse.id,
      description: apiResponse.description,
      amount: apiResponse.amount,
      type: apiResponse.type,
      categoryId: apiResponse.categoryId,
      categoryName: apiResponse.categoryName || 'Unknown',
      userId: apiResponse.userId,
      date: new Date(apiResponse.date),
      isFixed: apiResponse.isFixed,
      createdAt: new Date(apiResponse.createdAt),
      updatedAt: new Date(apiResponse.updatedAt),
    };
  }
}
```

## 📚 Documentação Swagger

A API possui documentação completa em Swagger disponível em:

```
GET /api/docs
```

A documentação inclui:

- Todos os endpoints disponíveis
- Esquemas de request/response
- Exemplos de uso
- Códigos de erro
- Modelos de dados

## 🧪 Testes de Integração

### Mock da API para Desenvolvimento

```typescript
// tests/data/mocks/http-client-mock.ts
import { HttpClient } from '@/data/protocols/http';

export const mockHttpClient: jest.Mocked<HttpClient> = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
};

// tests/data/usecases/remote-add-entry.spec.ts
import { RemoteAddEntry } from '@/data/usecases/remote-add-entry';
import { AddEntryParams } from '@/domain/usecases/add-entry';
import { mockHttpClient } from '../mocks';

describe('RemoteAddEntry', () => {
  let sut: RemoteAddEntry;
  const url = 'http://localhost:3001/entries';

  beforeEach(() => {
    sut = new RemoteAddEntry(url, mockHttpClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call HttpClient.post with correct values', async () => {
    const params: AddEntryParams = {
      description: 'Test entry',
      amount: 10050, // 100.50 in cents
      type: 'INCOME',
      categoryId: 'category-1',
      userId: 'user-1',
      date: new Date('2024-01-01'),
      isFixed: false,
    };

    mockHttpClient.post.mockResolvedValueOnce({
      id: 'entry-1',
      ...params,
    });

    await sut.add(params);

    expect(mockHttpClient.post).toHaveBeenCalledWith(url, params);
  });
});
```

## 🔒 Segurança

### Validação de Dados

- Sempre validar dados no frontend antes de enviar
- Não confiar apenas na validação do servidor
- Sanitizar inputs do usuário

### Armazenamento de Tokens

- Usar localStorage apenas para desenvolvimento
- Considerar httpOnly cookies para produção
- Implementar logout automático quando token expira

### CORS

A API está configurada para aceitar requisições do frontend:

```typescript
// Configuração CORS da API (informativo)
{
  origin: ['http://localhost:3000', 'https://app.financial-management.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}
```

## 📊 Monitoramento e Logs

### Logs de Requisições

```typescript
// src/infra/http/logging-http-client-decorator.ts
import { HttpClient } from '@/data/protocols/http';

export class LoggingHttpClientDecorator implements HttpClient {
  constructor(private readonly httpClient: HttpClient) {}

  async get<T = unknown>(url: string, config?: unknown): Promise<T> {
    console.log(`[HTTP] GET ${url}`);
    const start = Date.now();

    try {
      const result = await this.httpClient.get<T>(url, config);
      console.log(`[HTTP] GET ${url} - ${Date.now() - start}ms`);
      return result;
    } catch (error) {
      console.error(`[HTTP] GET ${url} - ERROR:`, error);
      throw error;
    }
  }

  // Implementar outros métodos...
}
```

### Métricas de Performance

```typescript
// src/infra/http/metrics-http-client-decorator.ts
import { HttpClient } from '@/data/protocols/http';

export class MetricsHttpClientDecorator implements HttpClient {
  constructor(private readonly httpClient: HttpClient) {}

  async get<T = unknown>(url: string, config?: unknown): Promise<T> {
    const start = performance.now();

    try {
      const result = await this.httpClient.get<T>(url, config);
      const duration = performance.now() - start;

      // Enviar métricas para sistema de monitoramento
      this.recordMetric('http_request_duration', duration, {
        method: 'GET',
        url: new URL(url).pathname,
        status: 'success',
      });

      return result;
    } catch (error) {
      const duration = performance.now() - start;

      this.recordMetric('http_request_duration', duration, {
        method: 'GET',
        url: new URL(url).pathname,
        status: 'error',
      });

      throw error;
    }
  }

  private recordMetric(
    name: string,
    value: number,
    labels: Record<string, string>
  ) {
    // Implementar envio para sistema de métricas
    console.log(`[METRIC] ${name}: ${value}`, labels);
  }
}
```

---

## 📞 Suporte

Para dúvidas sobre a API:

1. Consultar documentação Swagger
2. Verificar logs de erro no console
3. Validar formato de dados enviados
4. Confirmar headers de autenticação
5. Verificar configuração de CORS

**A integração com a API é fundamental para o funcionamento correto do sistema! 🔌**
