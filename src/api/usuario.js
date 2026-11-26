import { http } from './http.js'

// CONFIRA no UsuarioController do back-end qual @GetMapping devolve o MeuPerfilDto
// e ajuste esta constante se a rota for diferente.
const ROTA_PERFIL = '/usuario/perfil'

export const usuarioApi = {
  perfil: () => http(ROTA_PERFIL),
}