# 🚀 CI/CD & Deploy Guidelines (Frontend)

Este documento descreve as práticas recomendadas para configurar o pipeline de CI/CD e realizar o deploy da aplicação frontend utilizando **GitHub Actions**, **Docker** e **Vercel/Netlify**.

## 📦 Requisitos

- Conta no GitHub com GitHub Actions habilitado
- Conta no Vercel, Netlify ou outro serviço de hospedagem frontend
- Docker instalado para builds
- Configuração adequada de variáveis de ambiente

## 🧱 Estrutura de Arquivos

```
project-root/
├── .github/
│   └── workflows/
│       ├── ci.yml           # Verificações para PRs
│       └── deploy.yml       # Pipeline de deploy
├── frontend/
│   ├── src/
│   ├── Dockerfile
│   └── vercel.json          # Configuração para Vercel (opcional)
└── .env.example             # Template para variáveis de ambiente
```

## ⚙️ GitHub Actions - CI Pipeline

### `.github/workflows/ci.yml`

```yaml
name: Frontend CI

on:
  pull_request:
    branches: [main, develop]
    paths:
      - "frontend/**"
      - ".github/workflows/ci.yml"

jobs:
  lint-test:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./frontend

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: "npm"
          cache-dependency-path: "./frontend/package-lock.json"

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Type Check
        run: npm run type-check

      - name: Test
        run: npm run test:ci

      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_API_URL: ${{ secrets.NEXT_PUBLIC_API_URL_STAGING }}

  security-scan:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./frontend

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: "npm"
          cache-dependency-path: "./frontend/package-lock.json"

      - name: Install dependencies
        run: npm ci

      - name: Run security audit
        run: npm audit --audit-level=high
        continue-on-error: true

      - name: Scan for vulnerabilities
        uses: snyk/actions/node@master
        with:
          args: --severity-threshold=high
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
```

## ⚙️ GitHub Actions - Deploy Pipeline

### `.github/workflows/deploy.yml`

```yaml
name: Frontend Deploy

on:
  push:
    branches: [main, develop]
    paths:
      - "frontend/**"
      - ".github/workflows/deploy.yml"

jobs:
  deploy:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./frontend

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: "npm"
          cache-dependency-path: "./frontend/package-lock.json"

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm run test:ci

      - name: Set environment
        id: set-env
        run: |
          if [[ $GITHUB_REF == 'refs/heads/main' ]]; then
            echo "VERCEL_ENVIRONMENT=production" >> $GITHUB_ENV
            echo "NEXT_PUBLIC_API_URL=${{ secrets.NEXT_PUBLIC_API_URL_PROD }}" >> $GITHUB_ENV
          else
            echo "VERCEL_ENVIRONMENT=preview" >> $GITHUB_ENV
            echo "NEXT_PUBLIC_API_URL=${{ secrets.NEXT_PUBLIC_API_URL_STAGING }}" >> $GITHUB_ENV
          fi

      # Opção 1: Deploy para Vercel
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          github-token: ${{ secrets.GITHUB_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID}}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID}}
          working-directory: ./frontend
          vercel-args: "--prod"

      # Opção 2: Deploy para Netlify (alternativa)
      # - name: Deploy to Netlify
      #   uses: nwtgck/actions-netlify@v1.2
      #   with:
      #     publish-dir: './frontend/out'
      #     production-branch: main
      #     github-token: ${{ secrets.GITHUB_TOKEN }}
      #     deploy-message: "Deploy from GitHub Actions"
      #     enable-pull-request-comment: true
      #     enable-commit-comment: true
      #     overwrites-pull-request-comment: true
      #   env:
      #     NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
      #     NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}

      - name: Notify deployment
        uses: slackapi/slack-github-action@v1.23.0
        with:
          payload: |
            {
              "text": "🚀 Frontend deployed to ${{ env.VERCEL_ENVIRONMENT }} environment"
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

## ✈️ Configuração da Vercel

### `vercel.json`

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "outputDirectory": ".next",
  "env": {
    "NEXT_PUBLIC_API_URL": "https://api.financeapp.example.com"
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self' https://api.financeapp.example.com;"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://api.financeapp.example.com/:path*"
    },
    {
      "source": "/(.*)",
      "destination": "/"
    }
  ]
}
```

