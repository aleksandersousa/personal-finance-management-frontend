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

### 3. Estrutura de Pastas

```
frontend/
├── src/
│   ├── domain/
│   │   ├── entities/
│   │   ├── usecases/
│   │   └── repositories/
│   ├── data/
│   │   ├── repositories/
│   │   ├── datasources/
│   │   └── actions/
│   ├── infra/
│   │   ├── auth/
│   │   ├── http/
│   │   └── storage/
│   ├── presentation/
│   │   ├── components/
│   │   ├── pages/
│   │   └── hooks/
│   └── main/
│       ├── factories/
│       ├── config/
│       └── providers/
├── test/
│   ├── domain/
│   │   ├── entities/
│   │   ├── usecases/
│   │   └── repositories/
│   ├── data/
│   │   ├── repositories/
│   │   ├── datasources/
│   │   └── actions/
│   ├── infra/
│   │   ├── auth/
│   │   ├── http/
│   │   └── storage/
│   ├── presentation/
│   │   ├── components/
│   │   ├── pages/
│   │   └── hooks/
│   ├── main/
│   │   ├── factories/
│   │   ├── config/
│   │   └── providers/
│   └── e2e/
│       ├── critical-flows/
│       ├── fixtures/
│       └── support/
└── app/
    └── (rotas Next.js)
```

## 🔄 Fluxo de Desenvolvimento (Inside-Out)

### 1. Ordem de Desenvolvimento

**SEMPRE seguir esta ordem:**

1. **Domain** → Entidades e regras de negócio
2. **Data** → Implementação de repositórios e actions
3. **Infra/Presentation** → Infraestrutura e componentes
4. **Main** → Factories e configurações

### 2. Criação de Feature (TDD Obrigatório)

```bash
# Criar branch da develop
git checkout develop
git pull origin develop
git checkout -b feature/feature-name

# Exemplo
git checkout -b feature/entries-management
```

### 3. Desenvolvimento com Next.js 15 (Inside-Out + TDD)

#### A. DOMAIN LAYER (Primeiro)

**1. Criar Entidade + Teste**

```typescript
// src/domain/entities/entry.ts
export interface Entry {
  id: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  categoryId: string;
  userId: string;
  date: Date;
}

export class EntryEntity {
  constructor(private readonly entry: Entry) {}

  get id(): string {
    return this.entry.id;
  }

  get amount(): number {
    return this.entry.amount;
  }

  isExpense(): boolean {
    return this.entry.type === "expense";
  }

  isIncome(): boolean {
    return this.entry.type === "income";
  }
}
```

```typescript
// test/domain/entities/entry.test.ts
import { EntryEntity } from "@/domain/entities/entry";

describe("EntryEntity", () => {
  const mockEntry = {
    id: "1",
    description: "Test Entry",
    amount: 100.5,
    type: "income" as const,
    categoryId: "cat-1",
    userId: "user-1",
    date: new Date("2024-01-01"),
  };

  it("should create entry entity correctly", () => {
    const entity = new EntryEntity(mockEntry);

    expect(entity.id).toBe("1");
    expect(entity.amount).toBe(100.5);
  });

  it("should identify income correctly", () => {
    const entity = new EntryEntity(mockEntry);

    expect(entity.isIncome()).toBe(true);
    expect(entity.isExpense()).toBe(false);
  });

  it("should identify expense correctly", () => {
    const expenseEntry = { ...mockEntry, type: "expense" as const };
    const entity = new EntryEntity(expenseEntry);

    expect(entity.isExpense()).toBe(true);
    expect(entity.isIncome()).toBe(false);
  });
});
```

**2. Criar Use Case + Teste**

```typescript
// src/domain/usecases/create-entry.ts
import { Entry } from "@/domain/entities/entry";
import { EntryRepository } from "@/domain/repositories/entry-repository";

export interface CreateEntryInput {
  description: string;
  amount: number;
  type: "income" | "expense";
  categoryId: string;
  userId: string;
}

export class CreateEntryUseCase {
  constructor(private readonly entryRepository: EntryRepository) {}

  async execute(input: CreateEntryInput): Promise<Entry> {
    if (input.amount <= 0) {
      throw new Error("Amount must be positive");
    }

    const entry: Entry = {
      id: crypto.randomUUID(),
      ...input,
      date: new Date(),
    };

    return await this.entryRepository.create(entry);
  }
}
```

