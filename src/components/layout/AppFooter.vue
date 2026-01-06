<!--src/components/layout/AppFooter.vue-->
<script setup lang="ts">
import Container from '@/components/ui/Container.vue'
import DividerLotus from '@/components/ui/DividerLotus.vue'
import { SOCIAL_LINKS } from '@/config/social'

const year = new Date().getFullYear()

const menuLinks = [
  { to: '/', label: 'Home' },
  { to: '/pmv', label: 'PMV' },
  { to: '/gabi', label: 'GABI' },
  { to: '/schedule', label: 'Schedule' },
  { to: '/contact', label: 'Contact' },
] as const
</script>

<template>
  <footer
    class="mt-16 border-t border-zinc-800/70 bg-zinc-950/60 text-zinc-300 backdrop-blur"
    role="contentinfo"
    aria-label="Informasi situs"
  >
    <Container>
      <DividerLotus compact />

      <div class="grid gap-10 py-10 md:grid-cols-3">
        <!-- Brand -->
        <div class="space-y-3">
          <div class="flex items-center gap-3">
            <div
              class="grid h-10 w-10 place-items-center rounded-2xl border border-zinc-800 bg-zinc-900/60 shadow-insetSoft"
              aria-hidden="true"
            >
              <span class="font-semibold text-brand-300">ॐ</span>
            </div>

            <div>
              <div class="font-display text-xl font-semibold text-zinc-100">
                Vihara Avalokitesvara<span class="text-brand-300"></span>
              </div>
              <div class="text-xs text-zinc-400">Calm • Modern • Community</div>
            </div>
          </div>

          <p class="text-sm leading-relaxed text-zinc-300">
            Tempat berlatih dalam ketenangan, membangun welas asih, dan
            mempererat komunitas.
          </p>

          <p class="text-xs text-zinc-500">
            © {{ year }} Vihara Avalokitesvara
          </p>
        </div>

        <!-- Links -->
        <div class="space-y-3">
          <div class="text-sm font-semibold text-zinc-100">Menu</div>

          <nav class="grid gap-2 text-sm" aria-label="Footer navigation">
            <RouterLink
              v-for="l in menuLinks"
              :key="l.to"
              :to="l.to"
              class="group inline-flex items-center justify-between rounded-xl border border-transparent px-3 py-2 transition hover:border-zinc-800 hover:bg-zinc-900/40 hover:text-brand-200"
            >
              <span>{{ l.label }}</span>
              <span
                class="text-xs text-zinc-500 transition group-hover:text-brand-200"
              >
                →
              </span>
            </RouterLink>
          </nav>
        </div>

        <!-- Social -->
        <div class="space-y-3">
          <div class="text-sm font-semibold text-zinc-100">Ikuti Kami</div>

          <div class="grid gap-2">
            <a
              v-for="s in SOCIAL_LINKS"
              :key="s.key"
              :href="s.href"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="`Buka ${s.label} resmi`"
              class="group flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-2 text-sm text-zinc-200 transition hover:-translate-y-0.5 hover:border-brand-400/50 hover:shadow-glow"
            >
              <span class="font-medium">{{ s.label }}</span>
              <span
                class="text-xs text-zinc-400 transition group-hover:text-brand-200"
              >
                Buka →
              </span>
            </a>
          </div>

          <p class="text-xs text-zinc-500">
            Pastikan hanya mengikuti kanal resmi untuk menghindari informasi
            palsu
          </p>
        </div>
      </div>

      <div class="border-t border-zinc-800/70 py-6 text-xs text-zinc-500">
        <div
          class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between"
        >
          <span>Made with calm & care</span>
          <span class="text-zinc-600"
            >Designed for clarity • Built with Vue + Tailwind</span
          >
        </div>
      </div>
    </Container>
  </footer>
</template>
