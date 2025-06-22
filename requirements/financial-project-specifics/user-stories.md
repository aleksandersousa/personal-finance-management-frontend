# 👤 User Stories & Tasks - Personal Financial Management System

## 📋 Contexto do Projeto

O **Sistema de Gerenciamento Financeiro Pessoal** permite aos usuários:

- **Controlar receitas e despesas** com categorização
- **Visualizar resumos financeiros** mensais e anuais
- **Projetar fluxo de caixa** baseado em lançamentos fixos
- **Manter dados seguros** com isolamento total por usuário
- **Acessar via web** com interface responsiva e acessível

### Arquitetura do Sistema

- **Backend**: API NestJS + PostgreSQL + JWT auth
- **Frontend**: Next.js + TailwindCSS + Clean Architecture
- **Comunicação**: REST API com documentação Swagger
- **Deploy**: Frontend (Vercel/Netlify) + API (Fly.io/Railway)

## 🎯 Personas e Cenários

### Persona Principal: João Silva

- **Idade**: 28 anos, desenvolvedor
- **Objetivo**: Controlar gastos mensais e economizar para casa própria
- **Necessidades**: Interface simples, categorização, projeções futuras
- **Dispositivos**: Notebook (trabalho) + smartphone (dia a dia)

### Cenários de Uso

1. **Manhã**: Registra café da manhã no smartphone
2. **Trabalho**: Visualiza resumo mensal no notebook
3. **Fim do mês**: Analisa gastos e planeja próximo mês
4. **Planejamento**: Projeta economia para objetivos futuros

## 📱 Histórias de Usuário

### História 1: Adicionar entrada financeira

**Como** usuário  
**Quero** adicionar uma nova receita ou despesa  
**Para** acompanhar meu fluxo financeiro

#### Tarefas:

- Criar interface `AddEntry` em `domain/usecases`
- Implementar `RemoteAddEntry` em `data/usecases`
- Criar factory `makeRemoteAddEntry` em `main/factories/usecases`
- Criar componente `EntryForm` que recebe a função de submissão via props
- Criar componente de página `AddEntryPage` que recebe o caso de uso via props
- Criar factory `makeAddEntryPage` em `main/factories/pages`
- Implementar página Next.js que utiliza a factory da página
- Adicionar feedback de sucesso/erro após submissão
- Implementar testes unitários para cada camada
- Implementar teste E2E do fluxo completo

### História 2: Visualizar entradas por mês

**Como** usuário  
**Quero** ver todas as minhas entradas de um determinado mês  
**Para** entender para onde está indo meu dinheiro

#### Tarefas:

- Criar interface `LoadEntriesByMonth` em `domain/usecases`
- Implementar `RemoteLoadEntriesByMonth` em `data/usecases`
- Criar factory `makeRemoteLoadEntriesByMonth` em `main/factories/usecases`
- Criar componentes de lista e item de entrada que recebem dados via props
- Criar componente de página `EntriesListPage` que recebe o caso de uso via props
- Criar factory `makeEntriesListPage` em `main/factories/pages`
- Implementar página Next.js que utiliza a factory e o getServerSideProps para dados iniciais
- Criar filtros e ordenação como componentes independentes
- Implementar paginação para grandes volumes de dados
- Adicionar skeleton loader para melhorar UX durante carregamento
- Implementar testes para cada componente e integração

### História 3: Editar uma entrada

**Como** usuário  
**Quero** editar detalhes de uma entrada existente  
**Para** corrigir erros ou atualizar informações

#### Tarefas:

- Criar interface `UpdateEntry` em `domain/usecases`
- Implementar `RemoteUpdateEntry` em `data/usecases`
- Criar factory `makeRemoteUpdateEntry` em `main/factories/usecases`
- Criar componente de página `EditEntryPage` que recebe o caso de uso via props
- Criar factory `makeEditEntryPage` em `main/factories/pages`
- Implementar página Next.js com getServerSideProps para carregar dados da entrada
- Reutilizar componente de formulário com estado pré-preenchido
- Adicionar validação específica para edição
- Implementar modal de confirmação para mudanças em entradas fixas
- Adicionar testes para validar fluxo de edição

### História 4: Excluir uma entrada

**Como** usuário  
**Quero** remover uma entrada que não é mais relevante  
**Para** manter meus registros financeiros precisos

#### Tarefas:

- Criar interface `DeleteEntry` em `domain/usecases`
- Implementar `RemoteDeleteEntry` em `data/usecases`
- Criar factory `makeRemoteDeleteEntry` em `main/factories/usecases`
- Criar componente modal de confirmação que recebe a função de exclusão via props
- Adicionar o componente de exclusão na página de lista de entradas
- Implementar factory `makeDeleteEntryModal` em `main/factories/components`
- Adicionar opção para entradas fixas: excluir uma ou todas ocorrências
- Implementar feedback visual após exclusão
- Adicionar testes para fluxo de exclusão

### História 5: Visualizar resumo financeiro

**Como** usuário  
**Quero** ver um resumo dos meus gastos e receitas  
**Para** entender minha situação financeira rapidamente

#### Tarefas:

