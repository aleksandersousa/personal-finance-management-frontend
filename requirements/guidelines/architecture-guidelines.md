# 🏛️ Frontend Architecture Guidelines - Personal Financial Management System

## 📋 Visão Geral do Projeto

O **Sistema de Gerenciamento Financeiro Pessoal** é uma aplicação full-stack que permite aos usuários:

- Gerenciar receitas e despesas pessoais
- Categorizar lançamentos financeiros
- Visualizar resumos e análises mensais
- Projetar fluxo de caixa futuro
- Manter isolamento total de dados por usuário

### Arquitetura do Sistema Completo

- **Backend (API)**: NestJS + TypeORM + PostgreSQL + JWT
- **Frontend**: Next.js + TailwindCSS + TypeScript + Clean Architecture
- **Comunicação**: REST API documentada com Swagger
- **Autenticação**: JWT com refresh tokens
- **Deploy**: API (Fly.io/Railway) + Frontend (Vercel/Netlify)

## 🧱 Stack Tecnológico Frontend

- **Framework**: Next.js 15+ (App Router com PPR)
- **Linguagem**: TypeScript 5+
- **Estilização**: TailwindCSS 3+
- **Comunicação com API**:
  - Server Components: fetch nativo
  - Client Components: Axios (com adapter pattern)
- **Testes E2E**: Cypress
- **Testes Unitários**: Jest + Testing Library
- **Build**: Turbopack (desenvolvimento) + Webpack (produção)
- **Linting**: ESLint + Prettier
- **Git Hooks**: Husky + lint-staged
- **Otimizações**: Partial Prerendering (PPR), Server Actions

## 📂 Estrutura de Pastas (Next.js 15 App Router)

```
frontend/
├── src/
│   ├── domain/        # Regras e interfaces de negócio puras
│   │   ├── models/    # Modelos de domínio (interfaces)
│   │   └── usecases/  # Interfaces de casos de uso
│   ├── data/          # Implementações de casos de uso
│   │   ├── usecases/  # Implementações concretas
│   │   └── actions/   # Server Actions para mutações
│   ├── infra/         # Implementações técnicas
│   │   ├── http/      # HTTP clients (server/client)
│   │   ├── cache/     # Cache e revalidation
│   │   └── auth/      # Autenticação (middleware)
│   ├── presentation/  # Componentes UI
│   │   ├── components/
│   │   │   ├── server/  # Server Components
│   │   │   ├── client/  # Client Components
│   │   │   └── ui/      # Componentes base (atoms)
│   │   └── hooks/     # Hooks para Client Components
│   └── main/          # Composição e configuração
│       ├── factories/ # Factories para DI
│       ├── config/    # Configurações
│       └── providers/ # Context providers
├── app/               # Next.js App Router
│   ├── (auth)/        # Route groups
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/   # Protected routes
│   │   ├── entries/
│   │   ├── summary/
│   │   └── forecast/
│   ├── api/           # Route handlers (se necessário)
│   ├── globals.css    # Estilos globais
│   ├── layout.tsx     # Root layout
│   ├── loading.tsx    # Loading UI
│   ├── error.tsx      # Error boundaries
│   ├── not-found.tsx  # 404 page
│   └── page.tsx       # Home page
├── public/            # Assets estáticos
├── tests/             # Testes
└── middleware.ts      # Next.js middleware
```

## 🔁 Princípios Arquiteturais

### 1. Clean Architecture + Next.js 15 Best Practices

- **Fluxo de dependência**: presentation → data → domain
- **Domain não depende** de nenhuma camada externa
- **Server Components por padrão**: Maximize o uso de Server Components
- **Client Components quando necessário**: Use 'use client' apenas quando precisar de interatividade
- **Server Actions para mutações**: Substitua API routes por Server Actions quando possível
- **Fetch nativo**: Use fetch() do Next.js com cache automático em Server Components

### 2. Padrão de Comunicação com API (Next.js 15)

#### A. Server Components (Leitura de Dados)

