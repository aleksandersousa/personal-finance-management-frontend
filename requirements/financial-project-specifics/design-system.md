# 🎨 Design System & Style Guide - Personal Financial Management System

## 📋 Introdução

Este documento define as diretrizes visuais para o **Sistema de Gerenciamento Financeiro Pessoal**. O objetivo é criar uma experiência visual consistente, intuitiva e acessível que transmita confiança e profissionalismo no contexto financeiro.

### Princípios de Design

1. **Clareza Financeira**: Informações monetárias sempre destacadas e legíveis
2. **Confiança e Segurança**: Visual profissional que transmite segurança dos dados
3. **Simplicidade**: Interface limpa que não distrai do foco financeiro
4. **Acessibilidade**: Inclusivo para todos os usuários
5. **Responsividade**: Funcional em todos os dispositivos

### Contexto de Uso

- **Usuários**: Pessoas físicas controlando finanças pessoais
- **Dispositivos**: Smartphones (70%), desktops (25%), tablets (5%)
- **Momentos de uso**: Registro rápido mobile + análise detalhada desktop
- **Frequência**: Uso diário (entradas) + mensal (análises)

## 🎭 Brand

### Logo

- **Principal**: Versão colorida para uso em fundos claros
- **Alternativa**: Versão monocromática para fundos escuros
- **Favicon**: Versão simplificada para uso em ícones pequenos
- **Espaçamento**: Manter área de respiro de 1x a altura do logotipo em todos os lados

## 🎨 Cores

### Paleta Principal

| Nome           | Hex       | Tailwind     | Uso                                            |
| -------------- | --------- | ------------ | ---------------------------------------------- |
| **Primária**   | `#624CF5` | `indigo-600` | Ações principais, links, elementos de destaque |
| **Secundária** | `#0A84FF` | `blue-500`   | Elementos secundários, ações alternativas      |
| **Terciária**  | `#32D583` | `green-500`  | Receitas, sucesso, crescimento positivo        |
| **Alerta**     | `#FF9500` | `amber-500`  | Avisos, notificações, atenção                  |
| **Erro**       | `#FF2D55` | `red-500`    | Erros, despesas, crescimento negativo          |

### Tons de Cinza

| Nome          | Hex       | Tailwind   | Uso                                         |
| ------------- | --------- | ---------- | ------------------------------------------- |
| **Branco**    | `#FFFFFF` | `white`    | Fundo principal, texto em áreas escuras     |
| **Cinza 50**  | `#F7F9FC` | `gray-50`  | Fundo secundário, hover em elementos claros |
| **Cinza 100** | `#EEF1F9` | `gray-100` | Fundo de cards, bordas sutis                |
| **Cinza 300** | `#D3D8E2` | `gray-300` | Bordas, separadores                         |
| **Cinza 500** | `#6B7280` | `gray-500` | Texto secundário, placeholders              |
| **Cinza 700** | `#384766` | `gray-700` | Texto primário                              |
| **Cinza 900** | `#111827` | `gray-900` | Títulos, texto de ênfase                    |

### Cores Adicionais

| Nome             | Hex       | Tailwind     | Uso                                |
| ---------------- | --------- | ------------ | ---------------------------------- |
| **Purple Light** | `#EDE9FE` | `purple-100` | Backgrounds, estados de hover      |
| **Blue Light**   | `#EFF6FF` | `blue-50`    | Backgrounds alternativos           |
| **Green Light**  | `#DCFCE7` | `green-100`  | Backgrounds para valores positivos |
| **Red Light**    | `#FFE2E5` | `red-100`    | Backgrounds para valores negativos |
| **Dark Purple**  | `#4318FF` | `purple-700` | Elementos de maior destaque        |

### Estados

