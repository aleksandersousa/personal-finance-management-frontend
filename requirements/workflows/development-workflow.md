# Frontend Development Workflow

Este documento define o fluxo de trabalho completo para desenvolvimento do frontend da aplicação de gestão financeira pessoal usando Next.js 15.

## 🚀 Configuração Inicial

### 1. Setup do Ambiente

```bash
# Clone do repositório
git clone <repository-url>
cd personal-financial-management/frontend

# Instalação de dependências (SEMPRE usar yarn)
yarn install

# Configuração de ambiente
cp .env.example .env.local

# Configurar variáveis
# API_URL=http://localhost:3001
# NEXTAUTH_SECRET=your-secret-key
# JWT_SECRET=your-jwt-secret
```

### 2. Estrutura de Branches

```
main
├── develop
│   ├── feature/auth-implementation
│   ├── feature/entries-crud
│   ├── feature/dashboard-ui
│   └── hotfix/critical-bug-fix
└── release/v1.0.0
```

### 3. Estrutura de Pastas Atualizada

```
frontend/
├── src/
│   ├── domain/
│   │   ├── entities/
│   │   ├── usecases/
│   │   ├── models/
│   │   └── index.ts        # ← Exports de todas as interfaces do domínio
│   ├── data/
│   │   ├── protocols/      # ← Interfaces de comunicação (sem dependências externas)
│   │   │   └── http/       # ← Interfaces HTTP
│   │   ├── usecases/       # ← Implementações de casos de uso
│   │   └── index.ts
│   ├── infra/
│   │   ├── auth/
│   │   ├── http/           # ← Implementações HTTP (com dependências externas)
│   │   ├── storage/
│   │   ├── validation/     # ← Implementações de validação (Zod, etc.)
│   │   └── index.ts
│   ├── presentation/
│   │   ├── actions/        # ← Server Actions (Next.js)
│   │   ├── components/
│   │   │   ├── server/     # ← Server Components
│   │   │   ├── client/     # ← Client Components
│   │   │   └── ui/         # ← Componentes base (atoms)
│   │   ├── protocols/      # ← Interfaces de validação e outros protocolos
│   │   ├── hooks/
│   │   └── index.ts
│   └── main/
│       ├── factories/
│       │   ├── usecases/
│       │   ├── validation/ # ← Factories de validação
│       │   ├── pages/
│       │   └── http/
│       ├── config/
│       ├── providers/
│       └── index.ts
├── tests/                  # ← Espelha estrutura de src/
│   ├── domain/
│   │   ├── entities/
│   │   │   └── entry.spec.ts     # ← .spec ao invés de .test
│   │   ├── usecases/
│   │   │   └── add-entry.spec.ts
│   │   ├── models/
│   │   └── mocks/
│   │       └── index.ts
│   ├── data/
│   │   ├── protocols/
│   │   │   └── http/
│   │   ├── usecases/
│   │   │   └── remote-add-entry.spec.ts
│   │   └── mocks/
│   │       ├── http-client-mock.ts
│   │       └── index.ts
│   ├── infra/
│   │   ├── validation/
│   │   │   └── zod-form-validator.spec.ts
│   │   ├── http/
│   │   └── mocks/
│   │       └── index.ts
│   ├── presentation/
│   │   ├── actions/
│   │   ├── components/
│   │   │   ├── client/
│   │   │   │   └── entry-form.spec.tsx
│   │   │   ├── server/
│   │   │   └── ui/
│   │   ├── protocols/
│   │   └── mocks/
│   │       ├── form-validator-mock.ts
│   │       └── index.ts
│   ├── main/
│   │   ├── factories/
│   │   └── mocks/
│   │       └── index.ts
│   └── e2e/
│       ├── critical-flows/
│       │   └── add-entry-flow.cy.ts    # ← Cypress mantém .cy.ts
│       ├── fixtures/
│       └── support/
└── app/
    └── (rotas Next.js)
```

## 🔄 Fluxo de Desenvolvimento Atualizado (Inside-Out + Validation)

### 1. Ordem de Desenvolvimento Rigorosa

**SEMPRE seguir esta ordem:**

