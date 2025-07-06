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
# NEXT_PUBLIC_API_URL=http://localhost:3001/api
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
│   │   ├── helpers/        # ← Helpers para Server Components
│   │   └── index.ts
│   ├── main/
│   │   ├── factories/
│   │   │   ├── usecases/
│   │   │   ├── validation/ # ← Factories de validação
│   │   │   ├── pages/
│   │   │   ├── components/ # ← Factories de componentes
│   │   │   ├── http/
│   │   │   └── storage/
│   │   ├── decorators/     # ← Decorators para HTTP Client
│   │   └── index.ts
│   └── app/                # ← Next.js App Router
│       ├── (auth)/
│       ├── (dashboard)/
│       ├── api/
│       ├── globals.css
│       ├── layout.tsx
│       └── page.tsx
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
└── requirements/
    └── guidelines/
        ├── development-workflow.md
        ├── api-integration.md
        ├── user-stories.md
        └── frontend-setup-guide.md
```

## 🔄 Fluxo de Desenvolvimento Atualizado (Clean Architecture + Validation)

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

- ✅ **Permitido**: Todas as dependências externas (fetch, zod, next/cache, etc.)
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
  add: (params: AddEntryParams) => Promise<EntryModel>;
}

export type AddEntryParams = {
  amount: number; // em centavos
  description: string;
  type: 'INCOME' | 'EXPENSE';
  isFixed: boolean;
  categoryId: string;
  userId: string;
  date: Date;
};

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
```

**2. Teste Domain (100% Coverage Obrigatório)**

```typescript
// tests/domain/usecases/add-entry.spec.ts
import { AddEntry, AddEntryParams } from '@/domain/usecases';
import { EntryModel } from '@/domain/models';

class AddEntrySpy implements AddEntry {
  params!: AddEntryParams;
  result: EntryModel = {
    id: 'any_id',
    amount: 10000, // R$ 100,00 em centavos
    description: 'any_description',
    type: 'INCOME',
    isFixed: false,
    categoryId: 'any_category_id',
    categoryName: 'any_category_name',
    userId: 'any_user_id',
    date: new Date('2024-01-01'),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  async add(params: AddEntryParams): Promise<EntryModel> {
    this.params = params;
    return this.result;
  }
}

describe('AddEntry', () => {
  let addEntrySpy: AddEntrySpy;

  beforeEach(() => {
    addEntrySpy = new AddEntrySpy();
  });

  it('should call AddEntry with correct params', async () => {
    const params: AddEntryParams = {
      amount: 10000, // R$ 100,00 em centavos
      description: 'Test Entry',
      type: 'INCOME',
      isFixed: false,
      categoryId: 'category_id',
      userId: 'user_id',
      date: new Date('2024-01-01'),
    };

    await addEntrySpy.add(params);

    expect(addEntrySpy.params).toEqual(params);
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

**2. Teste Data (Mock HTTP Client)**

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

#### C. INFRA LAYER (Terceiro)

**1. Implementações com Dependências Externas**

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

  // ... put e delete methods
}

// src/infra/validation/zod-form-validator.ts
import { z } from 'zod';
import { FormValidator, ValidationResult } from '@/presentation/protocols';

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
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: 'bg-cyan-400 text-slate-900 hover:bg-cyan-300 focus:ring-cyan-400',
    secondary:
      'bg-slate-200 text-slate-900 hover:bg-slate-300 focus:ring-slate-400',
    danger: 'bg-pink-400 text-white hover:bg-pink-500 focus:ring-pink-400',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button className={classes} disabled={disabled || isLoading} {...props}>
      {isLoading ? (
        <>
          <svg
            className='animate-spin -ml-1 mr-2 h-4 w-4'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
          >
            <circle
              className='opacity-25'
              cx='12'
              cy='12'
              r='10'
              stroke='currentColor'
              strokeWidth='4'
            />
            <path
              className='opacity-75'
              fill='currentColor'
              d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
            />
          </svg>
          Carregando...
        </>
      ) : (
        children
      )}
    </button>
  );
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
import { FormValidator } from '@/presentation/protocols';
import { EntryFormData } from '@/infra/validation';

const typeOptions = [
  { value: 'INCOME', label: 'Receita' },
  { value: 'EXPENSE', label: 'Despesa' },
];

const categoryOptions = [
  { value: '1', label: 'Alimentação' },
  { value: '2', label: 'Transporte' },
  { value: '3', label: 'Lazer' },
  { value: '4', label: 'Saúde' },
  { value: '5', label: 'Educação' },
  { value: '6', label: 'Salário' },
  { value: '7', label: 'Freelance' },
  { value: '8', label: 'Investimentos' },
];

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

    const dataToValidate = {
      description: formData.description,
      amount: parseFloat(formData.amount) || 0,
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
import { ZodFormValidator } from '@/infra/validation';
import { entryFormSchema, EntryFormData } from '@/infra/validation';
import { FormValidator } from '@/presentation/protocols';

export function makeEntryFormValidator(): FormValidator<EntryFormData> {
  return new ZodFormValidator(entryFormSchema);
}

// src/main/factories/http/fetch-http-client-factory.ts
import { FetchHttpClient } from '@/infra/http';
import { HttpClient } from '@/data/protocols/http';

export function makeFetchHttpClient(): HttpClient {
  return new FetchHttpClient();
}

// src/main/factories/usecases/add-entry-factory.ts
import { RemoteAddEntry } from '@/data/usecases';
import { AddEntry } from '@/domain/usecases';
import { makeApiUrl, makeAuthorizeHttpClientDecorator } from '@/main/factories';

export const makeRemoteAddEntry = (): AddEntry => {
  return new RemoteAddEntry(
    makeApiUrl('/entries'),
    makeAuthorizeHttpClientDecorator()
  );
};

// src/main/factories/components/entry-form-with-feedback-factory.tsx
'use client';

import { EntryFormWithFeedback } from '@/presentation/components';
import { makeEntryFormValidator } from '@/main/factories/validation';
import { makeRemoteAddEntry } from '@/main/factories/usecases';
import { LocalStorageAdapter } from '@/infra/storage';

export function EntryFormWithFeedbackFactory() {
  const validator = makeEntryFormValidator();
  const addEntry = makeRemoteAddEntry();
  const getStorage = new LocalStorageAdapter();

  return (
    <EntryFormWithFeedback
      validator={validator}
      addEntry={addEntry}
      getStorage={getStorage}
    />
  );
}

// src/main/factories/pages/add-entry-page-factory.tsx
import { AddEntryPage } from '@/presentation/components';

export function makeAddEntryPage() {
  return <AddEntryPage />;
}
```

