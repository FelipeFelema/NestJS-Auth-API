# Users API (NestJS)

API para gerenciamento de usuários com autenticação JWT.

---

## Tecnologias

- NestJS
- Prisma ORM
- PostgreSQL
- JWT

---

## Funcionalidades

- Registro de usuários
- Login com autenticação
- Refresh token
- CRUD de usuários
- Paginação
- Busca

---

## Endpoints principais

POST /auth/register
POST /auth/login
GET /users
PUT /users/:id
DELETE /users/:id

---

## Como rodar

```bash
npm install
npm run start
```

---

## Observações

- Autenticação baseada em JWT
- Uso de refresh token para manter sessão do usuário
- Prisma utilizado como ORM para acesso ao banco de dados