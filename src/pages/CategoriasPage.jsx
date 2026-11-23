import RecursoPage from '../components/RecursoPage.jsx'
import { categoriasApi } from '../api/recursos.js'

// Colunas da tabela e campos do formulário (espelham o CategoriaRequest/Response do back-end)
const colunas = [
  { campo: 'nome', titulo: 'Nome' },
  { campo: 'descricao', titulo: 'Descrição', longa: true },
]

const campos = [
  { nome: 'nome', rotulo: 'Nome', obrigatorio: true, maxLength: 100 },
  { nome: 'descricao', rotulo: 'Descrição', textarea: true, maxLength: 255 },
]

export default function CategoriasPage() {
  return <RecursoPage titulo="Categorias" api={categoriasApi} colunas={colunas} campos={campos} />
}