1. **Domain** → Entidades, interfaces e regras de negócio
2. **Data** → Interfaces de comunicação (sem dependências externas)
3. **Infra** → Implementações técnicas (com dependências externas)
4. **Presentation** → Componentes UI e interfaces de validação
5. **Main** → Factories e configurações

### 2. Regras de Dependências por Camada

#### Domain Layer

- ✅ **Permitido**: Apenas TypeScript puro, sem dependências externas
- ❌ **Proibido**: Qualquer import de bibliotecas externas

#### Data Layer

- ✅ **Permitido**: Interfaces e tipos puros, imports do Domain, protocolos de comunicação
- ❌ **Proibido**: Implementações com dependências externas (axios, fetch, etc.)

#### Infra Layer

- ✅ **Permitido**: Todas as dependências externas (axios, zod, next/cache, etc.)
- ✅ **Permitido**: Implementações de interfaces do Data e Presentation

#### Presentation Layer

- ✅ **Permitido**: React, Next.js, Server Actions, interfaces de validação e protocolos
- ❌ **Proibido**: Implementações de validação (usar interfaces)

#### Main Layer

- ✅ **Permitido**: Todas as dependências para composição

### 3. Desenvolvimento com Validação (TDD + Validation-First)

#### A. DOMAIN LAYER (Primeiro)

**1. Criar Entidade + Interface + Teste**

```typescript
// src/domain/usecases/add-entry.ts
export interface AddEntry {
  add(params: AddEntryParams): Promise<EntryModel>;
}

export interface AddEntryParams {
  description: string;
  amount: number; // Em centavos
  type: 'INCOME' | 'EXPENSE';
  categoryId: string;
  userId: string;
  date: Date;
  isFixed: boolean;
}

// src/domain/models/index.ts
export * from './entry';
export * from './category';
export * from './user';

// src/domain/usecases/index.ts
export * from './add-entry';
export * from './load-entries';

// src/domain/index.ts
export * from './models';
export * from './usecases';
```

**2. Teste Domain (100% Coverage Obrigatório)**

```typescript
// tests/domain/usecases/add-entry.spec.ts
import { AddEntryParams } from '@/domain/usecases/add-entry';

describe('AddEntry Use Case', () => {
  it('should validate required fields in AddEntryParams', () => {
    const validParams: AddEntryParams = {
      description: 'Test entry',
      amount: 10050, // R$ 100.50 em centavos
      type: 'INCOME',
      categoryId: 'cat-1',
      userId: 'user-1',
      date: new Date('2024-01-01'),
      isFixed: false,
    };

    // Validar que todos os campos obrigatórios estão presentes
    expect(validParams.description).toBeDefined();
    expect(validParams.amount).toBeGreaterThan(0);
    expect(['INCOME', 'EXPENSE']).toContain(validParams.type);
    expect(validParams.categoryId).toBeDefined();
    expect(validParams.userId).toBeDefined();
    expect(validParams.date).toBeInstanceOf(Date);
    expect(typeof validParams.isFixed).toBe('boolean');
  });
});
```

#### B. DATA LAYER (Segundo)

**1. Criar Interfaces HTTP (Sem Implementação)**

```typescript
// src/data/protocols/http/http-client.ts (APENAS INTERFACE)
export interface HttpClient {
  get<T = unknown>(url: string, config?: unknown): Promise<T>;
  post<T = unknown>(url: string, data?: unknown, config?: unknown): Promise<T>;
  put<T = unknown>(url: string, data?: unknown, config?: unknown): Promise<T>;
  delete<T = unknown>(url: string, config?: unknown): Promise<T>;
}

// src/data/usecases/remote-add-entry.ts
import { AddEntry, AddEntryParams } from '@/domain/usecases/add-entry';
import { EntryModel } from '@/domain/models/entry';
import { HttpClient } from '@/data/protocols/http/http-client';

export class RemoteAddEntry implements AddEntry {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient
  ) {}

  async add(params: AddEntryParams): Promise<EntryModel> {
    const response = await this.httpClient.post<unknown>(
      `${this.url}/entries`,
      params
    );

    // Type assertion com validação runtime seria ideal aqui
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

**2. Teste Data (Mock HTTP Client)**

```typescript
// tests/data/mocks/http-client-mock.ts
import { HttpClient } from '@/data/protocols/http/http-client';

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
  const url = 'http://localhost:3001';

  beforeEach(() => {
    sut = new RemoteAddEntry(url, mockHttpClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call HttpClient.post with correct values', async () => {
    const params: AddEntryParams = {
      description: 'Test entry',
      amount: 10050,
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

    expect(mockHttpClient.post).toHaveBeenCalledWith('/entries', params);
  });
});
```

#### C. INFRA LAYER (Terceiro)

**1. Implementações com Dependências Externas**

```typescript
// src/infra/http/http-client-impl.ts
import { HttpClient } from '@/data/protocols/http/http-client';

