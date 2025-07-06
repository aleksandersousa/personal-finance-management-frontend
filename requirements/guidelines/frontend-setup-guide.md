# Frontend Setup Guide

Este guia fornece instruções passo a passo para configurar o ambiente de desenvolvimento do frontend da aplicação de gestão financeira pessoal.

## 📋 Pré-requisitos

### Sistema Operacional

- **Windows**: Windows 10/11 com WSL2
- **macOS**: macOS 10.15 ou superior
- **Linux**: Ubuntu 20.04+ ou distribuições equivalentes

### Ferramentas Necessárias

```bash
# Node.js (versão 18.17.0 ou superior)
node --version  # v18.17.0+

# npm (versão 9.0.0 ou superior)
npm --version   # 9.0.0+

# Git (versão 2.34.0 ou superior)
git --version   # 2.34.0+
```

### IDEs Recomendadas

- **VS Code** (recomendado)
- **WebStorm**
- **Cursor**

## 🚀 Configuração do Projeto

### 1. Clone do Repositório

```bash
# Clone o repositório
git clone <repository-url>
cd personal-financial-management

# Navegue para o frontend
cd frontend
```

### 2. Instalação de Dependências

```bash
# Usando yarn (recomendado)
yarn install

# Ou usando npm
npm install

# Ou usando pnpm (mais rápido)
pnpm install
```

### 3. Configuração de Ambiente

```bash
# Copie o arquivo de exemplo
cp .env.example .env.local

# Configure as variáveis de ambiente
nano .env.local  # ou seu editor preferido
```

#### Variáveis de Ambiente Necessárias

```bash
# .env.local
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-here
JWT_SECRET=your-jwt-secret-key-here

# Development
NODE_ENV=development
NEXT_TELEMETRY_DISABLED=1

# Optional: Analytics
NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

### 4. Configuração do VS Code (Recomendado)

#### Extensões Necessárias

```json
// .vscode/extensions.json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json",
    "streetsidesoftware.code-spell-checker"
  ]
}
```

#### Configurações do Workspace

```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "emmet.includeLanguages": {
    "javascript": "javascriptreact",
    "typescript": "typescriptreact"
  },
  "tailwindCSS.experimental.classRegex": [
    ["clsx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"],
    ["classnames\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"],
    ["cn\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

## 🔧 Configuração de Ferramentas

### 1. Next.js 15 Configuration

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

### 2. TypeScript Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
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
      "@/app/*": ["./src/app/*"],
      "@/components/*": ["./src/presentation/components/*"],
      "@/domain/*": ["./src/domain/*"],
      "@/data/*": ["./src/data/*"],
      "@/infra/*": ["./src/infra/*"],
      "@/main/*": ["./src/main/*"]
    },
    "types": ["jest", "@testing-library/jest-dom"],
    "skipLibCheck": true
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    "jest.setup.js",
    "jest.d.ts"
  ],
  "exclude": ["node_modules", "cypress", "cypress.config.ts", "tests/e2e"]
}
```

### 3. ESLint Configuration

```javascript
// eslint.config.mjs
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import globals from 'globals';

const compat = new FlatCompat();

export default [
  js.configs.recommended,
  ...compat.extends('next/core-web-vitals'),
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      '@next/next': nextPlugin,
      'react-hooks': reactHooksPlugin,
    },
    rules: {
      '@next/next/no-html-link-for-pages': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
];
```

### 4. Prettier Configuration

```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

