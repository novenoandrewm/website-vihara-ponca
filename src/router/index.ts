// src/router/index.ts
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { setPageMeta } from '@/utils/seo'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/Home.vue'),
    meta: {
      title: 'Vihara Avalokitesvara',
      description: 'Informasi kegiatan rutin, PMV, dan GABI.',
    },
  },
  {
    path: '/pmv',
    name: 'pmv',
    component: () => import('@/pages/Pmv.vue'),
    meta: { title: 'PMV', description: 'Informasi kegiatan PMV.' },
  },
  {
    path: '/gabi',
    name: 'gabi',
    component: () => import('@/pages/Gabi.vue'),
    meta: { title: 'GABI', description: 'Informasi kegiatan GABI.' },
  },
  {
    path: '/schedule',
    name: 'schedule',
    component: () => import('@/pages/Schedule.vue'),
    meta: { title: 'Jadwal', description: 'Jadwal kegiatan rutin.' },
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('@/pages/Contact.vue'),
    meta: { title: 'Kontak', description: 'Kontak & lokasi vihara.' },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/Login.vue'),
    meta: { title: 'Login', description: 'Login admin.' },
  },

  // ===== Event detail (karena kamu punya EventDetail.vue) =====
  {
    path: '/event/:id',
    name: 'event-detail',
    component: () => import('@/pages/EventDetail.vue'),
    meta: { title: 'Detail Acara', description: 'Detail acara.' },
  },

  // ===== ADMIN (RBAC) =====
  {
    path: '/admin',
    name: 'dashboard',
    component: () => import('@/pages/AdminDashboard.vue'),
    meta: {
      title: 'Dashboard Admin',
      description: 'Dashboard admin.',
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
      description: 'Kelola konten PMV.',
      requiresAuth: true,
      roles: ['superadmin', 'pmv_admin'],
    },
  },
  {
    path: '/admin/gabi',
    name: 'admin-gabi',
    component: () => import('@/pages/AdminGabi.vue'),
    meta: {
      title: 'Kelola GABI',
      description: 'Kelola konten GABI.',
      requiresAuth: true,
      roles: ['superadmin', 'gabi_admin'],
    },
  },
  {
    path: '/admin/schedule',
    name: 'admin-schedule',
    component: () => import('@/pages/AdminSchedule.vue'),
    meta: {
      title: 'Kelola Jadwal',
      description: 'Kelola jadwal.',
      requiresAuth: true,
      roles: ['superadmin', 'schedule_admin'],
    },
  },

  // 404
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/pages/NotFound.vue'),
    meta: { title: '404', description: 'Page not found.' },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach((to) => {
  if (!to.meta.requiresAuth) return

  const auth = useAuthStore()

  // belum login -> ke login
  if (!auth.user) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  // cek roles
  const allowed = (to.meta.roles as string[] | undefined) ?? []
  if (allowed.length && !allowed.includes(auth.user.role)) {
    // kalau tidak punya akses, lempar ke home
    return { name: 'home' }
  }
})

router.afterEach((to) => {
  setPageMeta({
    title: (to.meta.title as string) ?? 'Vihara Avalokitesvara',
    description: (to.meta.description as string) ?? '',
  })
})

export default router