export class HttpClientImpl implements HttpClient {
  async get<T = unknown>(_url: string, _config?: unknown): Promise<T> {
    // Implementação real com fetch ou axios
    return {} as T;
  }

  async post<T = unknown>(
    _url: string,
    _data?: unknown,
    _config?: unknown
  ): Promise<T> {
    // Implementação real com fetch ou axios
    return {} as T;
  }

  async put<T = unknown>(
    _url: string,
    _data?: unknown,
    _config?: unknown
  ): Promise<T> {
    // Implementação real com fetch ou axios
    return {} as T;
  }

  async delete<T = unknown>(_url: string, _config?: unknown): Promise<T> {
    // Implementação real com fetch ou axios
    return {} as T;
  }
}

// src/infra/validation/zod-form-validator.ts
import { z } from 'zod';
import {
  FormValidator,
  ValidationResult,
} from '@/presentation/protocols/form-validator';

export class ZodFormValidator<T> implements FormValidator<T> {
  constructor(private readonly schema: z.ZodSchema<T>) {}

  validate(data: unknown): ValidationResult<T> {
    try {
      const validatedData = this.schema.parse(data);
      return {
        success: true,
        data: validatedData,
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string[]> = {};

        error.errors.forEach(err => {
          const path = err.path.join('.');
          if (!errors[path]) {
            errors[path] = [];
          }
          errors[path].push(err.message);
        });

        return {
          success: false,
          errors,
        };
      }

      return {
        success: false,
        errors: {
          general: ['Validation failed'],
        },
      };
    }
  }
}

// src/infra/validation/entry-form-schema.ts
import { z } from 'zod';

export const entryFormSchema = z.object({
  description: z
    .string()
    .min(1, 'Descrição é obrigatória')
    .max(255, 'Descrição muito longa'),
  amount: z
    .number()
    .positive('Valor deve ser positivo')
    .max(999999.99, 'Valor muito alto'),
  type: z.enum(['INCOME', 'EXPENSE'], {
    required_error: 'Tipo é obrigatório',
    invalid_type_error: 'Tipo deve ser INCOME ou EXPENSE',
  }),
  categoryId: z.string().min(1, 'Categoria é obrigatória'),
  date: z.date({
    required_error: 'Data é obrigatória',
    invalid_type_error: 'Data inválida',
  }),
  isFixed: z.boolean(),
});

export type EntryFormData = z.infer<typeof entryFormSchema>;

// src/presentation/actions/add-entry-action.ts (Server Actions)
('use server');

import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { AddEntryParams } from '@/domain/usecases/add-entry';

export async function addEntryAction(formData: FormData): Promise<void> {
  try {
    const description = formData.get('description') as string;
    const amount = parseFloat(formData.get('amount') as string);
    const type = formData.get('type') as 'INCOME' | 'EXPENSE';
    const categoryId = formData.get('categoryId') as string;
    const date = new Date(formData.get('date') as string);
    const isFixed = formData.get('isFixed') === 'true';

    const params: AddEntryParams = {
      description,
      amount,
      type,
      categoryId,
      date,
      isFixed,
      userId: 'mock-user-id', // Em implementação real, pegar do auth
    };

    // Mock implementation - chamaria API real
    console.log('Adding entry:', params);

    // Revalidar cache
    revalidateTag('entries');
  } catch (error) {
    console.error('Error adding entry:', error);
    throw error;
  }

  redirect('/entries');
}
```

#### D. PRESENTATION LAYER (Quarto)

**1. Interfaces de Validação (Sem Implementação)**

```typescript
// src/presentation/protocols/form-validator.ts
export interface FormValidator<T> {
  validate(data: unknown): ValidationResult<T>;
}

