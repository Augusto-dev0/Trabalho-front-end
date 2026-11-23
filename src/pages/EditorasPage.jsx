import RecursoPage from '../components/RecursoPage.jsx'
import { editorasApi } from '../api/recursos.js'

const formatarCnpj = (cnpj) => cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')

const formatarTelefone = (telefone) =>
  telefone.length === 11
    ? telefone.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3')
    : telefone.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3')

const colunas = [
  { campo: 'nome', titulo: 'Nome' },
  { campo: 'email', titulo: 'E-mail' },
  { campo: 'cnpj', titulo: 'CNPJ', formatar: formatarCnpj },
  { campo: 'telefone', titulo: 'Telefone', formatar: formatarTelefone },
]

const campos = [
  { nome: 'nome', rotulo: 'Nome', obrigatorio: true, maxLength: 150 },
  { nome: 'email', rotulo: 'E-mail', tipo: 'email', maxLength: 150 },
  {
    nome: 'cnpj',
    rotulo: 'CNPJ',
    obrigatorio: true,
    maxLength: 14,
    pattern: '\\d{14}',
    inputMode: 'numeric',
    dica: '14 dígitos, somente números',
  },
  {
    nome: 'telefone',
    rotulo: 'Telefone',
    maxLength: 11,
    pattern: '\\d{10,11}',
    inputMode: 'numeric',
    dica: 'DDD + número, somente números',
  },
]

export default function EditorasPage() {
  return <RecursoPage titulo="Editoras" api={editorasApi} colunas={colunas} campos={campos} />
}
