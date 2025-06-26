# 🔒 Frontend Security Guidelines

Este documento detalha as práticas de segurança recomendadas para a implementação do frontend da aplicação de gerenciamento financeiro pessoal.

## 📋 Requisitos de Segurança

1. **Proteção de Dados Sensíveis**

   - Não armazenar informações financeiras sensíveis no cliente
   - Mascarar valores em telas públicas/compartilhadas
   - Implementar timeout para sessões inativas

2. **Comunicação Segura**

   - Utilizar HTTPS para todas as comunicações
   - Implementar cabeçalhos de segurança HTTP
   - Validar origens de requisições (CORS)

3. **Proteção contra Ataques Comuns**
   - Prevenir XSS (Cross-Site Scripting)
   - Mitigar CSRF (Cross-Site Request Forgery)
   - Evitar exposição de informações de debugging

## 🛡️ Implementação de Segurança

### Headers de Segurança

#### Configuração Next.js

```javascript
// next.config.js
const securityHeaders = [
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
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
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' https://analytics.google.com;
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https://cdn.example.com;
      font-src 'self' https://fonts.googleapis.com;
      connect-src 'self' https://api.financeapp.example.com;
    `
      .replace(/\s{2,}/g, ' ')
      .trim(),
  },
];

module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
  // Outras configurações...
};
```

### Proteção contra XSS

#### Sanitização de Dados

```typescript
// utils/sanitizers.ts
import DOMPurify from 'dompurify';

export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
  });
}

export function sanitizeUserInput(input: string): string {
  // Remover caracteres perigosos para prevenir XSS
  return input.replace(/[<>]/g, '');
}

// Para uso em campos de descrição que aceitam formatação básica
export function sanitizeDescription(description: string): string {
  return sanitizeHtml(description);
}

// Para uso em campos como valores que devem conter apenas números
export function sanitizeNumericInput(input: string): string {
  return input.replace(/[^0-9.,]/g, '');
}
```

#### Componentes Seguros

```tsx
// components/SafeDisplay.tsx
import { sanitizeHtml } from '@/utils/sanitizers';

interface SafeDisplayProps {
  html: string;
  className?: string;
}

export function SafeDisplay({ html, className }: SafeDisplayProps) {
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }}
    />
  );
}
```

### Proteção contra CSRF

#### Configuração do Cliente HTTP

```typescript
// infra/http/axios-http-client.ts
import axios, { AxiosInstance } from 'axios';

export class AxiosHttpClient {
  private readonly instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      withCredentials: true, // Permite envio de cookies para autenticação
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para adicionar token CSRF em requisições não-GET
    this.instance.interceptors.request.use(config => {
      const csrfToken = this.getCsrfToken();

      if (config.method !== 'get' && csrfToken) {
        config.headers['X-CSRF-Token'] = csrfToken;
      }

      return config;
    });
  }

  private getCsrfToken(): string | null {
    // Obtém o token CSRF de um cookie ou meta tag
    // O token deve ser enviado pelo servidor na resposta inicial
    const metaTag = document.querySelector('meta[name="csrf-token"]');
    return metaTag ? metaTag.getAttribute('content') : null;
  }

  async request<T = any>(params: {
    url: string;
    method: 'get' | 'post' | 'put' | 'delete';
    body?: any;
    headers?: Record<string, string>;
  }): Promise<T> {
    const response = await this.instance.request({
      url: params.url,
      method: params.method,
      data: params.body,
      headers: params.headers,
    });

    return response.data;
  }
}
```

### Proteção de Dados Sensíveis

#### Mascaramento de Informações Financeiras

```tsx
// components/SensitiveValue.tsx
import { useState } from 'react';
import { useUserPreferences } from '@/hooks/use-user-preferences';

interface SensitiveValueProps {
  value: number | string;
  defaultMasked?: boolean;
  className?: string;
}

