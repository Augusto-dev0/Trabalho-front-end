// Um campo de formulário com rótulo, dica e mensagem de erro (vinda da validação do back-end).
export default function Campo({ campo, valor, erro, onChange }) {
  const id = `campo-${campo.nome}`
  const Elemento = campo.textarea ? 'textarea' : 'input'
  const descricao = erro ? `${id}-erro` : campo.dica ? `${id}-dica` : undefined

  return (
    <div className="campo">
      <label htmlFor={id}>
        {campo.rotulo}
        {campo.obrigatorio && <span aria-hidden="true"> *</span>}
      </label>
      <Elemento
        id={id}
        name={campo.nome}
        type={campo.textarea ? undefined : (campo.tipo ?? 'text')}
        rows={campo.textarea ? 4 : undefined}
        value={valor}
        required={campo.obrigatorio}
        maxLength={campo.maxLength}
        pattern={campo.pattern}
        inputMode={campo.inputMode}
        aria-invalid={Boolean(erro)}
        aria-describedby={descricao}
        onChange={(evento) => onChange(campo.nome, evento.target.value)}
      />
      {campo.dica && <small id={`${id}-dica`}>{campo.dica}</small>}
      {erro && (
        <small id={`${id}-erro`} className="erro">
          {erro}
        </small>
      )}
    </div>
  )
}