```typescript
// test/domain/usecases/create-entry.test.ts
import { CreateEntryUseCase } from "@/domain/usecases/create-entry";
import { EntryRepository } from "@/domain/repositories/entry-repository";

describe("CreateEntryUseCase", () => {
  let useCase: CreateEntryUseCase;
  let mockRepository: jest.Mocked<EntryRepository>;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByUserId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    useCase = new CreateEntryUseCase(mockRepository);
  });

  it("should create entry successfully", async () => {
    const input = {
      description: "Test Entry",
      amount: 100.5,
      type: "income" as const,
      categoryId: "cat-1",
      userId: "user-1",
    };

    const expectedEntry = {
      id: expect.any(String),
      ...input,
      date: expect.any(Date),
    };

    mockRepository.create.mockResolvedValue(expectedEntry);

    const result = await useCase.execute(input);

    expect(mockRepository.create).toHaveBeenCalledWith(expectedEntry);
    expect(result).toEqual(expectedEntry);
  });

  it("should throw error for negative amount", async () => {
    const input = {
      description: "Test Entry",
      amount: -100,
      type: "income" as const,
      categoryId: "cat-1",
      userId: "user-1",
    };

    await expect(useCase.execute(input)).rejects.toThrow(
      "Amount must be positive"
    );
  });
});
```

#### B. DATA LAYER (Segundo)

```typescript
// src/data/repositories/entry-repository-impl.ts
import { Entry } from "@/domain/entities/entry";
import { EntryRepository } from "@/domain/repositories/entry-repository";
import { HttpClient } from "@/infra/http/http-client";

export class EntryRepositoryImpl implements EntryRepository {
  constructor(private readonly httpClient: HttpClient) {}

  async create(entry: Entry): Promise<Entry> {
    return await this.httpClient.post("/entries", entry);
  }

  async findById(id: string): Promise<Entry | null> {
    return await this.httpClient.get(`/entries/${id}`);
  }

  // ... outros métodos
}
```

```typescript
// test/data/repositories/entry-repository-impl.test.ts
import { EntryRepositoryImpl } from "@/data/repositories/entry-repository-impl";
import { HttpClient } from "@/infra/http/http-client";

describe("EntryRepositoryImpl", () => {
  let repository: EntryRepositoryImpl;
  let mockHttpClient: jest.Mocked<HttpClient>;

  beforeEach(() => {
    mockHttpClient = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    };
    repository = new EntryRepositoryImpl(mockHttpClient);
  });

  it("should create entry via HTTP client", async () => {
    const entry = {
      id: "1",
      description: "Test",
      amount: 100,
      type: "income" as const,
      categoryId: "cat-1",
      userId: "user-1",
      date: new Date(),
    };

    mockHttpClient.post.mockResolvedValue(entry);

    const result = await repository.create(entry);

    expect(mockHttpClient.post).toHaveBeenCalledWith("/entries", entry);
    expect(result).toEqual(entry);
  });

  // Teste para cada método com 100% de coverage
});
```

#### C. INFRA/PRESENTATION LAYER (Terceiro)

```typescript
// src/presentation/components/server/entries-list.tsx
import { Entry } from "@/domain/entities/entry";

interface EntriesListProps {
  entries: Entry[];
}

export function EntriesList({ entries }: EntriesListProps) {
  return (
    <div data-testid="entries-list">
      {entries.map((entry) => (
        <div key={entry.id} data-testid={`entry-${entry.id}`}>
          <span>{entry.description}</span>
          <span>{entry.amount}</span>
        </div>
      ))}
    </div>
  );
}
```