### 5. TailwindCSS Configuration

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Financial app color palette
        primary: {
          50: '#f0f9ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        success: {
          50: '#f0fdf4',
          500: '#22c55e',
          600: '#16a34a',
        },
        danger: {
          50: '#fef2f2',
          500: '#ef4444',
          600: '#dc2626',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
};
```

## 🧪 Configuração de Testes

### 1. Jest Configuration

```javascript
// jest.config.mjs
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/app/(.*)$': '<rootDir>/src/app/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    'app/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  testMatch: ['<rootDir>/tests/**/*.spec.{js,jsx,ts,tsx}'],
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '<rootDir>/tests/e2e/',
  ],
  transformIgnorePatterns: ['node_modules/(?!(next|@next)/)'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/components/(.*)$': '<rootDir>/src/presentation/components/$1',
    '^@/domain/(.*)$': '<rootDir>/src/domain/$1',
    '^@/data/(.*)$': '<rootDir>/src/data/$1',
    '^@/infra/(.*)$': '<rootDir>/src/infra/$1',
    '^@/main/(.*)$': '<rootDir>/src/main/$1',
    '^next/cache$': '<rootDir>/tests/presentation/mocks/next-cache.ts',
    '^next/navigation$':
      '<rootDir>/tests/presentation/mocks/next-navigation.ts',
  },
};

export default createJestConfig(customJestConfig);
```

### 2. Jest Setup

```javascript
// jest.setup.js
import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
}));

// Mock fetch
global.fetch = jest.fn();

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;
```

### 3. Cypress Configuration

```typescript
// cypress.config.ts
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'tests/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'tests/e2e/support/e2e.ts',
    videosFolder: 'tests/e2e/videos',
    screenshotsFolder: 'tests/e2e/screenshots',
    fixturesFolder: 'tests/e2e/fixtures',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    setupNodeEvents() {
      // implement node event listeners here
    },
  },
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
    specPattern: 'src/**/*.cy.{js,jsx,ts,tsx}',
  },
});
```

## 🚀 Executando o Projeto

### 1. Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
yarn dev

# Abrir no navegador
# http://localhost:3000
```

### 2. Build e Produção

```bash
# Build para produção
yarn build

# Iniciar servidor de produção
yarn start

# Analisar bundle
yarn analyze
```

### 3. Testes

```bash
# Testes unitários
yarn test

# Testes em modo watch
yarn test:watch

# Testes em CI
yarn test:ci

# Coverage
yarn test:coverage

# Testes E2E
yarn test:e2e

# Abrir Cypress
yarn test:e2e:open
```

### 4. Linting e Formatação

```bash
# Lint
yarn lint

# Fix lint issues
yarn lint:fix

# Format code
yarn format

# Type check
yarn type-check
```

## 🏗️ Estrutura do Projeto

### Arquitetura Clean Architecture

```
src/
├── domain/           # Regras de negócio e entidades
│   ├── models/      # Entidades do domínio
│   ├── usecases/    # Casos de uso
│   └── index.ts
├── data/            # Camada de dados
│   ├── protocols/   # Interfaces de comunicação
│   ├── usecases/    # Implementações dos casos de uso
│   └── index.ts
├── infra/           # Implementações técnicas
│   ├── http/        # HTTP Client (fetch)
│   ├── storage/     # LocalStorage adapter
│   ├── validation/  # Validação com Zod
│   └── index.ts
├── presentation/     # Interface do usuário
│   ├── actions/     # Server Actions
│   ├── components/  # Componentes React
│   │   ├── client/  # Client Components
│   │   ├── server/  # Server Components
│   │   └── ui/      # Componentes base
│   ├── protocols/   # Interfaces de validação
│   ├── helpers/     # Helpers para Server Components
│   └── index.ts
├── main/            # Composição e configuração
│   ├── factories/   # Factories para injeção de dependência
│   ├── decorators/  # Decorators para HTTP Client
│   └── index.ts
└── app/             # Next.js App Router
    ├── (auth)/      # Rotas de autenticação
    ├── (dashboard)/ # Rotas do dashboard
    ├── api/         # API routes
    ├── globals.css
    ├── layout.tsx
    └── page.tsx
```

### Estrutura de Testes

```
tests/
├── domain/          # Testes do domínio
│   └── usecases/
├── data/            # Testes da camada de dados
│   ├── usecases/
│   └── mocks/
├── infra/           # Testes das implementações
│   ├── validation/
│   ├── http/
│   └── storage/
├── presentation/     # Testes dos componentes
│   ├── components/
│   │   ├── client/
│   │   ├── server/
│   │   └── ui/
│   └── mocks/
├── main/            # Testes das factories
│   └── factories/
└── e2e/             # Testes end-to-end
    ├── critical-flows/
    ├── fixtures/
    └── support/
```

