import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Calendar,
  ExternalLink,
  Heart,
  Image,
  KeyRound,
  LogOut,
  Music2,
  RotateCcw,
  Sparkles,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import HeartBackground from '../components/HeartBackground'
import MemoryEditor from '../components/dashboard/MemoryEditor'
import {
  DateInput,
  Field,
  Section,
  TextArea,
  TextInput,
} from '../components/dashboard/DashboardFields'
import { useContent } from '../context/ContentContext'
import { useAdminAuth } from '../hooks/useAuth'

const TABS = [
  { id: 'general', label: 'عام', icon: KeyRound },
  { id: 'music', label: 'الموسيقى', icon: Music2 },
  { id: 'login', label: 'صفحة الدخول', icon: Heart },
  { id: 'welcome', label: 'الترحيب', icon: Sparkles },
  { id: 'story', label: 'القصة', icon: Calendar },
  { id: 'memories', label: 'الذكريات', icon: Image },
  { id: 'gallery', label: 'المعرض', icon: Image },
  { id: 'final', label: 'الصفحة الأخيرة', icon: Heart },
]

function AdminLoginForm({ onLogin }) {
  const { content } = useContent()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    if (password !== content.password) {
      setError('كلمة المرور غير صحيحة')
      return
    }
    onLogin(password)
  }

  return (
    <div className="romantic-bg relative min-h-dvh overflow-x-hidden">
      <HeartBackground density="normal" />
      <main className="relative z-10 flex min-h-dvh items-center justify-center px-5 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-3xl border border-rose-100 bg-white/90 p-8 shadow-xl"
        >
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-rose-50">
              <KeyRound className="text-rose-400" size={22} />
            </div>
            <h1 className="font-display text-2xl font-bold text-rose-900">
              {content.siteName}
            </h1>
            <p className="mt-2 text-sm text-rose-500">
              لوحة التحكم — أدخل كلمة المرور لإدارة المحتوى
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="كلمة المرور">
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError('')
                }}
                className="w-full rounded-xl border border-rose-100 px-3 py-2.5 text-sm outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
              />
            </Field>
            {error ? (
              <p className="text-center text-sm text-rose-500">{error}</p>
            ) : null}
            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-rose-400 to-pink-400 py-3 text-sm font-semibold text-white shadow-md"
            >
              دخول
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-rose-400">
            <Link to="/enter" className="underline hover:text-rose-600">
              الذهاب لصفحة الزائر
            </Link>
          </p>
        </motion.div>
      </main>
    </div>
  )
}

