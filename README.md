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
 
## 📸 Interface do Projeto

| Tela de Login | Tela de Registro |
| :---: | :---: |
| <img src="https://github.com/user-attachments/assets/c71733a1-8a6a-4db6-985a-b0abe7cc12d1" width="400"> | <img src="https://github.com/user-attachments/assets/99542e07-586f-4644-b74b-69ba84c82193" width="400"> |

| Tela de Perfil | Tela Editando Perfil |
| :---: | :---: |
| <img src="https://github.com/user-attachments/assets/eab432cc-b081-4b74-b482-fbff3520a3b6" width="400"> | <img src="https://github.com/user-attachments/assets/4354f3bc-d523-4ebe-b907-36d697a96e53" width="400"> |

| Tela de Gestão de Usuários |
| :---: |
| <img src="https://github.com/user-attachments/assets/34b86273-914d-499b-b0eb-e0c998c126df" width="400"> |

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
