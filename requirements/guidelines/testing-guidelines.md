# 🧪 Testing Guidelines (Frontend)

## 📁 Estrutura de Arquivos

```
frontend/
├── src/
│   └── ...
└── tests/
    ├── data/
    │   └── usecases/
    │       └── remote-add-entry.spec.ts
    ├── presentation/
    │   ├── components/
    │   │   └── entry-form.spec.tsx
    │   └── pages/
    │       └── add-entry-page.spec.tsx
    ├── main/
    │   └── factories/
    │       ├── pages/
    │       │   └── add-entry-page-factory.spec.ts
    │       └── usecases/
    │           └── add-entry-factory.spec.ts
    └── e2e/
        └── flows/
            └── add-entry.spec.ts
```

Os testes devem espelhar a estrutura do projeto, mantendo a mesma organização de pastas.

## 🧩 Tipos de Testes

### 1. Testes Unitários

- **Framework**: Jest + React Testing Library
- **Cobertura Alvo**: 80%+ de todas as camadas
- **Foco Principal**: Regras de negócio, transformação de dados, validações

#### Exemplo para Caso de Uso:

```typescript
// tests/data/usecases/remote-add-entry.spec.ts
describe("RemoteAddEntry", () => {
  let sut: RemoteAddEntry;
  let httpClientSpy: HttpClientSpy;
  let mockAddEntryParams: AddEntryParams;

  beforeEach(() => {
    httpClientSpy = new HttpClientSpy();
    sut = new RemoteAddEntry("any_url", httpClientSpy);
    mockAddEntryParams = {
      description: "any_description",
      amount: 100,
      date: new Date(),
      type: "INCOME",
      category_id: "any_category",
      is_fixed: false,
    };
  });

  test("Should call HttpClient with correct values", async () => {
    await sut.add(mockAddEntryParams);

    expect(httpClientSpy.url).toBe("any_url");
    expect(httpClientSpy.method).toBe("post");
    expect(httpClientSpy.body).toEqual(mockAddEntryParams);
  });

  test("Should return an EntryModel if HttpClient returns 200", async () => {
    const httpResult = {
      id: "any_id",
      ...mockAddEntryParams,
    };

    httpClientSpy.response = {
      statusCode: 200,
      body: httpResult,
    };

    const entry = await sut.add(mockAddEntryParams);

    expect(entry).toEqual(httpResult);
  });

  test("Should throw if HttpClient throws", async () => {
    httpClientSpy.response = {
      statusCode: 500,
      body: new Error("server_error"),
    };

    const promise = sut.add(mockAddEntryParams);

    await expect(promise).rejects.toThrow();
  });
});
```

### 2. Testes de Componentes

- **Framework**: Jest + React Testing Library
- **Estratégia**: Isolar componentes, mockar dependências
- **Foco**: Interações do usuário, renderização condicional, acessibilidade

#### Exemplo para Componente:

```typescript
// tests/presentation/components/entry-form.spec.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { EntryForm } from "@/presentation/components/entry-form";

describe("EntryForm Component", () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Should render form correctly", () => {
    render(
      <EntryForm onSubmit={mockOnSubmit} isLoading={false} error={null} />
    );

    expect(screen.getByLabelText(/descrição/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/valor/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/data/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /salvar/i })).toBeInTheDocument();
  });

  test("Should show validation messages for required fields", async () => {
    render(
      <EntryForm onSubmit={mockOnSubmit} isLoading={false} error={null} />
    );

    const submitButton = screen.getByRole("button", { name: /salvar/i });
    fireEvent.click(submitButton);

    expect(
      await screen.findByText(/descrição é obrigatória/i)
    ).toBeInTheDocument();
    expect(await screen.findByText(/valor é obrigatório/i)).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test("Should call onSubmit with correct values on submit", async () => {
    render(
      <EntryForm onSubmit={mockOnSubmit} isLoading={false} error={null} />
    );

    fireEvent.input(screen.getByLabelText(/descrição/i), {
      target: { value: "Salário" },
    });

    fireEvent.input(screen.getByLabelText(/valor/i), {
      target: { value: "5000" },
    });

    fireEvent.input(screen.getByLabelText(/data/i), {
      target: { value: "2023-07-05" },
    });

    // Select Income type
    fireEvent.click(screen.getByLabelText(/receita/i));

    const submitButton = screen.getByRole("button", { name: /salvar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        description: "Salário",
        amount: 5000,
        date: expect.any(Date),
        type: "INCOME",
        category_id: expect.any(String),
        is_fixed: false,
      });
    });
  });

  test("Should disable submit button when isLoading is true", () => {
    render(<EntryForm onSubmit={mockOnSubmit} isLoading={true} error={null} />);

    const submitButton = screen.getByRole("button", { name: /salvar/i });
    expect(submitButton).toBeDisabled();
  });

  test("Should display error message when error prop is provided", () => {
    const testError = new Error("Falha ao adicionar entrada");

    render(
      <EntryForm onSubmit={mockOnSubmit} isLoading={false} error={testError} />
    );

    expect(screen.getByText("Falha ao adicionar entrada")).toBeInTheDocument();
  });
});
```

