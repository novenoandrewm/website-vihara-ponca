import './styles/base.css'
import { createApp, nextTick } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './store'
import i18n from './i18n'
import { upsertJsonLd, orgSchema } from '@/utils/structured'

const app = createApp(App)
app.use(router).use(pinia).use(i18n)

router.isReady().then(async () => {
  app.mount('#app')
  // pastikan DOM siap, lalu sisipkan JSON-LD
  await nextTick()
  upsertJsonLd('org', orgSchema())
})
