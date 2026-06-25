import { Heart, Pause, Play, SkipBack, SkipForward } from 'lucide-react'
import { useMusic } from '../context/MusicContext'

function Waveform({ isPlaying }) {
  const bars = [0.45, 0.75, 1, 0.6, 0.85]

  return (
    <div className="flex h-8 items-end gap-0.5" aria-hidden="true">
      {bars.map((scale, index) => (
        <span
          key={index}
          className={`w-0.5 rounded-full bg-rose-400 ${isPlaying ? 'music-bar' : ''}`}
          style={{
            height: `${scale * 100}%`,
            animationDelay: isPlaying ? `${index * 0.12}s` : undefined,
          }}
        />
      ))}
    </div>
  )
}

export default function MusicPlayer() {
  const {
    hasSource,
    isPlaying,
    togglePlayback,
    musicTitle,
    progress,
    currentTimeLabel,
    durationLabel,
    seekTo,
    skipBackward,
    skipForward,
    duration,
  } = useMusic()

  const handleSeek = (event) => {
    if (!hasSource || !duration) return

    const rect = event.currentTarget.getBoundingClientRect()
    const ratio = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1)
    seekTo(ratio * duration)
  }

  return (
    <div
      dir="ltr"
      className="w-full rounded-full border border-white/70 bg-[#f7f2ee]/95 px-3 py-2.5 shadow-[0_10px_32px_-10px_rgba(190,18,60,0.28)] backdrop-blur-md sm:px-4"
    >
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-rose-100 to-pink-200 ring-2 ring-white">
          <Heart size={16} className="text-rose-500" fill="currentColor" />
        </div>

        <button
          type="button"
          onClick={skipBackward}
          disabled={!hasSource}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-rose-400 transition hover:bg-rose-50 disabled:opacity-40"
          aria-label="رجوع 10 ثواني"
        >
          <SkipBack size={16} />
        </button>

        <button
          type="button"
          onClick={togglePlayback}
          disabled={!hasSource}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#d9a8ad] text-white shadow-md transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label={isPlaying ? 'إيقاف' : 'تشغيل'}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
        </button>

        <button
          type="button"
          onClick={skipForward}
          disabled={!hasSource}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-rose-400 transition hover:bg-rose-50 disabled:opacity-40"
          aria-label="تقديم 10 ثواني"
        >
          <SkipForward size={16} />
        </button>

        <div className="min-w-0 flex-1">
          <p className="truncate text-right text-sm font-medium text-rose-900" dir="rtl">
            {hasSource ? musicTitle : 'ارفع ملف صوت من الداشبورد'}
          </p>

          <button
            type="button"
            onClick={handleSeek}
            disabled={!hasSource}
            className="mt-1.5 block w-full disabled:cursor-not-allowed"
            aria-label="شريط التقدم"
          >
            <span className="block h-1 overflow-hidden rounded-full bg-rose-100">
              <span
                className="block h-full rounded-full bg-rose-400 transition-[width] duration-150"
                style={{ width: `${progress * 100}%` }}
              />
            </span>
          </button>

          <div className="mt-1 flex items-center justify-between text-[10px] font-medium text-rose-400 sm:text-[11px]">
            <span>{currentTimeLabel}</span>
            <span>{durationLabel}</span>
          </div>
        </div>

        <div className="hidden shrink-0 sm:block">
          <Waveform isPlaying={isPlaying && hasSource} />
        </div>
      </div>
    </div>
  )
}
