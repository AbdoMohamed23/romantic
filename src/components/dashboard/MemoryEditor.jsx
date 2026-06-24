import { ImagePlus, Trash2 } from 'lucide-react'
import { DateInput, Field, TextArea } from './DashboardFields'

export default function MemoryEditor({
  memory,
  index,
  onChange,
  onImageUpload,
  onRemove,
  canRemove,
}) {
  return (
    <article className="rounded-xl border border-rose-100 bg-rose-50/40 p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-rose-700">ذكرى #{index + 1}</span>
        {canRemove ? (
          <button
            type="button"
            onClick={() => onRemove(memory.id)}
            className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-rose-400 transition hover:bg-rose-100 hover:text-rose-600"
          >
            <Trash2 size={14} />
            حذف
          </button>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-[120px_1fr]">
        <div>
          <div className="aspect-square overflow-hidden rounded-xl bg-gradient-to-br from-blush-100 to-rose-100">
            {memory.image ? (
              <img
                src={memory.image}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-2xl text-rose-300">
                ♥
              </div>
            )}
          </div>
          <label className="mt-2 flex cursor-pointer items-center justify-center gap-1 rounded-lg border border-dashed border-rose-200 bg-white px-2 py-2 text-xs text-rose-500 transition hover:border-rose-300 hover:text-rose-600">
            <ImagePlus size={14} />
            رفع صورة
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) onImageUpload(memory.id, file)
                e.target.value = ''
              }}
            />
          </label>
        </div>

        <div className="space-y-3">
          <Field label="التاريخ (اختياري)">
            <DateInput
              value={memory.date}
              onChange={(value) => onChange(memory.id, { date: value })}
            />
          </Field>
          <Field label="النص">
            <TextArea
              value={memory.text}
              onChange={(value) => onChange(memory.id, { text: value })}
              rows={3}
            />
          </Field>
        </div>
      </div>
    </article>
  )
}