export type ValidationResult<T> = {
  success: boolean;
  data?: T;
  errors?: Record<string, string[]>;
};

// src/presentation/protocols/index.ts
export * from './form-validator';
```

**2. Componentes UI Genéricos**

```typescript
// src/presentation/components/ui/button.tsx
import React from 'react';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  // Implementação do componente...
};

// src/presentation/components/ui/input.tsx
import React from 'react';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  className = '',
  id,
  ...props
}) => {
  // Implementação do componente...
};

// src/presentation/components/ui/index.ts
export * from './button';
export * from './input';
export * from './select';
```

**3. Client Components com Validação**

```typescript
// src/presentation/components/client/entry-form.tsx
'use client';

import React, { useState } from 'react';
import { Button, Input, Select } from '@/presentation/components/ui';
import { FormValidator } from '@/presentation/protocols/form-validator';
import { EntryFormData } from '@/infra/validation/entry-form-schema';

export interface EntryFormProps {
  validator: FormValidator<EntryFormData>;
  onSubmit: (data: EntryFormData) => Promise<void>;
  isLoading?: boolean;
}

export const EntryForm: React.FC<EntryFormProps> = ({
  validator,
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: '',
    categoryId: '',
    date: new Date().toISOString().split('T')[0],
    isFixed: false,
  });

  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Converter dados do form para tipos adequados para validação
    const dataToValidate = {
      description: formData.description,
      amount: parseFloat(formData.amount),
      type: formData.type as 'INCOME' | 'EXPENSE',
      categoryId: formData.categoryId,
      date: new Date(formData.date),
      isFixed: formData.isFixed,
    };

    const result = validator.validate(dataToValidate);

    if (!result.success) {
      setErrors(result.errors || {});
      return;
    }

    try {
      await onSubmit(result.data!);
      // Reset form on success
      setFormData({
        description: '',
        amount: '',
        type: '',
        categoryId: '',
        date: new Date().toISOString().split('T')[0],
        isFixed: false,
      });
      setErrors({});
    } catch {
      setErrors({
        general: ['Erro ao salvar entrada. Tente novamente.'],
      });
    }
  };

  // Resto da implementação...
};
```

#### E. MAIN LAYER (Quinto)

**1. Factories para Injeção de Dependência**

```typescript
// src/main/factories/validation/entry-form-validator-factory.ts
import { ZodFormValidator } from '@/infra/validation/zod-form-validator';
import { entryFormSchema, EntryFormData } from '@/infra/validation/entry-form-schema';
import { FormValidator } from '@/presentation/protocols/form-validator';

export function makeEntryFormValidator(): FormValidator<EntryFormData> {
  return new ZodFormValidator(entryFormSchema);
}

// src/main/factories/http/http-client-factory.ts
import { HttpClientImpl } from '@/infra/http/http-client-impl';
import { HttpClient } from '@/data/protocols/http/http-client';

export function makeHttpClient(): HttpClient {
  return new HttpClientImpl();
}

// src/main/factories/usecases/add-entry-factory.ts
import { RemoteAddEntry } from '@/data/usecases/remote-add-entry';
import { AddEntry } from '@/domain/usecases/add-entry';
import { makeHttpClient } from '@/main/factories/http/http-client-factory';
import { makeApiUrl } from '@/main/factories/http/api-url-factory';

export function makeRemoteAddEntry(): AddEntry {
  const httpClient = makeHttpClient();
  const url = makeApiUrl();
  return new RemoteAddEntry(url, httpClient);
}

// src/main/factories/pages/add-entry-page-factory.tsx
import { AddEntryPage } from '@/presentation/components/server/add-entry-page';
import { makeEntryFormValidator } from '@/main/factories/validation/entry-form-validator-factory';
import { EntryFormData } from '@/infra/validation/entry-form-schema';
import { AddEntryParams } from '@/domain/usecases/add-entry';