- Criar interface `LoadMonthlySummary` em `domain/usecases`
- Implementar `RemoteLoadMonthlySummary` em `data/usecases`
- Criar factory `makeRemoteLoadMonthlySummary` em `main/factories/usecases`
- Criar componentes de visualização: cartões, gráficos que recebem dados via props
- Criar componente de página `DashboardPage` que recebe os casos de uso via props
- Criar factory `makeDashboardPage` em `main/factories/pages`
- Implementar página Next.js com getServerSideProps para dados iniciais
- Implementar comparativo com períodos anteriores
- Adicionar animações para tornar os números mais compreensíveis
- Implementar testes para cálculos e exibição de dados

### História 6: Previsão de fluxo de caixa

**Como** usuário  
**Quero** visualizar uma previsão de saldo futuro  
**Para** planejar minhas finanças com antecedência

#### Tarefas:

- Criar interface `LoadCashFlowForecast` em `domain/usecases`
- Implementar `RemoteLoadCashFlowForecast` em `data/usecases`
- Criar factory `makeRemoteLoadCashFlowForecast` em `main/factories/usecases`
- Criar componente de gráfico temporal que recebe dados via props
- Criar componente de página `ForecastPage` que recebe o caso de uso via props
- Criar factory `makeForecastPage` em `main/factories/pages`
- Implementar página Next.js com getServerSideProps para dados iniciais
- Implementar tooltips detalhados para cada mês
- Adicionar opções de período de previsão (3, 6, 12 meses)
- Implementar testes para algoritmos de previsão

## 🔌 Integração com API

### Endpoints Principais Utilizados

**Autenticação:**

- `POST /auth/register` - Registro de usuário
- `POST /auth/login` - Login com email/senha
- `POST /auth/refresh` - Renovação de tokens

**Entradas Financeiras:**

- `GET /entries?month=YYYY-MM` - Listar por mês
- `POST /entries` - Criar nova entrada
- `PUT /entries/{id}` - Atualizar entrada
- `DELETE /entries/{id}` - Excluir entrada

**Categorias:**

- `GET /categories` - Listar categorias do usuário
- `POST /categories` - Criar categoria
- `PUT /categories/{id}` - Atualizar categoria

**Resumos e Análises:**

- `GET /summary/monthly?month=YYYY-MM` - Resumo mensal
- `GET /forecast/cash-flow?months=6` - Projeção fluxo de caixa

### Padrões de Implementação

**Conversão de Valores:**

```typescript
// Frontend → API (reais para centavos)
const amountInCents = Math.round(amountInReais * 100);

// API → Frontend (centavos para reais)
const amountInReais = amountInCents / 100;
```

**Tratamento de Datas:**

```typescript
// Frontend → API
const dateISO = date.toISOString().split("T")[0]; // YYYY-MM-DD

// API → Frontend
const dateObject = new Date(dateISO);
```

**Headers de Autenticação:**

```typescript
const headers = {
  Authorization: `Bearer ${accessToken}`,
  "Content-Type": "application/json",
};
```

### Tratamento de Erros

**Códigos HTTP Comuns:**

- `400` - Dados inválidos (validação frontend)
- `401` - Token expirado (renovar automaticamente)
- `403` - Não autorizado (redirecionar login)
- `404` - Recurso não encontrado (feedback usuário)
- `422` - Erro de validação (exibir detalhes)

**Estratégia de Retry:**

- Falhas de rede: 3 tentativas com backoff
- Token expirado: 1 tentativa de refresh automático
- Erros 5xx: 2 tentativas com delay

## 🧪 Estratégia de Testes por História

### Testes Unitários

- **Componentes**: Props, eventos, renderização
- **Hooks**: Estados, efeitos, cleanup
- **Casos de uso**: Lógica de negócio, validações
- **Utilities**: Formatação, conversões, validações

### Testes de Integração

- **Formulários**: Submissão, validação, reset
- **HTTP Client**: Requests, responses, erros
- **Token Management**: Refresh, storage, cleanup
- **Fluxos de dados**: Component → UseCase → API

### Testes E2E

- **Fluxos críticos**: Login → Adicionar entrada → Visualizar resumo
- **Responsividade**: Mobile, tablet, desktop
- **Acessibilidade**: Navegação teclado, screen readers
- **Performance**: Carregamento, interatividade

## 🚀 Critérios de Aceitação Globais

### Funcionais

- ✅ Todas as operações CRUD funcionando
- ✅ Autenticação e autorização implementadas
- ✅ Isolamento de dados por usuário
- ✅ Validações client-side e server-side
- ✅ Feedback visual para todas as ações

### Técnicos

- ✅ Cobertura de testes > 80%
- ✅ Bundle size < 500KB (gzipped)
- ✅ Lighthouse score > 90
- ✅ Zero vulnerabilidades críticas
- ✅ WCAG AA compliance

### UX/UI

- ✅ Interface responsiva (mobile-first)
- ✅ Loading states em todas as operações
- ✅ Error boundaries para falhas
- ✅ Navegação intuitiva
- ✅ Feedback de sucesso/erro claro

---

## 🔗 Documentos Relacionados

- **[API Integration Guide](./api-integration.md)** - Detalhes técnicos da API
- **[Architecture Guidelines](./architecture-guidelines.md)** - Padrões arquiteturais
- **[MVP Requirements](./mvp-requirements.md)** - Funcionalidades essenciais
- **[Design System](./design-system.md)** - Componentes e estilos
- **[Testing Guidelines](./testing-guidelines.md)** - Estratégias de teste

**Cada história de usuário contribui para uma experiência financeira completa e segura! 💰**