## 🔧 Desenvolvimento

### 1. Criando um Novo Caso de Uso

```bash
# 1. Criar interface no domain
touch src/domain/usecases/load-categories.ts

# 2. Criar implementação no data
touch src/data/usecases/remote-load-categories.ts

# 3. Criar factory no main
touch src/main/factories/usecases/load-categories-factory.ts

# 4. Criar testes
touch tests/domain/usecases/load-categories.spec.ts
touch tests/data/usecases/remote-load-categories.spec.ts
```

### 2. Criando um Novo Componente

```bash
# 1. Criar componente client
touch src/presentation/components/client/category-select.tsx

# 2. Criar factory do componente
touch src/main/factories/components/category-select-factory.tsx

# 3. Criar testes
touch tests/presentation/components/client/category-select.spec.tsx
```

### 3. Criando uma Nova Página

```bash
# 1. Criar componente da página
touch src/presentation/components/server/categories-page.tsx

# 2. Criar factory da página
touch src/main/factories/pages/categories-page-factory.tsx

# 3. Criar página Next.js
touch src/app/(dashboard)/categories/page.tsx

# 4. Criar testes
touch tests/presentation/components/server/categories-page.spec.tsx
```

## 🐛 Troubleshooting

### Problemas Comuns

#### 1. Erro de Módulo não Encontrado

```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
yarn install
```

#### 2. Erro de TypeScript

```bash
# Verificar configuração do TypeScript
yarn type-check

# Reiniciar TypeScript server no VS Code
Ctrl+Shift+P -> "TypeScript: Restart TS Server"
```

#### 3. Erro de Build

```bash
# Limpar cache do Next.js
rm -rf .next
yarn build
```

#### 4. Problemas com TailwindCSS

```bash
# Verificar se o arquivo CSS está importado
# app/globals.css deve conter:
# @tailwind base;
# @tailwind components;
# @tailwind utilities;
```

#### 5. Problemas com Testes

```bash
# Limpar cache do Jest
yarn jest --clearCache

# Verificar configuração
yarn test --verbose
```

### Logs e Debug

```bash
# Debug mode
DEBUG=* yarn dev

# Verbose logging
yarn dev --verbose

# Inspect Node.js
yarn dev --inspect
```

## 📚 Próximos Passos

Após a configuração:

1. **Familiarize-se com a arquitetura**

   - Leia `development-workflow.md`
   - Entenda a estrutura de pastas
   - Revise os padrões de código

2. **Explore os componentes**

   - Server Components vs Client Components
   - Server Actions para mutações
   - Sistema de cache do Next.js

3. **Configure seu ambiente de desenvolvimento**

   - Instale extensões recomendadas
   - Configure atalhos de teclado
   - Personalize seu workflow

4. **Execute os testes**

   - Rode os testes existentes
   - Entenda a estrutura de testes
   - Pratique TDD

5. **Comece a desenvolver**
   - Siga o `development-workflow.md`
   - Implemente sua primeira feature
   - Faça seu primeiro PR

## 🆘 Suporte

Se encontrar problemas:

1. **Consulte a documentação**

   - README.md do projeto
   - Documentação do Next.js
   - Issues do GitHub

2. **Peça ajuda ao time**

   - Slack/Discord do projeto
   - Pair programming
   - Code review

3. **Recursos externos**
   - [Next.js Documentation](https://nextjs.org/docs)
   - [React Documentation](https://react.dev)
   - [TailwindCSS Documentation](https://tailwindcss.com/docs)
   - [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

## 🚀 Deploy

### Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Configurar variáveis de ambiente
vercel env add NEXT_PUBLIC_API_URL
vercel env add NEXTAUTH_SECRET
vercel env add JWT_SECRET
```

### Netlify

```bash
# Build
yarn build

# Deploy
netlify deploy --prod --dir=.next
```

### Docker

```bash
# Build da imagem
docker build -t financial-frontend .

# Executar container
docker run -p 3000:3000 financial-frontend
```

**Agora você está pronto para desenvolver! 🚀**