| Estado             | Variação de Cor                 | Uso                                       |
| ------------------ | ------------------------------- | ----------------------------------------- |
| **Default**        | Cor base                        | Estado normal dos elementos               |
| **Hover**          | Cor base -10% luminosidade      | Quando o cursor está sobre o elemento     |
| **Active/Pressed** | Cor base -20% luminosidade      | Quando o elemento está sendo clicado      |
| **Focus**          | Cor base + ring-2 ring-offset-2 | Quando o elemento recebe foco via teclado |
| **Disabled**       | Cor base + opacidade 40%        | Elementos desabilitados                   |

## 🔤 Tipografia

### Família de Fontes

- **Principal**: Plus Jakarta Sans (sans-serif)
- **Alternativa**: System UI stack (`system-ui, -apple-system, sans-serif`)
- **Monospace**: JetBrains Mono (para valores numéricos e código)

### Escala Tipográfica

| Nome        | Tamanho       | Peso | Linha | Uso                                      |
| ----------- | ------------- | ---- | ----- | ---------------------------------------- |
| **Display** | 48px/3rem     | 700  | 1.1   | Páginas de marketing, valores principais |
| **H1**      | 32px/2rem     | 700  | 1.2   | Títulos principais                       |
| **H2**      | 24px/1.5rem   | 700  | 1.3   | Subtítulos, cabeçalhos de seção          |
| **H3**      | 20px/1.25rem  | 600  | 1.4   | Cabeçalhos de card, diálogos             |
| **Body-lg** | 18px/1.125rem | 400  | 1.5   | Texto de destaque                        |
| **Body**    | 16px/1rem     | 400  | 1.5   | Texto principal do corpo                 |
| **Body-sm** | 14px/0.875rem | 400  | 1.5   | Texto secundário, descrições             |
| **Caption** | 12px/0.75rem  | 400  | 1.4   | Legendas, metadados                      |

### Pesos da Fonte

- **Regular (400)**: Texto principal
- **Medium (500)**: Ênfase leve, subtítulos
- **Semibold (600)**: Títulos de seção, labels importantes
- **Bold (700)**: Títulos principais, elementos de destaque

## 📏 Espaçamento

### Sistema de Grid

- **Base**: 4px (0.25rem)
- **Colunas**: 12 colunas com gutters de 24px
- **Breakpoints**:
  - **sm**: 640px
  - **md**: 768px
  - **lg**: 1024px
  - **xl**: 1280px
  - **2xl**: 1536px

### Escala de Espaçamento

| Nome    | Valor        | Tailwind | Uso                                          |
| ------- | ------------ | -------- | -------------------------------------------- |
| **2xs** | 4px/0.25rem  | `p-1`    | Espaçamento mínimo                           |
| **xs**  | 8px/0.5rem   | `p-2`    | Espaçamento entre itens relacionados         |
| **sm**  | 12px/0.75rem | `p-3`    | Padding interno em elementos compactos       |
| **md**  | 16px/1rem    | `p-4`    | Espaçamento padrão                           |
| **lg**  | 24px/1.5rem  | `p-6`    | Espaçamento entre seções relacionadas        |
| **xl**  | 32px/2rem    | `p-8`    | Espaçamento entre blocos principais          |
| **2xl** | 48px/3rem    | `p-12`   | Espaçamento de seção                         |
| **3xl** | 64px/4rem    | `p-16`   | Espaçamento vertical entre seções principais |

## 🧩 Componentes

### Botões

**Variantes:**

- **Primary**: Fundo `indigo-600`, texto branco
- **Secondary**: Fundo `gray-100`, borda `gray-300`, texto `gray-700`
- **Tertiary**: Sem fundo, texto `indigo-600`
- **Danger**: Fundo `red-500`, texto branco
- **Success**: Fundo `green-500`, texto branco

**Tamanhos:**

- **sm**: Padding 8px 12px, texto 14px
- **md**: Padding 10px 16px, texto 16px
- **lg**: Padding 12px 20px, texto 16px

**Estados:**