```typescript
// test/presentation/components/server/entries-list.test.tsx
import { render, screen } from "@testing-library/react";
import { EntriesList } from "@/presentation/components/server/entries-list";

describe("EntriesList", () => {
  const mockEntries = [
    {
      id: "1",
      description: "Entry 1",
      amount: 100,
      type: "income" as const,
      categoryId: "cat-1",
      userId: "user-1",
      date: new Date(),
    },
    {
      id: "2",
      description: "Entry 2",
      amount: 50,
      type: "expense" as const,
      categoryId: "cat-2",
      userId: "user-1",
      date: new Date(),
    },
  ];

  it("should render all entries", () => {
    render(<EntriesList entries={mockEntries} />);

    expect(screen.getByTestId("entries-list")).toBeInTheDocument();
    expect(screen.getByTestId("entry-1")).toBeInTheDocument();
    expect(screen.getByTestId("entry-2")).toBeInTheDocument();
    expect(screen.getByText("Entry 1")).toBeInTheDocument();
    expect(screen.getByText("Entry 2")).toBeInTheDocument();
  });

  it("should render empty list when no entries", () => {
    render(<EntriesList entries={[]} />);

    expect(screen.getByTestId("entries-list")).toBeInTheDocument();
    expect(screen.queryByTestId(/^entry-/)).not.toBeInTheDocument();
  });
});
```

#### D. MAIN LAYER (Quarto)

```typescript
// src/main/factories/entry-factory.ts
import { CreateEntryUseCase } from "@/domain/usecases/create-entry";
import { EntryRepositoryImpl } from "@/data/repositories/entry-repository-impl";
import { HttpClientImpl } from "@/infra/http/http-client-impl";

export function makeCreateEntryUseCase(): CreateEntryUseCase {
  const httpClient = new HttpClientImpl();
  const entryRepository = new EntryRepositoryImpl(httpClient);
  return new CreateEntryUseCase(entryRepository);
}
```

```typescript
// test/main/factories/entry-factory.test.ts
import { makeCreateEntryUseCase } from "@/main/factories/entry-factory";
import { CreateEntryUseCase } from "@/domain/usecases/create-entry";

describe("EntryFactory", () => {
  it("should create CreateEntryUseCase with all dependencies", () => {
    const useCase = makeCreateEntryUseCase();

    expect(useCase).toBeInstanceOf(CreateEntryUseCase);
  });
});
```

### 4. Testes Durante Desenvolvimento (100% Coverage Obrigatório)

```bash
# Testes unitários com coverage
yarn test

# Testes com watch mode
yarn test:watch

# Coverage report (deve ser 100%)
yarn test:coverage

# Verificar coverage threshold
yarn test:coverage:check

# Testes E2E (apenas pontos críticos)
yarn test:e2e

# Testes E2E em modo interativo
yarn test:e2e:open
```

### 5. Configuração de Coverage (100% Obrigatório)

```json
// jest.config.js
module.exports = {
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.tsx',
    '!src/main/config/**',
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  coverageReporters: ['text', 'lcov', 'html'],
  testMatch: ['<rootDir>/test/**/*.test.{ts,tsx}'],
};
```

### 6. Verificações de Qualidade

```bash
# Linting
yarn lint
yarn lint:fix

# Type checking
yarn type-check

# Formatação
yarn format

# Coverage check (falha se não for 100%)
yarn test:coverage:check
```

## 🧪 Processo de Testing Detalhado

### 1. Estrutura de Testes (Espelhando src/)

