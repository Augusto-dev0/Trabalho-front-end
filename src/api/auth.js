import { http, tokenStorage } from './http.js'

// Rotas e nomes de campos do back-end. Se o seu Spring Boot usar outros, é só trocar aqui.
const ROTA_LOGIN = '/Auth/login'
const ROTA_CADASTRO = '/Auth/cadastro'

// Aceita os nomes mais comuns de campo de token na resposta do login.
function extrairToken(resposta) {
  return resposta?.token ?? resposta?.accessToken ?? resposta?.jwt ?? null
}

export async function login(email, senha) {
  // Limpa token antigo e NÃO o envia: um token velho pode fazer o back-end recusar até o login.
  tokenStorage.clear()
  const resposta = await http(ROTA_LOGIN, { method: 'POST', body: { email, senha }, semToken: true })
  const token = extrairToken(resposta)
  if (!token) throw new Error('Login feito, mas a API não devolveu um token (esperado campo "token").')
  tokenStorage.set(token)
  return resposta
}

export function cadastrar(nome, email, senha) {
  tokenStorage.clear()
  return http(ROTA_CADASTRO, { method: 'POST', body: { nome, email, senha }, semToken: true })
}

export function logout() {
  tokenStorage.clear()
}

export const estaLogado = () => Boolean(tokenStorage.get())

// Mostra o motivo REAL da falha (em vez de uma mensagem fixa que esconde o problema).
export function explicarErro(err) {
  const detalhe = err.fields?.length ? ' ' + err.fields.map((f) => `${f.field}: ${f.message}`).join('; ') : ''
  const dica = {
    0: '',
    400: ' (dados recusados pelo back-end: veja os nomes dos campos)',
    401: ' (credenciais inválidas ou rota protegida)',
    403: ' (rota bloqueada no Spring Security: libere /Auth/** com permitAll)',
    404: ' (essa rota não existe no back-end: confira ROTA_LOGIN/ROTA_CADASTRO em src/api/auth.js)',
    409: '',
    500: ' (erro no servidor: veja o console do Spring Boot)',
  }[err.status] ?? ''
  return err.status ? `${err.message}${detalhe} [HTTP ${err.status}]${dica}` : err.message
}
