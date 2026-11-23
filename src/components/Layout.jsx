import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { logout } from '../api/auth.js'

const LINKS = [
  { para: '/categorias', texto: 'Categorias' },
  { para: '/autores', texto: 'Autores' },
  { para: '/editoras', texto: 'Editoras' },
]

export default function Layout() {
  const navigate = useNavigate()

  function sair() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <>
      <header className="topo">
        <span className="marca">Biblioteca Comunitária</span>
        <nav aria-label="Principal">
          {LINKS.map((link) => (
            <NavLink key={link.para} to={link.para}>
              {link.texto}
            </NavLink>
          ))}
        </nav>
        <button type="button" className="btn sair" onClick={sair}>
          Sair
        </button>
      </header>
      <main className="conteudo">
        <Outlet />
      </main>
    </>
  )
}
