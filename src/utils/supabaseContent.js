import { ASSETS_BUCKET, isSupabaseConfigured, supabase } from '../lib/supabase'
import { compressImageFile } from './compressImage'
import { getSeedContent, mergeContent } from './contentMerge'

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

function stripUrlField(value) {
  return value?.startsWith('http') ? value : ''
}

function stripHeavyFields(content) {
  return {
    ...content,
    music: {
      ...content.music,
      src: stripUrlField(content.music.src),
    },
    memories: content.memories.map((memory) => ({
      ...memory,
      image: stripUrlField(memory.image),
    })),
    galleryItems: (content.galleryItems ?? []).map((item) => ({
      ...item,
      image: stripUrlField(item.image),
    })),
  }
}

function isEmptyRemotePayload(data) {
  return !data || typeof data !== 'object' || Object.keys(data).length === 0
}

export async function fetchRemoteContent() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('تعذّر الاتصال بالخادم')
  }

  const { data, error } = await supabase.rpc('get_site_content')
  if (error) throw error

  if (isEmptyRemotePayload(data)) return null
  return mergeContent(data)
}

export async function saveRemoteContent(content, password) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('تعذّر الاتصال بالخادم')
  }
  if (!password) {
    throw new Error('كلمة المرور مطلوبة للحفظ')
  }

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

  return mergeContent(payload)
}

export async function seedRemoteContentIfEmpty() {
  const existing = await fetchRemoteContent()
  if (existing) return existing

  const seed = getSeedContent()
  await saveRemoteContent(seed, seed.password)
  return mergeContent(seed)
}

export async function loadSiteContent() {
  return (await fetchRemoteContent()) ?? seedRemoteContentIfEmpty()
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
    mpga: 'audio/mpeg',
    ogg: 'audio/ogg',
    wav: 'audio/wav',
    wave: 'audio/wav',
    m4a: 'audio/mp4',
    mp4: 'audio/mp4',
    aac: 'audio/aac',
    flac: 'audio/flac',
    webm: 'audio/webm',
    weba: 'audio/webm',
    opus: 'audio/opus',
    amr: 'audio/amr',
    mid: 'audio/midi',
    midi: 'audio/midi',
  }

  return map[extension] || 'application/octet-stream'
}

export function isAudioFile(file) {
  if (!file) return false
  if (file.type.startsWith('audio/')) return true

  const extension = file.name.split('.').pop()?.toLowerCase()
  return /^(mp3|mpeg|mpga|ogg|wav|wave|m4a|mp4|aac|flac|webm|weba|opus|amr|mid|midi)$/.test(
    extension || '',
  )
}

export async function uploadAsset(file, folder) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('تعذّر رفع الملف')
  }

  const prepared = file.type?.startsWith('image/')
    ? await compressImageFile(file)
    : file

  const extension = prepared.name.split('.').pop()?.toLowerCase() || 'bin'
  const path = `${folder}/${crypto.randomUUID()}.${extension}`
  const contentType = guessMimeType(prepared)

  const { error } = await supabase.storage.from(ASSETS_BUCKET).upload(path, prepared, {
    cacheControl: '31536000',
    upsert: true,
    contentType,
  })

  if (error) throw error

  const { data } = supabase.storage.from(ASSETS_BUCKET).getPublicUrl(path)
  return data.publicUrl
}

export async function pushContentToCloud(content, password) {
  return saveRemoteContent(content, password)
}
