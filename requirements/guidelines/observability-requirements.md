# 🔍 Frontend Observability Guidelines

Este documento descreve as práticas recomendadas para implementar observabilidade no frontend, permitindo monitorar performance, erros e comportamento do usuário.

## 🎯 Objetivos da Observabilidade

- Detectar e diagnosticar problemas em produção
- Monitorar performance real de usuários (RUM)
- Rastrear comportamento do usuário para melhorar UX
- Coletar métricas de negócio específicas da aplicação

## 📦 Stack Recomendada

| Categoria      | Ferramenta                   | Descrição                        |
| -------------- | ---------------------------- | -------------------------------- |
| Analytics      | Google Analytics, Mixpanel   | Comportamento do usuário         |
| Error Tracking | Sentry                       | Rastreamento de erros JS         |
| Performance    | Web Vitals                   | Métricas de performance          |
| Logging        | Browser/Servidor Customizado | Logs específicos da aplicação    |
| Session Replay | LogRocket, Hotjar            | Reprodução de sessões de usuário |

## 📊 Web Vitals e Performance

### Implementação

```typescript
// utils/performance.ts
import { getCLS, getFID, getLCP } from "web-vitals";

export function reportWebVitals(onPerfEntry?: (metric: any) => void) {
  if (onPerfEntry && typeof onPerfEntry === "function") {
    getCLS(onPerfEntry); // Cumulative Layout Shift
    getFID(onPerfEntry); // First Input Delay
    getLCP(onPerfEntry); // Largest Contentful Paint
  }
}

// Integração com Google Analytics
export function sendToAnalytics(metric: any) {
  const { name, value } = metric;

  // Assumindo que gtag está disponível
  window.gtag("event", name, {
    value: Math.round(name === "CLS" ? value * 1000 : value),
    metric_id: name,
    metric_value: value,
    metric_delta: metric.delta,
  });
}
```

### Uso no Next.js

```typescript
// pages/_app.tsx
import { reportWebVitals, sendToAnalytics } from "@/utils/performance";

export function reportWebVitals(metric: any) {
  sendToAnalytics(metric);
}
```

## 🔴 Rastreamento de Erros com Sentry

### Configuração

```typescript
// utils/sentry.ts
import * as Sentry from "@sentry/nextjs";

export const initSentry = () => {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NODE_ENV,
    release: process.env.NEXT_PUBLIC_APP_VERSION,
    tracesSampleRate: 0.2,
    integrations: [
      new Sentry.BrowserTracing({
        tracePropagationTargets: [
          "localhost",
          /^https:\/\/api\.financeapp\.example\.com/,
        ],
      }),
    ],
    beforeSend(event) {
      // Não enviar PII (Personally Identifiable Information)
      if (event.user) {
        delete event.user.ip_address;
        // Mantém user.id para correlacionar erros, mas remove outros dados sensíveis
      }
      return event;
    },
  });
};

// Adicionar contexto do usuário após login
export const setUserContext = (userId: string) => {
  Sentry.setUser({ id: userId });
};

// Adicionar tags e contexto de negócio
export const setFinanceContext = (data: any) => {
  Sentry.setTag("subscription_plan", data.subscriptionPlan);
  Sentry.setTag("user_account_type", data.accountType);
  Sentry.setContext("finance_data", {
    totalEntries: data.totalEntries,
    hasPendingTransactions: data.pendingTransactions > 0,
  });
};
```

### Captura de Erros Personalizada

```typescript
// hooks/use-error-boundary.tsx
import { ErrorBoundary } from "@sentry/nextjs";
import { useState } from "react";

export function ErrorFallback({ error, componentStack, resetError }) {
  return (
    <div className="error-container">
      <h2>Algo deu errado</h2>
      <button onClick={resetError}>Tentar novamente</button>
    </div>
  );
}

export function withErrorBoundary<P>(Component: React.ComponentType<P>) {
  return function WithErrorBoundary(props: P) {
    return (
      <ErrorBoundary fallback={ErrorFallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}
```

## 📈 Analytics e Eventos de Negócio

### Hook Centralizado

```typescript
// hooks/use-analytics.ts
import { useCallback } from "react";

type EventName =
  | "entry_created"
  | "entry_updated"
  | "entry_deleted"
  | "report_generated"
  | "filter_applied"
  | "forecast_viewed";

type EventProperties = Record<string, any>;

export function useAnalytics() {
  const trackEvent = useCallback(
    (eventName: EventName, properties?: EventProperties) => {
      // Google Analytics
      if (typeof window.gtag === "function") {
        window.gtag("event", eventName, properties);
      }

      // Mixpanel (se disponível)
      if (typeof window.mixpanel?.track === "function") {
        window.mixpanel.track(eventName, properties);
      }

      // Log interno para debugging em dev
      if (process.env.NODE_ENV === "development") {
        console.log(`[Analytics] ${eventName}`, properties);
      }
    },
    []
  );

  // Eventos específicos de finanças
  const trackEntryCreated = useCallback(
    (entryType: "INCOME" | "EXPENSE", amount: number, isFixed: boolean) => {
      trackEvent("entry_created", {
        entry_type: entryType,
        amount,
        is_fixed: isFixed,
      });
    },
    [trackEvent]
  );

  const trackReportGenerated = useCallback(
    (reportType: string, dateRange: string) => {
      trackEvent("report_generated", {
        report_type: reportType,
        date_range: dateRange,
        generation_time: new Date().toISOString(),
      });
    },
    [trackEvent]
  );

  return {
    trackEvent,
    trackEntryCreated,
    trackReportGenerated,
  };
}
```