```typescript
// 1. Definir interface no domain
// domain/usecases/load-entries.ts
export interface LoadEntriesByMonth {
  load: (params: LoadEntriesParams) => Promise<EntryModel[]>;
}

export type LoadEntriesParams = {
  month: string; // YYYY-MM
  userId: string;
};

// 2. Implementar no data layer para Server Components
// data/usecases/server-load-entries.ts
export class ServerLoadEntries implements LoadEntriesByMonth {
  constructor(private readonly baseUrl: string) {}

  async load(params: LoadEntriesParams): Promise<EntryModel[]> {
    // Next.js fetch com cache automático
    const response = await fetch(
      `${this.baseUrl}/entries?month=${params.month}`,
      {
        headers: {
          Authorization: `Bearer ${await getServerToken()}`,
        },
        // Cache automático do Next.js
        next: {
          revalidate: 300, // 5 minutos
          tags: [`entries-${params.userId}-${params.month}`],
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to load entries");
    }

    const data = await response.json();
    return data.data.map(this.mapToEntryModel);
  }

  private mapToEntryModel(apiEntry: any): EntryModel {
    return {
      ...apiEntry,
      amount: apiEntry.amount / 100, // centavos para reais
      date: new Date(apiEntry.date),
    };
  }
}

// 3. Server Component (sem 'use client')
// app/(dashboard)/entries/page.tsx
import { ServerLoadEntries } from "@/data/usecases/server-load-entries";
import { EntriesList } from "@/presentation/components/server/entries-list";
import { getCurrentUser } from "@/infra/auth/server-auth";

type PageProps = {
  searchParams: { month?: string };
};

export default async function EntriesPage({ searchParams }: PageProps) {
  const user = await getCurrentUser();
  const month = searchParams.month || new Date().toISOString().slice(0, 7);

  // Executa no servidor
  const loadEntries = new ServerLoadEntries(process.env.API_URL!);
  const entries = await loadEntries.load({ month, userId: user.id });

  return (
    <div>
      <h1>Entradas Financeiras</h1>
      <EntriesList entries={entries} month={month} />
    </div>
  );
}
```

#### B. Server Actions (Mutações)

```typescript
// 1. Server Action para mutações
// data/actions/add-entry-action.ts
"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/infra/auth/server-auth";
import { AddEntryParams } from "@/domain/usecases/add-entry";

export async function addEntryAction(params: AddEntryParams) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  try {
    const response = await fetch(`${process.env.API_URL}/entries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.accessToken}`,
      },
      body: JSON.stringify({
        ...params,
        amount: Math.round(params.amount * 100), // reais para centavos
        date: params.date.toISOString().split("T")[0],
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to add entry");
    }

    // Revalidar cache das entradas
    revalidateTag(
      `entries-${user.id}-${params.date.toISOString().slice(0, 7)}`
    );
  } catch (error) {
    throw new Error("Failed to add entry");
  }

  // Redirecionar após sucesso
  redirect("/entries");
}

// 2. Client Component para o formulário
// presentation/components/client/add-entry-form.tsx
("use client");

import { useFormState } from "react-dom";
import { addEntryAction } from "@/data/actions/add-entry-action";

export function AddEntryForm() {
  const [state, formAction] = useFormState(addEntryAction, null);

  return (
    <form action={formAction}>
      <input name="description" placeholder="Descrição" required />
      <input
        name="amount"
        type="number"
        step="0.01"
        placeholder="Valor"
        required
      />
      <select name="type" required>
        <option value="INCOME">Receita</option>
        <option value="EXPENSE">Despesa</option>
      </select>
      <button type="submit">Adicionar Entrada</button>
      {state?.error && <p className="text-red-500">{state.error}</p>}
    </form>
  );
}

// 3. Server Component que usa o Client Component
// app/(dashboard)/entries/add/page.tsx
import { AddEntryForm } from "@/presentation/components/client/add-entry-form";

export default function AddEntryPage() {
  return (
    <div>
      <h1>Adicionar Entrada</h1>
      <AddEntryForm />
    </div>
  );
}
```

