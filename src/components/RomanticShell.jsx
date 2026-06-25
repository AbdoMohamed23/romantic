import { useEffect } from 'react'
import BackButton from './BackButton'
import HeartBackground from './HeartBackground'
import MusicPlayer from './MusicPlayer'
import { useMusic } from '../context/MusicContext'

export default function RomanticShell({
  children,
  showMusic = false,
  showBack = false,
  onBack,
}) {
  const { tryWelcomeMusicStart } = useMusic()

  useEffect(() => {
    if (showMusic) {
      tryWelcomeMusicStart()
    }
  }, [showMusic, tryWelcomeMusicStart])

  return (
    <div className="romantic-bg relative min-h-dvh overflow-x-hidden font-sans">
      <HeartBackground />

      {showBack ? (
        <div
          className="pointer-events-none fixed inset-x-0 z-40 flex justify-center px-5 sm:px-6"
          style={{ top: 'max(0.75rem, env(safe-area-inset-top))' }}
        >
          <div className="flow-screen pointer-events-auto flex w-full justify-start">
            <BackButton onClick={onBack} />
          </div>
        </div>
      ) : null}

      <div className="relative z-10 flex min-h-dvh flex-col">
        <main
          className="flex w-full flex-1 flex-col items-center justify-start overflow-x-hidden px-5 py-10 sm:px-6"
          style={{
            paddingBottom: 'calc(6.5rem + env(safe-area-inset-bottom))',
          }}
        >
          {children}
        </main>
      </div>

      {showMusic ? (
        <div
          className="pointer-events-none fixed inset-x-0 z-50 flex justify-center px-5 sm:px-6"
          style={{ bottom: 'max(1rem, env(safe-area-inset-bottom))' }}
        >
          <div className="flow-screen pointer-events-auto w-full">
            <MusicPlayer />
          </div>
        </div>
      ) : null}
    </div>
  )
}