## 🔒 Gestão de Secrets e Variáveis de Ambiente

### Secrets para CI/CD

Configure os seguintes secrets no repositório GitHub:

- `VERCEL_TOKEN`: Token da API da Vercel
- `VERCEL_ORG_ID`: ID da organização na Vercel
- `VERCEL_PROJECT_ID`: ID do projeto na Vercel
- `NEXT_PUBLIC_API_URL_STAGING`: URL da API de staging
- `NEXT_PUBLIC_API_URL_PROD`: URL da API de produção
- `SLACK_WEBHOOK_URL`: URL para notificações no Slack
- `SNYK_TOKEN`: Token para scan de segurança (opcional)

### Runtime Environment Variables

Para variáveis que precisam ser acessíveis no cliente:

```typescript
// Exemplo em next.config.js
module.exports = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_APP_VERSION: process.env.npm_package_version,
  },
  // Outras configurações...
};
```

## 🛠️ Estratégias de Deploy

### 1. Deploy Zero-Downtime

- Garanta que novas versões sejam completamente construídas antes de substituir a versão atual
- Use o recurso de preview deployments da Vercel/Netlify para testar antes de ir para produção
- Mantenha um histórico de deploys para possibilitar rollbacks rápidos

### 2. Feature Flags

- Implemente um sistema de feature flags para controlar recursos em produção
- Use `localStorage` ou APIs para controlar flags no cliente
- Isso permite lançar recursos parcialmente completos de forma segura

```typescript
// Exemplo de implementação simples de feature flags
export const featureFlags = {
  NEW_DASHBOARD: process.env.NEXT_PUBLIC_ENABLE_NEW_DASHBOARD === "true",
  DARK_MODE: process.env.NEXT_PUBLIC_ENABLE_DARK_MODE === "true",
  BETA_FEATURES: process.env.NEXT_PUBLIC_ENVIRONMENT !== "production",
};
```

### 3. Estratégia de Branches

- `main` -> Produção
- `develop` -> Staging/QA
- `feature/*` -> Branches de desenvolvimento que geram preview deployments

## 📈 Monitoramento de Deploys

### 1. Integração com Ferramentas de Monitoramento

```yaml
# Adicionar ao workflow de deploy
- name: Notify New Relic deployment
  run: |
    curl -X POST "https://api.newrelic.com/v2/applications/${{ secrets.NEW_RELIC_APP_ID }}/deployments.json" \
    -H "X-Api-Key:${{ secrets.NEW_RELIC_API_KEY }}" \
    -H "Content-Type: application/json" \
    -d '{
      "deployment": {
        "revision": "${{ github.sha }}",
        "changelog": "Deploy via GitHub Actions",
        "description": "Deploy to ${{ env.VERCEL_ENVIRONMENT }}",
        "user": "${{ github.actor }}"
      }
    }'
```

### 2. Verificações Pós-Deploy

```yaml
# Adicionar ao workflow de deploy
- name: Verify deployment
  run: |
    sleep 30  # Dar tempo para propagação
    STATUS_CODE=$(curl -s -o /dev/null -w "%{http_code}" ${{ env.DEPLOYMENT_URL }})
    if [[ $STATUS_CODE -ne 200 ]]; then
      echo "Deployment verification failed with status $STATUS_CODE"
      exit 1
    fi
```

## 🧪 Testes Específicos para Ambiente de Produção

```yaml
# Adicionar ao workflow de deploy após o deploy para produção
- name: Run Lighthouse CI
  uses: treosh/lighthouse-ci-action@v9
  with:
    urls: |
      ${{ env.DEPLOYMENT_URL }}
    uploadArtifacts: true
    temporaryPublicStorage: true
    runs: 3
    configPath: "./lighthouse-config.js"
```

## 🔄 Rollback

Em caso de problemas em produção:

```yaml
# Script para rollback no Vercel (adicionar como job separado)
rollback:
  runs-on: ubuntu-latest
  steps:
    - name: Rollback to previous deployment
      run: |
        curl -X POST "https://api.vercel.com/v13/deployments/${{ github.event.inputs.deployment_id }}/rollback" \
        -H "Authorization: Bearer ${{ secrets.VERCEL_TOKEN }}" \
        -H "Content-Type: application/json"
```
