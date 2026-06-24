import { useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Outlet, useLocation } from 'react-router-dom'
import HeartBackground from './HeartBackground'
import MusicPlayer from './MusicPlayer'
import PageTransition from './PageTransition'
import { useMusic } from '../context/MusicContext'

export default function Layout() {
  const location = useLocation()
  const { tryWelcomeMusicStart } = useMusic()

  useEffect(() => {
    tryWelcomeMusicStart()
  }, [location.pathname, tryWelcomeMusicStart])

  return (
    <div className="romantic-bg relative min-h-dvh overflow-x-hidden">
      <HeartBackground
        density={location.pathname === '/story' ? 'high' : 'normal'}
      />

      <div className="relative z-10 flex min-h-dvh flex-col">
        <main
          className="flex w-full flex-1 flex-col items-center overflow-x-hidden px-5 pt-6 sm:px-6"
          style={{
            paddingBottom: 'calc(6.5rem + env(safe-area-inset-bottom))',
          }}
        >
          <AnimatePresence initial={false}>
            <PageTransition key={location.pathname}>
              <Outlet />
            </PageTransition>
          </AnimatePresence>
        </main>
      </div>

      <MusicPlayer />
    </div>
  )
}