### 3. Testes de Páginas

- **Framework**: Jest + React Testing Library
- **Estratégia**: Testar a integração de componentes e a injeção de dependências
- **Foco**: Fluxo de dados entre componentes

```typescript
// tests/presentation/pages/add-entry-page.spec.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AddEntryPage } from "@/presentation/pages/add-entry-page";
import { AddEntry } from "@/domain/usecases/add-entry";

class AddEntrySpy implements AddEntry {
  params: any;
  callsCount = 0;
  result = {
    id: "generated_id",
    description: "any_description",
    amount: 100,
    date: new Date(),
    type: "INCOME",
    category_id: "any_category",
    is_fixed: false,
  };

  async add(params: any): Promise<any> {
    this.params = params;
    this.callsCount++;
    return this.result;
  }
}

describe("AddEntryPage", () => {
  let addEntrySpy: AddEntrySpy;

  beforeEach(() => {
    addEntrySpy = new AddEntrySpy();
  });

  test("Should pass correct props to EntryForm", () => {
    render(<AddEntryPage addEntry={addEntrySpy} />);

    expect(screen.getByText(/adicionar entrada/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /salvar/i })).toBeInTheDocument();
  });

  test("Should call AddEntry with correct values when form is submitted", async () => {
    render(<AddEntryPage addEntry={addEntrySpy} />);

    // Preencher e enviar formulário
    fireEvent.input(screen.getByLabelText(/descrição/i), {
      target: { value: "Salário Mensal" },
    });

    fireEvent.input(screen.getByLabelText(/valor/i), {
      target: { value: "5000" },
    });

    fireEvent.input(screen.getByLabelText(/data/i), {
      target: { value: "2023-07-05" },
    });

    fireEvent.click(screen.getByLabelText(/receita/i));
    fireEvent.click(screen.getByRole("button", { name: /salvar/i }));

    await waitFor(() => {
      expect(addEntrySpy.callsCount).toBe(1);
      expect(addEntrySpy.params).toEqual({
        description: "Salário Mensal",
        amount: 5000,
        date: expect.any(Date),
        type: "INCOME",
        category_id: expect.any(String),
        is_fixed: false,
      });
    });
  });
});
```

### 4. Testes de Factories

- **Framework**: Jest
- **Estratégia**: Verificar se as factories estão injetando as dependências corretamente
- **Foco**: Composição de componentes e casos de uso

```typescript
// tests/main/factories/pages/add-entry-page-factory.spec.tsx
import { makeAddEntryPage } from "@/main/factories/pages/add-entry-page-factory";
import { RemoteAddEntry } from "@/data/usecases/remote-add-entry";

jest.mock("@/data/usecases/remote-add-entry");
jest.mock("@/presentation/pages/add-entry-page", () => ({
  AddEntryPage: jest.fn().mockImplementation(({ addEntry }) => (
    <div data-testid="add-entry-page" data-add-entry={addEntry}>
      Mock AddEntryPage
    </div>
  )),
}));

describe("MakeAddEntryPage Factory", () => {
  test("Should compose page with correct dependencies", () => {
    const page = makeAddEntryPage();

    expect(RemoteAddEntry).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(Object)
    );
    expect(page.props["data-testid"]).toBe("add-entry-page");
    expect(page.props["data-add-entry"]).toBeInstanceOf(RemoteAddEntry);
  });
});
```

