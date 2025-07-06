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
- **Frontend**: Next.js 15 + TailwindCSS + Clean Architecture
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

### História 0.1: Cadastro de usuário

**Como** visitante  
**Quero** criar uma conta no sistema  
**Para** começar a gerenciar minhas finanças pessoais

#### Tarefas:

- Criar interface `AddAccount` em `domain/usecases`
- Implementar `RemoteAddAccount` em `data/usecases`
- Criar factory `makeRemoteAddAccount` em `main/factories/usecases`
- Criar componente `RegisterForm` que recebe a função de submissão via props
- Criar componente de página `RegisterPage` que recebe o caso de uso via props
- Criar factory `makeRegisterPage` em `main/factories/pages`
- Implementar página Next.js que utiliza a factory da página
- Adicionar validações client-side: email válido, senha forte, confirmação de senha
- Implementar feedback de sucesso/erro após submissão
- Adicionar redirecionamento automático para login após cadastro bem-sucedido
- Implementar testes unitários para cada camada
- Implementar teste E2E do fluxo completo de registro

#### Critérios de Aceitação:

- ✅ Campos obrigatórios: nome, email, senha, confirmação de senha
- ✅ Validação de email único no sistema
- ✅ Senha com mínimo 8 caracteres, incluindo maiúscula, minúscula e número
- ✅ Confirmação de senha deve coincidir com a senha
- ✅ Feedback claro em caso de erro (email já existe, senha fraca, etc.)
- ✅ Loading state durante submissão
- ✅ Redirecionamento para página de login após sucesso

### História 0.2: Login de usuário

**Como** usuário cadastrado  
**Quero** fazer login no sistema  
**Para** acessar meus dados financeiros

#### Tarefas:

- Criar interface `Authentication` em `domain/usecases`
- Implementar `RemoteAuthentication` em `data/usecases`
- Criar factory `makeRemoteAuthentication` em `main/factories/usecases`
- Criar componente `LoginForm` que recebe a função de submissão via props
- Criar componente de página `LoginPage` que recebe o caso de uso via props
- Criar factory `makeLoginPage` em `main/factories/pages`
- Implementar página Next.js que utiliza a factory da página
- Implementar gerenciamento de tokens JWT (access + refresh)
- Criar sistema de armazenamento seguro de tokens (localStorage/cookies)
- Adicionar redirecionamento baseado em autenticação
- Implementar "Lembrar-me" para sessões persistentes
- Adicionar link para página de cadastro
- Implementar testes unitários para cada camada
- Implementar teste E2E do fluxo completo de login

#### Critérios de Aceitação:

- ✅ Campos obrigatórios: email e senha
- ✅ Validação de credenciais via API
- ✅ Armazenamento seguro de tokens JWT
- ✅ Redirecionamento para dashboard após login bem-sucedido
- ✅ Feedback claro em caso de credenciais inválidas
- ✅ Loading state durante autenticação
- ✅ Opção "Lembrar-me" funcional
- ✅ Link para página de cadastro

### História 0.3: Logout de usuário

**Como** usuário logado  
**Quero** fazer logout do sistema  
**Para** proteger meus dados quando não estiver usando

#### Tarefas:

- Criar interface `Logout` em `domain/usecases`
- Implementar `RemoteLogout` em `data/usecases`
- Criar factory `makeRemoteLogout` em `main/factories/usecases`
- Criar componente `LogoutButton` que recebe a função de logout via props
- Adicionar componente de logout no header/navbar
- Implementar limpeza de tokens e dados do usuário
- Adicionar redirecionamento para página de login
- Implementar confirmação antes do logout (opcional)
- Implementar testes unitários para cada camada

#### Critérios de Aceitação:

- ✅ Botão de logout visível em todas as páginas autenticadas
- ✅ Limpeza completa de tokens e dados do localStorage
- ✅ Redirecionamento imediato para página de login
- ✅ Invalidação do token no servidor (se implementado)
- ✅ Feedback visual durante processo de logout

### História 0.4: Renovação automática de token

**Como** usuário logado  
**Quero** que minha sessão seja renovada automaticamente  
**Para** não perder dados durante o uso prolongado do sistema

#### Tarefas:

- Criar interface `RefreshToken` em `domain/usecases`
- Implementar `RemoteRefreshToken` em `data/usecases`
- Criar factory `makeRemoteRefreshToken` em `main/factories/usecases`
- Implementar interceptador HTTP para renovação automática
- Criar sistema de detecção de token expirado
- Implementar retry automático de requisições após renovação
- Adicionar fallback para logout em caso de falha na renovação
- Implementar testes para cenários de renovação

#### Critérios de Aceitação:

- ✅ Renovação automática antes da expiração do token
- ✅ Retry transparente de requisições falhadas por token expirado
- ✅ Logout automático se renovação falhar
- ✅ Não interromper fluxo do usuário durante renovação
- ✅ Logs apropriados para debug de problemas de autenticação

### História 1: Adicionar entrada financeira

**Como** usuário  
**Quero** adicionar uma nova receita ou despesa  
**Para** acompanhar meu fluxo financeiro

