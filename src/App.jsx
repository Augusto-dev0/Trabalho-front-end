import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
<<<<<<< HEAD
import RotaProtegida from './components/RotaProtegida.jsx'
import Login from './pages/Login.jsx'
import Cadastro from './pages/Cadastro.jsx'
=======
>>>>>>> origin/main
import CategoriasPage from './pages/CategoriasPage.jsx'
import AutoresPage from './pages/AutoresPage.jsx'
import EditorasPage from './pages/EditorasPage.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
<<<<<<< HEAD
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route element={<RotaProtegida />}>
          <Route element={<Layout />}>
            <Route index element={<Navigate to="/categorias" replace />} />
            <Route path="/categorias" element={<CategoriasPage />} />
            <Route path="/autores" element={<AutoresPage />} />
            <Route path="/editoras" element={<EditorasPage />} />
            <Route path="*" element={<p>Página não encontrada.</p>} />
          </Route>
=======
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/categorias" replace />} />
          <Route path="/categorias" element={<CategoriasPage />} />
          <Route path="/autores" element={<AutoresPage />} />
          <Route path="/editoras" element={<EditorasPage />} />
          <Route path="*" element={<p>Página não encontrada.</p>} />
>>>>>>> origin/main
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
