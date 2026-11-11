import { useState, useEffect } from "react"
import { api } from "../api"

const formVazio = { nome: "", email: "", cpf: "", senha: "" }

export function Usuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [form, setForm] = useState(formVazio)
  const [editandoId, setEditandoId] = useState(null)
  const [mensagem, setMensagem] = useState("")

  function carregar() {
    api("/usuarios")
      .then((dados) => setUsuarios(dados))
      .catch((err) => setMensagem(err.message))
  }

  useEffect(() => {
    carregar()
  }, [])

  function alterarCampo(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function salvar(e) {
    e.preventDefault()

    try {
      if (editandoId) {
        await api(`/usuarios/${editandoId}`, { method: "PUT", body: JSON.stringify(form) })
        setMensagem("Usuário atualizado")
      } else {
        await api("/usuarios", { method: "POST", body: JSON.stringify(form) })
        setMensagem("Usuário cadastrado")
      }

      setForm(formVazio)
      setEditandoId(null)
      carregar()
    } catch (err) {
      setMensagem(err.message)
    }
  }

  function editar(usuario) {
    setEditandoId(usuario.id)
    setForm({ nome: usuario.nome, email: usuario.email, cpf: usuario.cpf, senha: "" })
  }

  function cancelar() {
    setEditandoId(null)
    setForm(formVazio)
  }

  async function excluir(id) {
    try {
      await api(`/usuarios/${id}`, { method: "DELETE" })
      setMensagem("Usuário excluído")
      carregar()
    } catch (err) {
      setMensagem(err.message)
    }
  }

  return (
    <section>
      <h2>{editandoId ? "Editar usuário" : "Cadastrar usuário"}</h2>

      <form onSubmit={salvar}>
        <input name="nome" placeholder="Nome" value={form.nome} onChange={alterarCampo} />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={alterarCampo} />
        <input name="cpf" placeholder="CPF" value={form.cpf} onChange={alterarCampo} />
        <input
          name="senha"
          type="password"
          placeholder={editandoId ? "Nova senha (opcional)" : "Senha"}
          value={form.senha}
          onChange={alterarCampo}
        />

        <button type="submit">{editandoId ? "Salvar" : "Cadastrar"}</button>
        {editandoId && <button type="button" onClick={cancelar}>Cancelar</button>}
      </form>

      {mensagem && <p className="mensagem">{mensagem}</p>}

      <h2>Usuários cadastrados</h2>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Email</th>
            <th>CPF</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id}>
              <td>{usuario.id}</td>
              <td>{usuario.nome}</td>
              <td>{usuario.email}</td>
              <td>{usuario.cpf}</td>
              <td>
                <button onClick={() => editar(usuario)}>Editar</button>
                <button onClick={() => excluir(usuario.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
