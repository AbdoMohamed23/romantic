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
import {
  fileToDataUrl,
  loadContent,
  nextMemoryId,
  resetStoredContent,
  saveContent,
} from '../utils/contentStorage'
import {
  cacheContentLocally,
  fetchRemoteContent,
  getAdminPasswordForSync,
  migrateLocalToRemote,
  pushContentToCloud,
  saveRemoteContent,
  uploadAsset,
} from '../utils/supabaseContent'

const ContentContext = createContext(null)

function resolveMusicSrc(content) {
  if (content.music.src?.startsWith('data:')) return content.music.src
  if (content.music.src?.startsWith('http')) return content.music.src
  return musicAsset || content.music.src || ''
}

export function ContentProvider({ children }) {
  const [content, setContent] = useState(loadContent)
  const [syncStatus, setSyncStatus] = useState(
    isSupabaseConfigured ? 'loading' : 'local',
  )
  const [syncError, setSyncError] = useState('')
  const initialLoadDone = useRef(false)

  useEffect(() => {
    if (!isSupabaseConfigured || initialLoadDone.current) return

    let cancelled = false

    async function loadRemote() {
      try {
        const remote = await fetchRemoteContent()
        if (cancelled) return

        if (remote) {
          setContent(remote)
          cacheContentLocally(remote)
          setSyncStatus('cloud')
        } else {
          const password = getAdminPasswordForSync()
          if (password) {
            const migrated = await migrateLocalToRemote(password)
            if (!cancelled) {
              setContent(migrated)
              cacheContentLocally(migrated)
            }
          }
          setSyncStatus('cloud')
        }
        setSyncError('')
      } catch (error) {
        if (!cancelled) {
          setSyncStatus('local')
          setSyncError(error.message || 'تعذّر الاتصال بـ Supabase')
        }
      } finally {
        initialLoadDone.current = true
      }
    }

    loadRemote()
    return () => {
      cancelled = true
    }
  }, [])

  const persist = useCallback(async (next) => {
    setContent(next)
    cacheContentLocally(next)

    if (!isSupabaseConfigured) return

    try {
      const password = getAdminPasswordForSync()
      if (!password) {
        setSyncStatus('local')
        setSyncError('سجّل دخول الداشبورد لحفظ التغييرات على السحابة')
        return
      }

      await saveRemoteContent(next, password)
      setSyncStatus('cloud')
      setSyncError('')
    } catch (error) {
      setSyncStatus('local')
      setSyncError(
        error.message === 'invalid_password'
          ? 'كلمة المرور غير صحيحة للحفظ على السحابة'
          : error.message || 'فشل الحفظ على Supabase',
      )
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

  const syncToCloud = useCallback(async (password = getAdminPasswordForSync()) => {
    if (!isSupabaseConfigured || !password) return false

    try {
      await pushContentToCloud(content, password)
      setSyncStatus('cloud')
      setSyncError('')
      return true
    } catch (error) {
      setSyncStatus('local')
      setSyncError(error.message || 'فشل المزامنة مع Supabase')
      return false
    }
  }, [content])

  const uploadMemoryImage = useCallback(
    async (id, file) => {
      try {
        const image = isSupabaseConfigured
          ? await uploadAsset(file, 'memories')
          : await fileToDataUrl(file)

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
        if (isSupabaseConfigured) {
          const url = await uploadAsset(file, 'music')
          await persist({
            ...content,
            music: {
              ...content.music,
              src: url,
              fileName: file.name,
            },
          })
          return
        }
        const dataUrl = await fileToDataUrl(file)
        await persist({
          ...content,
          music: {
            ...content.music,
            src: dataUrl,
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

  const resetToDefaults = useCallback(() => {
    const next = structuredClone(defaultContent)
    resetStoredContent()
    setContent(next)
    persist(next)
  }, [persist])

  const musicSrc = resolveMusicSrc(content)

  const value = useMemo(
    () => ({
      content,
      musicSrc,
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
