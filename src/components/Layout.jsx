import { NavLink, Outlet } from 'react-router-dom'

const LINKS = [
  { para: '/categorias', texto: 'Categorias' },
  { para: '/autores', texto: 'Autores' },
  { para: '/editoras', texto: 'Editoras' },
]

export default function Layout() {
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
      </header>
      <main className="conteudo">
        <Outlet />
      </main>
    </>
  )
}
