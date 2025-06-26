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
# Usando npm
npm install

# Ou usando yarn (se preferir)
yarn install

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
API_URL=http://localhost:3001
API_VERSION=v1

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-here
JWT_SECRET=your-jwt-secret-key-here

# Database (se necessário para desenvolvimento)
DATABASE_URL=postgresql://user:password@localhost:5432/financial_db

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
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    ppr: true, // Partial Prerendering
    reactCompiler: true, // React Compiler
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },

  // Path aliases
  webpack: config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
      '@/app': path.resolve(__dirname, 'app'),
    };
    return config;
  },
};

export default nextConfig;
```

### 2. TypeScript Configuration

```json
// tsconfig.json
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
    "plugins": [{ "name": "next" }],
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

### 3. ESLint Configuration

```json
// .eslintrc.json
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended",
    "prettier"
  ],
  "plugins": ["@typescript-eslint"],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "prefer-const": "error",
    "no-var": "error"
  }
}
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
// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/app/(.*)$': '<rootDir>/app/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    'app/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
};

module.exports = createJestConfig(customJestConfig);
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
```

### 3. Cypress Configuration

```javascript
// cypress.config.js
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
  },
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },
});
```

## 🚀 Executando o Projeto

### 1. Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
npm run dev
# ou
yarn dev

# Abrir no navegador
# http://localhost:3000
```

### 2. Build e Produção

```bash
# Build para produção
npm run build

# Iniciar servidor de produção
npm run start

# Analisar bundle
npm run analyze
```

### 3. Testes

```bash
# Testes unitários
npm run test

# Testes em modo watch
npm run test:watch

# Coverage
npm run test:coverage

# Testes E2E
npm run test:e2e
```

### 4. Linting e Formatação

```bash
# Lint
npm run lint

# Fix lint issues
npm run lint:fix

# Format code
npm run format

# Type check
npm run type-check
```

## 🐛 Troubleshooting

### Problemas Comuns

#### 1. Erro de Módulo não Encontrado

```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
```

#### 2. Erro de TypeScript

```bash
# Verificar configuração do TypeScript
npm run type-check

# Reiniciar TypeScript server no VS Code
Ctrl+Shift+P -> "TypeScript: Restart TS Server"
```

#### 3. Erro de Build

```bash
# Limpar cache do Next.js
rm -rf .next
npm run build
```

#### 4. Problemas com TailwindCSS

```bash
# Verificar se o arquivo CSS está importado
# app/globals.css deve conter:
# @tailwind base;
# @tailwind components;
# @tailwind utilities;
```

### Logs e Debug

```bash
# Debug mode
DEBUG=* npm run dev

# Verbose logging
npm run dev -- --verbose

# Inspect Node.js
npm run dev -- --inspect
```

## 📚 Próximos Passos

Após a configuração:

1. **Familiarize-se com a arquitetura**

   - Leia `architecture-guidelines.md`
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
