# 🌍 Explorador de Países

Aplicação Angular para explorar dados de países do mundo inteiro, consumindo a API pública [REST Countries](https://restcountries.com). Desenvolvida como desafio técnico para a vaga de Desenvolvedor Frontend Júnior na Bclouder.

---

## ✨ Funcionalidades

### Obrigatórias
- **Listagem de países** com bandeira, nome, região e população
- **Busca em tempo real** por nome do país
- **Filtro por região** (África, Américas, Ásia, Europa, Oceania)
- **Página de detalhe** com capital, moedas, idiomas, fronteiras e mais
- **Estados de loading e erro** tratados de forma visível e amigável

### Diferenciais implementados
- **Navegação para países fronteiriços** diretamente da página de detalhe
- **Ordenação da listagem** por nome, população ou área
- **Design responsivo** adaptado para dispositivos móveis

---

## 🚀 Como rodar localmente

### Pré-requisitos

- [Node.js](https://nodejs.org/) v18 ou superior
- [npm](https://www.npmjs.com/) v9 ou superior
- [Angular CLI](https://angular.dev/tools/cli) v21

```bash
npm install -g @angular/cli
```

### Passos

```bash
# 1. Clone o repositório
git clone https://github.com/luchersou/explorador-de-paises.git

# 2. Entre na pasta do projeto
cd explorador-de-paises

# 3. Instale as dependências
npm install

# 4. Inicie o servidor de desenvolvimento
ng serve
```

Acesse **http://localhost:4200** no seu navegador. A aplicação recarrega automaticamente a cada alteração nos arquivos.

---

## 🏗️ Decisões técnicas

### Angular 21 com Standalone Components
Optei pelo modelo de **Standalone Components** (sem NgModules) por ser a abordagem moderna e recomendada do Angular. Isso reduz boilerplate, deixa as dependências de cada componente explícitas e torna o código mais fácil de navegar — especialmente importante num projeto com dados vindos de muitos endpoints.

### Signals para gerenciamento de estado
Utilizei a API de **Signals** do Angular para controlar o estado da aplicação (lista de países, filtros, ordenação, país selecionado). A escolha foi intencional: Signals são reativos por design, têm melhor performance que RxJS para estado de UI simples, e o código fica mais legível — sem `.subscribe()`, sem `async pipe` espalhados por todo lado.

RxJS ainda aparece onde faz sentido: no `HttpClient` para as chamadas HTTP e no `debounceTime` da busca em tempo real.

### Serviços dedicados
A lógica de acesso à API está isolada no `CountriesService`, que é o único ponto de contato com o REST Countries. Componentes não conhecem a URL da API — eles consomem métodos do serviço. Isso facilita trocar a fonte de dados no futuro sem tocar nos componentes.

### Roteamento com Angular Router
Rotas declaradas com **lazy loading** para a página de detalhe, garantindo que o bundle inicial seja menor. A URL do detalhe usa o `cca3` (código ISO de 3 letras) como parâmetro — ex: `/country/BRA` — o que torna os links compartilháveis e semanticamente corretos.

### Tailwind CSS
Escolhi o Tailwind pela velocidade no desenvolvimento e pela consistência que ele impõe naturalmente ao design. Com tantos cards e dados exibidos simultaneamente, as utility classes ajudam a manter hierarquia visual sem criar uma folha de estilos difícil de manter.

### Infinite Scroll com Intersection Observer
Para lidar com os 250+ países retornados pela API, implementei **infinite scroll** usando a [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) nativa do browser — sem biblioteca externa. Um elemento sentinela é posicionado no final da lista e, quando entra no viewport, o próximo lote de países é carregado. A escolha pela API nativa foi intencional: evita dependência extra, tem ótima performance e é suportada por todos os browsers modernos. Isso torna a experiência fluida mesmo em dispositivos mais modestos, sem renderizar todos os cards de uma vez.

### Prettier + EditorConfig
Configuração de formatação automática para garantir consistência no código independentemente do editor utilizado.

---

## 🗂️ Estrutura de pastas

```
src/
├── app/
│   ├── core/
│   │   ├── services/
│   │   │   └── countries.service.ts
│   │   └── models/
│   │       └── country.model.ts
│   │
│   ├── features/
│   │   ├── countries/
│   │   │   ├── pages/
│   │   │   │   ├── country-list/
│   │   │   │   │   ├── country-list.component.ts
│   │   │   │   │   └── country-list.component.html
│   │   │   │   └── country-detail/
│   │   │   │       ├── country-detail.component.ts
│   │   │   │       └── country-detail.component.html
│   │   │   ├── components/
│   │   │   │   ├── country-card/
│   │   │   │   │   ├── country-card.component.ts
│   │   │   │   │   └── country-card.component.html
│   │   │   │   └── country-filters/
│   │   │   │       ├── country-filters.component.ts
│   │   │   │       └── country-filters.component.html
│   │   │   ├── types/
│   │   │   │   ├── region-type.ts
│   │   │   │   └── sort-option.type.ts            
│   │   │   └── utils/
│   │   │       ├── filter-countries.ts
│   │   │       ├── region-badge.ts
│   │   │       └── sort-countries.ts
│   │   │
│   │   └── shared/
│   │       ├── error-message/
│   │       │   ├── error-message.component.ts
│   │       │   └── error-message.component.html
│   │       └── loading/
│   │           ├── loading.component.ts
│   │           └── loading.component.html
│   │
│   ├── app.routes.ts
│   ├── app.config.ts
│   └── app.ts
│
├── index.html
├── styles.css
└── main.ts
```

---

## 🔮 O que eu faria diferente com mais tempo

- **Testes unitários e de integração** — cobriria o `CountriesService` e os componentes principais utilizando Vitest e Angular Testing Library. A estrutura base de testes foi gerada pelo Angular CLI, mas a implementação dos casos de uso avançados ficou de fora devido ao prazo de entrega.
- **Cache das requisições** — a API de países é relativamente estável. Implementaria um cache simples com `localStorage` ou um interceptor HTTP para evitar requisições repetidas entre navegações.
- **Skeleton loading** no lugar do spinner — melhora a percepção de performance, pois o usuário vê a estrutura da tela antes dos dados chegarem.
- **Modo escuro** — a estrutura com Tailwind já facilita isso com a classe `dark:`, seria uma adição natural.

---

## 🛠️ Tecnologias utilizadas

| Tecnologia | Versão | Motivo |
|---|---|---|
| Angular | 21 | Framework principal |
| TypeScript | 5.x | Tipagem estática |
| Tailwind CSS | 4.x | Estilização utility-first |
| REST Countries API | v3.1 | Fonte de dados |
| Angular CLI | 21 | Scaffolding e build |
| Prettier | - | Formatação de código |

---

## 📡 API utilizada

[REST Countries v3.1](https://restcountries.com) — API pública, sem autenticação, com dados de 250+ países.

Endpoints utilizados:
- `GET /all` — lista todos os países
- `GET /name/{name}` — busca por nome
- `GET /alpha/{code}` — busca pelo código do país (para o detalhe e fronteiras)

---

*Desenvolvido por Lucas · Desafio Técnico Bclouder · 2026*
