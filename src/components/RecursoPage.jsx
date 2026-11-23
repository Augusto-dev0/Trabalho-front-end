import { useEffect, useState } from 'react'
import Campo from './Campo.jsx'
import Paginacao from './Paginacao.jsx'

const TAMANHO_PAGINA = 10

const valoresVazios = (campos) => Object.fromEntries(campos.map((campo) => [campo.nome, '']))

// Texto vazio vira null: o back-end valida @Pattern/@Email e "" seria rejeitado em campos opcionais.
function paraPayload(valores) {
  return Object.fromEntries(
    Object.entries(valores).map(([chave, valor]) => {
      const texto = typeof valor === 'string' ? valor.trim() : valor
      return [chave, texto === '' ? null : texto]
    }),
  )
}

/**
 * Página de CRUD reutilizável (listar, buscar, ordenar, paginar, criar, editar, excluir).
 * Cada tela (Categorias, Autores, Editoras) só informa a API, as colunas e os campos do formulário.
 */
export default function RecursoPage({ titulo, api, colunas, campos }) {
  // lista: guardamos o resultado junto com a "chave" da consulta que o gerou
  const [resultado, setResultado] = useState(null)
  const [erroAcao, setErroAcao] = useState('') // erro de exclusão (ex.: 409)
  const [mensagem, setMensagem] = useState('')

  // busca, ordenação e paginação (viram parâmetros ?nome=&sort=&page= da API)
  const [busca, setBusca] = useState('')
  const [filtro, setFiltro] = useState('')
  const [ordem, setOrdem] = useState('asc')
  const [numeroPagina, setNumeroPagina] = useState(0)
  const [recarregar, setRecarregar] = useState(0)

  // formulário
  const [formAberto, setFormAberto] = useState(false)
  const [editandoId, setEditandoId] = useState(null)
  const [valores, setValores] = useState(() => valoresVazios(campos))
  const [errosCampos, setErrosCampos] = useState({})
  const [erroForm, setErroForm] = useState('')
  const [salvando, setSalvando] = useState(false)

  // Identifica a consulta atual. Se o resultado guardado for de outra chave, ainda estamos carregando.
  const chave = `${filtro}|${ordem}|${numeroPagina}|${recarregar}`
  const carregando = resultado?.chave !== chave
  const pagina = resultado?.dados ?? null
  const erroLista = carregando ? '' : (resultado?.erro ?? '')
  const erroExibido = erroAcao || erroLista

  // Carrega a lista sempre que filtro, ordem, página ou o contador "recarregar" mudarem.
  useEffect(() => {
    let cancelado = false
    api
      .listar({ nome: filtro, page: numeroPagina, size: TAMANHO_PAGINA, sort: `nome,${ordem}` })
      .then((dados) => {
        if (!cancelado) setResultado({ chave, dados, erro: '' })
      })
      .catch((e) => {
        if (!cancelado) setResultado({ chave, dados: null, erro: e.message })
      })
    return () => {
      cancelado = true
    }
  }, [api, chave, filtro, ordem, numeroPagina])

  function buscar(evento) {
    evento.preventDefault()
    setNumeroPagina(0)
    setFiltro(busca.trim())
  }

  function limparBusca() {
    setBusca('')
    setFiltro('')
    setNumeroPagina(0)
  }

  function alternarOrdem() {
    setOrdem((atual) => (atual === 'asc' ? 'desc' : 'asc'))
    setNumeroPagina(0)
  }

  function abrirFormulario(item) {
    setEditandoId(item ? item.id : null)
    setValores(
      item
        ? Object.fromEntries(campos.map((campo) => [campo.nome, item[campo.nome] ?? '']))
        : valoresVazios(campos),
    )
    setErrosCampos({})
    setErroForm('')
    setMensagem('')
    setErroAcao('')
    setFormAberto(true)
  }

  function fecharFormulario() {
    setFormAberto(false)
    setEditandoId(null)
  }

  function alterarCampo(nome, valor) {
    setValores((atuais) => ({ ...atuais, [nome]: valor }))
    setErrosCampos((atuais) => ({ ...atuais, [nome]: undefined }))
  }

  async function salvar(evento) {
    evento.preventDefault()
    setSalvando(true)
    setErroForm('')
    setErrosCampos({})
    try {
      const payload = paraPayload(valores)
      if (editandoId === null) {
        await api.criar(payload)
        setMensagem('Registro cadastrado com sucesso.')
        setNumeroPagina(0)
      } else {
        await api.atualizar(editandoId, payload)
        setMensagem('Registro atualizado com sucesso.')
      }
      fecharFormulario()
      setRecarregar((n) => n + 1)
    } catch (e) {
      if (e.status === 400 && e.fields?.length) {
        // 400 com lista de campos: mostra a mensagem do back-end embaixo de cada campo
        setErrosCampos(Object.fromEntries(e.fields.map((f) => [f.field, f.message])))
        setErroForm('Corrija os campos destacados.')
      } else {
        setErroForm(e.message)
      }
    } finally {
      setSalvando(false)
    }
  }

  async function excluir(item) {
    if (!window.confirm(`Excluir "${item.nome}"?`)) return
    setMensagem('')
    setErroAcao('')
    try {
      await api.excluir(item.id)
      setMensagem('Registro excluído com sucesso.')
      // se era o último item da página, volta uma página
      if (pagina.content.length === 1 && numeroPagina > 0) {
        setNumeroPagina(numeroPagina - 1)
      } else {
        setRecarregar((n) => n + 1)
      }
    } catch (e) {
      // 409 (ex.: categoria com livros) chega aqui com a mensagem do back-end
      setErroAcao(e.message)
    }
  }

  return (
    <section>
      <header className="cabecalho-pagina">
        <h1>{titulo}</h1>
        <button type="button" className="btn btn-primario" onClick={() => abrirFormulario(null)}>
          Novo
        </button>
      </header>

      {mensagem && (
        <p className="alerta alerta-sucesso" role="status">
          {mensagem}
        </p>
      )}
      {erroExibido && (
        <p className="alerta alerta-erro" role="alert">
          {erroExibido}
        </p>
      )}

      {formAberto && (
        <form className="cartao formulario" onSubmit={salvar}>
          <h2>{editandoId === null ? 'Novo cadastro' : 'Editar registro'}</h2>
          {erroForm && (
            <p className="alerta alerta-erro" role="alert">
              {erroForm}
            </p>
          )}
          {campos.map((campo) => (
            <Campo
              key={campo.nome}
              campo={campo}
              valor={valores[campo.nome]}
              erro={errosCampos[campo.nome]}
              onChange={alterarCampo}
            />
          ))}
          <div className="acoes">
            <button type="submit" className="btn btn-primario" disabled={salvando}>
              {salvando ? 'Salvando...' : 'Salvar'}
            </button>
            <button type="button" className="btn" onClick={fecharFormulario} disabled={salvando}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      <form className="busca" onSubmit={buscar} role="search">
        <input
          type="search"
          placeholder="Buscar por nome"
          aria-label="Buscar por nome"
          value={busca}
          onChange={(evento) => setBusca(evento.target.value)}
        />
        <button type="submit" className="btn">
          Buscar
        </button>
        {filtro && (
          <button type="button" className="btn btn-link" onClick={limparBusca}>
            Limpar busca
          </button>
        )}
      </form>

      {carregando && !pagina && <p>Carregando...</p>}

      {pagina && (
        <div className="tabela-rolavel" aria-busy={carregando}>
          <table>
            <thead>
              <tr>
                {colunas.map((coluna) => (
                  <th key={coluna.campo}>
                    {coluna.campo === 'nome' ? (
                      <button type="button" className="ordenar" onClick={alternarOrdem}>
                        {coluna.titulo} {ordem === 'asc' ? '▲' : '▼'}
                      </button>
                    ) : (
                      coluna.titulo
                    )}
                  </th>
                ))}
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {pagina.content.length === 0 ? (
                <tr>
                  <td colSpan={colunas.length + 1} className="vazio">
                    Nenhum registro encontrado.
                  </td>
                </tr>
              ) : (
                pagina.content.map((item) => (
                  <tr key={item.id}>
                    {colunas.map((coluna) => {
                      const bruto = item[coluna.campo]
                      const texto = bruto ? (coluna.formatar ? coluna.formatar(bruto) : bruto) : '—'
                      return (
                        <td key={coluna.campo} className={coluna.longa ? 'celula-longa' : undefined} title={coluna.longa ? texto : undefined}>
                          {texto}
                        </td>
                      )
                    })}
                    <td className="celula-acoes">
                      <button type="button" className="btn" onClick={() => abrirFormulario(item)}>
                        Editar
                      </button>
                      <button type="button" className="btn btn-perigo" onClick={() => excluir(item)}>
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <Paginacao pagina={pagina} onMudar={setNumeroPagina} />
    </section>
  )
}
