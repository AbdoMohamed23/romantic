import { useEffect, useState } from 'react'
import { useContent } from '../context/ContentContext'

function getDurationParts(startDate) {
  const start = new Date(startDate)
  const now = new Date()

  let years = now.getFullYear() - start.getFullYear()
  let months = now.getMonth() - start.getMonth()
  let days = now.getDate() - start.getDate()
  let hours = now.getHours() - start.getHours()
  let minutes = now.getMinutes() - start.getMinutes()
  let seconds = now.getSeconds() - start.getSeconds()

  if (seconds < 0) {
    seconds += 60
    minutes -= 1
  }
  if (minutes < 0) {
    minutes += 60
    hours -= 1
  }
  if (hours < 0) {
    hours += 24
    days -= 1
  }
  if (days < 0) {
    const previousMonth = new Date(now.getFullYear(), now.getMonth(), 0)
    days += previousMonth.getDate()
    months -= 1
  }
  if (months < 0) {
    months += 12
    years -= 1
  }

  return { years, months, days, hours, minutes, seconds }
}

const units = [
  { key: 'years', label: 'Years' },
  { key: 'months', label: 'Months' },
  { key: 'days', label: 'Days' },
  { key: 'hours', label: 'Hours' },
  { key: 'minutes', label: 'Minutes' },
  { key: 'seconds', label: 'Seconds' },
]

export default function CountdownTimer() {
  const { content } = useContent()
  const startDate = content.dates.relationshipStart

  const [duration, setDuration] = useState(() =>
    getDurationParts(startDate),
  )

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDuration(getDurationParts(startDate))
    }, 1000)

    return () => clearInterval(intervalId)
  }, [startDate])

  return (
    <div className="grid w-full max-w-2xl grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
      {units.map(({ key, label }) => (
        <div
          key={key}
          className="rounded-2xl border border-rose-100 bg-white/70 px-4 py-5 text-center shadow-sm"
        >
          <p className="text-2xl font-semibold text-rose-700 sm:text-3xl">
            {duration[key]}
          </p>
          <p className="mt-1 text-xs uppercase tracking-wider text-rose-400 sm:text-sm">
            {label}
          </p>
        </div>
      ))}
    </div>
  )
}
