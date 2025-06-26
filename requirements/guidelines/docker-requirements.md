# 🐳 Docker Guidelines (Frontend)

## 🎯 Objetivo

Containerizar a aplicação frontend (Next.js) permitindo:

- Ambiente de desenvolvimento padronizado
- Facilitação de testes e CI/CD
- Deploy simplificado para produção ou staging

## 📁 Estrutura esperada

```
project-root/
├── frontend/
│   ├── src/
│   ├── public/
│   ├── Dockerfile
│   ├── .dockerignore
│   └── ...
├── docker-compose.yml
└── .env
```

## ⚙️ Dockerfile (Next.js)

```Dockerfile
# Estágio de build
FROM node:18-alpine AS builder

WORKDIR /app

# Instalação de dependências
COPY package*.json ./
RUN npm ci

# Build da aplicação
COPY . .
RUN npm run build

# Estágio de produção
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Usuário não-root para segurança
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar apenas arquivos necessários
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Definir usuário não-root
USER nextjs

# Configurar healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/health || exit 1

EXPOSE 3000

# Iniciar aplicação com output buffer adequado
ENV NODE_OPTIONS=--max-old-space-size=256
CMD ["node", "server.js"]
```

## 🧱 docker-compose.yml

```yaml
version: '3.9'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      target: ${NODE_ENV:-development}
    container_name: nextjs-frontend
    restart: unless-stopped
    environment:
      - NODE_ENV=${NODE_ENV:-development}
      - NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL:-http://localhost:3000/api}
    ports:
      - '${FRONTEND_PORT:-3000}:3000'
    volumes:
      - ./frontend:/app
      - /app/node_modules
      - /app/.next
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```

## 🔐 .dockerignore

```
node_modules
.next
out
.git
.github
.vscode
*.log
.env*
.DS_Store
coverage
```

## 🔀 Multi-Stage para Diferentes Ambientes

### Desenvolvimento

```Dockerfile
FROM node:18-alpine AS development

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

CMD ["npm", "run", "dev"]
```

### Produção

```Dockerfile
# Usar as etapas do Dockerfile acima, com a tag runner
```

## 🛠️ Comandos úteis

```bash
# Iniciar ambiente de desenvolvimento
docker-compose up -d frontend

# Construir imagem de produção
docker build -t my-frontend:latest --target runner .

# Executar testes dentro do container
docker-compose run --rm frontend npm run test

# Verificar logs
docker-compose logs -f frontend

# Entrar no container em execução
docker-compose exec frontend sh
```

## ✅ Boas práticas

1. **Otimização de Imagem**

   - Multi-stage builds para reduzir tamanho final
   - Usar versões Alpine quando possível
   - Limpar caches de npm em um único comando RUN

2. **Segurança**

   - Executar como usuário não-root
   - Não incluir secrets no build
   - Verificar vulnerabilidades com `npm audit` durante CI/CD

3. **Eficiência em Desenvolvimento**

   - Montar volumes para código fonte em desenvolvimento
   - Usar hot-reload eficiente
   - Compartilhar cache entre builds

4. **Caching Inteligente**
   - Instalar dependências antes de copiar código-fonte
   - Separar layers para maximizar cache em builds
