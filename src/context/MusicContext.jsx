import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { config } from '../data/config'
import { useContent } from './ContentContext'

const MUSIC_KEY = config.music.storageKey
const PENDING_KEY = config.music.pendingStartKey

const MusicContext = createContext(null)

function readMusicPreference() {
  const stored = localStorage.getItem(MUSIC_KEY)
  return stored === null ? null : stored === 'true'
}

export function MusicProvider({ children }) {
  const { content, musicSrc } = useContent()
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(() => readMusicPreference() === true)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !musicSrc) return
    audio.src = musicSrc
    audio.load()
  }, [musicSrc])

  const persistPreference = useCallback((playing) => {
    localStorage.setItem(MUSIC_KEY, String(playing))
    setIsPlaying(playing)
  }, [])

  const playMusic = useCallback(async () => {
    const audio = audioRef.current
    if (!audio || !musicSrc) return false

    audio.volume = content.music.volume

    try {
      await audio.play()
      persistPreference(true)
      return true
    } catch {
      persistPreference(false)
      return false
    }
  }, [content.music.volume, musicSrc, persistPreference])

  const pauseMusic = useCallback(() => {
    const audio = audioRef.current
    if (audio) audio.pause()
    persistPreference(false)
  }, [persistPreference])

  const togglePlayback = useCallback(async () => {
    if (isPlaying) {
      pauseMusic()
      return
    }

    await playMusic()
  }, [isPlaying, pauseMusic, playMusic])

  const requestMusicStart = useCallback(() => {
    sessionStorage.setItem(PENDING_KEY, 'true')
    localStorage.setItem(MUSIC_KEY, 'true')
    setIsPlaying(true)
  }, [])

  const tryWelcomeMusicStart = useCallback(async () => {
    const shouldStartFromLogin =
      sessionStorage.getItem(PENDING_KEY) === 'true'
    const prefersPlaying = readMusicPreference() === true

    if (!shouldStartFromLogin && !prefersPlaying) return

    if (shouldStartFromLogin) {
      sessionStorage.removeItem(PENDING_KEY)
    }

    await playMusic()
  }, [playMusic])

  const value = useMemo(
    () => ({
      audioRef,
      hasSource: Boolean(musicSrc),
      isPlaying,
      musicSrc,
      musicTitle: content.music.title,
      pauseMusic,
      playMusic,
      requestMusicStart,
      togglePlayback,
      tryWelcomeMusicStart,
    }),
    [
      content.music.title,
      isPlaying,
      musicSrc,
      pauseMusic,
      playMusic,
      requestMusicStart,
      togglePlayback,
      tryWelcomeMusicStart,
    ],
  )

  return (
    <MusicContext.Provider value={value}>
      {musicSrc ? (
        <audio ref={audioRef} src={musicSrc} loop preload="auto" />
      ) : null}
      {children}
    </MusicContext.Provider>
  )
}

export function useMusic() {
  const context = useContext(MusicContext)
  if (!context) {
    throw new Error('useMusic must be used within MusicProvider')
  }
  return context
}
