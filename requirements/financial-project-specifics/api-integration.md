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
http://localhost:3001

# Production
https://api.financial-management.com
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
  type: "INCOME" | "EXPENSE";
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

### A. Server Components (Recomendado)

```typescript
// infra/http/server-http-client.ts
export class ServerHttpClient {
  constructor(private readonly baseUrl: string) {}

  async get<T>(
    endpoint: string,
    options?: {
      cache?: RequestCache;
      next?: NextFetchRequestConfig;
      headers?: HeadersInit;
    }
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      cache: options?.cache || "force-cache",
      next: options?.next,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      cache: "no-store", // Mutações não devem ser cached
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}

// Uso em Server Component
// app/(dashboard)/entries/page.tsx
import { ServerHttpClient } from "@/infra/http/server-http-client";
import { getCurrentUser } from "@/infra/auth/server-auth";

export default async function EntriesPage() {
  const user = await getCurrentUser();
  const httpClient = new ServerHttpClient(process.env.API_URL!);

  // Cache automático por 5 minutos
  const entries = await httpClient.get("/entries", {
    next: {
      revalidate: 300,
      tags: [`entries-${user.id}`],
    },
    headers: {
      Authorization: `Bearer ${user.accessToken}`,
    },
  });

  return (
    <div>
      <h1>Entradas Financeiras</h1>
      <EntriesList entries={entries} />
    </div>
  );
}
```

### B. Server Actions (Para Mutações)

```typescript
// data/actions/entry-actions.ts
"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/infra/auth/server-auth";

export async function createEntryAction(formData: FormData) {
  const user = await getCurrentUser();

  const entryData = {
    description: formData.get("description") as string,
    amount: Math.round(parseFloat(formData.get("amount") as string) * 100),
    type: formData.get("type") as "INCOME" | "EXPENSE",
    categoryId: formData.get("categoryId") as string,
    isFixed: formData.get("isFixed") === "true",
    date: formData.get("date") as string,
  };

  try {
    const response = await fetch(`${process.env.API_URL}/entries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.accessToken}`,
      },
      body: JSON.stringify(entryData),
    });

    if (!response.ok) {
      throw new Error("Failed to create entry");
    }

    // Revalidar cache
    revalidateTag(`entries-${user.id}`);
    revalidateTag(`summary-${user.id}`);
  } catch (error) {
    throw new Error("Failed to create entry");
  }

  redirect("/entries");
}

export async function updateEntryAction(id: string, formData: FormData) {
  const user = await getCurrentUser();

  // Similar ao create, mas com PUT
  // ...

  revalidateTag(`entries-${user.id}`);
  redirect("/entries");
}

export async function deleteEntryAction(id: string) {
  const user = await getCurrentUser();

  try {
    const response = await fetch(`${process.env.API_URL}/entries/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${user.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete entry");
    }

    revalidateTag(`entries-${user.id}`);
  } catch (error) {
    throw new Error("Failed to delete entry");
  }
}
```

### C. HTTP Client Adapter (Para Client Components)

```typescript
// infra/http/axios-http-client.ts
export interface HttpRequest {
  url: string;
  method: "get" | "post" | "put" | "delete";
  body?: any;
  headers?: Record<string, string>;
}

export interface HttpResponse<T = any> {
  statusCode: number;
  body: T;
}

export interface HttpClient<R = any> {
  request: (data: HttpRequest) => Promise<HttpResponse<R>>;
}

export class AxiosHttpClient implements HttpClient {
  async request(data: HttpRequest): Promise<HttpResponse> {
    const response = await axios({
      url: data.url,
      method: data.method,
      data: data.body,
      headers: data.headers,
    });

    return {
      statusCode: response.status,
      body: response.data,
    };
  }
}
```

### Token Management

```typescript
// infra/cache/token-storage.ts
export interface TokenStorage {
  getAccessToken(): string | null;
  getRefreshToken(): string | null;
  setTokens(tokens: AuthTokens): void;
  clearTokens(): void;
}

export class LocalStorageTokenStorage implements TokenStorage {
  private readonly ACCESS_TOKEN_KEY = "@financial:accessToken";
  private readonly REFRESH_TOKEN_KEY = "@financial:refreshToken";

  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  setTokens(tokens: AuthTokens): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, tokens.accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, tokens.refreshToken);
  }

  clearTokens(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }
}
```

### HTTP Client com Interceptadores

```typescript
// infra/http/authenticated-http-client.ts
export class AuthenticatedHttpClient implements HttpClient {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly tokenStorage: TokenStorage,
    private readonly refreshTokenUseCase: RefreshToken
  ) {}

  async request(data: HttpRequest): Promise<HttpResponse> {
    const accessToken = this.tokenStorage.getAccessToken();

    if (accessToken) {
      data.headers = {
        ...data.headers,
        Authorization: `Bearer ${accessToken}`,
      };
    }

    try {
      return await this.httpClient.request(data);
    } catch (error) {
      if (error.response?.status === 401) {
        // Token expirado, tentar refresh
        const refreshToken = this.tokenStorage.getRefreshToken();
        if (refreshToken) {
          try {
            const newTokens = await this.refreshTokenUseCase.refresh(
              refreshToken
            );
            this.tokenStorage.setTokens(newTokens);

            // Repetir requisição com novo token
            data.headers.Authorization = `Bearer ${newTokens.accessToken}`;
            return await this.httpClient.request(data);
          } catch (refreshError) {
            // Refresh falhou, limpar tokens e redirecionar para login
            this.tokenStorage.clearTokens();
            throw refreshError;
          }
        }
      }
      throw error;
    }
  }
}
```

### Exemplo de Caso de Uso

```typescript
// data/usecases/remote-add-entry.ts
export class RemoteAddEntry implements AddEntry {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient<EntryModel>
  ) {}

  async add(params: AddEntryParams): Promise<EntryModel> {
    const httpResponse = await this.httpClient.request({
      url: this.url,
      method: "post",
      body: {
        amount: Math.round(params.amount * 100), // converter para centavos
        description: params.description,
        type: params.type,
        isFixed: params.isFixed,
        categoryId: params.categoryId,
        date: params.date.toISOString().split("T")[0], // YYYY-MM-DD
      },
    });

    return {
      ...httpResponse.body,
      amount: httpResponse.body.amount / 100, // converter de centavos
      date: new Date(httpResponse.body.date),
      createdAt: new Date(httpResponse.body.createdAt),
      updatedAt: new Date(httpResponse.body.updatedAt),
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
// infra/http/mock-http-client.ts (para desenvolvimento/testes)
export class MockHttpClient implements HttpClient {
  async request(data: HttpRequest): Promise<HttpResponse> {
    // Simular delay de rede
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock responses baseados na URL e método
    if (data.url.includes("/entries") && data.method === "post") {
      return {
        statusCode: 201,
        body: {
          id: "mock-id",
          ...data.body,
          userId: "mock-user-id",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      };
    }

    // Outros mocks...
    throw new Error(`Mock not implemented for ${data.method} ${data.url}`);
  }
}
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

---

## 📞 Suporte

Para dúvidas sobre a API:

1. Consultar documentação Swagger
2. Verificar logs de erro no console
3. Validar formato de dados enviados
4. Confirmar headers de autenticação