```
test/
├── domain/
│   ├── entities/
│   │   ├── entry.test.ts
│   │   ├── category.test.ts
│   │   └── user.test.ts
│   ├── usecases/
│   │   ├── create-entry.test.ts
│   │   ├── list-entries.test.ts
│   │   └── delete-entry.test.ts
│   └── repositories/
│       └── entry-repository.test.ts (interfaces)
├── data/
│   ├── repositories/
│   │   ├── entry-repository-impl.test.ts
│   │   └── category-repository-impl.test.ts
│   ├── datasources/
│   │   ├── api-datasource.test.ts
│   │   └── cache-datasource.test.ts
│   └── actions/
│       ├── entry-actions.test.ts
│       └── auth-actions.test.ts
├── infra/
│   ├── auth/
│   │   ├── next-auth-adapter.test.ts
│   │   └── jwt-service.test.ts
│   ├── http/
│   │   ├── http-client-impl.test.ts
│   │   └── api-interceptors.test.ts
│   └── storage/
│       ├── local-storage.test.ts
│       └── session-storage.test.ts
├── presentation/
│   ├── components/
│   │   ├── server/
│   │   │   ├── entries-list.test.tsx
│   │   │   └── dashboard-summary.test.tsx
│   │   └── client/
│   │       ├── entry-form.test.tsx
│   │       └── delete-modal.test.tsx
│   ├── pages/
│   │   ├── entries-page.test.tsx
│   │   └── dashboard-page.test.tsx
│   └── hooks/
│       ├── use-entries.test.ts
│       └── use-auth.test.ts
├── main/
│   ├── factories/
│   │   ├── entry-factory.test.ts
│   │   └── auth-factory.test.ts
│   ├── config/
│   │   ├── env-config.test.ts
│   │   └── api-config.test.ts
│   └── providers/
│       ├── query-provider.test.tsx
│       └── auth-provider.test.tsx
└── e2e/
    ├── critical-flows/
    │   ├── auth-flow.cy.ts
    │   ├── entry-crud-flow.cy.ts
    │   └── dashboard-flow.cy.ts
    ├── fixtures/
    │   ├── users.json
    │   └── entries.json
    └── support/
        ├── commands.ts
        └── e2e.ts
```

### 2. Padrões de Teste por Camada

#### Domain Layer Tests

```typescript
// Sempre testar:
// - Regras de negócio
// - Validações
// - Comportamentos esperados
// - Edge cases
// - Error cases
```

#### Data Layer Tests

```typescript
// Sempre testar:
// - Interações com datasources
// - Mapeamento de dados
// - Error handling
// - Cache behavior
```

#### Infra Layer Tests

```typescript
// Sempre testar:
// - Integrações externas (mocked)
// - Configurações
// - Adapters
// - Error scenarios
```

#### Presentation Layer Tests

```typescript
// Sempre testar:
// - Renderização
// - Interações do usuário
// - Props handling
// - Estado local
// - Error boundaries
```

### 3. Testes E2E - Pontos Críticos do Sistema

#### A. Fluxos Críticos Identificados

**1. Autenticação (CRÍTICO)**

```typescript
// test/e2e/critical-flows/auth-flow.cy.ts
describe("Authentication Critical Flow", () => {
  it("should complete full auth flow", () => {
    // Login
    cy.visit("/login");
    cy.get("[data-testid=email]").type("user@test.com");
    cy.get("[data-testid=password]").type("password123");
    cy.get("[data-testid=login-btn]").click();

    // Verify redirect to dashboard
    cy.url().should("include", "/dashboard");
    cy.get("[data-testid=user-menu]").should("be.visible");

    // Logout
    cy.get("[data-testid=user-menu]").click();
    cy.get("[data-testid=logout-btn]").click();
    cy.url().should("include", "/login");
  });

  it("should handle auth errors", () => {
    cy.visit("/login");
    cy.get("[data-testid=email]").type("invalid@test.com");
    cy.get("[data-testid=password]").type("wrongpassword");
    cy.get("[data-testid=login-btn]").click();

    cy.get("[data-testid=error-message]").should(
      "contain",
      "Invalid credentials"
    );
  });
});
```

**2. CRUD de Entradas (CRÍTICO)**

```typescript
// test/e2e/critical-flows/entry-crud-flow.cy.ts
describe("Entry CRUD Critical Flow", () => {
  beforeEach(() => {
    cy.login(); // Custom command
  });

  it("should complete full CRUD cycle", () => {
    // CREATE
    cy.visit("/entries/add");
    cy.get("[data-testid=description]").type("Test Entry E2E");
    cy.get("[data-testid=amount]").type("150.75");
    cy.get("[data-testid=type]").select("income");
    cy.get("[data-testid=category]").select("salary");
    cy.get("[data-testid=submit-btn]").click();

    // Verify creation
    cy.url().should("include", "/entries");
    cy.get("[data-testid=entries-list]").should("contain", "Test Entry E2E");

    // READ/LIST
    cy.get('[data-testid="entry-item"]').first().should("contain", "150.75");

    // UPDATE
    cy.get('[data-testid="entry-item"]')
      .first()
      .find("[data-testid=edit-btn]")
      .click();
    cy.get("[data-testid=description]").clear().type("Updated Entry E2E");
    cy.get("[data-testid=amount]").clear().type("200.00");
    cy.get("[data-testid=submit-btn]").click();

    // Verify update
    cy.get("[data-testid=entries-list]").should("contain", "Updated Entry E2E");
    cy.get("[data-testid=entries-list]").should("contain", "200.00");

    // DELETE
    cy.get('[data-testid="entry-item"]')
      .first()
      .find("[data-testid=delete-btn]")
      .click();
    cy.get("[data-testid=confirm-delete]").click();

    // Verify deletion
    cy.get("[data-testid=entries-list]").should(
      "not.contain",
      "Updated Entry E2E"
    );
  });
});
```