export function SensitiveValue({
  value,
  defaultMasked = true,
  className,
}: SensitiveValueProps) {
  const { shouldMaskValues } = useUserPreferences();
  const [isVisible, setIsVisible] = useState(
    !defaultMasked || !shouldMaskValues
  );

  const formatValue = () => {
    if (isVisible) {
      return typeof value === 'number'
        ? value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
        : value;
    }
    return '••••••';
  };

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <span>{formatValue()}</span>
      <button
        type='button'
        onClick={() => setIsVisible(!isVisible)}
        className='ml-2 text-gray-500 hover:text-gray-700 focus:outline-none'
        aria-label={isVisible ? 'Ocultar valor' : 'Mostrar valor'}
      >
        {isVisible ? '👁️' : '👁️‍🗨️'}
      </button>
    </div>
  );
}
```

### Gerenciamento de Autenticação

#### Hook de Autenticação Segura

```typescript
// hooks/use-auth.ts
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { makeLoginApi, makeLogoutApi } from '@/main/factories/usecases';
import { setUserContext } from '@/utils/sentry'; // Para rastreamento de erros
import { identifyUser } from '@/utils/session-replay'; // Para session replay

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutos

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const loginApi = makeLoginApi();
  const logoutApi = makeLogoutApi();

  // Verificar usuário autenticado
  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      const storedUser = localStorage.getItem('user');

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        // Verificar se o token ainda é válido ou refreshar
        // Implementação depende da estratégia de autenticação
        setUser(parsedUser);

        // Configurar identificação para ferramentas de observabilidade
        setUserContext(parsedUser.id);
        identifyUser(parsedUser.id, parsedUser.email);
      }
    } catch (err) {
      console.error('Error checking auth', err);
      // Se falhar, limpar estado
      localStorage.removeItem('user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Login
  const login = useCallback(
    async (email: string, password: string) => {
      try {
        setLoading(true);
        setError(null);

        const response = await loginApi.login({ email, password });

        // Não armazenar a senha em localStorage!
        const userData = {
          id: response.id,
          name: response.name,
          email: response.email,
          token: response.token,
        };

        // Armazenar apenas dados não-sensíveis
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);

        // Configurar identificação para ferramentas de observabilidade
        setUserContext(userData.id);
        identifyUser(userData.id, userData.email, userData.name);

        return userData;
      } catch (err) {
        setError(err.message || 'Falha ao fazer login');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [loginApi]
  );

  // Logout
  const logout = useCallback(async () => {
    try {
      setLoading(true);

      // Chamar API de logout se necessário
      if (user) {
        await logoutApi.logout();
      }

      // Limpar localStorage e estado
      localStorage.removeItem('user');
      sessionStorage.clear(); // Limpar dados temporários

      // Resetar identificação de usuário em ferramentas
      setUserContext(null);

      setUser(null);
      router.push('/login');
    } catch (err) {
      console.error('Error during logout', err);
      // Mesmo com erro, remover dados locais
      localStorage.removeItem('user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [user, logoutApi, router]);

  // Monitorar inatividade
  useEffect(() => {
    if (!user) return;

    let inactivityTimer: NodeJS.Timeout;

    const resetTimer = () => {
      if (inactivityTimer) clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        logout();
      }, INACTIVITY_TIMEOUT);
    };

    // Eventos para detectar atividade do usuário
    const events = ['mousedown', 'keypress', 'touchstart', 'scroll'];

    // Iniciar timer
    resetTimer();

    // Adicionar listeners
    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    // Cleanup
    return () => {
      if (inactivityTimer) clearTimeout(inactivityTimer);
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [user, logout]);

  // Verificar autenticação no carregamento
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
  };
}
```

### Validação de Entrada

#### Schema de Validação Segura

```typescript
// validation/schemas/entry-schema.ts
import * as z from 'zod';
import { sanitizeNumericInput, sanitizeUserInput } from '@/utils/sanitizers';

// Valor máximo permitido para uma transação (para evitar erros ou fraudes)
const MAX_TRANSACTION_AMOUNT = 1000000;

export const entrySchema = z.object({
  description: z
    .string()
    .min(3, 'A descrição deve ter pelo menos 3 caracteres')
    .max(100, 'A descrição deve ter no máximo 100 caracteres')
    .transform(sanitizeUserInput),

  amount: z
    .string()
    .transform(sanitizeNumericInput)
    .transform(val => parseFloat(val.replace(',', '.')))
    .refine(val => !isNaN(val), {
      message: 'Valor inválido',
    })
    .refine(val => val > 0, {
      message: 'O valor deve ser maior que zero',
    })
    .refine(val => val <= MAX_TRANSACTION_AMOUNT, {
      message: `O valor máximo permitido é ${MAX_TRANSACTION_AMOUNT.toLocaleString(
        'pt-BR',
        { style: 'currency', currency: 'BRL' }
      )}`,
    }),

  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida (formato: AAAA-MM-DD)')
    .transform(val => new Date(val))
    .refine(val => !isNaN(val.getTime()), {
      message: 'Data inválida',
    }),

  type: z.enum(['INCOME', 'EXPENSE'], {
    errorMap: () => ({ message: 'Tipo inválido' }),
  }),

  category_id: z
    .string()
    .uuid('ID de categoria inválido')
    .or(z.literal(''))
    .transform(val => val || undefined),

  is_fixed: z.boolean().default(false),
});

export type EntryFormData = z.infer<typeof entrySchema>;
```

### Proteção para Produção

#### Remoção de Informações de Debugging

```typescript
// utils/error-handler.ts
import * as Sentry from '@sentry/nextjs';

interface ErrorResponse {
  message: string;
  details?: string;
}

export function handleError(error: any): ErrorResponse {
  // Capturar erro para monitoramento
  Sentry.captureException(error);

  // Em produção, retornar mensagens genéricas
  if (process.env.NODE_ENV === 'production') {
    return {
      message: 'Ocorreu um erro. Por favor, tente novamente.',
    };
  }

  // Em desenvolvimento, mais detalhes
  return {
    message: error.message || 'Erro desconhecido',
    details: error.stack,
  };
}
```

## 🔍 Auditorias e Verificações

### Verificação de Dependências

```bash
# Verificar vulnerabilidades nas dependências
npm audit

# Verificar licenças de dependências (prevenir licenças proibidas)
npx license-checker --summary

# Verificar typosquatting e pacotes maliciosos
npx is-my-package-evil
```

### Análise Estática de Código

```bash
# ESLint com regras de segurança
npx eslint --ext .ts,.tsx src/ --config .eslintrc.security.js

# Verificação de segurança com SonarQube
npx sonarqube-scanner
```

### Testes de Segurança

```typescript
// tests/security/xss-protection.spec.tsx
import { render, screen } from "@testing-library/react";
import { SafeDisplay } from "@/components/SafeDisplay";

describe("XSS Protection", () => {
  it("should sanitize HTML and remove script tags", () => {
    const maliciousHtml = '<script>alert("XSS")</script><p>Conteúdo seguro</p>';

    render(<SafeDisplay html={maliciousHtml} />);

    expect(screen.queryByText('alert("XSS")')).not.toBeInTheDocument();
    expect(screen.getByText("Conteúdo seguro")).toBeInTheDocument();
  });

  it("should allow only safe tags and attributes", () => {
    const html =
      '<p>Texto <strong>importante</strong> com <a href="https://example.com" onclick="alert(1)">link</a></p>';

    render(<SafeDisplay html={html} />);

    const link = screen.getByText("link");
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "https://example.com");
    expect(link).not.toHaveAttribute("onclick");
  });
});
```

## 📝 Checklist de Segurança

### Antes do Deploy

- [ ] Remover chaves de API e credenciais hardcoded
- [ ] Verificar configuração de CORS
- [ ] Sanitizar todas as entradas de usuário
- [ ] Implementar proteção contra CSRF
- [ ] Configurar cabeçalhos de segurança HTTP
- [ ] Verificar vulnerabilidades em dependências
- [ ] Auditar código para pontos de injeção
- [ ] Testar mascaramento de dados sensíveis
- [ ] Validar timeout de inatividade
- [ ] Confirmar ausência de logs sensíveis em produção
