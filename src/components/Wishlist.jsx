import { Heart } from 'lucide-react'
import { motion } from 'framer-motion'
import { useContent } from '../context/ContentContext'

export default function Wishlist() {
  const { content, toggleWishlistItem } = useContent()
  const wishlist = content.wishlist ?? []

  const handleToggle = (id) => {
    toggleWishlistItem(id)
  }

  const completedCount = wishlist.filter((item) => item.completed).length
  const progressPercent = wishlist.length > 0 ? Math.round((completedCount / wishlist.length) * 100) : 0

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-6 md:py-10 pointer-events-auto">
      {/* Header Info */}
      <div className="text-center mb-8">
        <h1 className="font-display text-3xl font-bold text-rose-900 mb-2">
          حاجات نفسي نعملها سوا
        </h1>
        <p className="text-sm text-rose-500 max-w-sm mx-auto">
          أحلام صغيرة وحاجات حلوة بنتمناها، وكل ما نعمل حاجة منهم هنعلم عليها سوا ♥
        </p>
      </div>

      {/* Progress Bar */}
      <div className="glass-card rounded-2xl p-4 mb-6 text-center">
        <div className="flex justify-between items-center mb-2 text-xs font-semibold text-rose-700">
          <span>{completedCount} من {wishlist.length} خلصناهم</span>
          <span>{progressPercent}%</span>
        </div>
        <div className="w-full h-2.5 bg-rose-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-rose-400 to-pink-500 rounded-full"
          />
        </div>
      </div>

      {/* Wishlist Items List */}
      <div className="space-y-3.5 max-h-[50dvh] overflow-y-auto pr-1 hide-scrollbar">
        {wishlist.length === 0 ? (
          <div className="glass-card rounded-2xl py-12 text-center text-rose-400">
            <Heart className="mx-auto mb-2 text-rose-300" size={32} />
            <p className="text-sm">لا يوجد عناصر في القائمة بعد.</p>
          </div>
        ) : (
          wishlist.map((item) => (
            <motion.div
              key={item.id}
              onClick={() => handleToggle(item.id)}
              className={`glass-card rounded-2xl p-4 flex items-center justify-between gap-4 cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:bg-white/80 ${
                item.completed ? 'border-rose-200/60 bg-white/40' : ''
              }`}
              layoutId={`wishlist-item-${item.id}`}
            >
              {/* Checkbox Heart */}
              <button
                type="button"
                className="focus:outline-none shrink-0"
                aria-label={item.completed ? 'إلغاء التحديد' : 'تحديد المنجز'}
              >
                <motion.div
                  animate={{ scale: item.completed ? [1, 1.25, 1] : 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Heart
                    size={22}
                    className={`transition-colors duration-300 ${
                      item.completed ? 'text-rose-500 fill-rose-500' : 'text-rose-300 hover:text-rose-400'
                    }`}
                  />
                </motion.div>
              </button>

              {/* Text */}
              <span
                className={`flex-1 text-right text-sm leading-relaxed transition-all duration-300 font-medium ${
                  item.completed ? 'text-rose-400 line-through' : 'text-rose-900'
                }`}
                dir="rtl"
              >
                {item.text}
              </span>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