**3. Dashboard com Cálculos (CRÍTICO)**

```typescript
// test/e2e/critical-flows/dashboard-flow.cy.ts
describe("Dashboard Critical Flow", () => {
  beforeEach(() => {
    cy.login();
    cy.seedDatabase(); // Custom command to create test data
  });

  it("should display correct financial summary", () => {
    cy.visit("/dashboard");

    // Verify summary cards
    cy.get("[data-testid=total-income]").should("contain", "R$ 5.000,00");
    cy.get("[data-testid=total-expenses]").should("contain", "R$ 3.500,00");
    cy.get("[data-testid=balance]").should("contain", "R$ 1.500,00");

    // Verify charts are rendered
    cy.get("[data-testid=income-chart]").should("be.visible");
    cy.get("[data-testid=expense-chart]").should("be.visible");

    // Verify recent entries
    cy.get("[data-testid=recent-entries]").should("be.visible");
    cy.get('[data-testid=recent-entries] [data-testid="entry-item"]').should(
      "have.length.at.least",
      1
    );
  });
});
```

#### B. Configuração Cypress para Pontos Críticos

```typescript
// cypress.config.ts
import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    supportFile: "test/e2e/support/e2e.ts",
    specPattern: "test/e2e/critical-flows/**/*.cy.{js,jsx,ts,tsx}",
    fixturesFolder: "test/e2e/fixtures",
    video: true,
    screenshotOnRunFailure: true,
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
  },
});
```

```typescript
// test/e2e/support/commands.ts
declare global {
  namespace Cypress {
    interface Chainable {
      login(): Chainable<void>;
      seedDatabase(): Chainable<void>;
    }
  }
}

Cypress.Commands.add("login", () => {
  cy.session("user-session", () => {
    cy.visit("/login");
    cy.get("[data-testid=email]").type("test@example.com");
    cy.get("[data-testid=password]").type("password123");
    cy.get("[data-testid=login-btn]").click();
    cy.url().should("include", "/dashboard");
  });
});

Cypress.Commands.add("seedDatabase", () => {
  cy.request("POST", "/api/test/seed", {
    entries: [
      { description: "Salary", amount: 5000, type: "income" },
      { description: "Rent", amount: 1500, type: "expense" },
      { description: "Groceries", amount: 800, type: "expense" },
    ],
  });
});
```

### 4. Scripts de Teste

```json
// package.json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:coverage:check": "jest --coverage --passWithNoTests && yarn coverage:threshold",
    "coverage:threshold": "nyc check-coverage --lines 100 --functions 100 --branches 100 --statements 100",
    "test:e2e": "cypress run --spec 'test/e2e/critical-flows/**/*.cy.ts'",
    "test:e2e:open": "cypress open --e2e",
    "test:all": "yarn test:coverage:check && yarn test:e2e"
  }
}
```

## 📋 Code Review Process

### 1. Antes do PR

```bash
# Verificações locais obrigatórias
yarn lint
yarn type-check
yarn test:coverage:check  # Deve ter 100% coverage
yarn build

# Commit seguindo conventional commits
git add .
git commit -m "feat: add entries CRUD with complete test coverage"
```

### 2. Criação do Pull Request

**Template de PR Atualizado:**