- **Hover**: Escurecer 10%
- **Focus**: Ring-2 ring-offset-2 da cor do botão
- **Disabled**: Opacidade 40%

```html
<!-- Exemplos -->
<button
  class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg"
>
  Botão Primário
</button>

<button
  class="bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg"
>
  Botão Secundário
</button>
```

### Campos de Formulário

**Variantes:**

- **Default**: Borda `gray-300`, fundo branco
- **Focus**: Borda `indigo-600`, ring-2 ring-indigo-100
- **Error**: Borda `red-500`, texto de erro em `red-500`
- **Disabled**: Fundo `gray-100`, opacidade reduzida

**Componentes:**

- **Label**: Texto `gray-700`, font-medium, margin-bottom 6px
- **Input/Select**: Height 40px, padding 10px 14px, rounded-lg
- **Helper Text**: Texto `gray-500`, font-size 14px, margin-top 6px
- **Error Text**: Texto `red-500`, font-size 14px, margin-top 6px

```html
<!-- Exemplo -->
<div class="mb-4">
  <label for="amount" class="block text-gray-700 font-medium mb-1.5"
    >Valor</label
  >
  <div class="relative">
    <span class="absolute left-3 top-2.5 text-gray-500">R$</span>
    <input
      type="text"
      id="amount"
      class="pl-8 w-full h-10 px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
      placeholder="0,00"
    />
  </div>
  <p class="mt-1.5 text-sm text-gray-500">
    Utilize ponto ou vírgula para decimais
  </p>
</div>
```

### Cards

**Variantes:**

- **Default**: Fundo branco, borda `gray-100`, sombra sutil
- **Highlighted**: Fundo branco, borda `indigo-100`, sombra média
- **Interactive**: Como Default + hover state
- **Dark**: Fundo `gray-900` ou gradiente escuro, texto claro (como na primeira imagem de exemplo)

**Propriedades:**

- **Padding**: 24px
- **Border-radius**: 16px
- **Shadow**: `0 4px 12px rgba(0, 0, 0, 0.05)`

```html
<!-- Exemplo -->
<div class="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
  <h3 class="text-gray-900 font-semibold text-lg mb-4">Resumo do Mês</h3>
  <div class="space-y-3">
    <div class="flex justify-between">
      <span class="text-gray-500">Receitas</span>
      <span class="text-green-500 font-medium">R$ 5.240,00</span>
    </div>
    <div class="flex justify-between">
      <span class="text-gray-500">Despesas</span>
      <span class="text-red-500 font-medium">R$ 3.175,20</span>
    </div>
    <div class="pt-2 border-t border-gray-100">
      <div class="flex justify-between">
        <span class="font-medium text-gray-700">Saldo</span>
        <span class="font-semibold text-gray-900">R$ 2.064,80</span>
      </div>
    </div>
  </div>
</div>
```

### Tabelas

**Componentes:**

- **Header**: Fundo `gray-50`, texto `gray-700`, font-medium
- **Rows**: Fundo branco, hover `gray-50`
- **Borders**: `gray-200` para separar linhas
- **Pagination**: Botões secundários, contador de páginas

```html
<!-- Exemplo -->
<div class="overflow-x-auto rounded-lg border border-gray-200">
  <table class="min-w-full divide-y divide-gray-200">
    <thead class="bg-gray-50">
      <tr>
        <th
          class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
        >
          Descrição
        </th>
        <th
          class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
        >
          Data
        </th>
        <th
          class="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider"
        >
          Valor
        </th>
      </tr>
    </thead>
    <tbody class="bg-white divide-y divide-gray-200">
      <tr class="hover:bg-gray-50">
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
          Salário Mensal
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          15/07/2023
        </td>
        <td
          class="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-green-500"
        >
          R$ 4.500,00
        </td>
      </tr>
      <tr class="hover:bg-gray-50">
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
          Aluguel
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          10/07/2023
        </td>
        <td
          class="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-red-500"
        >
          R$ 1.800,00
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

### Badges/Tags

**Variantes:**

- **Default**: Fundo `gray-100`, texto `gray-700`
- **Blue**: Fundo `blue-100`, texto `blue-700`
- **Green**: Fundo `green-100`, texto `green-700`
- **Amber**: Fundo `amber-100`, texto `amber-700`
- **Red**: Fundo `red-100`, texto `red-700`
- **Purple**: Fundo `purple-100`, texto `purple-700`

**Propriedades:**

- **Padding**: 2px 8px
- **Font-size**: 12px
- **Border-radius**: 16px

```html
<!-- Exemplo -->
<span
  class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700"
