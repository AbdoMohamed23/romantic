export function formatDateLong(dateString) {
  if (!dateString) return null

  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return null

  return new Intl.DateTimeFormat('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  }).format(date)
}