```markdown
## 📋 Descrição

Breve descrição das mudanças

## 🔧 Tipo de Mudança

- [ ] Bug fix
- [ ] Nova feature
- [ ] Breaking change
- [ ] Documentação

## ✅ Checklist Obrigatório

- [ ] Testes passando (100% coverage)
- [ ] Lint sem erros
- [ ] TypeScript sem erros
- [ ] Fluxo inside-out seguido (domain → data → infra/presentation → main)
- [ ] Testes criados para cada camada
- [ ] Server Components utilizados quando possível
- [ ] Server Actions para mutações
- [ ] Cache configurado adequadamente
- [ ] Testes E2E para pontos críticos (se aplicável)

## 📊 Coverage Report

- [ ] Domain: 100%
- [ ] Data: 100%
- [ ] Infra: 100%
- [ ] Presentation: 100%
- [ ] Main: 100%

## 🧪 Como Testar

Passos para testar as mudanças

## 📸 Screenshots (se aplicável)
```

### 3. Review Guidelines Atualizadas

**Para Reviewers:**

- ✅ Verificar fluxo inside-out (domain → data → infra/presentation → main)
- ✅ Validar 100% de test coverage
- ✅ Confirmar estrutura de testes espelhando src/
- ✅ Verificar uso correto de Server/Client Components
- ✅ Validar implementação de Server Actions
- ✅ Confirmar configuração de cache
- ✅ Revisar tratamento de erros
- ✅ Verificar acessibilidade
- ✅ Validar performance (Core Web Vitals)
- ✅ Confirmar testes E2E para pontos críticos

## 🚀 Deploy Process

### 1. Merge para Develop

```bash
# Após aprovação do PR
git checkout develop
git pull origin develop
git merge feature/feature-name
git push origin develop
```

### 2. Deploy Staging

- Deploy automático para ambiente de staging
- Testes de integração executados
- Testes E2E críticos executados
- Validação de funcionalidades

### 3. Release para Production

```bash
# Criar release branch
git checkout -b release/v1.0.0
git push origin release/v1.0.0

# Executar testes completos
yarn test:all

# Após validação, merge para main
git checkout main
git merge release/v1.0.0
git tag v1.0.0
git push origin main --tags
```

## 🔍 Debugging e Troubleshooting

### 1. Development Tools

```bash
# Debug mode
yarn dev --inspect

# Analyze bundle
yarn analyze

# Performance profiling
yarn dev --profile

# Coverage debugging
yarn test:coverage --verbose
```

### 2. Common Issues

#### Test Coverage Issues

```bash
# Verificar arquivos sem coverage
yarn test:coverage --collectCoverageFrom="src/**/*.{ts,tsx}" --coverageReporters="text-summary"

# Debug coverage específico
yarn test:coverage --testPathPattern="domain/entities"
```

#### E2E Test Issues

```bash
# Debug E2E em modo interativo
yarn test:e2e:open

# Executar apenas um teste crítico
yarn cypress run --spec "test/e2e/critical-flows/auth-flow.cy.ts"
```

## 📊 Performance Monitoring

### 1. Core Web Vitals

- **LCP**: < 2.5s
- **INP**: < 200ms
- **CLS**: < 0.1

### 2. Test Performance

- **Unit Tests**: < 30s para suite completa
- **E2E Critical Tests**: < 5min para todos os fluxos críticos
- **Coverage Generation**: < 10s

### 3. Bundle Analysis

```bash
# Analyze bundle size
yarn analyze

# Check for large dependencies
yarn build --analyze
```

## 🔄 Continuous Improvement

### 1. Regular Reviews

- **Weekly**: Review de código, arquitetura e coverage
- **Monthly**: Análise de performance e otimização de testes E2E
- **Quarterly**: Atualização de dependências e revisão de pontos críticos

### 2. Learning & Updates

- Acompanhar updates do Next.js
- Estudar novas features do React
- Otimizar testes E2E baseado em feedback
- Participar da comunidade

### 3. Documentation Updates

- Manter workflows atualizados
- Documentar novos padrões de teste
- Atualizar pontos críticos para E2E
- Compartilhar aprendizados

---

## 📚 Recursos Adicionais

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [React Server Components](https://react.dev/reference/rsc/server-components)
- [Server Actions Guide](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [Jest Testing Framework](https://jestjs.io/docs/getting-started)
- [Cypress E2E Testing](https://docs.cypress.io/guides/overview/why-cypress)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Test Coverage Best Practices](https://testing-library.com/docs/guide-which-query)
