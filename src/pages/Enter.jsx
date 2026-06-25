import { useState } from 'react'
import { Heart, KeyRound, Sparkles } from 'lucide-react'
import FlowPage from '../components/FlowPage'
import { RevealGroup, RevealItem } from '../components/Reveal'
import { useContent } from '../context/ContentContext'

export default function Enter({ onLogin }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [shake, setShake] = useState(false)
  const { content } = useContent()

  const handleSubmit = (event) => {
    event.preventDefault()

    if (password !== content.password) {
      setError(content.login.error)
      setShake(true)
      window.setTimeout(() => setShake(false), 450)
      return
    }

    onLogin()
  }

  return (
    <FlowPage variant="center">
      <RevealGroup className="w-full">
        <RevealItem>
          <div className="glass-card theme-shadow-enter overflow-hidden rounded-4xl">
            <div className="border-b border-rose-100/80 bg-gradient-to-r from-rose-50/90 via-pink-50/90 to-rose-50/90 px-8 py-8 text-center">
              <div className="heart-pulse mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
                <Heart className="text-rose-400" size={28} fill="currentColor" />
              </div>

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

            <form
              onSubmit={handleSubmit}
              className={`space-y-5 px-8 py-8 ${shake ? 'enter-shake' : ''}`}
            >
              <label className="block text-center">
                <span className="mb-2 flex items-center justify-center gap-2 text-sm font-medium text-rose-600">
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
                  className="w-full rounded-2xl border border-rose-100 bg-white px-4 py-3.5 text-center text-rose-800 shadow-inner outline-none transition placeholder:text-rose-300 focus:border-rose-300 focus:ring-4 focus:ring-rose-100"
                  autoComplete="current-password"
                />
              </label>

              {error ? (
                <p
                  className="rounded-2xl border border-rose-100 bg-rose-50/90 px-4 py-3 text-center text-sm leading-relaxed text-rose-500"
                  role="alert"
                >
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-400 to-pink-400 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-rose-200/80 transition hover:from-rose-500 hover:to-pink-500 active:scale-[0.98]"
              >
                <Sparkles size={16} className="transition group-hover:rotate-12" />
                {content.login.button}
              </button>
            </form>
          </div>
        </RevealItem>

        <RevealItem className="mt-6 w-full">
          <p className="text-center text-xs text-rose-300">{content.login.footer}</p>
        </RevealItem>
      </RevealGroup>
    </FlowPage>
  )
}
