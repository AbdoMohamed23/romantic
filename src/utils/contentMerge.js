import { defaultContent } from '../data/defaultContent'

function mergeSection(base, patch) {
  if (!patch) return base
  if (Array.isArray(base)) return patch
  return { ...base, ...patch }
}

export function mergeContent(stored) {
  if (!stored || Object.keys(stored).length === 0) {
    return structuredClone(defaultContent)
  }

  return {
    ...defaultContent,
    ...stored,
    siteName: stored.siteName || defaultContent.siteName,
    password: stored.password ?? defaultContent.password,
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
    galleryItems: Array.isArray(stored.galleryItems) ? stored.galleryItems : [],
  }
}

export function getSeedContent() {
  return structuredClone(defaultContent)
}

export function nextItemId(items) {
  return items.reduce((max, item) => Math.max(max, item.id), 0) + 1
}
