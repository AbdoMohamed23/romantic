import { defaultContent } from '../data/defaultContent'

export const CONTENT_STORAGE_KEY = 'romantic-site-content'

function mergeSection(base, patch) {
  if (!patch) return base
  if (Array.isArray(base)) return patch
  return { ...base, ...patch }
}

export function mergeContent(stored) {
  if (!stored) return structuredClone(defaultContent)

  return {
    ...defaultContent,
    ...stored,
    siteName: stored.siteName || defaultContent.siteName,
    password:
      stored.password === 'love' ? defaultContent.password : stored.password ?? defaultContent.password,
    dates: mergeSection(defaultContent.dates, stored.dates),
    music: mergeSection(defaultContent.music, stored.music),
    login: mergeSection(defaultContent.login, stored.login),
    welcome: mergeSection(defaultContent.welcome, stored.welcome),
    story: {
      ...defaultContent.story,
      ...stored.story,
      firstMeeting: mergeSection(
        defaultContent.story.firstMeeting,
        stored.story?.firstMeeting,
      ),
      loveConfession: mergeSection(
        defaultContent.story.loveConfession,
        stored.story?.loveConfession,
      ),
    },
    gallery: mergeSection(defaultContent.gallery, stored.gallery),
    final: mergeSection(defaultContent.final, stored.final),
    memories: stored.memories?.length ? stored.memories : defaultContent.memories,
  }
}

export function loadContent() {
  try {
    const raw = localStorage.getItem(CONTENT_STORAGE_KEY)
    if (!raw) return structuredClone(defaultContent)
    const stored = JSON.parse(raw)
    const merged = mergeContent(stored)
    if (!stored.siteName || stored.password === 'love') {
      saveContent(merged)
    }
    return merged
  } catch {
    return structuredClone(defaultContent)
  }
}

export function saveContent(content) {
  const toStore = {
    ...content,
    music: {
      ...content.music,
      src: content.music.src?.startsWith('data:') ? content.music.src : '',
    },
  }
  localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(toStore))
}

export function resetStoredContent() {
  localStorage.removeItem(CONTENT_STORAGE_KEY)
}

export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export function nextMemoryId(memories) {
  return memories.reduce((max, item) => Math.max(max, item.id), 0) + 1
}