>
  Receita Fixa
</span>

<span
  class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700"
>
  Despesa Variável
</span>
```

## 🖼️ Iconografia

### Sistema de Ícones

- **Biblioteca**: Phosphor Icons
- **Estilo**: Outlined (24x24px)
- **Espessura da linha**: 1.5px
- **Cores**: Herdar a cor do texto do elemento pai

### Ícones Comuns

- **Receita**: ArrowUp
- **Despesa**: ArrowDown
- **Adicionar**: Plus
- **Editar**: Pencil
- **Excluir**: Trash
- **Filtrar**: Filter
- **Categorias**: Tag
- **Usuário**: User
- **Configurações**: Gear
- **Notificações**: Bell
- **Logout**: SignOut

## 🔄 Animações

- **Duração**: 150-300ms para micro-interações
- **Timing**: ease-in-out para transições suaves
- **Hover**: Sutis (scale, opacity, color)
- **Loading**: Spinners ou skeleton para estados de carregamento
- **Page transitions**: Fade para transições entre páginas

## 🌙 Modo Escuro (Dark Mode)

### Cores em Modo Escuro

| Claro        | Escuro          |
| ------------ | --------------- |
| `white`      | `gray-900`      |
| `gray-50`    | `gray-800`      |
| `gray-100`   | `gray-700`      |
| `gray-700`   | `gray-300`      |
| `gray-900`   | `gray-50`       |
| `indigo-600` | `indigo-400`    |
| `purple-100` | `purple-900/40` |

```html
<!-- Exemplo com suporte a dark mode -->
<div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-50">
  <h2 class="text-gray-700 dark:text-gray-300">Título da Seção</h2>
</div>
```

## 📱 Responsividade

### Princípios

- **Mobile-first**: Design iniciando em telas pequenas
- **Breakpoints-chave**: 640px, 768px, 1024px, 1280px
- **Elementos flexíveis**: Usar % e rem em vez de pixels fixos
- **Grid adaptável**: 1 coluna (mobile), 2 colunas (tablet), 3+ colunas (desktop)

## ♿ Acessibilidade

### Diretrizes WCAG

- **Conformidade**: WCAG 2.1 AA
- **Contraste**: Mínimo 4.5:1 para texto normal, 3:1 para texto grande
- **Foco visível**: Evidenciar o foco do teclado em todos elementos interativos
- **Texto alternativo**: Para todas as imagens significativas
- **Semântica**: Usar elementos HTML semânticos (button, nav, etc.)
- **Aria**: Usar atributos aria quando necessário

### Teclado

- **Focáveis**: Todos elementos interativos devem ser focáveis via teclado
- **Ordem de tabulação**: Lógica e previsível
- **Atalhos**: Implementar atalhos de teclado para ações comuns

## 🖥️ Exemplos de Interface (Opcional)

### Dashboard Principal

![Dashboard de Finanças](https://cdn.dribbble.com/userupload/15288619/file/original-025d1ae894c8952a0822a244a6209ab1.jpg?resize=752x&vertical=center)

![Dashboard de Finanças 2](https://cdn.dribbble.com/userupload/12226562/file/original-cdf6affe9a6cf0955f79f9abbc9e2c2c.png?resize=752x&vertical=center)