#### C. Client Components (Quando Necessário)

```typescript
// Para interatividade complexa que não pode ser Server Action
// presentation/components/client/entries-filter.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

export function EntriesFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [month, setMonth] = useState(searchParams.get("month") || "");

  const handleFilterChange = (newMonth: string) => {
    setMonth(newMonth);

    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      if (newMonth) {
        params.set("month", newMonth);
      } else {
        params.delete("month");
      }
      router.push(`/entries?${params.toString()}`);
    });
  };

  return (
    <div>
      <input
        type="month"
        value={month}
        onChange={(e) => handleFilterChange(e.target.value)}
        disabled={isPending}
      />
      {isPending && <span>Carregando...</span>}
    </div>
  );
}
```

### 3. Injeção de Dependência nos Componentes

- Os componentes recebem suas dependências via props
- As páginas injetam dependências nos componentes que precisam delas
- Evita acoplamento direto com implementações concretas

```typescript
// presentation/components/entry-form.tsx
import { useState } from "react";
import { AddEntryParams } from "@/domain/usecases/add-entry";

type EntryFormProps = {
  onSubmit: (params: AddEntryParams) => Promise<any>;
  isLoading: boolean;
  error: Error | null;
};

export const EntryForm: React.FC<EntryFormProps> = ({
  onSubmit,
  isLoading,
  error,
}) => {
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    date: "",
    type: "EXPENSE" as const,
    category_id: "",
    is_fixed: false,
  });

  // Resto da implementação...

  return <form onSubmit={handleFormSubmit}>{/* Campos do formulário */}</form>;
};
```

### 4. Integração com Next.js App Router (opcional)

Se estiver usando o App Router do Next.js, a integração seria:

```typescript
// app/entries/add/page.tsx
import { makeAddEntryPage } from "@/main/factories/pages/add-entry-page-factory";

export default function AddEntryPage() {
  return makeAddEntryPage();
}
```

### 5. Componentes

- Componentizar seguindo o princípio de responsabilidade única
- Uso de Atomic Design: átomos, moléculas, organismos, templates e páginas

## 💰 Regras de Negócio e Domínio

### Conceitos do Domínio Financeiro

**Entry (Lançamento Financeiro)**

- Representa uma receita ou despesa
- Pode ser fixa (recorrente) ou variável (única)
- Sempre associada a uma categoria e usuário
- Valores sempre positivos (tipo define se é receita/despesa)

**Category (Categoria)**

- Classificação para organização dos lançamentos
- Criada e gerenciada pelo próprio usuário
- Permite análises e filtros por tipo de gasto/receita

**User (Usuário)**

- Isolamento total de dados por usuário
- Autenticação obrigatória para todas as operações
- Não há compartilhamento de dados entre usuários

### Regras de Validação

**Valores Monetários:**

- Sempre trabalhar com centavos internamente (integers)
- Converter para reais apenas na apresentação
- Validar valores positivos
- Máximo de 2 casas decimais

**Datas:**

- Formato ISO para comunicação com API
- Validar datas não muito futuras (limite configurável)
- Considerar timezone do usuário

**Categorias:**

- Nome obrigatório e único por usuário
- Não permitir exclusão se há lançamentos associados
- Categoria padrão para lançamentos sem categoria

### Cálculos Financeiros

**Saldo (Balance):**

```typescript
balance = totalIncome - totalExpenses;
```

**Projeção de Fluxo de Caixa:**

- Baseada apenas em lançamentos fixos
- Considera frequência mensal
- Calcula tendência com base no histórico

## 🔐 Segurança e Isolamento

### Princípios de Segurança

1. **Zero Trust**: Validar tudo no frontend e backend
2. **Least Privilege**: Usuário só acessa seus próprios dados
3. **Defense in Depth**: Múltiplas camadas de validação
4. **Secure by Default**: Configurações seguras por padrão

### Implementação de Isolamento

