# User Management App

Aplicação fullstack para gerenciamento de usuários com autenticação e painel administrativo.

---

## Arquitetura

Este projeto é dividido em duas partes:

- mobile-app → Aplicação mobile feita com React Native (Expo)
- users-api-nest → API construída com NestJS, Prisma e PostgreSQL

---

## Estrutura do Projeto

/
├── mobile-app
├── users-api-nest

---

## Tecnologias

### Back-end
- Node.js
- NestJS
- Prisma ORM
- PostgreSQL
- JWT (Acess Token + Refresh Token)

### Front-end
- React Native (Expo)
- TypeScript

---

## Funcionalidades

- Registro e login de usuários
- Autenticação com JWT
- Refresh Token
- CRUD de usuários (admin)
- Paginação
- Busca de usuários
- Atualização de dados
- Exclusão de usuários

---
 
## Prints

(colocar imagens aqui)

---

## Como rodar o projeto

### Back-end

```bash
cd users-api-nest
npm install
npm run start
```

### Front-end

```bash
cd mobile-app
npm install
npx expo start
```

---

## Aprendizados

- Estrutura de projetos com NestJS
- Autenticação com JWT e refresh token
- Paginação no back-end e front-end
- Consumo de API com React Native
- Gerenciamento de estado com hooks
- Tratamento de erros em aplicações fullstack

---

## Decisões técnicas

- Uso de refresh token para melhorar a segurança da autenticação
- Paginação no backend para melhor performance
- Separação entre front-ent e back-end