export function makeAddEntryPage() {
  const validator = makeEntryFormValidator();

  const handleSubmit = async (data: EntryFormData) => {
    // Converter EntryFormData para AddEntryParams
    const params: AddEntryParams = {
      description: data.description,
      amount: Math.round(data.amount * 100), // Converter para centavos
      type: data.type,
      categoryId: data.categoryId,
      date: data.date,
      isFixed: data.isFixed,
      userId: 'mock-user-id', // Em implementação real, pegar do auth
    };

    // Mock implementation - chamaria caso de uso real
    console.log('Adding entry:', params);

    // Simular delay da API
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  return (
    <AddEntryPage
      validator={validator}
      onSubmit={handleSubmit}
    />
  );
}
```

### 4. Sistema de Testes Atualizado

#### A. Configuração Jest para .spec

```json
// jest.config.mjs
export default createJestConfig({
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testMatch: [
    '<rootDir>/tests/**/*.spec.{js,jsx,ts,tsx}',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/components/(.*)$': '<rootDir>/src/presentation/components/$1',
    '^@/domain/(.*)$': '<rootDir>/src/domain/$1',
    '^@/data/(.*)$': '<rootDir>/src/data/$1',
    '^@/infra/(.*)$': '<rootDir>/src/infra/$1',
    '^@/main/(.*)$': '<rootDir>/src/main/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '<rootDir>/tests/e2e/',
  ],
});
```

#### B. Estrutura de Testes por Camada

```
tests/
├── domain/
│   ├── entities/
│   │   └── entry.spec.ts
│   ├── usecases/
│   │   ├── add-entry.spec.ts
│   │   └── load-entries.spec.ts
│   └── models/
├── data/
│   ├── usecases/
│   │   ├── remote-add-entry.spec.ts
│   │   └── remote-load-entries.spec.ts
│   └── http/
│       └── http-client.spec.ts
├── infra/
│   ├── validation/
│   │   ├── zod-form-validator.spec.ts
│   │   └── entry-form-schema.spec.ts
│   ├── http/
│   │   └── http-client-impl.spec.ts
│   └── actions/
│       └── add-entry-action.spec.ts
├── presentation/
│   ├── components/
│   │   ├── client/
│   │   │   ├── entry-form.spec.tsx
│   │   │   └── entry-form-with-feedback.spec.tsx
│   │   ├── server/
│   │   │   └── add-entry-page.spec.tsx
│   │   └── ui/
│   │       ├── button.spec.tsx
│   │       ├── input.spec.tsx
│   │       └── select.spec.tsx
│   └── validation/
│       └── form-validator.spec.ts
├── main/
│   └── factories/
│       ├── validation/
│       │   └── entry-form-validator-factory.spec.ts
│       ├── usecases/
│       │   └── add-entry-factory.spec.ts
│       └── pages/
│           └── add-entry-page-factory.spec.ts
└── e2e/
    ├── critical-flows/
    │   └── add-entry-flow.cy.ts
    ├── fixtures/
    └── support/
```

#### C. Scripts de Teste Atualizados

```json
// package.json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:coverage:check": "jest --coverage --passWithNoTests && yarn coverage:threshold",
    "coverage:threshold": "nyc check-coverage --lines 80 --functions 80 --branches 80 --statements 80",
    "test:e2e": "cypress run --spec 'tests/e2e/critical-flows/**/*.cy.ts'",
    "test:e2e:open": "cypress open --e2e",
    "test:all": "yarn test:coverage:check && yarn test:e2e"
  }
}
```

### 5. Index de Exportação Obrigatório

#### A. Estrutura de Index Files

```typescript
// src/domain/models/index.ts
export * from './category';
export * from './entry';
export * from './user';

// src/domain/usecases/index.ts
export * from './add-entry';
export * from './load-entries';

// src/domain/index.ts
export * from './models';
export * from './usecases';

// src/data/protocols/http/index.ts
export * from './http-client';

// src/data/protocols/index.ts
export * from './http';

