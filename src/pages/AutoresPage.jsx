import RecursoPage from '../components/RecursoPage.jsx'
import { autoresApi } from '../api/recursos.js'

const colunas = [
  { campo: 'nome', titulo: 'Nome' },
  { campo: 'nacionalidade', titulo: 'Nacionalidade' },
  { campo: 'biografia', titulo: 'Biografia', longa: true },
]

const campos = [
  { nome: 'nome', rotulo: 'Nome', obrigatorio: true, maxLength: 150 },
  { nome: 'nacionalidade', rotulo: 'Nacionalidade', maxLength: 100 },
  { nome: 'biografia', rotulo: 'Biografia', textarea: true, maxLength: 2000 },
]

export default function AutoresPage() {
  return <RecursoPage titulo="Autores" api={autoresApi} colunas={colunas} campos={campos} />
}
