import { useEffect, useState } from 'react'
import { usuarioApi } from '../api/usuario.js'
import './Perfil.css'

const ROTULOS = {
  nome: 'Nome',
  email: 'E-mail',
  telefone: 'Telefone',
  role: 'Perfil',
  roles: 'Perfis',
  dataCadastro: 'Cadastrado em',
}

// Nunca exibir senha, mesmo que o back-end a envie por engano; o id também não interessa ao usuário.
const OCULTOS = ['senha', 'password', 'id']

const PAPEIS = { ADMIN: 'Administrador', USER: 'Usuário' }

const rotulo = (chave) => ROTULOS[chave] ?? chave.charAt(0).toUpperCase() + chave.slice(1)

function formatarPapel(texto) {
  const papel = String(texto).replace(/^ROLE_/, '').toUpperCase()
  return PAPEIS[papel] ?? texto
}

function formatar(chave, valor) {
  if (Array.isArray(valor)) return valor.map((item) => formatar(chave, item)).join(', ')
  if (valor !== null && typeof valor === 'object') {
    return formatar(chave, valor.nome ?? valor.name ?? valor.authority ?? JSON.stringify(valor))
  }
  if (chave === 'role' || chave === 'roles') return formatarPapel(valor)
  // Datas "2026-11-23" viram "23/11/2026". Feito na mão, sem new Date(), para não "voltar um dia" no fuso do Brasil.
  if (typeof valor === 'string' && /^\d{4}-\d{2}-\d{2}/.test(valor)) {
    const [ano, mes, dia] = valor.slice(0, 10).split('-')
    return `${dia}/${mes}/${ano}`
  }
  return String(valor)
}

export default function Perfil() {
  const [resultado, setResultado] = useState(null) // { tentativa, dados } ou { tentativa, erro }
  const [tentativa, setTentativa] = useState(0)

  useEffect(() => {
    let cancelado = false
    usuarioApi
      .perfil()
      .then((dados) => {
        if (!cancelado) setResultado({ tentativa, dados })
      })
      .catch((e) => {
        if (!cancelado) setResultado({ tentativa, erro: e.message })
      })
    return () => {
      cancelado = true
    }
  }, [tentativa])

  // Enquanto o resultado guardado for de outra tentativa, ainda estamos carregando
  const carregando = resultado?.tentativa !== tentativa

  const itens = Object.entries(resultado?.dados ?? {}).filter(
    ([chave, valor]) => !OCULTOS.includes(chave.toLowerCase()) && valor !== null && valor !== '',
  )

  return (
    <section className="cartao perfil">
      <h1>Meu perfil</h1>

      {carregando && <p>Carregando...</p>}

      {!carregando && resultado.erro && (
        <>
          <p className="alerta alerta-erro" role="alert">
            {resultado.erro}
          </p>
          <button type="button" className="btn" onClick={() => setTentativa((n) => n + 1)}>
            Tentar novamente
          </button>
        </>
      )}

      {!carregando && !resultado.erro && itens.length === 0 && <p>Nenhum dado de perfil disponível.</p>}

      {!carregando && itens.length > 0 && (
        <dl className="perfil-dados">
          {itens.map(([chave, valor]) => (
            <div key={chave}>
              <dt>{rotulo(chave)}</dt>
              <dd>{formatar(chave, valor)}</dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  )
}