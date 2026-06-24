import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { checkAuth } from '../hooks/useAuth'

export default function ProtectedRoute() {
  const location = useLocation()
  const isAuthenticated = checkAuth()

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/enter"
        replace
        state={{ from: location.pathname }}
      />
    )
  }

  return <Outlet />
}