### 5. Testes E2E

- **Framework**: Cypress
- **Estratégia**: Testar fluxos completos com integração real ou mocks de API
- **Foco**: Jornadas de usuário, navegação entre páginas, integração entre componentes

#### Exemplo para Fluxo E2E:

```typescript
// tests/e2e/flows/add-entry.spec.ts
describe("Add Financial Entry", () => {
  beforeEach(() => {
    cy.intercept("POST", "/api/entries", {
      statusCode: 201,
      body: {
        id: "generated-id",
        description: "Test Entry",
        amount: 1000,
        date: "2023-07-05T00:00:00Z",
        type: "INCOME",
        category_id: "salary-category",
        is_fixed: false,
      },
    }).as("createEntry");

    cy.visit("/entries/add");
  });

  it("should allow user to add a new income entry", () => {
    // Fill form
    cy.findByLabelText(/descrição/i).type("Salário Mensal");
    cy.findByLabelText(/valor/i).type("5000");
    cy.findByLabelText(/data/i).type("2023-07-05");
    cy.findByLabelText(/receita/i).click();

    // Select category
    cy.findByLabelText(/categoria/i).click();
    cy.findByText(/salário/i).click();

    // Submit form
    cy.findByRole("button", { name: /salvar/i }).click();

    // Wait for API call
    cy.wait("@createEntry");

    // Verify success message
    cy.findByText(/entrada adicionada com sucesso/i).should("be.visible");

    // Verify redirect to entries list
    cy.url().should("include", "/entries");

    // Verify entry appears in the list
    cy.findByText(/salário mensal/i).should("be.visible");
    cy.findByText(/r\$ 5\.000,00/i).should("be.visible");
  });

  it("should validate required fields", () => {
    // Submit empty form
    cy.findByRole("button", { name: /salvar/i }).click();

    // Check validation messages
    cy.findByText(/descrição é obrigatória/i).should("be.visible");
    cy.findByText(/valor é obrigatório/i).should("be.visible");
    cy.findByText(/data é obrigatória/i).should("be.visible");

    // API should not be called
    cy.get("@createEntry.all").should("have.length", 0);
  });
});
```

## 📊 Estratégia de Mocks

### Mocks de API

- Use MSW (Mock Service Worker) para interceptar requisições HTTP em testes
- Mantenha fixtures com respostas padrão em `/tests/fixtures`
- Crie helpers para gerar dados de teste com Faker.js

### Mocks de Dependências

- Use Jest para mockar implementações de interfaces
- Crie factories de mocks para reutilização entre testes
- Use Sinon para stubs, spies e mocks quando necessário

### Mock Factory Exemplo

```typescript
// tests/mocks/mock-add-entry.ts
import { AddEntry, AddEntryParams } from "@/domain/usecases/add-entry";
import { EntryModel } from "@/domain/models/entry-model";

export class AddEntrySpy implements AddEntry {
  params: AddEntryParams;
  callsCount = 0;
  result: EntryModel = {
    id: "generated_id",
    description: "any_description",
    amount: 100,
    date: new Date(),
    type: "INCOME",
    category_id: "any_category",
    is_fixed: false,
  };

  async add(params: AddEntryParams): Promise<EntryModel> {
    this.params = params;
    this.callsCount++;
    return this.result;
  }
}

export const mockAddEntryParams = (): AddEntryParams => ({
  description: "any_description",
  amount: 100,
  date: new Date(),
  type: "INCOME",
  category_id: "any_category",
  is_fixed: false,
});

export const mockEntryModel = (): EntryModel => ({
  id: "any_id",
  ...mockAddEntryParams(),
});
```

## 🚦 Execução de Testes

### Comandos

```bash
# Testes unitários e de componentes
npm run test

# Watch mode
npm run test:watch

# Cobertura
npm run test:coverage

# E2E
npm run test:e2e

# E2E com UI interativa
npm run test:e2e:open
```

### CI/CD Integration

- Executar testes unitários e de componentes em cada PR
- Executar testes E2E em PRs para main/staging
- Falhar build se cobertura cair abaixo do threshold definido
- Gerar relatórios de teste para análise
