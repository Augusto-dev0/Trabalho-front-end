import { http } from './http.js'

// Fábrica: gera as 5 operações do CRUD para qualquer recurso REST do back-end.
//   GET    /rota?nome=&page=&size=&sort=   -> página { content, page, size, totalElements, totalPages, last }
//   GET    /rota/{id}
//   POST   /rota                           -> 201
//   PUT    /rota/{id}                      -> 200
//   DELETE /rota/{id}                      -> 204
function criarRecurso(rota) {
  return {
    listar: ({ nome, page, size, sort } = {}) =>
      http(`/${rota}`, { params: { nome, page, size, sort } }),
    buscar: (id) => http(`/${rota}/${id}`),
    criar: (dados) => http(`/${rota}`, { method: 'POST', body: dados }),
    atualizar: (id, dados) => http(`/${rota}/${id}`, { method: 'PUT', body: dados }),
    excluir: (id) => http(`/${rota}/${id}`, { method: 'DELETE' }),
  }
}

export const categoriasApi = criarRecurso('categorias')
export const autoresApi = criarRecurso('autores')
export const editorasApi = criarRecurso('editoras')
