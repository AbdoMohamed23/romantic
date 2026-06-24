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
import { getSeedContent, nextMemoryId } from '../utils/contentMerge'
import {
  getAdminPasswordForSync,
  loadSiteContent,
  pushContentToCloud,
  saveRemoteContent,
  uploadAsset,
} from '../utils/supabaseContent'

const ContentContext = createContext(null)

function resolveMusicSrc(content) {
  if (content.music.src?.startsWith('http')) return content.music.src
  return musicAsset || ''
}

export function ContentProvider({ children }) {
  const [content, setContent] = useState(() => getSeedContent())
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured)
  const [syncStatus, setSyncStatus] = useState(
    isSupabaseConfigured ? 'loading' : 'error',
  )
  const [syncError, setSyncError] = useState(
    isSupabaseConfigured ? '' : 'Supabase غير مُعدّ — أضف متغيرات البيئة على Vercel',
  )

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
      setSyncError('Supabase غير مُعدّ — لا يمكن الحفظ')
      return
    }

    const password = getAdminPasswordForSync()
    if (!password) {
      setSyncError('سجّل دخول الداشبورد لحفظ التغييرات')
      return
    }

    setContent(next)

    try {
      const saved = await saveRemoteContent(next, password)
      setContent(saved)
      setSyncStatus('cloud')
      setSyncError('')
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
    const id = nextMemoryId(content.memories)
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
        const image = await uploadAsset(file, 'memories')
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

  const uploadMusic = useCallback(
    async (file) => {
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
        setSyncError(error.message || 'فشل رفع الأغنية')
        throw error
      }
    },
    [content, persist],
  )

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
      updateField,
      updateNestedField,
      updateRoot,
      updateDate,
      updateMemory,
      addMemory,
      removeMemory,
      uploadMemoryImage,
      uploadMusic,
      resetToDefaults,
      syncToCloud,
    }),
    [
      content,
      musicSrc,
      isLoading,
      syncStatus,
      syncError,
      updateField,
      updateNestedField,
      updateRoot,
      updateDate,
      updateMemory,
      addMemory,
      removeMemory,
      uploadMemoryImage,
      uploadMusic,
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