```typescript
// Sempre incluir userId em operações
interface AuthenticatedRequest {
  userId: string;
  // outros campos...
}

// Validar propriedade dos recursos
const validateOwnership = (resourceUserId: string, currentUserId: string) => {
  if (resourceUserId !== currentUserId) {
    throw new UnauthorizedError("Resource not owned by user");
  }
};
```

### Token Management com Next.js 15

```typescript
// middleware.ts - Autenticação no Edge Runtime
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  // Rotas que precisam de autenticação
  const protectedPaths = ["/dashboard", "/entries", "/summary", "/forecast"];
  const isProtectedPath = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtectedPath) {
    const token = request.cookies.get("accessToken")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      // Verificar token no Edge Runtime
      await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET!));
    } catch (error) {
      // Token inválido, tentar refresh
      const refreshToken = request.cookies.get("refreshToken")?.value;

      if (refreshToken) {
        try {
          const newTokens = await refreshAccessToken(refreshToken);
          const response = NextResponse.next();

          // Atualizar cookies
          response.cookies.set("accessToken", newTokens.accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 15 * 60, // 15 minutos
          });

          return response;
        } catch (refreshError) {
          // Refresh falhou, redirecionar para login
          const response = NextResponse.redirect(
            new URL("/login", request.url)
          );
          response.cookies.delete("accessToken");
          response.cookies.delete("refreshToken");
          return response;
        }
      }

      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|login|register).*)"],
};

// infra/auth/server-auth.ts - Autenticação em Server Components
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export async function getCurrentUser() {
  const cookieStore = cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    throw new Error("No authentication token");
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET!)
    );

    return {
      id: payload.sub as string,
      email: payload.email as string,
      name: payload.name as string,
    };
  } catch (error) {
    throw new Error("Invalid token");
  }
}

// Server Action para login
("use server");

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const response = await fetch(`${process.env.API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const { tokens } = await response.json();

    // Armazenar tokens em cookies httpOnly
    cookies().set("accessToken", tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60, // 15 minutos
    });

    cookies().set("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 dias
    });
  } catch (error) {
    throw new Error("Login failed");
  }

  redirect("/dashboard");
}
```

## 📊 Performance e Otimização (Next.js 15)

### Estratégias de Performance Nativas

**Partial Prerendering (PPR):**

```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    ppr: true, // Habilita PPR
  },
};

export default nextConfig;

// app/entries/page.tsx - PPR automático
export default async function EntriesPage() {
  // Parte estática (pre-rendered)
  return (
    <div>
      <h1>Entradas Financeiras</h1>
      {/* Parte dinâmica (streamed) */}
      <Suspense fallback={<EntriesSkeleton />}>
        <EntriesList />
      </Suspense>
    </div>
  );
}
```

**Cache Inteligente com Next.js:**

```typescript
// Cache automático para Server Components
const entries = await fetch("/api/entries", {
  next: {
    revalidate: 300, // 5 minutos
    tags: ["entries", `user-${userId}`],
  },
});

// Revalidação sob demanda
import { revalidateTag } from "next/cache";
await revalidateTag("entries");

// Cache de uso específico
import { unstable_cache } from "next/cache";

const getCachedSummary = unstable_cache(
  async (userId: string, month: string) => {
    return await fetchMonthlySummary(userId, month);
  },
  ["monthly-summary"],
  { revalidate: 3600 } // 1 hora
);
```

**Bundle Optimization Avançado:**

```typescript
// next.config.js
const nextConfig = {
  // Turbopack para desenvolvimento
  experimental: {
    turbo: {
      rules: {
        "*.svg": {
          loaders: ["@svgr/webpack"],
          as: "*.js",
        },
      },
    },
  },

  // Otimizações de produção
  optimizePackageImports: ["lodash", "date-fns", "recharts"],

  // Compressão
  compress: true,

  // Tree shaking agressivo
  experimental: {
    optimizeServerReact: true,
  },
};
```

**Data Fetching Otimizado:**

```typescript
// Streaming com Suspense
export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>

      {/* Carrega imediatamente */}
      <QuickStats />

      {/* Streams conforme fica pronto */}
      <Suspense fallback={<ChartSkeleton />}>
        <MonthlyChart />
      </Suspense>

      <Suspense fallback={<TableSkeleton />}>
        <RecentEntries />
      </Suspense>
    </div>
  );
}