#### Tarefas:

- ✅ Criar interface `AddEntry` em `domain/usecases`
- ✅ Implementar `RemoteAddEntry` em `data/usecases`
- ✅ Criar factory `makeRemoteAddEntry` em `main/factories/usecases`
- ✅ Criar componente `EntryForm` que recebe a função de submissão via props
- ✅ Criar componente de página `AddEntryPage` que recebe o caso de uso via props
- ✅ Criar factory `makeAddEntryPage` em `main/factories/pages`
- ✅ Implementar página Next.js que utiliza a factory da página
- ✅ Adicionar feedback de sucesso/erro após submissão
- ✅ Implementar testes unitários para cada camada
- ✅ Implementar teste E2E do fluxo completo

#### Critérios de Aceitação:

- ✅ Campos obrigatórios: descrição, valor, tipo, categoria, data
- ✅ Validação client-side com Zod
- ✅ Conversão automática de reais para centavos
- ✅ Feedback visual durante submissão
- ✅ Redirecionamento após sucesso
- ✅ Tratamento de erros de validação
- ✅ Interface responsiva e acessível

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

#### Critérios de Aceitação:

- ✅ Listagem de entradas por mês
- ✅ Filtros por tipo (receita/despesa) e categoria
- ✅ Ordenação por data, valor, descrição
- ✅ Paginação para grandes volumes
- ✅ Loading states e skeleton
- ✅ Conversão de centavos para reais na exibição
- ✅ Interface responsiva

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

#### Critérios de Aceitação:

- ✅ Carregamento dos dados existentes no formulário
- ✅ Validação client-side com Zod
- ✅ Confirmação para entradas fixas
- ✅ Feedback de sucesso/erro
- ✅ Redirecionamento após edição
- ✅ Preservação de dados não alterados

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

#### Critérios de Aceitação:

- ✅ Modal de confirmação antes da exclusão
- ✅ Opção para entradas fixas (uma ou todas)
- ✅ Feedback visual após exclusão
- ✅ Atualização automática da lista
- ✅ Tratamento de erros de exclusão

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

#### Critérios de Aceitação:

- ✅ Resumo mensal com receitas, despesas e saldo
- ✅ Gráficos de distribuição por categoria
- ✅ Comparativo com mês anterior
- ✅ Conversão automática de centavos para reais
- ✅ Interface responsiva e acessível
- ✅ Loading states durante carregamento

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

#### Critérios de Aceitação:

- ✅ Previsão de fluxo de caixa por mês
- ✅ Opções de período (3, 6, 12 meses)
- ✅ Gráfico temporal interativo
- ✅ Tooltips com detalhes por mês
- ✅ Indicador de confiança da previsão
- ✅ Interface responsiva

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
const dateISO = date.toISOString().split('T')[0]; // YYYY-MM-DD

// API → Frontend
const dateObject = new Date(dateISO);
```

**Headers de Autenticação:**

```typescript
const headers = {
  Authorization: `Bearer ${accessToken}`,
  'Content-Type': 'application/json',
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

- ✅ Cobertura de testes > 90%
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

## 📊 Métricas de Sucesso

### Métricas Técnicas

- **Performance**: First Contentful Paint < 1.5s
- **Acessibilidade**: Lighthouse Accessibility Score > 95
- **SEO**: Lighthouse SEO Score > 90
- **Best Practices**: Lighthouse Best Practices Score > 90

### Métricas de Negócio

- **Engajamento**: Tempo médio de sessão > 5 minutos
- **Retenção**: Usuários ativos mensais > 70%
- **Conversão**: Taxa de cadastro > 15%
- **Satisfação**: NPS > 50

### Métricas de Qualidade

- **Cobertura de Testes**: > 90%
- **Bugs Críticos**: 0 em produção
- **Tempo de Deploy**: < 5 minutos
- **Disponibilidade**: > 99.9%

## 🔄 Processo de Desenvolvimento

### 1. Planejamento

- **Sprint Planning**: Estimativas baseadas em story points
- **Refinement**: Detalhamento de critérios de aceitação
- **Definition of Ready**: Checklist antes de iniciar desenvolvimento

### 2. Desenvolvimento

- **TDD**: Testes antes do código
- **Clean Architecture**: Separação clara de responsabilidades
- **Code Review**: Revisão obrigatória antes do merge

### 3. Testes

- **Unit Tests**: Cobertura mínima de 90%
- **Integration Tests**: Fluxos críticos
- **E2E Tests**: Cenários de usuário completos

### 4. Deploy

- **CI/CD**: Pipeline automatizado
- **Staging**: Ambiente de homologação
- **Production**: Deploy com rollback automático

## 📚 Documentação Relacionada

- **[API Integration Guide](./api-integration.md)** - Detalhes técnicos da API
- **[Development Workflow](./development-workflow.md)** - Padrões arquiteturais
- **[Frontend Setup Guide](./frontend-setup-guide.md)** - Configuração do ambiente
- **[Testing Guidelines](../testing-guidelines.md)** - Estratégias de teste

**Cada história de usuário contribui para uma experiência financeira completa e segura! 💰**
