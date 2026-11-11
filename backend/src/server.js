import express from "express"
import cors from "cors"
import bcrypt from "bcrypt"
import { prisma } from "./lib/prisma.ts"

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())

// =============================================== USUÁRIOS ===============================================

app.get("/usuarios", async (req, res) => {
    try {
        const usuarios = await prisma.usuario.findMany({
            orderBy: { id: "asc" },
            select: { id: true, nome: true, email: true, cpf: true }
        })

        res.json(usuarios)
    } catch (err) {
        res.status(500).json({ error: "Erro ao buscar usuários" })
    }
})

app.post("/usuarios", async (req, res) => {
    try {
        const { nome, email, cpf, senha } = req.body

        if (!nome || !email || !cpf || !senha) {
            return res.status(400).json({ error: "Preencha todos os campos" })
        }

        const senhaHash = await bcrypt.hash(senha, 10)

        const usuario = await prisma.usuario.create({
            data: { nome, email, cpf, senha: senhaHash },
            select: { id: true, nome: true, email: true, cpf: true }
        })

        res.status(201).json(usuario)
    } catch (err) {
        if (err.code === "P2002") {
            return res.status(409).json({ error: "Email ou CPF já cadastrado" })
        }

        res.status(500).json({ error: "Erro ao cadastrar usuário" })
    }
})

app.put("/usuarios/:id", async (req, res) => {
    try {
        const id = Number(req.params.id)
        const { nome, email, cpf, senha } = req.body

        const data = { nome, email, cpf }

        // a senha só muda se uma nova for enviada
        if (senha) {
            data.senha = await bcrypt.hash(senha, 10)
        }

        const usuario = await prisma.usuario.update({
            where: { id },
            data,
            select: { id: true, nome: true, email: true, cpf: true }
        })

        res.json(usuario)
    } catch (err) {
        if (err.code === "P2025") {
            return res.status(404).json({ error: "Usuário não encontrado" })
        }

        if (err.code === "P2002") {
            return res.status(409).json({ error: "Email ou CPF já cadastrado" })
        }

        res.status(500).json({ error: "Erro ao atualizar usuário" })
    }
})

app.delete("/usuarios/:id", async (req, res) => {
    try {
        const id = Number(req.params.id)

        await prisma.usuario.delete({ where: { id } })

        res.json({ message: "Usuário excluído com sucesso" })
    } catch (err) {
        if (err.code === "P2025") {
            return res.status(404).json({ error: "Usuário não encontrado" })
        }

        if (err.code === "P2003") {
            return res.status(409).json({ error: "Não é possível excluir: usuário possui tarefas" })
        }

        res.status(500).json({ error: "Erro ao excluir usuário" })
    }
})

// =============================================== TAREFAS ===============================================

app.get("/tarefas", async (req, res) => {
    try {
        const tarefas = await prisma.tarefa.findMany({
            orderBy: { prazo: "asc" },
            include: { usuario: { select: { nome: true } } }
        })

        res.json(tarefas)
    } catch (err) {
        res.status(500).json({ error: "Erro ao buscar tarefas" })
    }
})

app.post("/tarefas", async (req, res) => {
    try {
        const { titulo, descricao, prazo, status, usuarioId } = req.body

        if (!titulo || !prazo || !usuarioId) {
            return res.status(400).json({ error: "Preencha título, prazo e responsável" })
        }

        const tarefa = await prisma.tarefa.create({
            data: {
                titulo,
                descricao,
                prazo: new Date(prazo),
                status,
                usuarioId: Number(usuarioId)
            }
        })

        res.status(201).json(tarefa)
    } catch (err) {
        if (err.code === "P2003") {
            return res.status(400).json({ error: "Usuário responsável não existe" })
        }

        res.status(500).json({ error: "Erro ao cadastrar tarefa" })
    }
})

app.put("/tarefas/:id", async (req, res) => {
    try {
        const id = Number(req.params.id)
        const { titulo, descricao, prazo, status, usuarioId } = req.body

        const tarefa = await prisma.tarefa.update({
            where: { id },
            data: {
                titulo,
                descricao,
                prazo: new Date(prazo),
                status,
                usuarioId: Number(usuarioId)
            }
        })

        res.json(tarefa)
    } catch (err) {
        if (err.code === "P2025") {
            return res.status(404).json({ error: "Tarefa não encontrada" })
        }

        if (err.code === "P2003") {
            return res.status(400).json({ error: "Usuário responsável não existe" })
        }

        res.status(500).json({ error: "Erro ao atualizar tarefa" })
    }
})

app.delete("/tarefas/:id", async (req, res) => {
    try {
        const id = Number(req.params.id)

        await prisma.tarefa.delete({ where: { id } })

        res.json({ message: "Tarefa excluída com sucesso" })
    } catch (err) {
        if (err.code === "P2025") {
            return res.status(404).json({ error: "Tarefa não encontrada" })
        }

        res.status(500).json({ error: "Erro ao excluir tarefa" })
    }
})

app.listen(PORT, () => {
    console.log(`API rodando em http://localhost:${PORT}`)
})
