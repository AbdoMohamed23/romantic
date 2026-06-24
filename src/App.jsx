import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import Enter from './pages/Enter'
import Final from './pages/Final'
import Gallery from './pages/Gallery'
import Story from './pages/Story'
import Welcome from './pages/Welcome'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Enter />} />
      <Route path="/enter" element={<Navigate to="/" replace />} />
      <Route path="/login" element={<Dashboard />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/story" element={<Story />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/final" element={<Final />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
