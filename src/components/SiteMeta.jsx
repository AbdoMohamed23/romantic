import { useEffect } from 'react'
import { useContent } from '../context/ContentContext'

export default function SiteMeta() {
  const { content } = useContent()

  useEffect(() => {
    document.title = content.siteName || 'هدية حب'
  }, [content.siteName])

  return null
}
