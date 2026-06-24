import { motion } from 'framer-motion'
import { Music2, Pause, Play } from 'lucide-react'
import { useMusic } from '../context/MusicContext'

export default function MusicPlayer() {
  const { hasSource, isPlaying, togglePlayback, musicTitle } = useMusic()

  return (
    <motion.div
      initial={{ y: 100, opacity: 0, scale: 0.92 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
      className="fixed inset-x-4 z-50 mx-auto max-w-md sm:inset-x-6"
      style={{ bottom: 'max(1.25rem, calc(1rem + env(safe-area-inset-bottom)))' }}
    >
      <div
        dir="ltr"
        className="flex items-center gap-3 rounded-3xl border border-white/60 bg-white/75 px-4 py-3 shadow-[0_12px_40px_-12px_rgba(244,114,182,0.55)] backdrop-blur-xl"
      >
        <motion.button
          type="button"
          onClick={togglePlayback}
          disabled={!hasSource}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-rose-400 via-pink-400 to-rose-500 text-white shadow-lg shadow-rose-300/50 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label={isPlaying ? 'Pause music' : 'Play music'}
        >
          <motion.span
            key={isPlaying ? 'pause' : 'play'}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
          </motion.span>
          {isPlaying ? (
            <motion.span
              className="absolute inset-0 rounded-full border-2 border-rose-300/60"
              animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          ) : null}
        </motion.button>

        <div className="min-w-0 flex-1 text-left">
          <div className="flex items-center gap-1.5">
            <Music2 size={13} className="shrink-0 text-rose-400" />
            <p className="text-[11px] font-medium text-rose-400">
              {hasSource ? 'Now playing' : 'No music file'}
            </p>
          </div>
          <p className="truncate text-sm font-semibold text-rose-800">
            {hasSource ? musicTitle : 'Add romantic.mp3'}
          </p>
        </div>
      </div>
    </motion.div>
  )
}
