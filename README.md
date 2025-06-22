# 💰 Personal Financial Management System - Frontend

Sistema de Gerenciamento Financeiro Pessoal construído com Next.js 15, Clean Architecture e TypeScript.

## 🚀 Tecnologias

### Core

- **Next.js 15** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **TailwindCSS** - Framework CSS utilitário
- **Yarn** - Gerenciador de pacotes

### Desenvolvimento

- **Jest + Testing Library** - Testes unitários
- **Cypress** - Testes E2E
- **ESLint + Prettier** - Linting e formatação
- **Husky + lint-staged** - Git hooks

### CI/CD & Deploy

- **GitHub Actions** - Automação CI/CD
- **Docker** - Containerização
- **Vercel** - Deploy (configurado)

## 📁 Estrutura do Projeto

```
src/
├── domain/              # Regras de negócio puras
│   ├── models/         # Interfaces de domínio
│   │   ├── entry.ts
│   │   ├── category.ts
│   │   ├── user.ts
│   │   └── index.ts    # ⭐ Exporta todos os models
│   └── usecases/       # Interfaces de casos de uso
│       ├── load-entries.ts
│       ├── add-entry.ts
│       └── index.ts    # ⭐ Exporta todos os use cases
├── data/               # Implementações de casos de uso
│   ├── usecases/       # Implementações concretas
│   │   ├── remote-load-entries.ts
│   │   ├── remote-add-entry.ts
│   │   └── index.ts    # ⭐ Exporta implementações
│   └── actions/        # Server Actions para mutações
│       ├── add-entry-action.ts
│       └── index.ts    # ⭐ Exporta actions
├── infra/              # Implementações técnicas
│   ├── http/           # HTTP clients (server/client)
│   │   ├── axios-adapter.ts
│   │   ├── fetch-adapter.ts
│   │   └── index.ts    # ⭐ Exporta adapters
│   ├── cache/          # Cache e revalidation
│   │   └── index.ts
│   └── auth/           # Autenticação (middleware)
│       └── index.ts
├── presentation/       # Componentes UI
│   ├── components/
│   │   ├── server/     # Server Components
│   │   │   └── index.ts
│   │   ├── client/     # Client Components
│   │   │   └── index.ts
│   │   └── ui/         # Componentes base
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       └── index.ts # ⭐ Exporta componentes UI
│   └── hooks/          # Hooks para Client Components
│       └── index.ts
└── main/               # Composição e configuração
    ├── factories/      # Factories para DI
    │   ├── usecases/
    │   │   └── index.ts
    │   ├── pages/
    │   │   └── index.ts
    │   └── index.ts    # ⭐ Exporta todas as factories
    ├── config/         # Configurações
    │   └── index.ts
    └── providers/      # Context providers
        └── index.ts

app/                    # Next.js App Router
├── (auth)/            # Route groups
├── (dashboard)/       # Protected routes
├── globals.css        # Estilos globais
├── layout.tsx         # Root layout
└── page.tsx           # Home page
```

## 📋 Diretrizes de Desenvolvimento

### 🔄 Padrão de Exportação com `index.ts`

**OBRIGATÓRIO**: Cada diretório deve ter um arquivo `index.ts` que exporta todos os módulos públicos:

#### Domain Layer

```typescript
// src/domain/models/index.ts
export * from './entry';
export * from './category';
export * from './user';

// src/domain/usecases/index.ts
export * from './load-entries';
export * from './add-entry';
export * from './update-entry';
export * from './delete-entry';
```

#### Data Layer

```typescript
// src/data/usecases/index.ts
export * from './remote-load-entries';
export * from './remote-add-entry';
export * from './remote-update-entry';
export * from './remote-delete-entry';

// src/data/actions/index.ts
export * from './add-entry-action';
export * from './update-entry-action';
export * from './delete-entry-action';
```

#### Infrastructure Layer

```typescript
// src/infra/http/index.ts
export * from './axios-adapter';
export * from './fetch-adapter';

// src/infra/auth/index.ts
export * from './jwt-adapter';
export * from './auth-middleware';
```

#### Presentation Layer

```typescript
// src/presentation/components/ui/index.ts
export * from './button';
export * from './input';
export * from './card';
export * from './modal';

// src/presentation/hooks/index.ts
export * from './use-entries';
export * from './use-auth';
export * from './use-form';
```

#### Main Layer

```typescript
// src/main/factories/index.ts
export * from './usecases';
export * from './pages';
export * from './components';

// src/main/factories/usecases/index.ts
export * from './load-entries-factory';
export * from './add-entry-factory';
```

### 📦 Importações Padronizadas

**Sempre importe do `index.ts` mais próximo:**

```typescript
// ✅ CORRETO - Importação limpa
import { EntryModel, CategoryModel } from '@/domain/models';
import { LoadEntries, AddEntry } from '@/domain/usecases';
import { Button, Input } from '@/presentation/components/ui';

// ❌ INCORRETO - Importação direta
import { EntryModel } from '@/domain/models/entry';
import { CategoryModel } from '@/domain/models/category';
import { Button } from '@/presentation/components/ui/button';
```

### 🏗️ Workflow de Desenvolvimento

#### 1. Criando um Novo Modelo

```bash
# 1. Criar o arquivo do modelo
touch src/domain/models/new-model.ts

# 2. Implementar o modelo
# 3. Adicionar exportação no index.ts
echo "export * from './new-model';" >> src/domain/models/index.ts
```

#### 2. Criando um Novo Use Case

