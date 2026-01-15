<!-- src/components/sections/FollowUsSection.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { SOCIAL_LINKS } from '@/config/social'

// Import icons statically for better tree-shaking
import instagramIcon from '@iconify-icons/skill-icons/instagram'
import tiktokIcon from '@iconify-icons/logos/tiktok-icon'
import whatsappIcon from '@iconify-icons/logos/whatsapp-icon'

const { t } = useI18n({ useScope: 'global' })

const props = defineProps<{
  title?: string
  subtitle?: string
}>()

const displayTitle = computed(() => props.title || t('follow_us.title'))
const displaySubtitle = computed(
  () => props.subtitle || t('follow_us.subtitle')
)

const whatsapp = SOCIAL_LINKS.find((s) => s.key === 'whatsapp') ?? null
const socials = SOCIAL_LINKS.filter((s) => s.key !== 'whatsapp')

function isInstagram(key: string) {
  return key.includes('ig') || key.includes('instagram')
}

function isTikTok(key: string) {
  return key.includes('tiktok')
}
</script>

<template>
  <section
    class="content-visibility-auto contain-intrinsic-size-[400px] relative"
  >
    <div
      class="group relative overflow-hidden rounded-3xl border border-zinc-800/60 bg-zinc-900/60 p-6 shadow-xl backdrop-blur-md transition-all duration-500 hover:border-zinc-700/50 hover:shadow-2xl md:p-10 md:backdrop-blur-xl"
    >
      <div
        class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
        aria-hidden="true"
      />

      <div class="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
        <div class="flex h-full flex-col justify-between gap-8">
          <div class="space-y-4">
            <h2
              class="font-display text-2xl font-semibold tracking-[0.06em] text-zinc-100 md:text-3xl"
            >
              {{ displayTitle }}
            </h2>
            <div
              class="h-1 w-12 rounded-full bg-gradient-to-r from-brand-500 to-brand-400"
              aria-hidden="true"
            />
            <p class="text-base leading-relaxed text-zinc-400">
              {{ displaySubtitle }}
            </p>
          </div>

          <div
            v-if="whatsapp"
            class="rounded-2xl border border-zinc-800/80 bg-zinc-950/40 p-5 transition-colors hover:bg-zinc-950/60"
          >
            <div
              class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <h3 class="text-base font-medium text-zinc-200">
                  {{ t('follow_us.wa_title') }}
                </h3>
                <p class="text-sm text-zinc-500">
                  {{ t('follow_us.wa_desc') }}
                </p>
              </div>

              <a
                :href="whatsapp.href"
                target="_blank"
                rel="noopener noreferrer"
                :aria-label="`${t('common.contact_via')} ${t(whatsapp.labelKey)}`"
                class="group/btn flex transform-gpu items-center gap-4"
              >
                <Icon
                  :icon="whatsappIcon"
                  class="h-10 w-10 shrink-0 drop-shadow-md transition-transform duration-300 group-hover/btn:scale-110"
                />

                <BaseButton
                  size="lg"
                  variant="primary"
                  class="w-full shadow-lg shadow-brand-500/10 sm:w-auto"
                >
                  <span>{{ t('follow_us.wa_btn') }}</span>
                </BaseButton>
              </a>
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <div
            class="flex items-center justify-between border-b border-zinc-800 pb-3"
          >
            <h3 class="text-lg font-medium text-zinc-100">
              {{ t('follow_us.social_title') }}
            </h3>
            <span class="text-xs text-zinc-500">{{
              t('follow_us.tap_hint')
            }}</span>
          </div>

          <div class="grid gap-3 sm:grid-cols-2">
            <a
              v-for="s in socials"
              :key="s.key"
              :href="s.href"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="`${t('common.open_link')} ${t(s.labelKey)}`"
              class="group/item relative flex min-h-[60px] transform-gpu items-center justify-between overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/50 px-4 py-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-500/30 hover:bg-zinc-900 hover:shadow-lg"
            >
              <div
                class="absolute inset-0 bg-gradient-to-r from-brand-500/5 to-transparent opacity-0 transition-opacity group-hover/item:opacity-100"
                aria-hidden="true"
              />

              <div class="relative flex items-center gap-3">
                <div
                  class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-transform group-hover/item:scale-110"
                >
                  <Icon
                    v-if="isInstagram(s.key)"
                    :icon="instagramIcon"
                    width="32"
                    height="32"
                  />

                  <Icon
                    v-else-if="isTikTok(s.key)"
                    :icon="tiktokIcon"
                    width="28"
                    height="28"
                  />

                  <div
                    v-else
                    class="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-zinc-400 group-hover/item:text-brand-300"
                  >
                    <span class="text-xs">↗</span>
                  </div>
                </div>

                <span
                  class="text-sm font-medium text-zinc-300 group-hover/item:text-white"
                >
                  {{ t(s.labelKey) }}
                </span>
              </div>
            </a>
          </div>

          <div
            class="rounded-lg border border-emerald-500/20 bg-emerald-900/10 p-3 text-center"
          >
            <p class="text-xs font-medium text-emerald-300/90">
              {{ t('follow_us.validity_note') }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.content-visibility-auto {
  content-visibility: auto;
  contain-intrinsic-size: 400px;
}
</style>
