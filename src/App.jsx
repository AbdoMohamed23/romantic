import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import Dashboard from './pages/Dashboard'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Dashboard />} />

      <Route path="/enter" element={<Navigate to="/" replace />} />
      <Route path="/welcome" element={<Navigate to="/" replace />} />
      <Route path="/story" element={<Navigate to="/" replace />} />
      <Route path="/gallery" element={<Navigate to="/" replace />} />
      <Route path="/final" element={<Navigate to="/" replace />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
