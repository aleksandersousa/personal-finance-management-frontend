# Estágio de build
FROM node:20-alpine AS builder

WORKDIR /app

# Instalação de dependências
COPY package*.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Build da aplicação
COPY . .
RUN yarn build

# Estágio de produção
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Usuário não-root para segurança
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar apenas arquivos necessários
COPY --from=builder /app/next.config.ts ./
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