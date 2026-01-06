// src/i18n/index.ts
import { createI18n } from 'vue-i18n'
import { watch } from 'vue'
import { setOgLocale } from '@/utils/seo'
import id from './id.json'
import en from './en.json'

type AppLocale = 'id' | 'en'

function normalizeLocale(v: unknown): AppLocale {
  return v === 'en' ? 'en' : 'id'
}

const initial: AppLocale =
  typeof window !== 'undefined'
    ? normalizeLocale(window.localStorage.getItem('locale'))
    : 'id'

const i18n = createI18n({
  legacy: false,
  locale: initial,
  fallbackLocale: 'id',
  messages: { id, en },
})

watch(
  () => i18n.global.locale.value,
  (loc) => {
    const normalized = normalizeLocale(loc)
    if (loc !== normalized) {
      i18n.global.locale.value = normalized
      return
    }

    // persist
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('locale', normalized)
    }

    // <html lang="...">
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('lang', normalized)
    }

    // og:locale
    setOgLocale(normalized === 'id' ? 'id_ID' : 'en_US')
  },
  { immediate: true }
)

export default i18n
