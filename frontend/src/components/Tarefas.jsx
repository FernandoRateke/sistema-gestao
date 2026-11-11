import { useState, useEffect } from "react"
import { api } from "../api"

const formVazio = { titulo: "", descricao: "", prazo: "", status: "PENDENTE", usuarioId: "" }

export function Tarefas() {
  const [tarefas, setTarefas] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [form, setForm] = useState(formVazio)
  const [editandoId, setEditandoId] = useState(null)
  const [mensagem, setMensagem] = useState("")

  function carregar() {
    api("/tarefas")
      .then((dados) => setTarefas(dados))
      .catch((err) => setMensagem(err.message))

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
        await api(`/tarefas/${editandoId}`, { method: "PUT", body: JSON.stringify(form) })
        setMensagem("Tarefa atualizada")
      } else {
        await api("/tarefas", { method: "POST", body: JSON.stringify(form) })
        setMensagem("Tarefa cadastrada")
      }

      setForm(formVazio)
      setEditandoId(null)
      carregar()
    } catch (err) {
      setMensagem(err.message)
    }
  }

  function editar(tarefa) {
    setEditandoId(tarefa.id)
    setForm({
      titulo: tarefa.titulo,
      descricao: tarefa.descricao || "",
      prazo: tarefa.prazo.slice(0, 10),
      status: tarefa.status,
      usuarioId: tarefa.usuarioId
    })
  }

  function cancelar() {
    setEditandoId(null)
    setForm(formVazio)
  }

  async function excluir(id) {
    try {
      await api(`/tarefas/${id}`, { method: "DELETE" })
      setMensagem("Tarefa excluída")
      carregar()
    } catch (err) {
      setMensagem(err.message)
    }
  }

  return (
    <section>
      <h2>{editandoId ? "Editar tarefa" : "Cadastrar tarefa"}</h2>

      <form onSubmit={salvar}>
        <input name="titulo" placeholder="Título" value={form.titulo} onChange={alterarCampo} />
        <input name="descricao" placeholder="Descrição" value={form.descricao} onChange={alterarCampo} />
        <input name="prazo" type="date" value={form.prazo} onChange={alterarCampo} />

        <select name="status" value={form.status} onChange={alterarCampo}>
          <option value="PENDENTE">Pendente</option>
          <option value="EM_ANDAMENTO">Em andamento</option>
          <option value="CONCLUIDA">Concluída</option>
        </select>

        <select name="usuarioId" value={form.usuarioId} onChange={alterarCampo}>
          <option value="">Selecione o responsável</option>
          {usuarios.map((usuario) => (
            <option key={usuario.id} value={usuario.id}>{usuario.nome}</option>
          ))}
        </select>

        <button type="submit">{editandoId ? "Salvar" : "Cadastrar"}</button>
        {editandoId && <button type="button" onClick={cancelar}>Cancelar</button>}
      </form>

      {mensagem && <p className="mensagem">{mensagem}</p>}

      <h2>Lista de tarefas</h2>

      <table>
        <thead>
          <tr>
            <th>Título</th>
            <th>Descrição</th>
            <th>Prazo</th>
            <th>Status</th>
            <th>Responsável</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {tarefas.map((tarefa) => (
            <tr key={tarefa.id}>
              <td>{tarefa.titulo}</td>
              <td>{tarefa.descricao}</td>
              <td>{new Date(tarefa.prazo).toLocaleDateString("pt-BR", { timeZone: "UTC" })}</td>
              <td>{tarefa.status}</td>
              <td>{tarefa.usuario.nome}</td>
              <td>
                <button onClick={() => editar(tarefa)}>Editar</button>
                <button onClick={() => excluir(tarefa.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
