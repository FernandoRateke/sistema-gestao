# Sistema de Gestão de Tarefas

Cadastro de usuários e de tarefas. Cada tarefa tem um prazo, um status e um usuário responsável.

- `backend` → Node.js + Express + Prisma + PostgreSQL (senha criptografada com bcrypt)
- `frontend` → React + Vite

## Back-end

1. Crie o banco `sistema_gestao` no PostgreSQL.
2. Copie o `.env.example` para `.env` e ajuste usuário/senha do banco.

```bash
cd backend
npm install
npx prisma migrate dev --name init
npx prisma generate
npm run dev
```

## Front-end

```bash
cd frontend
npm install
npm run dev
```
