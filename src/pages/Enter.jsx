import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Heart, KeyRound, Sparkles } from 'lucide-react'
import HeartBackground from '../components/HeartBackground'
import { useContent } from '../context/ContentContext'
import { useMusic } from '../context/MusicContext'
import { useAuth } from '../hooks/useAuth'

export default function Enter() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [shake, setShake] = useState(false)
  const { content } = useContent()
  const { isAuthenticated, login: visitorLogin } = useAuth()
  const { requestMusicStart } = useMusic()
  const navigate = useNavigate()
  const location = useLocation()

  const redirectTo =
    typeof location.state?.from === 'string'
      ? location.state.from
      : location.state?.from?.pathname || '/welcome'

  if (isAuthenticated) {
    return <Navigate to="/welcome" replace />
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (password !== content.password) {
      setError(content.login.error)
      setShake(true)
      return
    }

    visitorLogin()
    requestMusicStart()
    navigate(redirectTo, { replace: true })
  }

  return (
    <div className="romantic-bg relative min-h-screen overflow-x-hidden font-sans">
      <HeartBackground />

      <main className="relative z-10 flex min-h-screen items-center justify-center overflow-x-hidden px-5 py-10 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="mx-auto w-full max-w-md"
        >
          <div className="glass-card overflow-hidden rounded-4xl shadow-[0_24px_64px_-20px_rgba(244,114,182,0.45)]">
            <div className="border-b border-rose-100/80 bg-gradient-to-r from-rose-50/90 via-pink-50/90 to-rose-50/90 px-8 py-8 text-center">
              <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm"
              >
                <Heart className="text-rose-400" size={28} fill="currentColor" />
              </motion.div>

              <p className="text-xs font-medium text-rose-400">
                {content.login.eyebrow}
              </p>
              <h1 className="font-display mt-3 text-3xl font-semibold text-rose-800 sm:text-4xl">
                {content.login.title}
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-rose-500 sm:text-base">
                {content.login.subtitle}
              </p>
            </div>

            <motion.form
              onSubmit={handleSubmit}
              animate={shake ? { x: [0, -8, 8, -6, 6, 0] } : { x: 0 }}
              transition={{ duration: 0.45 }}
              onAnimationComplete={() => setShake(false)}
              className="space-y-5 px-8 py-8"
            >
              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm font-medium text-rose-600">
                  <KeyRound size={16} className="text-rose-400" />
                  {content.login.passwordLabel}
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value)
                    setError('')
                  }}
                  placeholder={content.login.placeholder}
                  className="w-full rounded-2xl border border-rose-100 bg-white px-4 py-3.5 text-rose-800 shadow-inner outline-none transition placeholder:text-rose-300 focus:border-rose-300 focus:ring-4 focus:ring-rose-100"
                  autoComplete="current-password"
                />
              </label>

              <AnimatePresence mode="wait">
                {error ? (
                  <motion.p
                    key="login-error"
                    initial={{ opacity: 0, y: -6, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -6, height: 0 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="overflow-hidden rounded-2xl border border-rose-100 bg-rose-50/90 px-4 py-3 text-center text-sm leading-relaxed text-rose-500"
                    role="alert"
                  >
                    {error}
                  </motion.p>
                ) : null}
              </AnimatePresence>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-400 to-pink-400 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-rose-200/80 transition hover:from-rose-500 hover:to-pink-500"
              >
                <Sparkles size={16} className="transition group-hover:rotate-12" />
                {content.login.button}
              </motion.button>
            </motion.form>
          </div>

          <p className="mt-6 text-center text-xs text-rose-300">
            {content.login.footer}
          </p>
        </motion.div>
      </main>
    </div>
  )
}
