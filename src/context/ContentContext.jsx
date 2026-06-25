import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { defaultContent } from '../data/defaultContent'
import { musicAsset } from '../data/musicAsset'
import { isSupabaseConfigured } from '../lib/supabase'
import { getSeedContent, nextItemId } from '../utils/contentMerge'
import { applySiteTheme } from '../utils/theme'
import ThemeApplier from '../components/ThemeApplier'
import {
  isAudioFile,
  loadSiteContent,
  saveRemoteContent,
  setAdminPasswordForSync,
  uploadAsset,
  verifySitePassword,
} from '../utils/supabaseContent'

const ContentContext = createContext(null)

function createInitialContent() {
  return getSeedContent()
}

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
  const [content, setContent] = useState(createInitialContent)
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured)
  const [isDirty, setIsDirty] = useState(false)
  const [syncStatus, setSyncStatus] = useState(
    isSupabaseConfigured ? 'loading' : 'error',
  )
  const [syncError, setSyncError] = useState(
    isSupabaseConfigured ? '' : 'تعذّر الاتصال بالخادم',
  )
  const [isMusicUploading, setIsMusicUploading] = useState(false)
  const contentRef = useRef(content)

  useEffect(() => {
    contentRef.current = content
  }, [content])

  const patchContent = useCallback((updater) => {
    setContent((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      contentRef.current = next
      return next
    })
    setIsDirty(true)
    setSyncStatus((status) => (status === 'error' ? 'error' : 'ready'))
  }, [])

  const applyLoadedContent = useCallback((remote) => {
    applySiteTheme(remote.appearance)
    contentRef.current = remote
    setContent(remote)
    setIsDirty(false)
    setSyncStatus('ready')
    setSyncError('')
  }, [])

  const loadFromDatabase = useCallback(async () => {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase غير مُعدّ')
    }

    setSyncStatus('loading')
    setSyncError('')

    try {
      const remote = await loadSiteContent()
      applyLoadedContent(remote)
      return remote
    } catch (error) {
      setSyncStatus('error')
      setSyncError(error.message || 'تعذّر تحميل المحتوى من Supabase')
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [applyLoadedContent])

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setIsLoading(false)
      return
    }

    loadFromDatabase().catch(() => {})
  }, [loadFromDatabase])

  const saveChanges = useCallback(async (password) => {
    if (!isSupabaseConfigured) {
      const message = 'Supabase غير مُعدّ — لا يمكن الحفظ'
      setSyncError(message)
      throw new Error(message)
    }

    if (!password) {
      const message = 'سجّل خروج ثم ادخل من جديد بكلمة المرور الحالية'
      setSyncError(message)
      throw new Error(message)
    }

    const snapshot = contentRef.current
    setSyncStatus('saving')
    setSyncError('')

    try {
      await saveRemoteContent(snapshot, password)

      const nextLoginPassword =
        snapshot.password && snapshot.password !== password ? snapshot.password : null

      if (nextLoginPassword) {
        setAdminPasswordForSync(nextLoginPassword)
      }

      setIsDirty(false)
      setSyncStatus('ready')
      return { nextLoginPassword }
    } catch (error) {
      setSyncStatus('error')
      setSyncError(
        error.message === 'invalid_password'
          ? 'كلمة مرور الدخول لا تطابق قاعدة البيانات — اضغط خروج وادخل بالكلمة المسجّلة حالياً في قاعدة البيانات'
          : error.message || 'فشل الحفظ على Supabase',
      )
      throw error
    }
  }, [])

  const verifyPassword = useCallback(async (password) => {
    if (!isSupabaseConfigured) {
      throw new Error('تعذّر الاتصال بالخادم')
    }
    return verifySitePassword(password)
  }, [])

  const updateField = useCallback(
    (section, field, value) => {
      patchContent((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      }))
    },
    [patchContent],
  )

  const updateNestedField = useCallback(
    (section, nested, field, value) => {
      patchContent((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [nested]: {
            ...prev[section][nested],
            [field]: value,
          },
        },
      }))
    },
    [patchContent],
  )

  const updateRoot = useCallback(
    (field, value) => {
      patchContent((prev) => ({ ...prev, [field]: value }))
    },
    [patchContent],
  )

  const updateDate = useCallback(
    (field, value) => {
      patchContent((prev) => ({
        ...prev,
        dates: { ...prev.dates, [field]: value },
      }))
    },
    [patchContent],
  )

  const updateMemory = useCallback(
    (id, patch) => {
      patchContent((prev) => ({
        ...prev,
        memories: prev.memories.map((memory) =>
          memory.id === id ? { ...memory, ...patch } : memory,
        ),
      }))
    },
    [patchContent],
  )

  const addMemory = useCallback(() => {
    patchContent((prev) => {
      const id = nextItemId(prev.memories)
      return {
        ...prev,
        memories: [...prev.memories, { id, image: '', date: '', text: '' }],
      }
    })
  }, [patchContent])

  const removeMemory = useCallback(
    (id) => {
      patchContent((prev) => ({
        ...prev,
        memories: prev.memories.filter((memory) => memory.id !== id),
      }))
    },
    [patchContent],
  )

  const updateGalleryItem = useCallback(
    (id, patch) => {
      patchContent((prev) => ({
        ...prev,
        galleryItems: (prev.galleryItems ?? []).map((item) =>
          item.id === id ? { ...item, ...patch } : item,
        ),
      }))
    },
    [patchContent],
  )

  const addGalleryItem = useCallback(() => {
    patchContent((prev) => {
      const id = nextItemId(prev.galleryItems ?? [])
      return {
        ...prev,
        galleryItems: [
          ...(prev.galleryItems ?? []),
          { id, image: '', date: '', text: '' },
        ],
      }
    })
  }, [patchContent])

  const removeGalleryItem = useCallback(
    (id) => {
      patchContent((prev) => ({
        ...prev,
        galleryItems: (prev.galleryItems ?? []).filter((item) => item.id !== id),
      }))
    },
    [patchContent],
  )

  const uploadMemoryImage = useCallback(
    async (id, file) => {
      const image = await uploadAsset(file, 'story')
      patchContent((prev) => ({
        ...prev,
        memories: prev.memories.map((memory) =>
          memory.id === id ? { ...memory, image } : memory,
        ),
      }))
      return image
    },
    [patchContent],
  )

  const uploadGalleryImage = useCallback(
    async (id, file) => {
      const image = await uploadAsset(file, 'gallery')
      patchContent((prev) => ({
        ...prev,
        galleryItems: (prev.galleryItems ?? []).map((item) =>
          item.id === id ? { ...item, image } : item,
        ),
      }))
      return image
    },
    [patchContent],
  )

  const uploadMusic = useCallback(
    async (file) => {
      if (!isAudioFile(file)) {
        throw new Error('الملف لازم يكون صوت (mp3, m4a, wav, ogg, flac...)')
      }

      setIsMusicUploading(true)
      setSyncError('')

      try {
        const url = await uploadAsset(file, 'music')
        patchContent((prev) => ({
          ...prev,
          music: {
            ...prev.music,
            src: url,
            fileName: file.name,
          },
        }))
        return url
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
    [patchContent],
  )

  const removeMusic = useCallback(() => {
    patchContent((prev) => ({
      ...prev,
      music: {
        ...prev.music,
        src: '',
        fileName: '',
      },
    }))
  }, [patchContent])

  const resetToDefaults = useCallback(() => {
    const next = structuredClone(defaultContent)
    contentRef.current = next
    setContent(next)
    applySiteTheme(next.appearance)
    setIsDirty(true)
    setSyncStatus('ready')
    setSyncError('')
  }, [])

  const musicSrc = resolveMusicSrc(content)

  const value = useMemo(
    () => ({
      content,
      musicSrc,
      isLoading,
      isDirty,
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
      saveChanges,
      loadFromDatabase,
      verifyPassword,
    }),
    [
      content,
      musicSrc,
      isLoading,
      isDirty,
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
      resetToDefaults,
      saveChanges,
      loadFromDatabase,
      verifyPassword,
    ],
  )

  return (
    <ContentContext.Provider value={value}>
      <ThemeApplier appearance={content.appearance} />
      {children}
    </ContentContext.Provider>
  )
}

export function useContent() {
  const context = useContext(ContentContext)
  if (!context) {
    throw new Error('useContent must be used within ContentProvider')
  }
  return context
}
