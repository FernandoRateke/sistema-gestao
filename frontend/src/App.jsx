import { useState } from "react"
import { Usuarios } from "./components/Usuarios"
import { Tarefas } from "./components/Tarefas"
import "./App.css"

function App() {
  const [pagina, setPagina] = useState("tarefas")

  return (
    <>
      <header>
        <h1>Sistema de Gestão de Tarefas</h1>

        <nav>
          <button onClick={() => setPagina("tarefas")}>Tarefas</button>
          <button onClick={() => setPagina("usuarios")}>Usuários</button>
        </nav>
      </header>

      <main>
        {pagina === "tarefas" && <Tarefas />}
        {pagina === "usuarios" && <Usuarios />}
      </main>
    </>
  )
}

export default App