// Parallel data fetching
async function DashboardData() {
  const [stats, chart, entries] = await Promise.all([
    getQuickStats(),
    getMonthlyChart(),
    getRecentEntries(),
  ]);

  return { stats, chart, entries };
}
```

**UI Performance com React 18:**

```typescript
// Concurrent features
"use client";

import { useTransition, useDeferredValue } from "react";

export function SearchableEntries() {
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const handleSearch = (value: string) => {
    setQuery(value);
    startTransition(() => {
      // Busca não urgente
      searchEntries(deferredQuery);
    });
  };

  return (
    <div>
      <input
        onChange={(e) => handleSearch(e.target.value)}
        disabled={isPending}
      />
      {isPending && <SearchSpinner />}
      <EntriesList query={deferredQuery} />
    </div>
  );
}
```

### Métricas de Performance

```typescript
// Monitoramento de performance com Next.js 15
const performanceMetrics = {
  // Core Web Vitals
  LCP: "<2.5s", // Largest Contentful Paint
  INP: "<200ms", // Interaction to Next Paint (substitui FID)
  CLS: "<0.1", // Cumulative Layout Shift

  // Next.js específico
  TTFB: "<800ms", // Time to First Byte (Server Components)
  FCP: "<1.5s", // First Contentful Paint
  TTI: "<3.5s", // Time to Interactive
  Bundle: "<500KB", // Bundle size (gzipped)

  // PPR específico
  Static_Generation_Time: "<2s",
  Dynamic_Streaming_Time: "<1s",
};
```

## 🧪 Estratégia de Testes Avançada

### Pirâmide de Testes

```
     /\
    /E2E\     ← Poucos, fluxos críticos
   /______\
  /Integration\ ← Médio, interações entre componentes
 /______________\
/   Unit Tests   \ ← Muitos, lógica isolada
/__________________\
```

### Testes por Camada

**Domain Layer:**

```typescript
// Testes de regras de negócio puras
describe("Entry validation", () => {
  it("should reject negative amounts", () => {
    expect(() => createEntry({ amount: -100 })).toThrow(
      "Amount must be positive"
    );
  });
});
```

**Data Layer:**

```typescript
// Testes de casos de uso com mocks
describe("RemoteAddEntry", () => {
  it("should convert amount to cents", async () => {
    const httpClient = mockHttpClient();
    const addEntry = new RemoteAddEntry(url, httpClient);

    await addEntry.add({ amount: 100.5 });

    expect(httpClient.request).toHaveBeenCalledWith({
      body: expect.objectContaining({ amount: 10050 }),
    });
  });
});
```

**Presentation Layer:**

```typescript
// Testes de componentes
describe("EntryForm", () => {
  it("should call onSubmit with formatted data", async () => {
    const onSubmit = jest.fn();
    render(<EntryForm onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText("Valor"), "100,50");
    await userEvent.click(screen.getByRole("button", { name: "Salvar" }));

    expect(onSubmit).toHaveBeenCalledWith({
      amount: 100.5,
    });
  });
});
```

## 🚀 Deploy e CI/CD

### Pipeline de Deploy

```yaml
# .github/workflows/frontend.yml
name: Frontend CI/CD
on:
  push:
    branches: [main, develop]
    paths: ["frontend/**"]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm run test:ci

      - name: Run E2E tests
        run: npm run test:e2e:ci

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

### Configuração Next.js 15 Otimizada