// src/data/usecases/index.ts
export * from './remote-add-entry';
export * from './remote-load-entries';

// src/data/index.ts
export * from './protocols';
export * from './usecases';

// src/infra/validation/index.ts
export * from './zod-form-validator';
export * from './entry-form-schema';

// src/infra/http/index.ts
export * from './http-client-impl';

// src/infra/index.ts
export * from './validation';
export * from './http';

// src/presentation/components/ui/index.ts
export * from './button';
export * from './input';
export * from './select';

// src/presentation/actions/index.ts
export * from './add-entry-action';

// src/presentation/components/client/index.ts
export * from './entry-form';
export * from './entry-form-with-feedback';

// src/presentation/components/server/index.ts
export * from './add-entry-page';

// src/presentation/components/index.ts
export * from './ui';
export * from './client';
export * from './server';

// src/presentation/protocols/index.ts
export * from './form-validator';

// src/presentation/index.ts
export * from './actions';
export * from './components';
export * from './protocols';

// src/main/factories/validation/index.ts
export * from './entry-form-validator-factory';

// src/main/factories/usecases/index.ts
export * from './add-entry-factory';

// src/main/factories/pages/index.ts
export * from './add-entry-page-factory';

// src/main/factories/http/index.ts
export * from './http-client-factory';
export * from './api-url-factory';

// src/main/factories/index.ts
export * from './validation';
export * from './usecases';
export * from './pages';
export * from './http';

// src/main/index.ts
export * from './factories';
export * from './config';
export * from './providers';
```

#### B. Uso dos Index Files

```typescript
// ✅ CORRETO - Usar index files
import { AddEntry, AddEntryParams } from '@/domain';
import { RemoteAddEntry, HttpClient } from '@/data';
import { HttpClientImpl, ZodFormValidator } from '@/infra';
import { Button, Input } from '@/presentation/components/ui';
import { FormValidator } from '@/presentation/protocols';
import { addEntryAction } from '@/presentation/actions';
import { makeEntryFormValidator } from '@/main/factories';

// ❌ INCORRETO - Import direto sem index
import { AddEntry } from '@/domain/usecases/add-entry';
import { RemoteAddEntry } from '@/data/usecases/remote-add-entry';
import { HttpClient } from '@/data/protocols/http/http-client';
import { HttpClientImpl } from '@/infra/http/http-client-impl';
import { FormValidator } from '@/presentation/protocols/form-validator';
```

### 6. Validação de Arquitetura

#### A. Checklist de Compliance

```bash
# Script de validação de arquitetura
#!/bin/bash

echo "🔍 Validando arquitetura..."

# 1. Verificar se domain não tem dependências externas
echo "📋 Verificando Domain Layer..."
if grep -r "import.*from ['\"]react\|axios\|zod\|next" src/domain/; then
  echo "❌ Domain layer contém dependências externas!"
  exit 1
fi

# 2. Verificar se data não tem implementações externas
echo "📋 Verificando Data Layer..."
if grep -r "import.*from ['\"]axios\|zod\|next" src/data/; then
  echo "❌ Data layer contém dependências externas!"
  exit 1
fi

# 3. Verificar se todos os diretórios têm index.ts
echo "📋 Verificando Index Files..."
for dir in $(find src -type d); do
  if [ -n "$(ls $dir/*.ts $dir/*.tsx 2>/dev/null | grep -v index)" ] && [ ! -f "$dir/index.ts" ]; then
    echo "❌ Missing index.ts in: $dir"
    exit 1
  fi
done

# 4. Verificar se testes usam .spec
echo "📋 Verificando Extensões de Teste..."
if find tests -name "*.test.ts" -o -name "*.test.tsx" | grep -v ".cy.ts"; then
  echo "❌ Found .test files - use .spec instead"
  exit 1
fi