export default function Dashboard() {
  const { isAdmin, adminLoginWithPassword, adminLogout } = useAdminAuth()
  const {
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
  } = useContent()
  const [activeTab, setActiveTab] = useState('general')
  const [savedFlash, setSavedFlash] = useState(false)

  const handleAdminLogin = async (password) => {
    adminLoginWithPassword(password)
    if (isSupabaseConfigured) {
      await syncToCloud(password)
    }
  }

  const flashSaved = () => {
    setSavedFlash(true)
    window.setTimeout(() => setSavedFlash(false), 1500)
  }

  const handlePreview = () => {
    localStorage.setItem('romantic-site-authenticated', 'true')
    window.open('/welcome', '_blank')
  }

  if (!isAdmin) {
    return <AdminLoginForm onLogin={handleAdminLogin} />
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'general':
        return (
          <Section
            title="إعدادات عامة"
            description="اسم الموقع، كلمة المرور، والتواريخ المهمة"
          >
            <Field label="اسم الموقع" hint="يظهر في تبويب المتصفح ولوحة التحكم">
              <TextInput
                value={content.siteName}
                onChange={(v) => {
                  updateRoot('siteName', v)
                  flashSaved()
                }}
              />
            </Field>
            <Field label="كلمة مرور الموقع" hint="يستخدمها الزائر ولوحة التحكم">
              <TextInput
                value={content.password}
                onChange={(v) => {
                  updateRoot('password', v)
                  flashSaved()
                }}
              />
            </Field>
            <Field label="تاريخ بداية العلاقة">
              <DateInput
                value={content.dates.relationshipStart}
                onChange={(v) => {
                  updateDate('relationshipStart', `${v}T00:00:00`)
                  flashSaved()
                }}
              />
            </Field>
            <Field label="تاريخ أول لقاء">
              <DateInput
                value={content.dates.firstMeeting}
                onChange={(v) => {
                  updateDate('firstMeeting', v)
                  flashSaved()
                }}
              />
            </Field>
            <Field label="تاريخ الاعتراف بالحب">
              <DateInput
                value={content.dates.loveConfession}
                onChange={(v) => {
                  updateDate('loveConfession', v)
                  flashSaved()
                }}
              />
            </Field>
          </Section>
        )

      case 'music':
        return (
          <Section
            title="الموسيقى"
            description="الأغنية التي تُشغّل في الموقع"
          >
            <Field label="عنوان الأغنية">
              <TextInput
                value={content.music.title}
                onChange={(v) => {
                  updateField('music', 'title', v)
                  flashSaved()
                }}
              />
            </Field>
            <Field label="مستوى الصوت (0 - 1)">
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={content.music.volume}
                onChange={(e) => {
                  updateField('music', 'volume', Number(e.target.value))
                  flashSaved()
                }}
                className="w-full accent-rose-400"
              />
              <span className="text-xs text-rose-400">
                {Math.round(content.music.volume * 100)}%
              </span>
            </Field>
            <Field label="ملف الأغنية" hint={content.music.fileName}>
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-rose-200 bg-rose-50/50 px-4 py-6 text-sm text-rose-500 transition hover:border-rose-300">
                <Music2 size={18} />
                رفع ملف mp3 / ogg / wav
                <input
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      uploadMusic(file).then(flashSaved)
                    }
                    e.target.value = ''
                  }}
                />
              </label>
            </Field>
            {musicSrc ? (
              <audio controls src={musicSrc} className="w-full" />
            ) : (
              <p className="text-sm text-rose-400">لا يوجد ملف موسيقى حالياً</p>
            )}
          </Section>
        )

      case 'login':
        return (
          <Section
            title="صفحة دخول الزائر"
            description="النصوص التي تظهر عند فتح الهدية (/enter)"
          >
            {[
              ['eyebrow', 'العنوان الصغير'],
              ['title', 'العنوان الرئيسي'],
              ['subtitle', 'الوصف'],
              ['passwordLabel', 'تسمية كلمة المرور'],
              ['placeholder', 'نص الحقل الفارغ'],
              ['button', 'نص الزر'],
              ['error', 'رسالة الخطأ'],
              ['footer', 'نص التذييل'],
            ].map(([key, label]) => (
              <Field key={key} label={label}>
                {key === 'subtitle' ? (
                  <TextArea
                    value={content.login[key]}
                    onChange={(v) => {
                      updateField('login', key, v)
                      flashSaved()
                    }}
                  />
                ) : (
                  <TextInput
                    value={content.login[key]}
                    onChange={(v) => {
                      updateField('login', key, v)
                      flashSaved()
                    }}
                  />
                )}
              </Field>
            ))}
          </Section>
        )

      case 'welcome':
        return (
          <Section title="صفحة الترحيب" description="أول صفحة بعد الدخول">
            <Field label="العنوان الصغير">
              <TextInput
                value={content.welcome.eyebrow}
                onChange={(v) => {
                  updateField('welcome', 'eyebrow', v)
                  flashSaved()
                }}
              />
            </Field>
            <Field label="العنوان الرئيسي">
              <TextInput
                value={content.welcome.title}
                onChange={(v) => {
                  updateField('welcome', 'title', v)
                  flashSaved()
                }}
              />
            </Field>
            <Field label="النص">
              <TextArea
                value={content.welcome.subtitle}
                onChange={(v) => {
                  updateField('welcome', 'subtitle', v)
                  flashSaved()
                }}
                rows={4}
              />
            </Field>
            <Field label="زر التالي">
              <TextInput
                value={content.welcome.nextButton}
                onChange={(v) => {
                  updateField('welcome', 'nextButton', v)
                  flashSaved()
                }}
              />
            </Field>
          </Section>
        )

      case 'story':
        return (
          <Section title="صفحة القصة" description="العناوين ومحتوى الخط الزمني">
            <Field label="العنوان الصغير">
              <TextInput
                value={content.story.eyebrow}
                onChange={(v) => {
                  updateField('story', 'eyebrow', v)
                  flashSaved()
                }}
              />
            </Field>
            <Field label="العنوان الرئيسي">
              <TextInput
                value={content.story.title}
                onChange={(v) => {
                  updateField('story', 'title', v)
                  flashSaved()
                }}
              />
            </Field>

            <div className="rounded-xl border border-rose-100 bg-rose-50/30 p-4">
              <p className="mb-3 text-sm font-semibold text-rose-700">أول لقاء</p>
              <div className="space-y-3">
                <Field label="التسمية">
                  <TextInput
                    value={content.story.firstMeeting.label}
                    onChange={(v) => {
                      updateNestedField('story', 'firstMeeting', 'label', v)
                      flashSaved()
                    }}
                  />
                </Field>
                <Field label="الوصف">
                  <TextArea
                    value={content.story.firstMeeting.description}
                    onChange={(v) => {
                      updateNestedField('story', 'firstMeeting', 'description', v)
                      flashSaved()
                    }}
                  />
                </Field>
              </div>
            </div>

            <div className="rounded-xl border border-rose-100 bg-rose-50/30 p-4">
              <p className="mb-3 text-sm font-semibold text-rose-700">اعتراف الحب</p>
              <div className="space-y-3">
                <Field label="التسمية">
                  <TextInput
                    value={content.story.loveConfession.label}
                    onChange={(v) => {
                      updateNestedField('story', 'loveConfession', 'label', v)
                      flashSaved()
                    }}
                  />
                </Field>
                <Field label="الرسالة">
                  <TextArea
                    value={content.story.loveConfession.message}
                    onChange={(v) => {
                      updateNestedField('story', 'loveConfession', 'message', v)
                      flashSaved()
                    }}
                  />
                </Field>
              </div>
            </div>

            <Field label="زر الذكريات">
              <TextInput
                value={content.story.memoriesButton}
                onChange={(v) => {
                  updateField('story', 'memoriesButton', v)
                  flashSaved()
                }}
              />
            </Field>
            <p className="text-xs text-rose-400">
              صور ونصوص الذكريات في تبويب «الذكريات» — تظهر في القصة والمعرض معاً.
            </p>
          </Section>
        )

      case 'memories':
        return (
          <Section
            title="الذكريات"
            description="كل ذكرى: صورة + تاريخ + نص — تُستخدم في القصة والمعرض"
          >
            <div className="space-y-4">
              {content.memories.map((memory, index) => (
                <MemoryEditor
                  key={memory.id}
                  memory={memory}
                  index={index}
                  onChange={(id, patch) => {
                    updateMemory(id, patch)
                    flashSaved()
                  }}
                  onImageUpload={(id, file) => {
                    uploadMemoryImage(id, file).then(flashSaved)
                  }}
                  onRemove={removeMemory}
                  canRemove={content.memories.length > 1}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                addMemory()
                flashSaved()
              }}
              className="w-full rounded-xl border border-dashed border-rose-200 py-3 text-sm font-medium text-rose-500 transition hover:border-rose-300 hover:bg-rose-50"
            >
              + إضافة ذكرى جديدة
            </button>
          </Section>
        )

      case 'gallery':
        return (
          <Section title="صفحة المعرض" description="عناوين صفحة الألبوم">
            <Field label="العنوان الصغير">
              <TextInput
                value={content.gallery.eyebrow}
                onChange={(v) => {
                  updateField('gallery', 'eyebrow', v)
                  flashSaved()
                }}
              />
            </Field>
            <Field label="العنوان الرئيسي">
              <TextInput
                value={content.gallery.title}
                onChange={(v) => {
                  updateField('gallery', 'title', v)
                  flashSaved()
                }}
              />
            </Field>
            <Field label="زر التالي">
              <TextInput
                value={content.gallery.finalButton}
                onChange={(v) => {
                  updateField('gallery', 'finalButton', v)
                  flashSaved()
                }}
              />
            </Field>
          </Section>
        )

      case 'final':
        return (
          <Section title="الصفحة الأخيرة" description="الرسالة الختامية">
            <Field label="العنوان الصغير">
              <TextInput
                value={content.final.eyebrow}
                onChange={(v) => {
                  updateField('final', 'eyebrow', v)
                  flashSaved()
                }}
              />
            </Field>
            <Field label="العنوان الرئيسي">
              <TextInput
                value={content.final.title}
                onChange={(v) => {
                  updateField('final', 'title', v)
                  flashSaved()
                }}
              />
            </Field>
            <Field label="الرسالة">
              <TextArea
                value={content.final.text}
                onChange={(v) => {
                  updateField('final', 'text', v)
                  flashSaved()
                }}
                rows={6}
              />
            </Field>
          </Section>
        )

      default:
        return null
    }
  }

  return (
    <div className="romantic-bg relative min-h-dvh overflow-x-hidden">
      <HeartBackground density="normal" />

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-6 sm:px-6">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-rose-400">{content.siteName}</p>
            <h1 className="font-display text-2xl font-bold text-rose-900">
              لوحة التحكم
            </h1>
            <p className="text-sm text-rose-500">
              {savedFlash ? '✓ تم الحفظ تلقائياً' : 'التغييرات تُحفظ فوراً'}
              {isSupabaseConfigured ? (
                <span className="mt-1 block text-xs">
                  {syncStatus === 'loading' && '⏳ جاري الاتصال بـ Supabase...'}
                  {syncStatus === 'cloud' && '☁️ متصل بـ Supabase'}
                  {syncStatus === 'local' && '💾 محلي فقط — تحقق من الإعدادات'}
                  {syncError ? ` — ${syncError}` : ''}
                </span>
              ) : (
                <span className="mt-1 block text-xs text-rose-400">
                  Supabase غير مُعدّ — راجع ملف .env
                </span>
              )}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handlePreview}
              className="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-white px-3 py-2 text-xs font-medium text-rose-600 transition hover:bg-rose-50"
            >
              <ExternalLink size={14} />
              معاينة الموقع
            </button>
            <button
              type="button"
              onClick={() => {
                if (window.confirm('استعادة كل المحتوى للقيم الافتراضية؟')) {
                  resetToDefaults()
                  flashSaved()
                }
              }}
              className="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-white px-3 py-2 text-xs font-medium text-rose-500 transition hover:bg-rose-50"
            >
              <RotateCcw size={14} />
              استعادة
            </button>
            <button
              type="button"
              onClick={adminLogout}
              className="flex items-center gap-1.5 rounded-xl bg-rose-100 px-3 py-2 text-xs font-medium text-rose-600 transition hover:bg-rose-200"
            >
              <LogOut size={14} />
              خروج
            </button>
          </div>
        </header>

        <nav className="romantic-scrollbar mb-6 flex gap-2 overflow-x-auto pb-1">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium transition ${
                activeTab === id
                  ? 'bg-gradient-to-r from-rose-400 to-pink-400 text-white shadow-md'
                  : 'bg-white/80 text-rose-600 hover:bg-white'
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </nav>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          {renderTab()}
        </motion.div>

        <p className="mt-8 text-center text-xs text-rose-400">
          رابط الزائر:{' '}
          <Link to="/enter" className="underline">
            /enter
          </Link>
        </p>
      </div>
    </div>
  )
}