### 4. Sistema de Testes Atualizado

#### A. Configuração Jest para .spec

```javascript
// jest.config.mjs
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testMatch: ['<rootDir>/tests/**/*.spec.{js,jsx,ts,tsx}'],
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
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '<rootDir>/tests/e2e/',
  ],
};

export default createJestConfig(customJestConfig);
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
│   │   └── fetch-http-client.spec.ts
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
    "test:ci": "jest --ci --coverage --watchAll=false --passWithNoTests",
    "test:coverage": "jest --coverage",
    "test:e2e": "cypress run",
    "test:e2e:open": "cypress open"
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
export * from './storage';

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
export * from './fetch-http-client';

// src/infra/index.ts
export * from './validation';
export * from './http';
export * from './storage';

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
export * from './fetch-http-client-factory';
export * from './api-url-factory';

// src/main/factories/index.ts
export * from './validation';
export * from './usecases';
export * from './pages';
export * from './http';
export * from './storage';
export * from './components';
export * from './decorators';

// src/main/index.ts
export * from './factories';
export * from './decorators';
```

#### B. Uso dos Index Files

```typescript
// ✅ CORRETO - Usar index files
import { AddEntry, AddEntryParams } from '@/domain';
import { RemoteAddEntry, HttpClient } from '@/data';
import { FetchHttpClient, ZodFormValidator } from '@/infra';
import { Button, Input } from '@/presentation/components/ui';
import { FormValidator } from '@/presentation/protocols';
import { addEntryAction } from '@/presentation/actions';
import { makeEntryFormValidator } from '@/main/factories';

// ❌ INCORRETO - Import direto sem index
import { AddEntry } from '@/domain/usecases/add-entry';
import { RemoteAddEntry } from '@/data/usecases/remote-add-entry';
import { HttpClient } from '@/data/protocols/http/http-client';
import { FetchHttpClient } from '@/infra/http/fetch-http-client';
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
import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  // Path aliases
  webpack: config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
      '@/app': path.resolve(__dirname, 'src/app'),
    };
    return config;
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
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
- [ ] Server Actions estão no Presentation layer

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
- [ ] Cobertura mínima de 90%
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
          yarn test:ci

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
