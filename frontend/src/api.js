const API_URL = "http://localhost:3000"

export async function api(rota, opcoes = {}) {
  const resposta = await fetch(API_URL + rota, {
    headers: { "Content-Type": "application/json" },
    ...opcoes
  })

  const dados = await resposta.json()

  if (!resposta.ok) {
    throw new Error(dados.error || "Erro ao falar com o servidor")
  }

  return dados
}
