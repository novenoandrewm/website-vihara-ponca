import { config } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import 'vitest-axe/extend-expect'

import id from '@/i18n/id.json'
import en from '@/i18n/en.json' // kalau file ini ada

Object.defineProperty(window.HTMLCanvasElement.prototype, 'getContext', {
  value: () => null,
})

const i18n = createI18n({
  legacy: false,
  locale: 'id',
  fallbackLocale: 'id',
  messages: { id, en },
})

config.global.plugins = [i18n]
config.global.stubs = {
  RouterLink: { props: ['to'], template: `<a :href="to"><slot /></a>` },
}
