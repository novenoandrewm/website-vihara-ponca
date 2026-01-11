<!--src/components/layout/AppFooter.vue-->
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'

import instagramIcon from '@iconify-icons/skill-icons/instagram'
import tiktokIcon from '@iconify-icons/logos/tiktok-icon'
import whatsappIcon from '@iconify-icons/logos/whatsapp-icon'

import Container from '@/components/ui/Container.vue'
import DividerLotus from '@/components/ui/DividerLotus.vue'
import { SOCIAL_LINKS } from '@/config/social'

const { t } = useI18n({ useScope: 'global' })
const route = useRoute()
const year = new Date().getFullYear()

const menuLinks = [
  { to: '/', labelKey: 'nav.home' },
  { to: '/pmv', labelKey: 'nav.pmv' },
  { to: '/gabi', labelKey: 'nav.gabi' },
  { to: '/schedule', labelKey: 'nav.general' },
  { to: '/contact', labelKey: 'nav.contact' },
] as const

const currentSocials = computed(() => {
  const path = route.path.toLowerCase()
  if (path.startsWith('/pmv'))
    return SOCIAL_LINKS.filter((s) => s.category === 'pmv')
  if (path.startsWith('/gabi'))
    return SOCIAL_LINKS.filter((s) => s.category === 'gabi')
  return SOCIAL_LINKS.filter((s) => s.category === 'vihara')
})

function isInstagram(key: string) {
  return key.includes('ig') || key.includes('instagram')
}

function isTikTok(key: string) {
  return key.includes('tiktok')
}

function isWhatsApp(key: string) {
  return key.includes('wa') || key.includes('whatsapp')
}

function getCategoryColor(category: string) {
  if (category === 'pmv') return 'bg-yellow-500'
  if (category === 'gabi') return 'bg-green-500'
  return 'bg-brand-400'
}
</script>

<template>
  <footer
    class="relative mt-32 border-t border-brand-500/40 bg-zinc-900/90 text-zinc-300 backdrop-blur-xl"
    role="contentinfo"
    aria-label="Informasi situs"
  >
    <div
      class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
      aria-hidden="true"
    />

    <div
      class="pointer-events-none absolute inset-x-0 top-0 -mt-24 flex justify-center opacity-15"
      aria-hidden="true"
    >
      <div
        class="h-[300px] w-[600px] rounded-full bg-brand-400/20 blur-[120px]"
      />
    </div>

    <Container class="relative z-10">
      <div class="relative z-20 -mt-6 pb-2 pt-4">
        <DividerLotus
          compact
          size="h-16 w-16 stroke-[1.5]"
          lineColor="from-transparent via-brand-400/30 to-transparent"
          class="text-brand-200 drop-shadow-[0_0_10px_rgba(253,186,116,0.2)]"
        />
      </div>

      <div class="-mt-2 grid gap-12 pb-16 pt-2 md:grid-cols-3">
        <div class="space-y-5">
          <div class="flex items-center gap-4">
            <div
              class="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/10 shadow-2xl backdrop-blur-sm"
              aria-hidden="true"
            >
              <span class="text-xl font-bold text-brand-300">ॐ</span>
            </div>

            <div>
              <div
                class="font-display text-xl font-bold tracking-wide text-zinc-100"
              >
                Vihara Avalokitesvara
              </div>
              <div
                class="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-brand-400/80"
              >
                <span class="h-px w-3 bg-brand-400/50"></span>
                {{ t('footer.sub_tagline') }}
              </div>
            </div>
          </div>

          <p class="max-w-sm text-sm leading-relaxed text-zinc-400">
            {{ t('footer.tagline') }}
          </p>

          <p class="pt-2 text-xs font-medium text-zinc-400">
            © {{ year }} Vihara Avalokitesvara. {{ t('footer.rights') }}
          </p>
        </div>

        <div class="space-y-5">
          <div class="flex items-center gap-3">
            <div class="h-1 w-1 rounded-full bg-brand-500"></div>
            <div
              class="text-xs font-bold uppercase tracking-widest text-zinc-100"
            >
              {{ t('footer.menu_title') }}
            </div>
          </div>

          <nav class="grid gap-1 text-sm" aria-label="Footer navigation">
            <RouterLink
              v-for="l in menuLinks"
              :key="l.to"
              :to="l.to"
              class="group flex items-center justify-between rounded-lg px-3 py-2 text-zinc-400 transition-all duration-300 hover:bg-white/10 hover:pl-5 hover:text-brand-200"
            >
              <span class="font-medium">{{ t(l.labelKey) }}</span>
              <svg
                class="h-3 w-3 -translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </RouterLink>
          </nav>
        </div>

        <div class="space-y-5">
          <div class="flex items-center gap-3">
            <div class="h-1 w-1 rounded-full bg-brand-500"></div>
            <div
              class="text-xs font-bold uppercase tracking-widest text-zinc-100"
            >
              {{ t('footer.connect_title') }}
            </div>
          </div>

          <div class="grid gap-2">
            <a
              v-for="s in currentSocials"
              :key="s.key"
              :href="s.href"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="`${t('common.open_link')} ${t(s.labelKey)}`"
              class="group flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-300 transition-all duration-300 hover:border-brand-500/40 hover:bg-white/10 hover:shadow-[0_0_15px_-5px_rgba(253,186,116,0.15)]"
            >
              <div
                class="flex h-5 w-5 shrink-0 items-center justify-center transition-transform duration-300 group-hover:scale-110"
              >
                <Icon
                  v-if="isInstagram(s.key)"
                  :icon="instagramIcon"
                  width="20"
                  height="20"
                />
                <Icon
                  v-else-if="isTikTok(s.key)"
                  :icon="tiktokIcon"
                  width="18"
                  height="18"
                />
                <Icon
                  v-else-if="isWhatsApp(s.key)"
                  :icon="whatsappIcon"
                  width="20"
                  height="20"
                />
                <span
                  v-else
                  class="h-1.5 w-1.5 rounded-full"
                  :class="getCategoryColor(s.category)"
                ></span>
              </div>

              <span class="flex-1 font-medium">{{ t(s.labelKey) }}</span>

              <span
                class="text-[10px] uppercase tracking-wider text-zinc-500 transition group-hover:text-brand-300"
              >
                {{ t('footer.visit_btn') }} ↗
              </span>
            </a>
          </div>
        </div>
      </div>

      <div
        class="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-8 text-xs text-zinc-500 md:flex-row"
      >
        <span>{{ t('footer.made_with') }}</span>
        <div class="flex gap-6">
          <span class="cursor-pointer transition hover:text-zinc-300">{{
            t('footer.privacy')
          }}</span>
          <span class="cursor-pointer transition hover:text-zinc-300">{{
            t('footer.terms')
          }}</span>
          <span class="cursor-pointer transition hover:text-zinc-300">{{
            t('footer.sitemap')
          }}</span>
        </div>
      </div>
    </Container>
  </footer>
</template>
