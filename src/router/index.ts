import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { setPageMeta } from '@/utils/seo'

const routes = [
  // ...rute publik...
  {
    path: '/admin',
    name: 'dashboard',
    component: () => import('@/pages/AdminDashboard.vue'),
    meta: {
      title: 'Dashboard',
      description: 'Halaman admin untuk mengelola konten',
      requiresAuth: true,
      roles: ['superadmin', 'pmv_admin', 'gabi_admin', 'schedule_admin'],
    },
  },
  {
    path: '/admin/pmv',
    name: 'admin-pmv',
    component: () => import('@/pages/AdminPmv.vue'),
    meta: {
      title: 'Kelola PMV',
      requiresAuth: true,
      roles: ['superadmin', 'pmv_admin'],
    },
  },
  // tambahkan rute admin lainnya sesuai modul
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/Login.vue'),
    meta: { title: 'Login' },
  },
  // rute fallback / not found...
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth) {
    if (!auth.user) {
      return { name: 'login' }
    }
    // cek hak akses
    const allowed = (to.meta.roles as string[]) ?? []
    if (allowed.length && auth.user && !allowed.includes(auth.user.role)) {
      return { name: 'home' } // tolak akses
    }
  }
})

router.afterEach((to) => {
  // set SEO meta sesuai rute
  setPageMeta({
    title: (to.meta.title as string) ?? 'Vihara',
    description: (to.meta.description as string) ?? '',
  })
})

export default router
