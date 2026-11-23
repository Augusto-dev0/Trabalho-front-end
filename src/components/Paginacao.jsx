// Controles de paginação baseados na resposta do back-end: { page, totalPages, totalElements, last }
export default function Paginacao({ pagina, onMudar }) {
  if (!pagina) return null

  if (pagina.totalPages <= 1) {
    return <p className="total">{pagina.totalElements} registro(s)</p>
  }

  return (
    <nav className="paginacao" aria-label="Paginação">
      <button type="button" className="btn" disabled={pagina.page === 0} onClick={() => onMudar(pagina.page - 1)}>
        Anterior
      </button>
      <span>
        Página {pagina.page + 1} de {pagina.totalPages} · {pagina.totalElements} registros
      </span>
      <button type="button" className="btn" disabled={pagina.last} onClick={() => onMudar(pagina.page + 1)}>
        Próxima
      </button>
    </nav>
  )
}
