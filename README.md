# User Management App

Aplicação fullstack para gerenciamento de usuários com autenticação e painel administrativo.

---

## Arquitetura

Este projeto é dividido em duas partes:

- mobile-app → Aplicação mobile feita com React Native (Expo)
- users-api-nest → API construída com NestJS, Prisma e PostgreSQL

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

### Tela de Login
<img width="680" height="506" alt="Image" src="https://github.com/user-attachments/assets/bc52b18a-2385-4f58-91f8-814765b6d08e" />

### Tela de Registro
<img width="514" height="489" alt="Image" src="https://github.com/user-attachments/assets/e035cd09-d45c-4c7c-a5ad-becac8894f41" />

### Tela de Perfil
<img width="484" height="544" alt="Image" src="https://github.com/user-attachments/assets/40877919-3c10-4847-b108-895d01b9b9b8" />

### Tela Editando perfil
<img width="483" height="449" alt="Image" src="https://github.com/user-attachments/assets/320e0cb3-ef25-4aea-b875-c59e3c783c78" />

### Tela de Usuários
<img width="490" height="664" alt="Image" src="https://github.com/user-attachments/assets/3fe875ac-f401-4715-8f8d-a33452c30651" />

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
