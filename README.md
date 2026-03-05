# FC DDD Patterns

Este projeto implementa padrões de Domain-Driven Design (DDD) em TypeScript, com exemplos práticos de arquitetura em diferentes domínios como Customer, Product e Checkout.

É referente ao Desafio de Repositórios do módulo "DDD: Modelagem Tática e Patterns" do curso "Full Cycle 3.0" da FullCycle.

## Requisitos

- Node.js (versão 14 ou superior)
- npm (gerenciador de pacotes do Node.js)

## Instalação

### 1. Clonar o repositório
```bash
git clone <URL_DO_REPOSITORIO>
cd fc-ddd-patterns
```

### 2. Instalar dependências
Execute o seguinte comando para instalar todas as dependências do projeto:

```bash
npm install
```

## Rodando os testes

Para executar todos os testes da aplicação:

```bash
npm test
```

Este comando irá:
- Validar o TypeScript com `tsc --noEmit`
- Executar todos os testes com Jest

### Executar testes de um arquivo específico

Para rodar testes de um arquivo específico, use:

```bash
npm test -- <nome_do_arquivo>
```

Exemplo:
```bash
npm test -- customer.spec.ts
```

## Estrutura do Projeto

```
src/
├── domain/           # Camada de domínio (entidades, value objects, serviços)
│   ├── @shared/      # Código compartilhado entre domínios
│   ├── customer/     # Domínio de clientes
│   ├── product/      # Domínio de produtos
│   └── checkout/     # Domínio de pedidos
└── infrastructure/   # Camada de infraestrutura (repositórios, modelos de dados)
    ├── customer/
    ├── product/
    └── order/
```

## Tecnologias Utilizadas

- **TypeScript**: Linguagem de programação
- **Jest**: Framework de testes
- **Sequelize**: ORM para banco de dados
- **SQLite3**: Banco de dados
- **UUID**: Geração de identificadores únicos

## Scripts Disponíveis

- `npm test` - Executa todos os testes
- `npm run tsc` - Executa a verificação de tipos TypeScript

## Contribuindo

1. Crie uma branch para sua feature
2. Commit suas mudanças
3. Push para a branch
4. Abra um Pull Request
