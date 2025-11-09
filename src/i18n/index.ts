import { createI18n } from 'vue-i18n'
import id from './id.json'
import en from './en.json'

const saved = (localStorage.getItem('locale') as 'id' | 'en') ?? 'id'

const i18n = createI18n({
  legacy: false,
  locale: saved,
  fallbackLocale: 'en',
  messages: { id, en },
})

export default i18n
