// Cliente HTTP único do front-end. Todas as chamadas à API passam por aqui.

// Em desenvolvimento: '/api' (o proxy do Vite encaminha para o back-end).
// Em produção: defina VITE_API_URL com o endereço da API.
const BASE_URL = import.meta.env.VITE_API_URL ?? '/api'
const TOKEN_KEY = 'token'

// O JWT será guardado aqui pela tela de login (fatia de segurança).
// Enquanto não houver login, nenhum header Authorization é enviado.
export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
}

// Erro padronizado: espelha o ApiError do back-end ({ status, message, fields: [{ field, message }] }).
export class ApiError extends Error {
  constructor(status, message, fields = []) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.fields = fields
  }
}

function montarUrl(caminho, params) {
  const url = new URL(`${BASE_URL}${caminho}`, window.location.origin)
  Object.entries(params ?? {}).forEach(([chave, valor]) => {
    if (valor !== undefined && valor !== null && valor !== '') {
      url.searchParams.set(chave, valor)
    }
  })
  return url.toString()
}

function mensagemPadrao(status) {
  if (status === 401) return 'Sessão expirada ou usuário não autenticado.'
  if (status === 403) return 'Você não tem permissão para esta operação.'
  if (status === 404) return 'Registro não encontrado.'
  return `Erro inesperado (${status}).`
}

export async function http(caminho, { method = 'GET', body, params } = {}) {
  const headers = { Accept: 'application/json' }
  if (body !== undefined) headers['Content-Type'] = 'application/json'

  const token = tokenStorage.get()
  if (token) headers.Authorization = `Bearer ${token}`

  let resposta
  try {
    resposta = await fetch(montarUrl(caminho, params), {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError(0, 'Não foi possível conectar à API. Verifique se o back-end está rodando.')
  }

  // 204 No Content (DELETE) não tem corpo
  if (resposta.status === 204) return null

  let corpo = null
  try {
    corpo = await resposta.json()
  } catch {
    // resposta sem JSON: segue com corpo nulo
  }

  if (!resposta.ok) {
    if (resposta.status === 401) tokenStorage.clear()
    throw new ApiError(resposta.status, corpo?.message ?? mensagemPadrao(resposta.status), corpo?.fields ?? [])
  }
  return corpo
}
