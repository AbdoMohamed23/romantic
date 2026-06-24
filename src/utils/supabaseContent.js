import { ASSETS_BUCKET, isSupabaseConfigured, supabase } from '../lib/supabase'
import { defaultContent } from '../data/defaultContent'
import { mergeContent, saveContent as saveLocalContent } from './contentStorage'

const ADMIN_PASSWORD_KEY = 'romantic-site-admin-password'

export function setAdminPasswordForSync(password) {
  if (password) {
    sessionStorage.setItem(ADMIN_PASSWORD_KEY, password)
  } else {
    sessionStorage.removeItem(ADMIN_PASSWORD_KEY)
  }
}

export function getAdminPasswordForSync() {
  return sessionStorage.getItem(ADMIN_PASSWORD_KEY) || ''
}

function stripHeavyFields(content) {
  return {
    ...content,
    music: {
      ...content.music,
      src:
        content.music.src?.startsWith('data:') || content.music.src?.startsWith('http')
          ? content.music.src
          : '',
    },
    memories: content.memories.map((memory) => ({
      ...memory,
      image:
        memory.image?.startsWith('data:') || memory.image?.startsWith('http')
          ? memory.image
          : '',
    })),
  }
}

export async function fetchRemoteContent() {
  if (!isSupabaseConfigured || !supabase) return null

  const { data, error } = await supabase.rpc('get_site_content')
  if (error) throw error

  const payload = data && typeof data === 'object' && Object.keys(data).length > 0 ? data : null
  return payload ? mergeContent(payload) : null
}

export async function saveRemoteContent(content, password = getAdminPasswordForSync()) {
  if (!isSupabaseConfigured || !supabase) return false
  if (!password) return false

  const payload = stripHeavyFields(content)
  const { error } = await supabase.rpc('save_site_content', {
    p_password: password,
    p_content: payload,
  })

  if (error) {
    if (error.message?.includes('invalid_password')) {
      throw new Error('invalid_password')
    }
    throw error
  }

  return true
}

function guessMimeType(file) {
  if (file.type) return file.type

  const extension = file.name.split('.').pop()?.toLowerCase()
  const map = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    gif: 'image/gif',
    mp3: 'audio/mpeg',
    mpeg: 'audio/mpeg',
    ogg: 'audio/ogg',
    wav: 'audio/wav',
  }

  return map[extension] || 'application/octet-stream'
}

export async function uploadAsset(file, folder) {
  if (!isSupabaseConfigured || !supabase) return null

  const extension = file.name.split('.').pop()?.toLowerCase() || 'bin'
  const path = `${folder}/${crypto.randomUUID()}.${extension}`
  const contentType = guessMimeType(file)

  const { error } = await supabase.storage.from(ASSETS_BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: true,
    contentType,
  })

  if (error) throw error

  const { data } = supabase.storage.from(ASSETS_BUCKET).getPublicUrl(path)
  return data.publicUrl
}

export async function pushContentToCloud(content, password) {
  await saveRemoteContent(content, password)
  cacheContentLocally(content)
  return content
}

export async function migrateLocalToRemote(password) {
  const raw = localStorage.getItem('romantic-site-content')
  const local = raw ? mergeContent(JSON.parse(raw)) : structuredClone(defaultContent)
  await saveRemoteContent(local, password)
  return local
}

export function cacheContentLocally(content) {
  saveLocalContent(content)
}
