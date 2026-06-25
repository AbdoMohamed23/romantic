import { useEffect } from 'react'
import HeartBackground from './HeartBackground'
import MusicPlayer from './MusicPlayer'
import { useMusic } from '../context/MusicContext'

export default function RomanticShell({ children, showMusic = false }) {
  const { tryWelcomeMusicStart } = useMusic()

  useEffect(() => {
    if (showMusic) {
      tryWelcomeMusicStart()
    }
  }, [showMusic, tryWelcomeMusicStart])

  return (
    <div className="romantic-bg relative min-h-dvh overflow-x-hidden font-sans">
      <HeartBackground />

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
