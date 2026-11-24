import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { estaLogado } from '../api/auth.js'

// Só deixa passar quem tem token; os demais vão para o login.
export default function RotaProtegida() {
  const local = useLocation()
  if (!estaLogado()) return <Navigate to="/login" replace state={{ de: local.pathname }} />
  return <Outlet />
}
