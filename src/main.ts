import './styles/base.css'
import { createApp, nextTick } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './store'
import i18n from './i18n'
import { upsertJsonLd, orgSchema } from '@/utils/structured'
import { useAuthStore } from '@/store/auth'

const app = createApp(App)
app.use(router).use(pinia).use(i18n)

// Restore persisted user
const auth = useAuthStore()
auth.loadFromLocalStorage()

router.isReady().then(async () => {
  app.mount('#app')
  await nextTick()
  upsertJsonLd('org', orgSchema())
})