echo "✅ Arquitetura válida!"
```

#### B. Linting Rules Customizadas

```json
// .eslintrc.json
{
  "rules": {
    "no-restricted-imports": [
      "error",
      {
        "patterns": [
          {
            "group": ["react", "axios", "zod", "next/*"],
            "importNames": ["*"],
            "message": "Domain layer não pode importar dependências externas"
          }
        ],
        "paths": [
          {
            "name": "src/domain/**",
            "importNames": ["*"],
            "message": "Use index exports: import from '@/domain' ao invés de paths diretos"
          }
        ]
      }
    ]
  }
}
```

### 7. Performance e Otimização

#### A. Bundle Analysis com Validation

```bash
# Análise de bundle por camada
yarn analyze

# Verificar se domain/data não estão no client bundle
echo "📊 Verificando Client Bundle..."
if grep -r "domain\|data" .next/static/chunks/; then
  echo "⚠️ Domain/Data layers no client bundle - verificar imports"
fi
```

#### B. Code Splitting por Layer

```typescript
// next.config.ts
const nextConfig = {
  experimental: {
    optimizePackageImports: [
      '@/presentation/components/ui',
      '@/main/factories',
    ],
  },
  webpack: config => {
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        domain: {
          test: /[\\/]src[\\/]domain[\\/]/,
          name: 'domain',
          chunks: 'all',
        },
        infra: {
          test: /[\\/]src[\\/]infra[\\/]/,
          name: 'infra',
          chunks: 'all',
        },
      },
    };
    return config;
  },
};
```

## 📋 Code Review Process Atualizado

### 1. Checklist de PR

```markdown
## ✅ Checklist Arquitetural Obrigatório

### Estrutura de Camadas

- [ ] Domain: Apenas interfaces e tipos puros
- [ ] Data: Apenas interfaces HTTP, sem implementações externas
- [ ] Infra: Implementações com dependências externas
- [ ] Presentation: Interfaces de validação, componentes UI
- [ ] Main: Factories e composição

### Dependências

- [ ] Domain não importa bibliotecas externas
- [ ] Data não importa implementações externas
- [ ] Infra contém todas as dependências de terceiros
- [ ] Server Actions estão no Infra layer

### Validação

- [ ] Interfaces de validação no Presentation
- [ ] Implementações de validação no Infra
- [ ] Schemas Zod no Infra
- [ ] Factories de validação no Main

### Exports e Imports

- [ ] Todos os diretórios com arquivos têm index.ts
- [ ] Imports usam index files (@/domain ao invés de @/domain/usecases/add-entry)
- [ ] Componentes UI genéricos criados quando necessário

### Testes

- [ ] Arquivos de teste usam extensão .spec (não .test)
- [ ] Testes espelham estrutura de src/
- [ ] Cobertura mínima de 80%
- [ ] Testes E2E para fluxos críticos (.cy.ts)

### Performance

- [ ] Bundle analysis executado
- [ ] Domain/Data não vazaram para client bundle
- [ ] Code splitting configurado adequadamente
```

### 2. Automated Checks

```yaml
# .github/workflows/architecture-check.yml
name: Architecture Validation
on: [pull_request]

jobs:
  validate-architecture:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Check Domain Dependencies
        run: |
          if grep -r "import.*from ['\"]react\|axios\|zod\|next" src/domain/; then
            echo "❌ Domain layer contains external dependencies!"
            exit 1
          fi

      - name: Check Index Files
        run: |
          for dir in $(find src -type d); do
            if [ -n "$(ls $dir/*.ts $dir/*.tsx 2>/dev/null | grep -v index)" ] && [ ! -f "$dir/index.ts" ]; then
              echo "❌ Missing index.ts in: $dir"
              exit 1
            fi
          done

      - name: Check Test Extensions
        run: |
          if find tests -name "*.test.ts" -o -name "*.test.tsx" | grep -v ".cy.ts"; then
            echo "❌ Found .test files - use .spec instead"
            exit 1
          fi

      - name: Run Tests
        run: |
          yarn test:coverage:check

      - name: Build Check
        run: |
          yarn build
```

---

## 🔗 Recursos Adicionais

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Zod Validation](https://zod.dev/)
- [Jest Testing Framework](https://jestjs.io/docs/getting-started)
- [Cypress E2E Testing](https://docs.cypress.io/guides/overview/why-cypress)

**A arquitetura rigorosa garante manutenibilidade, testabilidade e escalabilidade do projeto! 🏗️**
