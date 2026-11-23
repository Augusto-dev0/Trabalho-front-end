import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import CategoriasPage from './pages/CategoriasPage.jsx'
import AutoresPage from './pages/AutoresPage.jsx'
import EditorasPage from './pages/EditorasPage.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/categorias" replace />} />
          <Route path="/categorias" element={<CategoriasPage />} />
          <Route path="/autores" element={<AutoresPage />} />
          <Route path="/editoras" element={<EditorasPage />} />
          <Route path="*" element={<p>Página não encontrada.</p>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