### Uso nos Componentes

```tsx
// components/EntryForm.tsx
import { useAnalytics } from "@/hooks/use-analytics";

export function EntryForm({ onSubmit }) {
  const { trackEntryCreated } = useAnalytics();

  const handleSubmit = async (data) => {
    try {
      await onSubmit(data);
      trackEntryCreated(data.type, data.amount, data.isFixed);
    } catch (error) {
      // Tratamento de erro
    }
  };

  // Resto do componente
}
```

## 🎥 Session Replay

### Configuração LogRocket

```typescript
// utils/session-replay.ts
import LogRocket from "logrocket";
import setupLogRocketReact from "logrocket-react";

export function initLogRocket() {
  // Inicializar apenas em produção
  if (process.env.NODE_ENV !== "production") return;

  LogRocket.init("app/finance-app");
  setupLogRocketReact(LogRocket);

  // Sanitização de dados
  LogRocket.getSessionURL((sessionURL) => {
    console.log("LogRocket session URL:", sessionURL);
  });
}

export function identifyUser(userId: string, email?: string, name?: string) {
  if (process.env.NODE_ENV !== "production") return;

  LogRocket.identify(userId, {
    name,
    email,
    // Informações específicas de finanças (não sensíveis)
    subscriptionTier: "free", // ou 'premium', etc.
  });
}
```

## 🔄 Middleware de Logging

### Implementação

```typescript
// middleware/logging.ts
import { NextRequest, NextResponse } from "next/server";

export function loggingMiddleware(req: NextRequest) {
  const start = performance.now();
  const url = req.nextUrl.pathname;

  // Resposta original
  const response = NextResponse.next();

  // Após processar
  const end = performance.now();
  const duration = end - start;

  // Adicionar header para debugging
  response.headers.set("Server-Timing", `app;dur=${duration}`);

  // Opcional: enviar para backend para aggregação
  if (duration > 1000) {
    // Se for lento
    fetch("/api/metrics/slow-page", {
      method: "POST",
      body: JSON.stringify({
        url,
        duration,
        userAgent: req.headers.get("user-agent"),
      }),
    }).catch(console.error); // Silenciar erro para não afetar usuário
  }

  return response;
}
```

## 📱 Monitoramento de Erros de Rede

### Hook Personalizado

```typescript
// hooks/use-network-monitor.ts
import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

export function useNetworkMonitor() {
  useEffect(() => {
    const handleOnline = () => {
      console.log("Aplicação está online");
    };

    const handleOffline = () => {
      console.log("Aplicação está offline");
      Sentry.captureMessage("User went offline", { level: "info" });
    };

    // Monitorar erros de fetch/axios
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);

        // Monitorar apenas chamadas para nossa API
        const url = typeof args[0] === "string" ? args[0] : args[0].url;
        if (url.includes("/api/") && !response.ok) {
          Sentry.captureMessage(`API Error: ${response.status} for ${url}`, {
            level: "error",
            extra: {
              status: response.status,
              statusText: response.statusText,
              url,
            },
          });
        }

        return response;
      } catch (error) {
        Sentry.captureException(error);
        throw error;
      }
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.fetch = originalFetch;
    };
  }, []);
}
```

## 📋 Dashboards Recomendados

### Dashboard de Experiência do Usuário

- Core Web Vitals por página
- Taxa de erro de JS por página e navegador
- Performance de rede (carregamento de assets)
- Taxa de rejeição por página

### Dashboard Específico de Finanças

- Tempo médio para criar uma entrada
- Uso de filtros e categorias
- Horários de pico de utilização
- Dispositivos mais comuns
- Conversão por tipo de usuário

## 🛠️ Integração com Sistema de Alertas

```typescript
// utils/alerts.ts
import { init as initAlerting, notify } from "@highlight-run/highlight";

export function setupAlerting() {
  initAlerting({
    projectId: process.env.NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID,
    serviceName: "finance-frontend",
    tracingOrigins: true,
  });

  // Configurar alertas para Core Web Vitals ruins
  window.addEventListener("load", () => {
    setTimeout(() => {
      const lcpElement = document.querySelector("[largest-contentful-paint]");
      if (lcpElement && performance.now() > 2500) {
        notify("Slow LCP detected", {
          level: "warning",
          fingerprint: "slow-lcp",
          context: {
            url: window.location.href,
            performance: performance.getEntriesByType("navigation")[0],
          },
        });
      }
    }, 5000);
  });
}
```

## 🔄 Implementação no Next.js

```typescript
// pages/_app.tsx
import { useEffect } from "react";
import { AppProps } from "next/app";
import { initSentry } from "@/utils/sentry";
import { initLogRocket } from "@/utils/session-replay";
import { reportWebVitals } from "@/utils/performance";
import { useNetworkMonitor } from "@/hooks/use-network-monitor";
import { setupAlerting } from "@/utils/alerts";

// Inicializar observabilidade
initSentry();
initLogRocket();

export function reportWebVitals(metric) {
  // Enviar métricas para analytics
}

function MyApp({ Component, pageProps }: AppProps) {
  // Monitorar rede
  useNetworkMonitor();

  useEffect(() => {
    // Configurar alertas
    setupAlerting();
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
```
