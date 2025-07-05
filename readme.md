# EZMoney API

## Introdução

Uma API autodocumentável construída com Fastify para um sistema de gerenciamento completo de finanças.

## Tecnologias

- Linguagem: [Node.js](https://nodejs.org)
- Framework: [Fastify.js](https://www.fastify.io)
- ORM: [PrismaORM](https://www.prisma.io)
- Documentação [Swagger](https://swagger.io/)
- Banco de Dados: [PostgreSQL](https://www.postgresql.org)
- Autenticação: [JWT](https://jwt.io)
- Gerenciamento de Dependências: [pnpm](https://pnpm.io)
- Linter: [ESLint](https://eslint.org)
- Testes: [Vitest](https://vitest.dev)

## Estrutura do Projeto

| Diretório/Arquivo       | Descrição                                      |
| ----------------------- | ---------------------------------------------- |
| **prisma/**             | Configuração do Prisma ORM para banco de dados |
| **src/**                | Código-fonte principal da aplicação            |
| └─ **@types/**          | Definições de tipos TypeScript customizados    |
| └─ **controllers/**     | Controladores para lidar com requisições HTTP  |
| └─ **middlewares/**     | Middlewares para processamento de requisições  |
| └─ **schemas/**         | Esquemas de validação de dados                 |
| └─ **services/**        | Camada de serviços e lógica de negócio         |
| └─ **test/**            | Configuração de testes da aplicação            |
| └─ **utils/**           | Funções utilitárias e helpers                  |
| └─ **app.ts**           | Configuração principal da aplicação            |
| └─ **env.ts**           | Configurações de variáveis de ambiente         |
| └─ **error-handler.ts** | Manipulação centralizada de erros              |
| └─ **server.ts**        | Inicialização e configuração do servidor       |

## Endpoints

| Método   | Endpoint        | Descrição                                   |
| -------- | --------------- | ------------------------------------------- |
| **POST** | `/auth/sign-up` | Registrar um novo usuário                   |
| **POST** | `/auth/sign-in` | Fazer login e obter o token de autenticação |
| **GET**  | `/auth/profile` | Obter o perfil do usuário autenticado       |
| **POST** | `/categories`   | Criar uma nova categoria                    |
| **GET**  | `/categories`   | Listar todas as categorias                  |
| **POST** | `/invoices`     | Criar uma nova fatura                       |
| **GET**  | `/invoices`     | Listar todas as faturas                     |

## Instalação

Crie uma fork do repositório:

Acesse: https://github.com/izaiasmorais/ezmoney-api/fork

Clone o repositório na sua máquina:

```bash
git clone https://github.com/[seu usuário]/ezmoney-api
```

Acesse o projeto:

```bash
cd ezmoney-api
```

Instale as dependências:

```bash
pnpm install
```

Configure o arquivo .env com suas credenciais (baseando-se no .env.example):

```env
EXPIRES_IN=10000
PORT=3333
SECRET="secret"
DATABASE_URL="postgresql://docker:docker@localhost:5432/docker"
```

## Executando o Projeto

Rode o banco postgres no docker (caso não já possua um postgres em outro serviço):

```bash
docker compose up -d
```

Suba as migrações para o banco:

```bash
pnpm migrate
```

Gere o schema do prisma:

```bash
pnpm generate
```

Inicie o servidor:

```bash
pnpm dev
```

## Executando os Testes

Executar os testes dos controllers:

```bash
pnpm test
```
