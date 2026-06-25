import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { defaultContent } from '../data/defaultContent'
import { musicAsset } from '../data/musicAsset'
import { isSupabaseConfigured } from '../lib/supabase'
import { getSeedContent, nextItemId } from '../utils/contentMerge'
import {
  getAdminPasswordForSync,
  isAudioFile,
  loadSiteContent,
  pushContentToCloud,
  saveRemoteContent,
  uploadAsset,
} from '../utils/supabaseContent'

const ContentContext = createContext(null)

function resolveMusicSrc(content) {
  if (content.music.src === '') return ''

  if (content.music.src?.startsWith('http')) {
    const version = encodeURIComponent(content.music.fileName || 'track')
    const joiner = content.music.src.includes('?') ? '&' : '?'
    return `${content.music.src}${joiner}v=${version}`
  }

  return musicAsset || ''
}

export function ContentProvider({ children }) {
  const [content, setContent] = useState(() => getSeedContent())
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured)
  const [syncStatus, setSyncStatus] = useState(
    isSupabaseConfigured ? 'loading' : 'error',
  )
  const [syncError, setSyncError] = useState(
    isSupabaseConfigured ? '' : 'تعذّر الاتصال بالخادم',
  )
  const [isMusicUploading, setIsMusicUploading] = useState(false)

  useEffect(() => {
    if (!isSupabaseConfigured) return

    let cancelled = false

    async function load() {
      try {
        const remote = await loadSiteContent()
        if (!cancelled) {
          setContent(remote)
          setSyncStatus('cloud')
          setSyncError('')
        }
      } catch (error) {
        if (!cancelled) {
          setSyncStatus('error')
          setSyncError(error.message || 'تعذّر تحميل المحتوى من Supabase')
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  const persist = useCallback(async (next) => {
    if (!isSupabaseConfigured) {
      const message = 'Supabase غير مُعدّ — لا يمكن الحفظ'
      setSyncError(message)
      throw new Error(message)
    }

    const password = getAdminPasswordForSync()
    if (!password) {
      const message = 'سجّل دخول الداشبورد لحفظ التغييرات'
      setSyncError(message)
      throw new Error(message)
    }

    setContent(next)

    try {
      const saved = await saveRemoteContent(next, password)
      setContent(saved)
      setSyncStatus('cloud')
      setSyncError('')
      return saved
    } catch (error) {
      setSyncStatus('error')
      setSyncError(
        error.message === 'invalid_password'
          ? 'كلمة المرور غير صحيحة'
          : error.message || 'فشل الحفظ على Supabase',
      )
      throw error
    }
  }, [])

  const updateField = useCallback(
    (section, field, value) => {
      persist({
        ...content,
        [section]: {
          ...content[section],
          [field]: value,
        },
      })
    },
    [content, persist],
  )

  const updateNestedField = useCallback(
    (section, nested, field, value) => {
      persist({
        ...content,
        [section]: {
          ...content[section],
          [nested]: {
            ...content[section][nested],
            [field]: value,
          },
        },
      })
    },
    [content, persist],
  )

  const updateRoot = useCallback(
    (field, value) => {
      persist({ ...content, [field]: value })
    },
    [content, persist],
  )

  const updateDate = useCallback(
    (field, value) => {
      persist({
        ...content,
        dates: { ...content.dates, [field]: value },
      })
    },
    [content, persist],
  )

  const updateMemory = useCallback(
    (id, patch) => {
      persist({
        ...content,
        memories: content.memories.map((memory) =>
          memory.id === id ? { ...memory, ...patch } : memory,
        ),
      })
    },
    [content, persist],
  )

  const addMemory = useCallback(() => {
    const id = nextItemId(content.memories)
    persist({
      ...content,
      memories: [
        ...content.memories,
        { id, image: '', date: '', text: '' },
      ],
    })
  }, [content, persist])

  const removeMemory = useCallback(
    (id) => {
      persist({
        ...content,
        memories: content.memories.filter((memory) => memory.id !== id),
      })
    },
    [content, persist],
  )

  const updateGalleryItem = useCallback(
    (id, patch) => {
      persist({
        ...content,
        galleryItems: (content.galleryItems ?? []).map((item) =>
          item.id === id ? { ...item, ...patch } : item,
        ),
      })
    },
    [content, persist],
  )

  const addGalleryItem = useCallback(() => {
    const id = nextItemId(content.galleryItems ?? [])
    persist({
      ...content,
      galleryItems: [
        ...(content.galleryItems ?? []),
        { id, image: '', date: '', text: '' },
      ],
    })
  }, [content, persist])

  const removeGalleryItem = useCallback(
    (id) => {
      persist({
        ...content,
        galleryItems: (content.galleryItems ?? []).filter((item) => item.id !== id),
      })
    },
    [content, persist],
  )

  const syncToCloud = useCallback(
    async (password = getAdminPasswordForSync()) => {
      if (!isSupabaseConfigured || !password) return false

      try {
        const saved = await pushContentToCloud(content, password)
        setContent(saved)
        setSyncStatus('cloud')
        setSyncError('')
        return true
      } catch (error) {
        setSyncStatus('error')
        setSyncError(error.message || 'فشل المزامنة مع Supabase')
        return false
      }
    },
    [content],
  )

  const uploadMemoryImage = useCallback(
    async (id, file) => {
      try {
        const image = await uploadAsset(file, 'story')
        await persist({
          ...content,
          memories: content.memories.map((memory) =>
            memory.id === id ? { ...memory, image } : memory,
          ),
        })
      } catch (error) {
        setSyncError(error.message || 'فشل رفع الصورة')
        throw error
      }
    },
    [content, persist],
  )

  const uploadGalleryImage = useCallback(
    async (id, file) => {
      try {
        const image = await uploadAsset(file, 'gallery')
        await persist({
          ...content,
          galleryItems: (content.galleryItems ?? []).map((item) =>
            item.id === id ? { ...item, image } : item,
          ),
        })
      } catch (error) {
        setSyncError(error.message || 'فشل رفع الصورة')
        throw error
      }
    },
    [content, persist],
  )

  const uploadMusic = useCallback(
    async (file) => {
      if (!isAudioFile(file)) {
        const error = new Error('الملف لازم يكون صوت (mp3, m4a, wav, ogg, flac...)')
        setSyncError(error.message)
        throw error
      }

      const password = getAdminPasswordForSync()
      if (!password) {
        const error = new Error('سجّل دخول الداشبورد لحفظ التغييرات')
        setSyncError(error.message)
        throw error
      }

      setIsMusicUploading(true)
      setSyncError('')

      try {
        const url = await uploadAsset(file, 'music')
        await persist({
          ...content,
          music: {
            ...content.music,
            src: url,
            fileName: file.name,
          },
        })
      } catch (error) {
        const message =
          error.message?.includes('mime') || error.message?.includes('not allowed')
            ? 'نوع الملف غير مدعوم على السيرفر — جرّب mp3 أو wav'
            : error.message || 'فشل رفع الأغنية'
        setSyncError(message)
        throw new Error(message)
      } finally {
        setIsMusicUploading(false)
      }
    },
    [content, persist],
  )

  const removeMusic = useCallback(async () => {
    setIsMusicUploading(true)
    setSyncError('')

    try {
      await persist({
        ...content,
        music: {
          ...content.music,
          src: '',
          fileName: '',
        },
      })
    } catch (error) {
      setSyncError(error.message || 'فشل حذف الأغنية')
      throw error
    } finally {
      setIsMusicUploading(false)
    }
  }, [content, persist])

  const resetToDefaults = useCallback(async () => {
    const next = structuredClone(defaultContent)
    const password = getAdminPasswordForSync()
    if (!password) {
      setSyncError('سجّل دخول الداشبورد أولاً')
      return
    }

    try {
      const saved = await saveRemoteContent(next, password)
      setContent(saved)
      setSyncStatus('cloud')
      setSyncError('')
    } catch (error) {
      setSyncStatus('error')
      setSyncError(error.message || 'فشل استعادة الإعدادات الافتراضية')
    }
  }, [])

  const musicSrc = resolveMusicSrc(content)

  const value = useMemo(
    () => ({
      content,
      musicSrc,
      isLoading,
      syncStatus,
      syncError,
      isSupabaseConfigured,
      isMusicUploading,
      updateField,
      updateNestedField,
      updateRoot,
      updateDate,
      updateMemory,
      addMemory,
      removeMemory,
      updateGalleryItem,
      addGalleryItem,
      removeGalleryItem,
      uploadMemoryImage,
      uploadGalleryImage,
      uploadMusic,
      removeMusic,
      resetToDefaults,
      syncToCloud,
    }),
    [
      content,
      musicSrc,
      isLoading,
      syncStatus,
      syncError,
      isMusicUploading,
      updateField,
      updateNestedField,
      updateRoot,
      updateDate,
      updateMemory,
      addMemory,
      removeMemory,
      updateGalleryItem,
      addGalleryItem,
      removeGalleryItem,
      uploadMemoryImage,
      uploadGalleryImage,
      uploadMusic,
      removeMusic,
      isMusicUploading,
      resetToDefaults,
      syncToCloud,
    ],
  )

  return (
    <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
  )
}

export function useContent() {
  const context = useContext(ContentContext)
  if (!context) {
    throw new Error('useContent must be used within ContentProvider')
  }
  return context
}