```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Habilita features experimentais
  experimental: {
    ppr: true, // Partial Prerendering
    reactCompiler: true, // React Compiler
    turbo: {
      // Turbopack config para dev
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
    optimizeServerReact: true,
    serverComponentsHmrCache: false, // Desabilita cache HMR para dev
  },

  // Otimizações de bundle
  optimizePackageImports: [
    'lodash',
    'date-fns',
    'recharts',
    '@heroicons/react',
  ],

  // Compressão e cache
  compress: true,
  generateEtags: true,

  // Headers de segurança
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },

  // Redirects para SEO
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: false,
        has: [
          {
            type: 'cookie',
            key: 'accessToken',
          },
        ],
      },
    ];
  },

  // Configuração de imagens
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000, // 1 ano
    dangerouslyAllowSVG: false,
  },

  // Configuração de TypeScript
  typescript: {
    tsconfigPath: './tsconfig.json',
  },

  // ESLint
  eslint: {
    dirs: ['src', 'app'],
  },

  // Configuração de ambiente
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Webpack customizado (fallback para Turbopack)
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Otimizações para produção
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      };
    }

    return config;
  },
};

export default nextConfig;

// tsconfig.json otimizado
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/app/*": ["./app/*"],
      "@/components/*": ["./src/presentation/components/*"],
      "@/domain/*": ["./src/domain/*"],
      "@/data/*": ["./src/data/*"],
      "@/infra/*": ["./src/infra/*"],
      "@/main/*": ["./src/main/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### Ambientes

- **Development**: `localhost:3000` - Hot reload, Turbopack, debug tools
- **Staging**: `staging.financial-app.com` - Testes de integração, PPR habilitado
- **Production**: `app.financial-management.com` - Todas otimizações ativas

---

## 🔗 Integração com Documentação

Este documento deve ser usado em conjunto com:

- **[API Integration Guide](./api-integration.md)** - Detalhes da comunicação com backend
- **[MVP Requirements](./mvp-requirements.md)** - Funcionalidades essenciais
- **[Design System](./design-system.md)** - Padrões visuais e componentes
- **[Testing Guidelines](./testing-guidelines.md)** - Estratégias detalhadas de teste
- **[Security Guidelines](./security-guidelines.md)** - Práticas de segurança específicas

**A arquitetura frontend espelha a arquitetura da API, garantindo consistência e manutenibilidade em todo o sistema! 🏗️**

- Props explicitamente tipadas com TypeScript

### 6. Estado

- Estado local com useState para componentes simples
- Context API para estado compartilhado entre vários componentes
- Zustand apenas se necessário para estado global complexo

### 7. Design System

- Componentizar elementos visuais recorrentes
- Manter consistência visual via variáveis Tailwind no tema
- Documentar componentes para reuso

### 8. Gerenciamento de Servidor de Estado

Para gerenciar dados do servidor e cache, você pode usar bibliotecas como React Query, mantendo o padrão de injeção de dependência:

```typescript
// main/factories/pages/dashboard-page-factory.tsx
import { QueryClient, QueryClientProvider } from "react-query";
import { DashboardPage } from "@/presentation/pages/dashboard-page";
import { makeRemoteLoadEntries } from "@/main/factories/usecases/load-entries-factory";

export const makeDashboardPage = () => {
  const queryClient = new QueryClient();
  const loadEntries = makeRemoteLoadEntries();

  return (
    <QueryClientProvider client={queryClient}>
      <DashboardPage loadEntries={loadEntries} />
    </QueryClientProvider>
  );
};
```

### 9. Gerenciamento de Dados entre Páginas

Para gerenciar dados que precisam persistir entre navegações de páginas:

1. **Server-side props**: Para dados que vêm do servidor
2. **URL Query Parameters**: Para filtros e outros estados que devem ser compartilhados
3. **Zustand**: Para estados globais que devem persistir entre páginas

```typescript
// pages/entries/index.tsx
import { makeEntriesListPage } from "@/main/factories/pages/entries-list-page-factory";

export async function getServerSideProps(context) {
  // Buscar dados iniciais do servidor
  const initialEntries = await fetchInitialEntries();

  return {
    props: {
      initialEntries,
    },
  };
}

export default function EntriesListRoute(props) {
  return makeEntriesListPage(props);
}
```