```bash
# 1. Criar interface no domain
touch src/domain/usecases/new-usecase.ts

# 2. Adicionar ao index de usecases
echo "export * from './new-usecase';" >> src/domain/usecases/index.ts

# 3. Criar implementação no data
touch src/data/usecases/remote-new-usecase.ts

# 4. Adicionar ao index de data
echo "export * from './remote-new-usecase';" >> src/data/usecases/index.ts
```

#### 3. Criando um Novo Componente

```bash
# 1. Criar componente
touch src/presentation/components/ui/new-component.tsx

# 2. Adicionar ao index de UI
echo "export * from './new-component';" >> src/presentation/components/ui/index.ts
```

### 🧪 Testes e Exportações

**Os testes devem importar do mesmo `index.ts`:**

```typescript
// tests/domain/models/entry.spec.ts
import { EntryModel } from '@/domain/models';

// tests/presentation/components/button.spec.tsx
import { Button } from '@/presentation/components/ui';
```

### 📝 Regras de Exportação

1. **Sempre exporte através de `index.ts`**
2. **Use `export *` para re-exportar módulos**
3. **Mantenha os `index.ts` organizados alfabeticamente**
4. **Não exporte implementações internas/privadas**
5. **Documente exports complexos quando necessário**

#### Exemplo de `index.ts` Documentado

```typescript
// src/domain/usecases/index.ts

// Entry Management
export * from './load-entries';
export * from './add-entry';
export * from './update-entry';
export * from './delete-entry';

// Category Management
export * from './load-categories';
export * from './add-category';

// User Management
export * from './authenticate-user';
export * from './refresh-token';
```

### 🔍 Benefícios do Padrão

1. **Imports Limpos**: Reduz verbosidade nas importações
2. **Refatoração Fácil**: Mudanças internas não quebram imports externos
3. **API Pública Clara**: Define claramente o que pode ser importado
4. **Organização**: Força estrutura consistente
5. **Performance**: Facilita tree-shaking do bundler

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
yarn dev                # Servidor de desenvolvimento
yarn build             # Build de produção
yarn start             # Servidor de produção

# Qualidade de código
yarn lint              # Executar ESLint
yarn lint:fix          # Corrigir problemas do ESLint
yarn format            # Formatar código com Prettier
yarn format:check      # Verificar formatação
yarn type-check        # Verificar tipos TypeScript

# Testes
yarn test              # Testes unitários
yarn test:watch        # Testes em modo watch
yarn test:ci           # Testes para CI (com coverage)
yarn test:e2e          # Testes E2E
yarn test:e2e:open     # Abrir Cypress

# Docker
docker-compose up      # Executar com Docker
docker build -t frontend .  # Build da imagem
```

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+
- Yarn

### Instalação

```bash
# Instalar dependências
yarn install

# Copiar arquivo de ambiente
cp .env.example .env.local

# Executar em desenvolvimento
yarn dev
```

O projeto estará disponível em [http://localhost:3000](http://localhost:3000)

### Docker

```bash
# Executar com Docker Compose
docker-compose up

# Ou build manual
docker build -t personal-finance-frontend .
docker run -p 3000:3000 personal-finance-frontend
```

## 🧪 Testes

### Unitários

```bash
yarn test              # Executar todos os testes
yarn test:watch        # Modo watch
yarn test:ci           # CI com coverage
```

### E2E

```bash
yarn test:e2e          # Executar testes E2E
yarn test:e2e:open     # Interface do Cypress
```

## 📦 CI/CD

### GitHub Actions

- **CI Pipeline**: Executado em PRs

  - Linting e formatação
  - Type checking
  - Testes unitários
  - Build
  - Security audit

- **Deploy Pipeline**: Executado em push para main/develop
  - Testes
  - Deploy automático para Vercel
  - Notificações Slack

### Configuração de Secrets

Configure os seguintes secrets no GitHub:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
- `NEXT_PUBLIC_API_URL_STAGING`
- `NEXT_PUBLIC_API_URL_PROD`
- `SLACK_WEBHOOK_URL`

## 🏗️ Arquitetura

### Clean Architecture

O projeto segue os princípios da Clean Architecture:

1. **Domain**: Regras de negócio puras, sem dependências externas
2. **Data**: Implementações dos casos de uso
3. **Infra**: Implementações técnicas (HTTP, cache, auth)
4. **Presentation**: Componentes UI e hooks
5. **Main**: Composição e configuração

### Fluxo de Dependências

```
Presentation → Data → Domain
     ↓
   Infra ← Main
```

## 🎨 Design System

O projeto inclui um sistema de design básico com:

- Componentes UI reutilizáveis
- Paleta de cores consistente
- Tipografia padronizada
- Espaçamentos sistemáticos

### Exemplo de Uso

```tsx
import { Button } from '@/presentation/components/ui';

<Button variant='primary' size='lg'>
  Meu Botão
</Button>;
```

## 🔧 Configurações

### Path Aliases

```typescript
// Configurados no tsconfig.json
"@/*": ["./src/*"]
"@/components/*": ["./src/presentation/components/*"]
"@/domain/*": ["./src/domain/*"]
"@/data/*": ["./src/data/*"]
"@/infra/*": ["./src/infra/*"]
"@/main/*": ["./src/main/*"]
```

### Variáveis de Ambiente

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
NODE_ENV=development
```

## 📋 Próximos Passos

Com o boilerplate configurado, você pode:

1. **Implementar casos de uso** específicos do domínio financeiro
2. **Criar componentes** para formulários e visualizações
3. **Integrar com a API** backend
4. **Adicionar autenticação** JWT
5. **Implementar testes** para cada funcionalidade

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

**Boilerplate pronto para desenvolvimento! 🚀**
